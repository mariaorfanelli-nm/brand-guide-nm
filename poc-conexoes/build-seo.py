"""Apply technical SEO to static previews without changing editorial copy or design."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit
import re,json,html
from PIL import Image
ROOT=Path(__file__).resolve().parent
manifest=json.loads((ROOT/'content/seo-pages.json').read_text())
ORIGIN=manifest['productionOrigin'];PREVIEW=manifest['previewOrigin']
ORG={'@type':'Organization','@id':ORIGIN+'/#organization','name':'NeuralMind','url':ORIGIN+'/','foundingDate':'2017','logo':'https://framerusercontent.com/images/6vnjAOtFA3rg3VbbaOLIU72xxY.png','email':'contato@neuralmind.ai','sameAs':['https://www.linkedin.com/company/neuralmind-ai/','https://www.instagram.com/neuralmind_ai/']}
SITE={'@type':'WebSite','@id':ORIGIN+'/#website','url':ORIGIN+'/','name':'NeuralMind','inLanguage':'pt-BR','publisher':{'@id':ORG['@id']}}
knownAlts={
 'assertia-partnership-original.png':'Profissional analisa um documento no computador com representações digitais de pesquisa e análise textual',
 'sofia-original.png':'Fachada de hospital em imagem ilustrativa do case SofIA na ANS',
 'assertia-original.png':'Profissional analisa dados no computador em imagem ilustrativa do case AssertIA no TCU',
 'prioscan-original.jpeg':'Equipe médica reunida diante de uma radiografia de tórax no monitor',
 'corporate-a-research.webp':'Profissionais em uma estação de pesquisa e desenvolvimento em inteligência artificial',
 'neuralstudio-study-v2.webp':'Profissional consulta informações e faz anotações durante o trabalho',
 'corporate-b-decisions.webp':'Especialistas reunidos para analisar informações e discutir decisões',
 'corporate-c-tech-detail.webp':'Equipamentos de computação e infraestrutura para pesquisa em inteligência artificial',
 'fndtc.png':'FNDCT — Fundo Nacional de Desenvolvimento Científico e Tecnológico',
 'finep.png':'Finep — Financiadora de Estudos e Projetos',
 'ans.png':'ANS — Agência Nacional de Saúde Suplementar',
 'tcu.png':'TCU — Tribunal de Contas da União',
 'nvidia-inception.png':'NVIDIA Inception',
 'empresa-filha-unicamp.png':'Empresa filha da Unicamp',
 'integrated-biometrics.png':'Integrated Biometrics',
 'enforce.png':'Enforce',
 'futronic.png':'Futronic',
 'fundep.png':'FUNDEP — Fundação de Desenvolvimento da Pesquisa'}
class Attrs(HTMLParser):
 def handle_starttag(self,tag,attrs):self.attrs=dict(attrs)
def attrs(tag):
 p=Attrs();p.feed(tag);return p.attrs
serviceNames={'/neuralstudio':'NeuralStudio','/sofia':'SofIA','/prioscan':'PrioScan','/neuralstudio/matriculas':'NDocs Matrículas'}
serviceTypes={'/neuralstudio':'Inteligência corporativa','/sofia':'Inteligência jurídica e regulatória','/prioscan':'IA para priorização de exames','/neuralstudio/matriculas':'Inteligência documental para matrículas imobiliárias'}
def graph(row):
 canonical=(PREVIEW+'/'+row['file']) if row['kind']=='template' else ORIGIN+row['path']
 web={'@type':'WebPage','@id':canonical+'#webpage','url':canonical,'name':row['title'],'description':row['description'],'inLanguage':'pt-BR','isPartOf':{'@id':SITE['@id']},'publisher':{'@id':ORG['@id']}}
 g=[web]
 if row['kind']=='home':g=[ORG,SITE,web]
 else:
  trail=[{'@type':'ListItem','position':1,'name':'NeuralMind','item':ORIGIN+'/'}]
  if row['path'].startswith('/neuralstudio/'):
   trail.append({'@type':'ListItem','position':2,'name':'NeuralStudio','item':ORIGIN+'/neuralstudio'})
  elif row['path'].startswith('/blog/'):
   trail.append({'@type':'ListItem','position':2,'name':'Conteúdos','item':ORIGIN+'/blog'})
  trail.append({'@type':'ListItem','position':len(trail)+1,'name':row['title'].split(' | ')[0],'item':canonical})
  g.append({'@type':'BreadcrumbList','@id':canonical+'#breadcrumb','itemListElement':trail})
 if row['kind']=='service':
  entity={'@type':'Service','@id':canonical+'#service','name':serviceNames[row['path']],'serviceType':serviceTypes[row['path']],'description':row['description'],'url':canonical,'provider':{'@id':ORG['@id']}}
  web['mainEntity']={'@id':entity['@id']};g.append(entity)
 if row['kind']=='article':
  g.append({'@type':'BlogPosting','@id':canonical+'#article','mainEntityOfPage':{'@id':web['@id']},'headline':row['title'].removesuffix(' | NeuralMind'),'description':row['description'],'image':PREVIEW+'/'+row['image'],'publisher':{'@id':ORG['@id']},'inLanguage':'pt-BR'})
 return canonical,{'@context':'https://schema.org','@graph':g}
changes=[]
for row in manifest['pages']:
 p=ROOT/row['file'];s=p.read_text();head,body=s.split('</head>',1)
 head=re.sub(r'<title>.*?</title>','<title>'+html.escape(row['title'])+'</title>',head,flags=re.S)
 names={'description','robots','twitter:card','twitter:title','twitter:description','twitter:image','twitter:image:alt'}
 def cleanMeta(m):
  a=attrs(m[0]);return '' if a.get('name') in names or str(a.get('property','')).startswith('og:') else m[0]
 head=re.sub(r'<meta\b[^>]*>',cleanMeta,head)
 head=re.sub(r'<link\b[^>]*>',lambda m:'' if attrs(m[0]).get('rel')=='canonical' else m[0],head)
 head=re.sub(r'<script type="application/ld\+json" id="nm-seo-structured">.*?</script>','',head,flags=re.S)
 canonical,schema=graph(row);image=PREVIEW+'/'+row['image']
 entries=[('name','description',row['description']),('name','robots','noindex, follow, max-image-preview:large'),('property','og:type','article' if row['kind']=='article' else 'website'),('property','og:site_name','NeuralMind'),('property','og:locale','pt_BR'),('property','og:title',row['title']),('property','og:description',row['description']),('property','og:url',canonical),('property','og:image',image),('property','og:image:alt',row['imageAlt']),('name','twitter:card','summary_large_image'),('name','twitter:title',row['title']),('name','twitter:description',row['description']),('name','twitter:image',image),('name','twitter:image:alt',row['imageAlt'])]
 head+=''.join(f'<meta {attribute}="{key}" content="{html.escape(value,quote=True)}">' for attribute,key,value in entries)+f'<link rel="canonical" href="{html.escape(canonical,quote=True)}">'
 head+='<script type="application/ld+json" id="nm-seo-structured">'+json.dumps(schema,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+'</script>'
 imageChanges=0
 def updateImage(m):
  global imageChanges
  tag=m[0];a=attrs(tag);src=a.get('src','');name=Path(urlsplit(src).path).name
  if name in knownAlts:
   alt=knownAlts[name]
   if a.get('alt')!=alt:
    if 'alt' in a:tag=re.sub(r'\balt="[^"]*"','alt="'+html.escape(alt,quote=True)+'"',tag,count=1)
    else:tag=tag[:-1]+' alt="'+html.escape(alt,quote=True)+'">'
    imageChanges+=1
  if 'decoding' not in a:tag=tag[:-1]+' decoding="async">'
  imagePath=(p.parent/urlsplit(src).path).resolve()
  if imagePath.exists() and name.lower().endswith(('.png','.jpg','.jpeg','.webp')) and ('width' not in a or 'height' not in a):
   with Image.open(imagePath) as im:w,h=im.size
   if 'width' not in a:tag=tag[:-1]+f' width="{w}">'
   if 'height' not in a:tag=tag[:-1]+f' height="{h}">'
  return tag
 body=re.sub(r'<img\b[^>]*>',updateImage,body)
 p.write_text(head+'</head>'+body)
 changes.append({'file':row['file'],'path':row['path'],'title':row['title'],'descriptionLength':len(row['description']),'imageAltsUpdated':imageChanges})
(ROOT/'content/seo-static-audit.json').write_text(json.dumps({'pages':changes,'previewIndexing':'noindex, follow','canonicalOrigin':ORIGIN,'structuredData':['Organization','WebSite','WebPage','BreadcrumbList','Service','BlogPosting']},ensure_ascii=False,indent=2)+'\n')
print(f'Updated {len(changes)} pages: metadata, canonical links, social cards, structured data and image attributes.')
