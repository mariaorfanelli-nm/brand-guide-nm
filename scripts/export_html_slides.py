#!/usr/bin/env python3
"""Render the HTML slide templates as exact 1600x900 PNG files."""

from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")

match = re.search(r'<div class="slides-stack">(.*?)</div>\s*</section>\s*<section id="meet"', HTML, re.S)
if not match:
    raise SystemExit("slides-stack not found")

cards = re.findall(r'<article class="slide-card">\s*(<div class="deck-slide.*?</div>)\s*<div class="slide-meta">', match.group(1), re.S)
if len(cards) != 14:
    raise SystemExit(f"expected 14 slides, found {len(cards)}")

out_dir = ROOT / "assets" / "slides-rendered"
out_dir.mkdir(parents=True, exist_ok=True)

chrome = "/usr/bin/google-chrome"
for number, card in enumerate(cards, 1):
    page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<base href="{ROOT.as_uri()}/">
<link rel="stylesheet" href="styles.css">
<style>
html,body{{margin:0!important;padding:0!important;width:1600px!important;height:900px!important;overflow:hidden!important;background:#290241!important}}
.deck-slide{{width:1600px!important;height:900px!important;aspect-ratio:auto!important;border-radius:0!important;box-shadow:none!important;box-sizing:border-box!important}}
</style></head><body>{card}</body></html>'''
    temp = out_dir / f"slide-{number:02d}.html"
    temp.write_text(page, encoding="utf-8")
    target = out_dir / f"slide-{number:02d}.png"
    cmd = [chrome, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
           "--user-data-dir=/tmp/nm-slide-chrome", "--force-device-scale-factor=1",
           "--window-size=1600,900", f"--screenshot={target}", temp.as_uri()]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode:
        print(result.stderr, file=sys.stderr)
        raise SystemExit(result.returncode)
    temp.unlink()
    print(target)
