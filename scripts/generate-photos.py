#!/usr/bin/env python3
"""
Generates the site's photography with Vertex AI (gemini-3-pro-image, the best
image model available on this project — Imagen 4 is not provisioned here).

WHAT THESE IMAGES ARE. They are AI-generated stand-ins, used the way a stock
photo library would be. The people in them are not real caregivers, clients or
families, and nothing on the site should caption them as though they were. Two
slots are deliberately NOT generated here:

  * Leadership headshots. data/leadership.ts names seventeen specific people.
    Generating faces for named individuals presented as real staff is
    fabricating evidence about who runs the company, not sourcing a stock photo.
    Those stay as initial avatars until real headshots exist.

  * Literal town landmarks. The town briefs ask for "recognizably local, not
    stock" — a real Wauwatosa porch. A model cannot supply that, and inventing
    a specific street would be a false local claim. The town images here are
    honest generic Upper-Midwest residential, and the copy should not assert
    that any given house is in any given town.

Usage:
  python3 scripts/generate-photos.py            # only missing images
  python3 scripts/generate-photos.py --force    # regenerate everything
  python3 scripts/generate-photos.py --only home-hero,careers-hero
"""
import base64, io, json, os, subprocess, sys, time, urllib.error, urllib.request

PROJECT = os.environ.get("GCP_PROJECT", "juniperathome-prod")
ACCOUNT = os.environ.get("GCP_ACCOUNT", "yechielgartenhaus@gmail.com")
MODEL = "gemini-3-pro-image"
LOCATION = "global"

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "public", "photos")

# ── the shared photographic DNA ───────────────────────────────────────────
# Every prompt ends with this so twenty-two images read as one commissioned
# shoot rather than twenty-two separate stock purchases. It encodes the Style
# Bible's photography rules directly.
DNA = (
    "Photojournalistic documentary photograph, shot on 35mm film with a 50mm lens, "
    "natural warm window light only with no studio lighting or flash, shallow depth of field, "
    "soft muted natural color palette with warm earth tones, visible film grain, "
    "candid unposed real moment caught mid-action, genuine relaxed expressions, "
    "authentic lived-in American home with real clutter and worn furniture, "
    "ordinary-looking real people with natural skin texture and imperfections. "
    "NOT a stock photo, no forced smiles at camera, no perfect teeth, no studio backdrop, "
    "no medical scrubs, no clinical or hospital setting, nobody looking frail helpless or sad. "
    # Generated lettering is always malformed and is the clearest giveaway that
    # an image is synthetic, so keep writing out of frame entirely.
    "No legible text, no writing, no signage, no labels, no readable documents anywhere in frame."
)

# The caregiver's uniform, kept identical across every frame.
POLO = "a caregiver in her 30s or 40s wearing a plain deep forest-green polo shirt"

SERVICES = [
    ("companion-care", f"{POLO} and an older woman in her 80s laughing together over a half-finished jigsaw puzzle at a kitchen table, mugs of tea beside them"),
    ("personal-care", f"{POLO} steadying an older man's elbow as he stands from an armchair, both mid-step, unhurried and matter-of-fact"),
    ("dementia-care", f"{POLO} sitting knee-to-knee with an older woman, both looking down at an open photo album on their laps, the caregiver pointing at a picture"),
    ("24-hour-care", f"{POLO} handing a mug to an older man in a worn armchair by a window in soft late-afternoon light, a second caregiver's coat on a hook by the door"),
    ("live-in-care", f"{POLO} and an older woman cooking side by side at a kitchen counter, chopping vegetables, comfortable domestic routine"),
    ("overnight-care", f"{POLO} reading in a pool of warm lamplight in a quiet hallway at night, a bedroom door ajar behind her, calm and undramatic"),
    ("respite-care", f"an adult daughter in her 50s pulling on her coat by the front door, half-turned to smile at {POLO} who is already sitting down with an older man at the kitchen table"),
    ("post-hospital-care", f"{POLO} and an older man going slowly down three front-porch steps together, his hand on the rail and hers at his back, a walker at the bottom"),
    ("veterans-care", f"{POLO} and an older veteran in his 80s at a kitchen table with paperwork spread between them, a folded flag in a case on the shelf behind, both concentrating"),
]

SLOTS = [
    ("home-hero",
     f"{POLO} and an older woman in her 80s laughing together over a jigsaw puzzle at a worn kitchen table, "
     "late morning light through a window behind them, two mugs, a newspaper pushed aside", "4:5"),
    ("care-team",
     "a woman in her 40s working in the small back office of a local American home-care agency, "
     "mid-conversation and gesturing with one hand, a metal filing cabinet and a corkboard behind her, "
     "a landline phone and a coffee mug on the desk, soft daylight from a side window, "
     "an ordinary small American workplace, approachable and unglamorous, not corporate, "
     "not a home study, no garden visible", "16:9"),
    ("careers-hero",
     "two caregivers in plain deep forest-green polo shirts standing beside a parked car in a driveway, "
     "laughing at something one of them said, travel mugs in hand, real daylight, ordinary suburban street", "4:3"),
] + [(f"service-{slug}", desc, "4:3") for slug, desc in SERVICES]

# Ten town images. Deliberately generic Upper-Midwest residential — see the
# module docstring on why these do not name or depict a specific town.
TOWN_SCENES = [
    "on a covered front porch with a hanging planter, the older woman in a cardigan in a wicker chair",
    "walking slowly along a tree-lined sidewalk past clapboard houses, autumn leaves down",
    "at a chain-link garden gate, the older man holding a tomato plant in a pot",
    "sitting on concrete front steps of a brick bungalow, a watering can beside them",
    "under a porch awning during light rain, both watching the street, unbothered",
    "beside a mailbox at the end of a short driveway, the older woman holding mail",
    "on a wooden back deck with peeling paint, a folding chair and a coffee mug",
    "at the open door of a two-storey house, mid-goodbye, the caregiver half-turned",
    "in a small front yard beside a maple tree, the older man leaning on a cane",
    "on a screened porch in warm evening light, both seated, a card game between them",
]
TOWN_SLUGS = ["wauwatosa-wi", "west-allis-wi", "greenfield-wi", "oak-creek-wi", "franklin-wi",
              "shorewood-wi", "whitefish-bay-wi", "glendale-wi", "cudahy-wi", "south-milwaukee-wi"]
for slug, scene in zip(TOWN_SLUGS, TOWN_SCENES):
    SLOTS.append((f"town-{slug}",
                  f"{POLO} and an older client together {scene}, "
                  "a modest Upper-Midwest residential neighbourhood, overcast-bright natural light", "4:3"))


def token():
    env = dict(os.environ, CLOUDSDK_PYTHON=os.environ.get("CLOUDSDK_PYTHON", "/opt/homebrew/bin/python3.11"))
    return subprocess.run(["gcloud", "auth", "print-access-token", f"--account={ACCOUNT}"],
                          capture_output=True, text=True, env=env, check=True).stdout.strip()


def generate(prompt, aspect, tok, tries=7):
    """One image, with backoff — this project's per-minute quota is small."""
    url = (f"https://aiplatform.googleapis.com/v1/projects/{PROJECT}"
           f"/locations/{LOCATION}/publishers/google/models/{MODEL}:generateContent")
    cfg = {"responseModalities": ["IMAGE"]}
    if aspect:
        cfg["imageConfig"] = {"aspectRatio": aspect}
    body = json.dumps({"contents": [{"role": "user", "parts": [{"text": prompt}]}],
                       "generationConfig": cfg}).encode()
    delay = 20
    for attempt in range(tries):
        req = urllib.request.Request(url, data=body, headers={
            "Authorization": f"Bearer {tok}", "Content-Type": "application/json"})
        try:
            d = json.load(urllib.request.urlopen(req, timeout=300))
            parts = d["candidates"][0].get("content", {}).get("parts", [])
            img = [p for p in parts if "inlineData" in p]
            if not img:
                reason = d["candidates"][0].get("finishReason")
                # A refusal or empty return is worth retrying once or twice with
                # the same prompt; the model is not deterministic.
                print(f"      no image (finish={reason}), retrying")
                time.sleep(delay); delay = min(delay * 2, 240); continue
            return base64.b64decode(img[0]["inlineData"]["data"])
        except (TimeoutError, urllib.error.URLError, OSError) as e:
            # A socket timeout mid-generation is common on the big model and is
            # worth retrying — it cost an image on the first full run.
            if isinstance(e, urllib.error.HTTPError):
                raise
            print(f"      network ({type(e).__name__}), retrying in {delay}s")
            time.sleep(delay); delay = min(delay * 2, 240); continue
        except urllib.error.HTTPError as e:
            msg = e.read()[:200].decode("utf8", "replace").replace("\n", " ")
            if e.code in (429, 503, 500):
                print(f"      {e.code}, backing off {delay}s")
                time.sleep(delay); delay = min(delay * 2, 240)
                if e.code == 429 and attempt >= 2:
                    tok = token()  # long backoffs can outlive the token
                continue
            raise RuntimeError(f"{e.code}: {msg}")
    raise RuntimeError("exhausted retries")


def save_webp(raw, path, max_w=1600):
    from PIL import Image
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(path, "WEBP", quality=82, method=6)
    return im.size, os.path.getsize(path)


def main():
    force = "--force" in sys.argv
    only = None
    for a in sys.argv[1:]:
        if a.startswith("--only"):
            only = set((a.split("=", 1)[1] if "=" in a else sys.argv[sys.argv.index(a) + 1]).split(","))
    os.makedirs(OUT, exist_ok=True)
    tok = token()
    todo = [s for s in SLOTS if (only is None or s[0] in only)]
    made = skipped = failed = 0
    for i, (name, desc, aspect) in enumerate(todo, 1):
        path = os.path.join(OUT, f"{name}.webp")
        if os.path.exists(path) and not force:
            print(f"[{i}/{len(todo)}] {name}: exists, skipping"); skipped += 1; continue
        print(f"[{i}/{len(todo)}] {name} ({aspect})")
        try:
            raw = generate(f"{desc}. {DNA}", aspect, tok)
            size, nbytes = save_webp(raw, path)
            print(f"      ✓ {size[0]}x{size[1]}  {nbytes//1024}KB")
            made += 1
        except Exception as e:
            print(f"      ✗ {e}"); failed += 1
        time.sleep(6)  # stay under the per-minute quota
    print(f"\nmade {made}, skipped {skipped}, failed {failed} -> {OUT}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
