#!/usr/bin/env python3
"""Export text-free HTML slide backgrounds plus browser-computed text metadata."""

from pathlib import Path
import html as html_lib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / "index.html").read_text(encoding="utf-8")
match = re.search(r'<div class="slides-stack">(.*?)</div>\s*</section>\s*<section id="meet"', SOURCE, re.S)
if not match:
    raise SystemExit("slides-stack not found")
cards = re.findall(r'<article class="slide-card">\s*(<div class="deck-slide.*?</div>)\s*<div class="slide-meta">', match.group(1), re.S)
if len(cards) != 16:
    raise SystemExit(f"expected 16 slides, found {len(cards)}")

OUT = ROOT / "assets" / "slides-hybrid"
OUT.mkdir(parents=True, exist_ok=True)
CHROME = "/usr/bin/google-chrome"

JS = r'''
<script>
function directText(el) {
  let value = "";
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) value += node.textContent;
    else if (node.nodeName === "BR") value += "\n";
  }
  return value.replace(/[ \t]+/g, " ").replace(/^\s+|\s+$/g, "");
}
async function collect() {
  await document.fonts.ready;
  const root = document.querySelector(".deck-slide");
  const items = [];
  for (const el of root.querySelectorAll("*")) {
    const value = directText(el);
    if (!value) continue;
    const textNodes = [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (!textNodes.length) continue;
    const range = document.createRange();
    range.setStartBefore(textNodes[0]); range.setEndAfter(textNodes[textNodes.length - 1]);
    const glyph = range.getBoundingClientRect();
    const parent = el.getBoundingClientRect();
    const hasNestedElements = [...el.children].some(c => c.nodeName !== "BR");
    const r = hasNestedElements
      ? {x:glyph.x, y:glyph.y, width:(el.nodeName === "LI" ? parent.right - glyph.x : glyph.width), height:glyph.height}
      : parent;
    const s = getComputedStyle(el);
    if (r.width < 1 || r.height < 1 || s.display === "none" || s.visibility === "hidden") continue;
    items.push({
      text: value, x:r.x, y:r.y, w:r.width, h:r.height,
      fontSize:parseFloat(s.fontSize), fontWeight:s.fontWeight,
      fontFamily:s.fontFamily, color:s.color, opacity:parseFloat(s.opacity),
      lineHeight:s.lineHeight, letterSpacing:s.letterSpacing,
      textAlign:s.textAlign, textTransform:s.textTransform
    });
  }
  const data = document.createElement("pre");
  data.id = "slide-text-data";
  data.textContent = JSON.stringify(items);
  data.style.display = "none";
  document.body.appendChild(data);
  document.documentElement.classList.add("hide-slide-text");
}
collect();
</script>
'''

for number, card in enumerate(cards, 1):
    page = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<base href="{ROOT.as_uri()}/"><link rel="stylesheet" href="styles.css">
<style>
html,body{{margin:0!important;padding:0!important;width:1600px!important;height:900px!important;overflow:hidden!important;background:#290241!important}}
.deck-slide{{width:1600px!important;height:900px!important;aspect-ratio:auto!important;border-radius:0!important;box-shadow:none!important;box-sizing:border-box!important}}
.hide-slide-text .deck-slide,.hide-slide-text .deck-slide *{{color:transparent!important;text-shadow:none!important}}
</style></head><body>{card}{JS}</body></html>'''
    temp = OUT / f"slide-{number:02d}.html"
    temp.write_text(page, encoding="utf-8")
    common = [CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
              "--user-data-dir=/tmp/nm-hybrid-chrome", "--force-device-scale-factor=1",
              "--window-size=1600,900", "--virtual-time-budget=2500"]
    dumped = subprocess.run(common + ["--dump-dom", temp.as_uri()], capture_output=True, text=True, check=True).stdout
    data_match = re.search(r'<pre id="slide-text-data"[^>]*>(.*?)</pre>', dumped, re.S)
    if not data_match:
        raise SystemExit(f"text metadata missing for slide {number}")
    items = json.loads(html_lib.unescape(data_match.group(1)))
    (OUT / f"slide-{number:02d}.json").write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    target = OUT / f"slide-{number:02d}-background.png"
    subprocess.run(common + [f"--screenshot={target}", temp.as_uri()], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    temp.unlink()
    print(number, len(items), target)
