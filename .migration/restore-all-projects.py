#!/usr/bin/env python3
"""Recria as pastas dos projetos a partir da conta mariaorfanelli-nm."""
import argparse,json,os,shutil,subprocess
from pathlib import Path
PROJECTS=[('ARACI','araci','ARACI'),('ARACI_BRAND','ARACI_BRAND',''),('Finep_Neblina','Finep_Neblina',''),('Finep_PRUMO','Finep_PRUMO',''),('Investing_slides','Investing_slides',''),('Jurema_Branding','Jurema_Branding',''),('NDocs_Branding','ndocs_brand',''),('NM-Brand-Guide','brand-guide-nm','brand-guide-nm'),('NeuralStudio','neuralstudio-brand','neuralstudio-brand-assets'),('PrioScan-Catalisa','PrioScan-Catalisa',''),('Sofia_Branding','Sofia_Branding',''),('Video_Editing','Video_Editing',''),('Video_Institucional_NM','Video_Institucional_NM','')]
def run(args,**kwargs):subprocess.run(args,check=True,**kwargs)
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('destination',nargs='?',default=str(Path.home()/'Coding'));ap.add_argument('--only',nargs='*',help='Nomes das pastas a restaurar');args=ap.parse_args()
 if not shutil.which('git'):ap.error('Instale Git antes de executar.')
 if subprocess.run(['git','lfs','version'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode:ap.error('Instale Git LFS antes de executar: https://git-lfs.com/')
 run(['git','lfs','install']);dest=Path(args.destination).expanduser().resolve();dest.mkdir(parents=True,exist_ok=True)
 for folder,repo,inner in PROJECTS:
  if args.only and folder not in args.only:continue
  parent=dest/folder;target=parent/inner if inner else parent
  if target.exists():print('Pasta já existe; preservada:',target);continue
  target.parent.mkdir(parents=True,exist_ok=True)
  run(['git','clone','https://github.com/mariaorfanelli-nm/'+repo+'.git',str(target)])
  run(['git','-C',str(target),'lfs','pull'])
  extras=target/'.migration'/'workspace-parent'
  if inner and extras.exists():
   for p in extras.iterdir():
    out=parent/p.name
    if out.exists():raise RuntimeError('Destino já existe: '+str(out))
    if p.is_dir():shutil.copytree(p,out)
    else:shutil.copy2(p,out)
  print('Restaurado:',folder,flush=True)
 print('Concluído. Reinstale as dependências de cada projeto e transfira suas configurações .env por um meio privado.')
if __name__=='__main__':main()
