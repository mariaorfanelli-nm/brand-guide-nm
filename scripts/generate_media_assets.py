from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "assets" / "brand"
FONTS = ROOT / "assets" / "fonts" / "desktop"
OUTPUT = ROOT / "assets" / "media"

PURPLE_BRAND = (41, 2, 65)
VIOLET = (147, 129, 255)
CORAL = (239, 71, 111)


def horizontal_gradient(size, left, right):
    width, height = size
    strip = Image.new("RGB", (width, 1))
    pixels = strip.load()
    for x in range(width):
        amount = x / max(width - 1, 1)
        pixels[x, 0] = tuple(
            round(left[channel] * (1 - amount) + right[channel] * amount)
            for channel in range(3)
        )
    return strip.resize((width, height))


def add_glow(canvas, box, color, opacity, blur):
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse(box, fill=(*color, opacity))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(blur)))


def resized_asset(path, width):
    asset = Image.open(path).convert("RGBA")
    height = round(width * asset.height / asset.width)
    return asset.resize((width, height), Image.Resampling.LANCZOS)


def paste_centered(canvas, asset, center_x, top):
    canvas.alpha_composite(asset, (round(center_x - asset.width / 2), top))


def centered_text(draw, text, center_x, top, font, fill):
    bounds = draw.textbbox((0, 0), text, font=font)
    width = bounds[2] - bounds[0]
    draw.text((round(center_x - width / 2), top), text, font=font, fill=fill)


def right_aligned_text(draw, text, right, top, font, fill):
    bounds = draw.textbbox((0, 0), text, font=font)
    width = bounds[2] - bounds[0]
    draw.text((round(right - width), top), text, font=font, fill=fill)


def save_jpeg(canvas, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(
        path,
        format="JPEG",
        quality=95,
        subsampling=0,
        optimize=True,
        progressive=True,
    )


def linkedin_cover():
    size = (4200, 700)
    canvas = horizontal_gradient(size, (17, 0, 27), PURPLE_BRAND).convert("RGBA")
    add_glow(canvas, (3250, -760, 4900, 1080), VIOLET, 42, 320)

    logo = resized_asset(BRAND / "neuralmind-ai-white.png", 1540)
    content_right = 3760
    canvas.alpha_composite(logo, (content_right - logo.width, 172))

    draw = ImageDraw.Draw(canvas)
    tagline_font = ImageFont.truetype(
        FONTS / "NeuralMindSansSquare-Medium.ttf", 60
    )
    right_aligned_text(
        draw,
        "A inteligência por trás das decisões mais complexas.",
        content_right,
        426,
        font=tagline_font,
        fill=(255, 255, 252, 224),
    )
    draw.rounded_rectangle((content_right - 1520, 546, content_right, 554), radius=4, fill=CORAL)
    save_jpeg(canvas, OUTPUT / "linkedin-company-cover-4200x700.jpg")


def youtube_banner():
    size = (2560, 1440)
    canvas = horizontal_gradient(size, (16, 0, 25), (38, 2, 59)).convert("RGBA")
    add_glow(canvas, (560, 100, 2000, 1340), VIOLET, 32, 330)

    logo = resized_asset(BRAND / "neuralmind-ai-white.png", 920)
    paste_centered(canvas, logo, 1280, 602)

    draw = ImageDraw.Draw(canvas)
    tagline_font = ImageFont.truetype(
        FONTS / "NeuralMindSansSquare-Medium.ttf", 58
    )
    centered_text(
        draw,
        "A inteligência por trás das decisões mais complexas.",
        1280,
        792,
        tagline_font,
        (255, 255, 252, 224),
    )
    draw.rounded_rectangle((1095, 902, 1465, 910), radius=4, fill=CORAL)
    save_jpeg(canvas, OUTPUT / "youtube-channel-banner-2560x1440.jpg")


if __name__ == "__main__":
    linkedin_cover()
    youtube_banner()
    for generated in sorted(OUTPUT.glob("*.jpg")):
        with Image.open(generated) as image:
            print(f"{generated.relative_to(ROOT)} | {image.width}x{image.height} | {generated.stat().st_size} bytes")
