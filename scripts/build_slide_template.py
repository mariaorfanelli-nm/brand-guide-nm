"""Publish the current 16-slide editable deck under its standard filename."""
from pathlib import Path
import runpy
import shutil
ROOT = Path(__file__).resolve().parents[1]
if __name__ == "__main__":
    runpy.run_path(str(ROOT / "scripts/build_hybrid_pptx.py"), run_name="__main__")
    target = ROOT / "Template_Slides_NeuralMind_AI.pptx"
    shutil.copy2(ROOT / "Template_Slides_NeuralMind_AI_Editavel.pptx", target)
    print(target)
