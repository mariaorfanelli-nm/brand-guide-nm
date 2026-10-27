#!/usr/bin/env python3
"""Render the Preâmbulo Tech 2026 social artboards to PNG."""

from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "social" / "preambulo-tech-2026"
OUT.mkdir(parents=True, exist_ok=True)
CHROME = "/usr/bin/google-chrome"
PAGE = (ROOT / "preambulo-tech-2026-social.html").as_uri()


def shot(asset, width, height, filename):
    target = OUT / filename
    command = [
        CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
        "--user-data-dir=/tmp/nm-preambulo-chrome", "--force-device-scale-factor=1",
        f"--window-size={width},{height}", "--virtual-time-budget=3000",
        f"--screenshot={target}", f"{PAGE}?asset={asset}",
    ]
    subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(target)


for index in range(1, 4):
    shot(f"ig-{index}", 1080, 1350, f"instagram-{index}-1080x1350.png")
shot("li-1", 1200, 1200, "linkedin-1200x1200.png")
