from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "documents" / "template-a4-cover.png"
LOGO = ROOT / "assets" / "brand" / "neuralmind-ai-white.png"
FONT_DIR = ROOT / "assets" / "fonts" / "desktop"

PURPLE = (41, 2, 65)
VIOLET = (147, 129, 255)
CORAL = (239, 71, 111)
WHITE = (255, 255, 252)


def font(name, size):
    return ImageFont.truetype(FONT_DIR / name, size)


def main():
    canvas = Image.new("RGB", (1240, 1754), WHITE)
    draw = ImageDraw.Draw(canvas)
    inset = 26
    draw.rectangle((inset, inset, 1240 - inset, 1754 - inset), fill=PURPLE)

    logo = Image.open(LOGO).convert("RGBA")
    logo_width = 430
    logo_height = round(logo_width * logo.height / logo.width)
    logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
    canvas.paste(logo, (132, 126), logo)

    left = 132
    draw.text(
        (left, 555),
        "DOCUMENTO INSTITUCIONAL  /  MODELO A4",
        font=font("NeuralMindSansSquare-SemiBold.ttf", 18),
        fill=VIOLET,
    )
    draw.text(
        (left, 610),
        "[Título do documento]",
        font=font("NeuralMindSansSquare-Bold.ttf", 56),
        fill=WHITE,
    )
    draw.text(
        (left, 695),
        "[Uma frase curta que explica o propósito\ndesta publicação]",
        font=font("NeuralMindSansSquare-Regular.ttf", 27),
        fill=WHITE,
        spacing=10,
    )
    draw.rectangle((left, 815, 1108, 821), fill=CORAL)

    label_font = font("NeuralMindSansSquare-SemiBold.ttf", 17)
    value_font = font("NeuralMindSansSquare-Regular.ttf", 23)
    draw.text((left, 1190), "PREPARADO POR", font=label_font, fill=VIOLET)
    draw.text((left, 1228), "[Área ou responsável]", font=value_font, fill=WHITE)
    draw.text((left, 1305), "DATA  /  VERSÃO", font=label_font, fill=VIOLET)
    draw.text((left, 1343), "[dd.mm.aaaa]  /  [v1.0]", font=value_font, fill=WHITE)

    draw.rectangle((left, 1545, 1108, 1548), fill=VIOLET)
    draw.text(
        (left, 1580),
        "IA responsável para setores críticos",
        font=font("NeuralMindSansSquare-SemiBold.ttf", 20),
        fill=WHITE,
    )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUTPUT, format="PNG", optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
