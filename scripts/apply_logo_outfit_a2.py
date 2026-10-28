"""Extract the supplied lettering fonts and build portable outlined SVGs."""
import base64,re,json,shutil,zipfile
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
ROOT=Path(__file__).resolve().parents[1]
s=Path('/home/maria/Downloads/neuralmind-lettering.html').read_text()
fontdir=ROOT/'assets/fonts/lettering'; fontdir.mkdir(exist_ok=True)
for block in re.findall(r'@font-face\s*\{([^}]+)',s):
 family=re.search(r"font-family:\s*'([^']+)'",block).group(1)
 weight=re.search(r'font-weight:\s*(\d+)',block).group(1)
 if (family,weight) not in [('Outfit','400'),('Outfit','800'),('Urbanist','800')]:continue
 data=re.search(r'base64,([^)]*)',block).group(1).strip("'\" ")
 (fontdir/f'{family}-{weight}.ttf').write_bytes(base64.b64decode(data))
fonts={k:TTFont(fontdir/f'{k}.ttf') for k in ['Outfit-400','Outfit-800','Urbanist-800']}
def artwork(kind,color,tail):
 chunks=([('N','Outfit-400',100),('M','Urbanist-800',98)] if kind.startswith('nm-') else [('Neural','Outfit-400',100),('M','Urbanist-800',98),('ind','Outfit-800',100)]+([('.ai','Outfit-400',100)] if kind=='neuralmind-ai' else []))
 x=12; paths=[]
 for text,key,size in chunks:
  f=fonts[key]; scale=size/f['head'].unitsPerEm; gs=f.getGlyphSet(); cmap=f.getBestCmap(); suffix=text=='.ai'
  if suffix:x+=1.5
  for c in text:
   g=cmap[ord(c)]; pen=SVGPathPen(gs); gs[g].draw(TransformPen(pen,(scale,0,0,-scale,x,110)))
   paths.append(f'<path fill="{tail if suffix else color}" d="{pen.getCommands()}"/>')
   x+=f['hmtx'][g][0]*scale+(0 if suffix else -2)
  if text=='M':x-=1.5
 opacity=' opacity="0.12"' if kind=='nm-watermark' else ''
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {x+12:.3f} 140" role="img"><title>{kind} · Outfit + Urbanist · A2</title><g{opacity}>'+''.join(paths)+'</g></svg>'
out=ROOT/'assets/brand'; files=[]
for kind in ['neuralmind','neuralmind-ai','nm-monogram','nm-watermark']:
 for variant,color,tail in [('purple','#290241','#290241'),('white','#fffffc','#fffffc'),('lilac','#9880ff','#9880ff'),('black','#111111','#111111'),('color','#290241','#7750b8'),('inverse','#fffffc','#b7a2ff')]:
  p=out/f'{kind}-{variant}.svg';p.write_text(artwork(kind,color,tail));files.append(p)
with zipfile.ZipFile(out/'neuralmind-svg-kit.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in files:z.write(p,p.name)
print(f'{len(files)} SVGs em contornos; fontes extraídas do HTML original.')
