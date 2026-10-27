#!/usr/bin/env python3
"""Render Kleber's standalone HTML templates and build a hybrid editable PPTX."""

from pathlib import Path
import re
import subprocess
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "kleber"
OUT.mkdir(parents=True, exist_ok=True)
CHROME = "/usr/bin/google-chrome"
PAGE = (ROOT / "kleber-speaker-kit.html").as_uri()


def shot(asset, width, height, filename):
    target = OUT / filename
    command = [
        CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
        "--user-data-dir=/tmp/nm-kleber-kit-chrome", "--force-device-scale-factor=1",
        f"--window-size={width},{height}", "--virtual-time-budget=2500",
        f"--screenshot={target}", f"{PAGE}?asset={asset}",
    ]
    subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(target)


shot("slide-purple", 1600, 900, "kleber-slide-purple-1600x900.png")
shot("slide-purple-background", 1600, 900, "kleber-slide-purple-background-1600x900.png")
shot("slide-white", 1600, 900, "kleber-slide-white-1600x900.png")
shot("slide-white-background", 1600, 900, "kleber-slide-white-background-1600x900.png")
shot("social", 1080, 1350, "kleber-event-social-1080x1350.png")
shot("social-background", 1080, 1350, "kleber-event-social-background-1080x1350.png")


def esc(value):
    return (value.replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;"))


def text_shape(shape_id, name, value, x, y, w, h, size, color, bold=False):
    """Return a PowerPoint textbox in raw DrawingML; coordinates are inches."""
    paragraphs = []
    for line in value.split("\n"):
        paragraphs.append(
            f'<a:p><a:pPr algn="l"><a:spcBef><a:spcPts val="0"/></a:spcBef>'
            f'<a:spcAft><a:spcPts val="0"/></a:spcAft></a:pPr><a:r>'
            f'<a:rPr lang="pt-BR" sz="{int(size * 100)}" b="{1 if bold else 0}">'
            f'<a:solidFill><a:srgbClr val="{color}"/></a:solidFill>'
            f'<a:latin typeface="NeuralMind Sans Square"/></a:rPr><a:t>{esc(line)}</a:t>'
            f'</a:r><a:endParaRPr lang="pt-BR" sz="{int(size * 100)}"/></a:p>'
        )
    emu = lambda inches: int(inches * 914400)
    return (
        f'<p:sp><p:nvSpPr><p:cNvPr id="{shape_id}" name="{esc(name)}"/>'
        f'<p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm>'
        f'<a:off x="{emu(x)}" y="{emu(y)}"/><a:ext cx="{emu(w)}" cy="{emu(h)}"/>'
        f'</a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>'
        f'<p:txBody><a:bodyPr wrap="square" anchor="t" lIns="0" rIns="0" tIns="0" bIns="0">'
        f'<a:spAutoFit/></a:bodyPr><a:lstStyle/>{"".join(paragraphs)}</p:txBody></p:sp>'
    )


def slide_xml(background_name, width, height, shapes):
    picture = (
        '<p:pic><p:nvPicPr><p:cNvPr id="2" name="Fundo renderizado HTML" '
        f'descr="{esc(background_name)}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/>'
        '</p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="rId2"/>'
        '<a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm>'
        f'<a:off x="0" y="0"/><a:ext cx="{width}" cy="{height}"/></a:xfrm>'
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>'
    )
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
        'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        '<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/>'
        '</p:nvGrpSpPr><p:grpSpPr/>' + picture + shapes +
        '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>'
    ).encode("utf-8")


def build_pptx(target, pages, width, height):
    """Use the existing valid deck package as an editable OOXML scaffold."""
    source = ROOT / "Template_Slides_NeuralMind_AI_Editavel.pptx"
    count = len(pages)
    with zipfile.ZipFile(source) as src, zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as dst:
        for info in src.infolist():
            name = info.filename
            numbered = re.search(r"(?:slide|notesSlide|image)(\d+)", name)
            if numbered and any(part in name for part in ("ppt/slides/", "ppt/notesSlides/", "ppt/media/")):
                if int(numbered.group(1)) > count:
                    continue
            data = src.read(name)
            slide_match = re.fullmatch(r"ppt/slides/slide(\d+)\.xml", name)
            image_match = re.fullmatch(r"ppt/media/image(\d+)\.png", name)
            if slide_match and int(slide_match.group(1)) <= count:
                data = pages[int(slide_match.group(1)) - 1]["xml"]
            elif image_match and int(image_match.group(1)) <= count:
                data = pages[int(image_match.group(1)) - 1]["background"].read_bytes()
            elif name == "ppt/presentation.xml":
                text = data.decode("utf-8")
                slide_ids = re.findall(r'<p:sldId[^>]*/>', text)
                text = re.sub(r'<p:sldIdLst>.*?</p:sldIdLst>',
                              '<p:sldIdLst>' + ''.join(slide_ids[:count]) + '</p:sldIdLst>', text)
                text = re.sub(r'<p:sldSz cx="\d+" cy="\d+"[^>]*/>',
                              f'<p:sldSz cx="{width}" cy="{height}" type="custom"/>', text)
                data = text.encode("utf-8")
            elif name == "ppt/_rels/presentation.xml.rels":
                text = data.decode("utf-8")
                for relation in re.findall(r'<Relationship[^>]*/>', text):
                    target_match = re.search(r'Target="slides/slide(\d+)\.xml"', relation)
                    if target_match and int(target_match.group(1)) > count:
                        text = text.replace(relation, "")
                data = text.encode("utf-8")
            elif name == "[Content_Types].xml":
                text = data.decode("utf-8")
                for override in re.findall(r'<Override[^>]*/>', text):
                    number = re.search(r'/(?:slides/slide|notesSlides/notesSlide)(\d+)\.xml', override)
                    if number and int(number.group(1)) > count:
                        text = text.replace(override, "")
                data = text.encode("utf-8")
            dst.writestr(info, data)
    return target


slide_width, slide_height = 12191999, 6858000
purple_shapes = "".join([
    text_shape(3, "Seção", "ENCERRAMENTO", .93, 1.15, 3.2, .28, 12, "EF476F", True),
    text_shape(4, "Agradecimento", "Obrigado.", .93, 1.72, 4.8, .9, 66, "FFFFFC"),
    text_shape(5, "Nome", "Kleber Edurado Vicente dos Santos", .93, 3.05, 4.8, .35, 15, "FFFFFC"),
    text_shape(6, "Cargo", "Head de Inovação, Produtos e\nDesenvolvimento de Negócios", .93, 3.44, 4.7, .55, 10, "C8C0CD", True),
    text_shape(7, "Rótulo e-mail", "E-MAIL", .93, 4.58, 1.2, .22, 8, "EF476F", True),
    text_shape(8, "E-mail", "nome@empresa.com", .93, 4.86, 2.3, .28, 10, "FFFFFC"),
    text_shape(9, "Rótulo telefone", "TELEFONE", 3.55, 4.58, 1.25, .22, 8, "EF476F", True),
    text_shape(10, "Telefone", "+55 00 00000-0000", 3.55, 4.86, 2.15, .28, 10, "FFFFFC"),
])
white_shapes = "".join([
    text_shape(3, "Seção", "ENCERRAMENTO", .88, 1.24, 3.2, .28, 12, "290241", True),
    text_shape(4, "Agradecimento", "Obrigado.", .88, 1.82, 5.6, .9, 65, "0F1108"),
    text_shape(5, "Mensagem", "Fico à disposição para continuarmos esta conversa.", .88, 3.05, 5.5, .55, 15, "625E63"),
    text_shape(6, "Rótulo e-mail", "E-MAIL", .88, 4.45, 1.2, .22, 8, "EF476F", True),
    text_shape(7, "E-mail", "nome@empresa.com", .88, 4.73, 2.35, .28, 10, "0F1108"),
    text_shape(8, "Rótulo telefone", "TELEFONE", 3.55, 4.45, 1.3, .22, 8, "EF476F", True),
    text_shape(9, "Telefone", "+55 00 00000-0000", 3.55, 4.73, 2.2, .28, 10, "0F1108"),
    text_shape(10, "Nome", "Kleber Edurado\nVicente dos Santos", 8.18, 5.54, 3.65, .62, 15, "FFFFFC"),
    text_shape(11, "Cargo", "Head de Inovação, Produtos e\nDesenvolvimento de Negócios", 8.18, 6.22, 3.65, .48, 8, "EF476F", True),
])
closing_pages = [
    {"background": OUT / "kleber-slide-purple-background-1600x900.png",
     "xml": slide_xml("kleber-slide-purple-background-1600x900.png", slide_width, slide_height, purple_shapes)},
    {"background": OUT / "kleber-slide-white-background-1600x900.png",
     "xml": slide_xml("kleber-slide-white-background-1600x900.png", slide_width, slide_height, white_shapes)},
]
closing_pptx = build_pptx(ROOT / "Slide_Kleber_Vicente_Editavel.pptx", closing_pages, slide_width, slide_height)
print(closing_pptx)

event_width, event_height = 7315200, 9144000
event_shapes = "".join([
    text_shape(3, "Tipo", "EVENTO", 6.43, .62, .95, .24, 12, "EF476F", True),
    text_shape(4, "Data e horário", "Data · horário", 5.72, 1.00, 1.7, .32, 16, "FFFFFC"),
    text_shape(5, "Chamada", "PARTICIPAÇÃO CONFIRMADA", .65, 4.85, 5.3, .3, 14, "EF476F", True),
    text_shape(6, "Tema", "Tema da\nparticipação\nno evento.", .65, 5.38, 5.5, 1.75, 48, "FFFFFC"),
    text_shape(7, "Nome", "Kleber Edurado\nVicente dos Santos", .65, 7.48, 5.9, .68, 25, "FFFFFC"),
    text_shape(8, "Cargo", "HEAD DE INOVAÇÃO, PRODUTOS E\nDESENVOLVIMENTO DE NEGÓCIOS", .65, 8.26, 5.8, .48, 12, "C8C0CD", True),
    text_shape(9, "Evento e local", "NOME DO EVENTO · LOCAL", .65, 9.12, 5.9, .28, 12, "C8C0CD", True),
])
event_pages = [{
    "background": OUT / "kleber-event-social-background-1080x1350.png",
    "xml": slide_xml("kleber-event-social-background-1080x1350.png", event_width, event_height, event_shapes),
}]
event_pptx = build_pptx(ROOT / "Card_Evento_Kleber_Editavel.pptx", event_pages, event_width, event_height)
print(event_pptx)
