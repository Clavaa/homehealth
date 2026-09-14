#!/usr/bin/env python3
"""
Generates the favicon set.

Why this exists: app/icon.svg was the only icon, so /favicon.ico 404'd. Any
browser that won't use an SVG favicon — Safari most of all — falls back to
/favicon.ico and, finding nothing, shows a blank tab. The SVG also carries the
full logo: a sprig with twelve needle strokes and three berries. That reads
beautifully in the header at 40px and turns to mush at 16px.

So the tab icon is a deliberately reduced version of the same mark — one bold
stem, four needle pairs, three berries — sized so no stroke lands below about
1.5 device pixels at 16px. It is recognisably the logo, not a different one.

Outputs into app/, where Next's file conventions pick them up automatically:
  favicon.ico    16/32/48, the fallback that was missing
  icon.png       512, for Android and link unfurls
  apple-icon.png 180, for iOS home screens (opaque, iOS ignores alpha)

Usage: python3 scripts/generate-favicons.py
"""
import io
import os
import struct
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(os.path.dirname(HERE), "app")

JUNIPER = (30, 77, 69)      # --color-juniper  #1e4d45
BUTTER = (233, 196, 106)    # --color-butter   #e9c46a
WHITE = (255, 255, 255)

M = 1024  # master size; everything below is expressed as a fraction of it


def draw_mark(size: int = M, rounded: bool = True, detail: str = "full") -> Image.Image:
    """
    The reduced sprig mark.

    `detail` matters more than resolution: downsampling one master to 16px
    merges the needles into the stem and the three berries into one blob. So a
    16px tile is drawn as stem-plus-berries only, and the needles appear from
    32px up, where there is room for them to read as separate strokes.
    """
    s = size
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Ground
    if rounded:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill=JUNIPER)
    else:
        d.rectangle([0, 0, s - 1, s - 1], fill=JUNIPER)

    # Small tiles need a proportionally fatter stem to survive antialiasing.
    stem_w = max(2, int(s * (0.115 if detail == "min" else 0.075)))
    needle_w = max(2, int(s * 0.055))

    def P(x, y):
        return (x * s, y * s)

    # Main stem, lower-left to upper-right, drawn as a polyline so it curves.
    stem = [P(0.30, 0.86), P(0.40, 0.68), P(0.52, 0.48), P(0.66, 0.26), P(0.74, 0.14)]
    d.line(stem, fill=WHITE, width=stem_w, joint="curve")

    # Needle pairs, swept toward the tip — omitted on the smallest tile.
    if detail != "min":
        needles = [
            (P(0.70, 0.20), P(0.58, 0.09)),
            (P(0.70, 0.20), P(0.86, 0.13)),
            (P(0.61, 0.35), P(0.47, 0.26)),
            (P(0.61, 0.35), P(0.80, 0.30)),
        ]
        for a, b in needles:
            d.line([a, b], fill=WHITE, width=needle_w)

    # Three-berry cluster in the lower crook. Bigger and further apart on the
    # small tile so they stay three berries rather than one gold smudge.
    cluster = ([(0.60, 0.64, 0.135), (0.85, 0.53, 0.100), (0.83, 0.80, 0.085)]
               if detail == "min"
               else [(0.63, 0.63, 0.105), (0.82, 0.55, 0.075), (0.79, 0.74, 0.060)])
    for cx, cy, r in cluster:
        d.ellipse(
            [(cx - r) * s, (cy - r) * s, (cx + r) * s, (cy + r) * s],
            fill=BUTTER,
        )
    return img


def reduced_svg() -> str:
    """The reduced mark as SVG, geometry mirroring draw_mark's `full` detail."""
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#1e4d45"/>
  <g fill="none" stroke="#ffffff" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M30 86 L40 68 L52 48 L66 26 L74 14"/>
  </g>
  <g fill="none" stroke="#ffffff" stroke-width="5.5" stroke-linecap="round">
    <path d="M70 20 L58 9"/>
    <path d="M70 20 L86 13"/>
    <path d="M61 35 L47 26"/>
    <path d="M61 35 L80 30"/>
  </g>
  <g fill="#e9c46a">
    <circle cx="63" cy="63" r="10.5"/>
    <circle cx="82" cy="55" r="7.5"/>
    <circle cx="79" cy="74" r="6"/>
  </g>
</svg>
"""


def write_ico(path, images):
    """
    An .ico holding one PNG per size, each its own artwork.

    Layout: ICONDIR (6 bytes), then one 16-byte ICONDIRENTRY per image, then
    the PNG payloads. PNG-in-ICO is supported everywhere that matters.
    """
    blobs = []
    for im in images:
        buf = io.BytesIO()
        im.save(buf, "PNG")
        blobs.append(buf.getvalue())

    offset = 6 + 16 * len(images)
    out = bytearray(struct.pack("<HHH", 0, 1, len(images)))
    for im, blob in zip(images, blobs):
        w = 0 if im.width >= 256 else im.width
        h = 0 if im.height >= 256 else im.height
        out += struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, len(blob), offset)
        offset += len(blob)
    for blob in blobs:
        out += blob
    with open(path, "wb") as f:
        f.write(bytes(out))


def main():
    master = draw_mark(M)

    # .ico — the file whose absence caused the blank tab. Written by hand
    # because Pillow's ICO writer downsamples every entry from the base image,
    # which would throw away the point of drawing 16px at its own detail level.
    write_ico(
        os.path.join(APP, "favicon.ico"),
        [
            draw_mark(256, detail="min").resize((16, 16), Image.LANCZOS),
            draw_mark(512, detail="full").resize((32, 32), Image.LANCZOS),
            draw_mark(768, detail="full").resize((48, 48), Image.LANCZOS),
        ],
    )

    # iOS flattens alpha to black, so composite onto the brand colour first and
    # skip the rounded corners — iOS applies its own mask.
    apple = Image.new("RGB", (M, M), JUNIPER)
    square = draw_mark(M, rounded=False)
    apple.paste(square, (0, 0), square)
    apple.resize((180, 180), Image.LANCZOS).save(os.path.join(APP, "apple-icon.png"), "PNG")

    # The SVG must carry the SAME reduced mark. The original app/icon.svg held
    # the full twelve-stroke logo, so whenever a browser preferred the vector
    # (Chrome does, given sizes="any") the tab went back to being a smudge.
    with open(os.path.join(APP, "icon.svg"), "w") as f:
        f.write(reduced_svg())

    for name in ("favicon.ico", "icon.svg", "apple-icon.png"):
        p = os.path.join(APP, name)
        print(f"  {name:18s} {os.path.getsize(p)//1024 or 1:3d}KB")

    # Legibility check: how much of a 16px tile is actually ink?
    tile = draw_mark(256, detail="min").resize((16, 16), Image.LANCZOS).convert("RGB")
    px = list(tile.getdata())
    light = sum(1 for r, g, b in px if r + g + b > 330)
    print(f"\n  16x16 legibility: {light}/{len(px)} px read as mark, not ground "
          f"({100*light/len(px):.0f}%)")


if __name__ == "__main__":
    main()
