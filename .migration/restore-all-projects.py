#!/usr/bin/env python3
"""Recria as pastas dos projetos a partir da conta mariaorfanelli-nm."""
import argparse,json,os,shutil,subprocess,sys
from pathlib import Path
PROJECTS=[('ARACI','araci','ARACI'),('ARACI_BRAND','ARACI_BRAND',''),('Finep_Neblina','Finep_Neblina',''),('Finep_PRUMO','Finep_PRUMO',''),('Investing_slides','Investing_slides',''),('Jurema_Branding','Jurema_Branding',''),('NDocs_Branding','ndocs_brand',''),('NM-Brand-Guide','brand-guide-nm','brand-guide-nm'),('NeuralStudio','neuralstudio-brand','neuralstudio-brand-assets'),('PrioScan-Catalisa','PrioScan-Catalisa',''),('Sofia_Branding','Sofia_Branding',''),('Video_Editing','Video_Editing',''),('Video_Institucional_NM','Video_Institucional_NM','')]
def run(args,**kwargs):
 if args and args[0]=='git':args=['git','-c','credential.helper=','-c','credential.helper=!gh auth git-credential']+args[1:]
 subprocess.run(args,check=True,**kwargs)
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('destination',nargs='?',default=str(Path.home()/'Coding'));ap.add_argument('--only',nargs='*',help='Nomes das pastas a restaurar');args=ap.parse_args()
 if not shutil.which('git'):ap.error('Instale Git antes de executar.')
 if not shutil.which('gh'):ap.error('Instale GitHub CLI e entre na conta: gh auth login')
 if subprocess.run(['git','lfs','version'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode:ap.error('Instale Git LFS antes de executar: https://git-lfs.com/')
 dest=Path(args.destination).expanduser().resolve();dest.mkdir(parents=True,exist_ok=True);link_jobs=[]
 for folder,repo,inner in PROJECTS:
  if args.only and folder not in args.only:continue
  parent=dest/folder;target=parent/inner if inner else parent
  if target.exists():
   if not (target/'.git').exists():print('Pasta existente sem Git; preservada:',target);continue
   origin=subprocess.check_output(['git','-C',str(target),'remote','get-url','origin'],text=True).strip().removesuffix('.git')
   if origin not in ['https://github.com/mariaorfanelli-nm/'+repo,'git@github.com:mariaorfanelli-nm/'+repo]:print('Pasta de outro repositório; preservada:',target);continue
   print('Repositório já presente; conferindo os arquivos de mídia:',target)
  else:
   target.parent.mkdir(parents=True,exist_ok=True)
   run(['git','clone','https://github.com/mariaorfanelli-nm/'+repo+'.git',str(target)])
  run(['git','-C',str(target),'lfs','install','--local'])
  run(['git','-C',str(target),'lfs','pull'])
  media=target/'.migration'/'restore-source-assets.py'
  if media.exists():run([sys.executable,str(media)])
  extras=target/'.migration'/'workspace-parent'
  if inner and extras.exists():
   for p in extras.iterdir():
    out=parent/p.name
    if out.exists():print('Arquivo externo já presente; preservado:',out);continue
    if p.is_dir():shutil.copytree(p,out)
    else:shutil.copy2(p,out)
  link_manifest=target/'.migration'/'directory-links.json'
  if link_manifest.exists():link_jobs.append((target,json.loads(link_manifest.read_text())))
  print('Restaurado:',folder,flush=True)
 for project_root,links in link_jobs:
  for link in links:
   path=project_root/link['path'];anchor=dest/link['target_folder']/link['target_path']
   if path.exists() or path.is_symlink():continue
   if not anchor.is_dir():print('Vínculo pendente; pasta de destino ausente:',anchor);continue
   path.parent.mkdir(parents=True,exist_ok=True)
   try:path.symlink_to(os.path.relpath(anchor,path.parent),target_is_directory=True)
   except OSError:shutil.copytree(anchor,path)
   print('Vínculo de pastas restaurado:',path)
 print('Concluído. Reinstale as dependências de cada projeto e transfira suas configurações .env por um meio privado.')
if __name__=='__main__':main()
