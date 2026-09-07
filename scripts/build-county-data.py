#!/usr/bin/env python3
"""
Builds data/county-facts.json — real, per-county facts for the 3,144
/home-care/[state]/[county] pages, so no two pages carry the same numbers.

Sources (all public, no API key):
  SVI   CDC/ATSDR Social Vulnerability Index 2022 (ACS 2018-2022 5-year)
        -> 65+ population, disability, poverty, no-vehicle households
  CHR   County Health Rankings 2024 analytic data
        -> median household income, % rural
  CMS   Home Health Care Agencies + Home Health ZIP service areas (Jul 2026)
        -> Medicare-certified agencies SERVING each county, star ratings
  CMS   Nursing Home Provider Information (Aug 2026)
        -> facility count, certified beds, average overall star rating
  Census 2020 ZCTA-to-county relationship file -> ZIP -> county FIPS
  Census county adjacency file -> which counties actually border each other

Writes two files: data/county-facts.json and data/county-adjacency.json.

Usage:
  python3 scripts/build-county-data.py --fetch   # download sources, then build
  python3 scripts/build-county-data.py [raw_dir] # build from an existing dir

CMS republishes its provider files monthly under versioned URLs, so --fetch
resolves them through the CMS metastore rather than hard-coding a filename.
Re-run it whenever you want the counts and star ratings refreshed.
"""
import csv, json, os, re, sys, unicodedata, urllib.request
from collections import defaultdict

DEFAULT_RAW = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "sources")

# Titles as they appear in the CMS provider-data metastore.
CMS_DATASETS = {
    "hh_provider.csv": "Home Health Care Agencies",
    "hh_zip.csv": "Home Health Care - Zip Codes",
    "nh_provider.csv": "Provider Information",
}
STATIC_SOURCES = {
    "svi_county.csv":
        "https://svi.cdc.gov/Documents/Data/2022/csv/states_counties/SVI_2022_US_county.csv",
    "chr_2024.csv":
        "https://www.countyhealthrankings.org/sites/default/files/media/document/analytic_data2024.csv",
    "zcta_county.txt":
        "https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt",
    "county_adjacency.txt":
        "https://www2.census.gov/geo/docs/reference/county_adjacency.txt",
}
UA = {"User-Agent": "Mozilla/5.0 (home-care county data build)"}


def _get(url, dest):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=300) as r, open(dest, "wb") as fh:
        fh.write(r.read())
    print(f"  {os.path.basename(dest)}  {os.path.getsize(dest)/1024:.0f} KB")


def fetch(raw):
    os.makedirs(raw, exist_ok=True)
    print(f"fetching sources into {raw}")
    for name, url in STATIC_SOURCES.items():
        _get(url, os.path.join(raw, name))

    meta_url = ("https://data.cms.gov/provider-data/api/1/metastore/schemas/"
                "dataset/items?show-reference-ids=false")
    with urllib.request.urlopen(urllib.request.Request(meta_url, headers=UA), timeout=120) as r:
        items = json.load(r)
    by_title = {}
    for it in items:
        for dist in it.get("distribution", []):
            url = dist.get("downloadURL") or dist.get("data", {}).get("downloadURL")
            if url:
                by_title.setdefault(it.get("title", ""), url)
    for name, title in CMS_DATASETS.items():
        url = by_title.get(title)
        if not url:
            raise SystemExit(f"CMS dataset not found in metastore: {title!r}")
        _get(url, os.path.join(raw, name))


args = [a for a in sys.argv[1:] if a != "--fetch"]
RAW = args[0] if args else os.path.normpath(DEFAULT_RAW)
if "--fetch" in sys.argv:
    fetch(RAW)
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "data", "county-facts.json")

csv.field_size_limit(10_000_000)


def num(v):
    """SVI/CHR use -999 and '' for missing."""
    if v is None:
        return None
    v = str(v).strip().replace(",", "")
    if v in ("", "-", "NA", "N/A", "*"):
        return None
    try:
        f = float(v)
    except ValueError:
        return None
    if f <= -998:
        return None
    return f


def kebab(s):
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.lower().replace("'", "").replace("’", "").replace(".", "")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


SUFFIXES = (" county", " parish", " census area", " city and borough", " borough",
            " municipality", " planning region", " city")


def squash(s):
    """Alphanumeric-only, so "De Kalb" and "DeKalb" collapse to one key."""
    return re.sub(r"[^a-z0-9]", "", s.lower())


def corename(name):
    low = name.lower()
    for suf in SUFFIXES:
        if low.endswith(suf) and len(low) > len(suf):
            return kebab(name[: -len(suf)])
    return kebab(name)


# ── base county list (authoritative: what the site actually renders) ────────
counties = json.load(open(os.path.join(ROOT, "data", "counties.json")))
ABBR = json.load(open(os.path.join(HERE, "state-abbr.json")))

fips_of = {}          # (st, corename) -> fips   for name-based joins
squash_of = {}        # (st, alphanumeric-only core) -> fips  (CMS writes "De Kalb")
all_fips = {}         # fips -> {state, name, st}
for state, rows in counties.items():
    st = ABBR[state]
    for r in rows:
        f = r["fips"]
        all_fips[f] = {"state": state, "name": r["county"], "st": st}
        fips_of.setdefault((st, corename(r["county"])), f)
        squash_of.setdefault((st, squash(corename(r["county"]))), f)

# CMS writes some county names abbreviated, truncated, or misspelled. These are
# the ones that survive squashing; each was confirmed against the census name.
NH_ALIASES = {
    ("CT", "lowerctrivervly"): "lowerconnecticutrivervalley",
    ("CT", "naugatuckvly"): "naugatuckvalley",
    ("CT", "northeasternct"): "northeasternconnecticut",
    ("CT", "nwhills"): "northwesthills",
    ("CT", "southcentralct"): "southcentralconnecticut",
    ("CT", "southeasternct"): "southeasternconnecticut",
    ("CT", "westernct"): "westernconnecticut",
    ("DC", "thedistrict"): "districtofcolumbia",
    ("LA", "ebatonrouge"): "eastbatonrouge",
    ("LA", "wbatonrouge"): "westbatonrouge",
    ("LA", "jeffrsondavis"): "jeffersondavis",
    ("LA", "stjohnbaptist"): "stjohnthebaptist",
    ("MN", "lakeofwoods"): "lakeofthewoods",
    ("MN", "yellowmedcine"): "yellowmedicine",
    ("NE", "scottbluff"): "scottsbluff",
    ("PA", "northumberlnd"): "northumberland",
}

facts = {f: {} for f in all_fips}


# ── 1. SVI: age, disability, poverty, vehicle access ───────────────────────
svi_hit = 0
with open(os.path.join(RAW, "svi_county.csv"), encoding="utf-8-sig", errors="replace") as fh:
    for row in csv.DictReader(fh):
        f = str(row["FIPS"]).strip().zfill(5)
        if f not in facts:
            continue
        svi_hit += 1
        d = facts[f]
        def i(col):
            v = num(row.get(col))
            return int(v) if v is not None else None
        # SVI's own total, so any sentence tying pct65 to a total reconciles.
        # counties.json carries a later Census estimate; mixing the two made
        # small counties state arithmetic that visibly did not add up.
        d["popTotal"] = i("E_TOTPOP")
        d["pop65"] = i("E_AGE65")
        d["pct65"] = num(row.get("EP_AGE65"))
        d["disabled"] = i("E_DISABL")
        d["pctDisabled"] = num(row.get("EP_DISABL"))
        d["pctPoverty150"] = num(row.get("EP_POV150"))
        d["pctNoVehicle"] = num(row.get("EP_NOVEH"))
        d["households"] = i("E_HH")


# ── 2. County Health Rankings: income + rurality ───────────────────────────
chr_hit = 0
with open(os.path.join(RAW, "chr_2024.csv"), encoding="utf-8-sig", errors="replace") as fh:
    r = csv.DictReader(fh)
    for row in r:
        sf = (row.get("State FIPS Code") or "").strip()
        cf = (row.get("County FIPS Code") or "").strip()
        if not sf or not cf or cf == "000":
            continue          # state-level roll-up row
        f = (sf.zfill(2) + cf.zfill(3))
        if f not in facts:
            continue
        chr_hit += 1
        inc = num(row.get("Median Household Income raw value"))
        # CHR publishes "% Rural" as a FRACTION (0-1) despite the column name.
        rural = num(row.get("% Rural raw value"))
        if inc:
            facts[f]["medianIncome"] = int(round(inc))
        if rural is not None:
            facts[f]["pctRural"] = round(rural * 100, 1)


# ── 3. ZIP -> county FIPS (Census 2020 relationship file) ──────────────────
zip_counties = defaultdict(set)
with open(os.path.join(RAW, "zcta_county.txt"), encoding="utf-8-sig", errors="replace") as fh:
    r = csv.DictReader(fh, delimiter="|")
    for row in r:
        z = (row.get("GEOID_ZCTA5_20") or "").strip()
        c = (row.get("GEOID_COUNTY_20") or "").strip()
        if len(z) == 5 and len(c) == 5:
            zip_counties[z].add(c)


# ── 4. CMS home health: agencies SERVING each county ──────────────────────
prov = {}
with open(os.path.join(RAW, "hh_provider.csv"), encoding="utf-8-sig", errors="replace") as fh:
    for row in csv.DictReader(fh):
        ccn = (row.get("CMS Certification Number (CCN)") or "").strip()
        if not ccn:
            continue
        prov[ccn] = {
            "star": num(row.get("Quality of patient care star rating")),
            "aide": (row.get("Offers Home Health Aide Services") or "").strip().lower() == "yes",
            "own": (row.get("Type of Ownership") or "").strip(),
        }

serving = defaultdict(set)
with open(os.path.join(RAW, "hh_zip.csv"), encoding="utf-8-sig", errors="replace") as fh:
    for row in csv.DictReader(fh):
        ccn = (row.get("CMS Certification Number (CCN)") or "").strip()
        z = (row.get("ZIP Code") or "").strip().zfill(5)
        for f in zip_counties.get(z, ()):
            if f in facts:
                serving[f].add(ccn)

for f, ccns in serving.items():
    stars = [prov[c]["star"] for c in ccns if c in prov and prov[c]["star"]]
    aide = sum(1 for c in ccns if c in prov and prov[c]["aide"])
    nonprofit = sum(1 for c in ccns if c in prov and "NON-PROFIT" in prov[c]["own"].upper())
    d = facts[f]
    d["hhAgencies"] = len(ccns)
    if aide:
        d["hhAideAgencies"] = aide
    if nonprofit:
        d["hhNonprofit"] = nonprofit
    if stars:
        d["hhStar"] = round(sum(stars) / len(stars), 1)
        d["hhRated"] = len(stars)


# ── 5. CMS nursing homes in each county ───────────────────────────────────
nh = defaultdict(lambda: {"n": 0, "beds": 0, "stars": [], "res": 0.0})
nh_unmatched = set()
with open(os.path.join(RAW, "nh_provider.csv"), encoding="utf-8-sig", errors="replace") as fh:
    for row in csv.DictReader(fh):
        st = (row.get("State") or "").strip().upper()
        cty = (row.get("County/Parish") or "").strip()
        if not st or not cty:
            continue
        sq = squash(corename(cty))
        sq = NH_ALIASES.get((st, sq), sq)
        f = (fips_of.get((st, corename(cty)))
             or fips_of.get((st, kebab(cty)))
             or squash_of.get((st, sq)))
        if not f:
            nh_unmatched.add((st, cty))
            continue
        e = nh[f]
        e["n"] += 1
        beds = num(row.get("Number of Certified Beds"))
        if beds:
            e["beds"] += int(beds)
        star = num(row.get("Overall Rating"))
        if star:
            e["stars"].append(star)
        res = num(row.get("Average Number of Residents per Day"))
        if res:
            e["res"] += res

for f, e in nh.items():
    d = facts[f]
    d["nursingHomes"] = e["n"]
    if e["beds"]:
        d["nursingBeds"] = e["beds"]
    if e["stars"]:
        d["nursingStar"] = round(sum(e["stars"]) / len(e["stars"]), 1)
    if e["res"]:
        d["nursingResidents"] = int(round(e["res"]))


# ── 5b. True state-level averages (for honest "vs the state" comparisons) ─
# Computed from the provider rows themselves, not by averaging county averages,
# so "the Wisconsin average" means what it says.
state_stats = {}
_hh_state = defaultdict(list)
with open(os.path.join(RAW, "hh_provider.csv"), encoding="utf-8-sig", errors="replace") as fh:
    for row in csv.DictReader(fh):
        star = num(row.get("Quality of patient care star rating"))
        st_ = (row.get("State") or "").strip().upper()
        if star and st_:
            _hh_state[st_].append(star)
_nh_state = defaultdict(list)
with open(os.path.join(RAW, "nh_provider.csv"), encoding="utf-8-sig", errors="replace") as fh:
    for row in csv.DictReader(fh):
        star = num(row.get("Overall Rating"))
        st_ = (row.get("State") or "").strip().upper()
        if star and st_:
            _nh_state[st_].append(star)
for st_ in set(_hh_state) | set(_nh_state):
    e = {}
    if _hh_state.get(st_):
        e["hhStar"] = round(sum(_hh_state[st_]) / len(_hh_state[st_]), 2)
        e["hhRated"] = len(_hh_state[st_])
    if _nh_state.get(st_):
        e["nursingStar"] = round(sum(_nh_state[st_]) / len(_nh_state[st_]), 2)
        e["nursingCount"] = len(_nh_state[st_])
    state_stats[st_] = e

# national reference points, for counties in states with thin data
_all_hh = [x for v in _hh_state.values() for x in v]
_all_nh = [x for v in _nh_state.values() for x in v]
state_stats["US"] = {
    "hhStar": round(sum(_all_hh) / len(_all_hh), 2),
    "hhRated": len(_all_hh),
    "nursingStar": round(sum(_all_nh) / len(_all_nh), 2),
    "nursingCount": len(_all_nh),
}

STATS_OUT = os.path.join(ROOT, "data", "state-stats.json")
with open(STATS_OUT, "w") as fh:
    json.dump(state_stats, fh, separators=(",", ":"), sort_keys=True, indent=0)


# ── 6. County adjacency (who actually borders whom) ───────────────────────
# The Census file is fixed-column-ish TSV: a header row per county, then one
# indented row per neighbour. Counties added since the file was published
# (Connecticut's planning regions, some reorganised Alaska boroughs) are absent;
# the site falls back to population-neighbours for those.
adjacency = defaultdict(set)
adj_path = os.path.join(RAW, "county_adjacency.txt")
if os.path.exists(adj_path):
    cur = None
    for line in open(adj_path, encoding="latin-1"):
        parts = line.rstrip("\n").split("\t")
        if len(parts) < 4:
            continue
        if parts[0].strip():
            cur = parts[1].strip().strip('"')
        nb = parts[3].strip().strip('"')
        if cur and nb and nb != cur and cur in facts and nb in facts:
            adjacency[cur].add(nb)
            adjacency[nb].add(cur)  # the file is meant to be symmetric; enforce it

ADJ_OUT = os.path.join(ROOT, "data", "county-adjacency.json")
adj_clean = {k: sorted(v) for k, v in sorted(adjacency.items()) if v}
with open(ADJ_OUT, "w") as fh:
    json.dump(adj_clean, fh, separators=(",", ":"), sort_keys=True)


# ── write ─────────────────────────────────────────────────────────────────
clean = {f: {k: v for k, v in d.items() if v is not None} for f, d in facts.items()}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w") as fh:
    json.dump(clean, fh, separators=(",", ":"), sort_keys=True)

n = len(clean)
def cov(k):
    c = sum(1 for d in clean.values() if k in d)
    return f"{k}: {c}/{n} ({100*c/n:.1f}%)"

print(f"counties: {n}")
print(f"SVI rows matched: {svi_hit}   CHR rows matched: {chr_hit}")
print("  " + "\n  ".join(cov(k) for k in
      ["popTotal", "pop65", "pct65", "pctDisabled", "pctPoverty150", "pctNoVehicle",
       "medianIncome", "pctRural", "hhAgencies", "hhStar", "nursingHomes", "nursingStar"]))
print(f"state stats: {len(state_stats)} states; US avg hh={state_stats['US']['hhStar']}, "
      f"nursing={state_stats['US']['nursingStar']}")
print(f"adjacency: {len(adj_clean)}/{n} counties "
      f"({100*len(adj_clean)/n:.1f}%), avg {sum(len(v) for v in adj_clean.values())/max(1,len(adj_clean)):.1f} neighbours")
print(f"wrote {ADJ_OUT} ({os.path.getsize(ADJ_OUT)/1024:.0f} KB)")
if nh_unmatched:
    print(f"nursing-home county names unmatched: {len(nh_unmatched)} -> {sorted(nh_unmatched)[:12]}")
print(f"wrote {OUT} ({os.path.getsize(OUT)/1024:.0f} KB)")
