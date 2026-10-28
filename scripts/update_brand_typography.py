"""Apply the approved lettering families to active brand-guide sources."""
from pathlib import Path
import re,base64,shutil,zipfile
R=Path(__file__).resolve().parents[1]
s=(R/'lettering-reference.html').read_text()
names={400:'Regular',500:'Medium',600:'SemiBold',700:'Bold',800:'ExtraBold',900:'Black'}
faces=[]
for b in re.findall(r'@font-face\s*\{([^}]+)',s):
 f=re.search(r"font-family:\s*'([^']+)'",b).group(1); w=int(re.search(r'font-weight:\s*(\d+)',b).group(1))
 if f not in ['Outfit','Urbanist']:continue
 data=base64.b64decode(re.search(r'base64,([^)]*)',b).group(1).strip("'\" "))
 (R/f'assets/fonts/lettering/{f}-{w}.ttf').write_bytes(data)
 (R/f'assets/fonts/desktop/{f}-{names[w]}.ttf').write_bytes(data)
 faces.append(f'@font-face {{ font-family: "{f}"; src: url("lettering/{f}-{w}.ttf") format("truetype"); font-style: normal; font-weight: {w}; font-display: swap; }}')
(R/'assets/fonts/brand-typography.css').write_text('\n'.join(faces)+'\n:root { --font-brand: "Outfit", Arial, sans-serif; --font-support: "Urbanist", "Outfit", Arial, sans-serif; }\n')
with zipfile.ZipFile(R/'assets/fonts/neuralmind-fonts.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in ['Outfit','Urbanist']:
  for w,n in names.items():z.write(R/f'assets/fonts/desktop/{f}-{n}.ttf',f'{f}/{f}-{n}.ttf')
 z.writestr('LEIA-ME.txt','NeuralMind.ai — Tipografia\nOutfit: títulos, textos e apresentações; pesos 400 a 800.\nUrbanist: apoio em rótulos e números; o M do logo usa Urbanist 800.\nInstale os TTF antes de editar Word e PowerPoint.\nO lettering oficial usa .ai A2. Não recomponha o logo: use os SVGs em contornos.\n')
for p in [R/'styles.css',*list((R/'assets/social').glob('*/post.css'))]:
 t=p.read_text(); t=re.sub(r'@font-face\s*\{[^}]+\}\s*','',t)
 t=t.replace('"NeuralMind Text 2.0"','"Outfit"').replace('"NeuralMind"','"Outfit"')
 rel='assets/fonts/brand-typography.css' if p.name=='styles.css' else '../../fonts/brand-typography.css'
 t=f'@import url("{rel}");\n\n'+t
 p.write_text(t)
# Active HTML pages; historical lettering studies remain intact.
for p in R.glob('*.html'):
 if p.name.startswith('logo-options') or p.name=='lettering-reference.html':continue
 t=p.read_text().replace('NeuralMind Sans Square','Outfit').replace('NeuralMind Text 2.0','Outfit')
 t=re.sub(r'@font-face\s*\{[^}]+\}\s*','',t)
 t=t.replace('"NeuralMind",','"Outfit",')
 if p.name=='preambulo-tech-2026-social.html':t=t.replace('</head>','<link rel="stylesheet" href="assets/fonts/brand-typography.css">\n</head>')
 t=t.replace('assets/brand/legacy/neuralmind-legacy-white.png','assets/brand/neuralmind-ai-white.svg').replace('assets/brand/legacy/neuralmind-legacy-color.png','assets/brand/neuralmind-ai-purple.svg')
 t=t.replace('Marca legada centralizada','Assinatura Outfit + M aberto, com .ai A2 centralizada')
 p.write_text(t)
# The old logo was cropped from an image; the new logo is already tightly framed.
for p in (R/'assets/social').glob('*/post.css'):
 with p.open('a') as f:f.write('\n/* Assinatura oficial em contornos, sem recorte da marca anterior. */\n.legacy-logo { aspect-ratio: auto; overflow: visible; }\n.legacy-logo img { position: static; display: block; width: 100%; height: auto; max-width: 100%; }\n')
for p in (R/'scripts').glob('*.py'):
 if p.name in ['apply_logo_outfit_a2.py','update_brand_typography.py'] or 'legacy' in p.name:continue
 t=p.read_text().replace('NeuralMind Sans Square','Outfit')
 for w,n in names.items():t=t.replace(f'NeuralMindSansSquare-{n}.ttf',f'Outfit-{n}.ttf')
 if p.name=='build_a4_document_template.py':t=t.replace('FONT = "Arial"','FONT = "Outfit"')
 p.write_text(t)
