/* Regenerate active brand-guide media from their HTML sources. */
const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const {chromium}=require('/home/maria/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const url=(file,query='')=>pathToFileURL(path.join(root,file)).href+query;
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'/home/maria/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome',headless:true});
 const p=await b.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(url('index.html'));await p.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
 const slides=await p.locator('.deck-slide').evaluateAll(a=>a.map(e=>e.outerHTML));
 for(let i=0;i<slides.length;i++){
  await p.setViewportSize({width:1600,height:900});
  await p.setContent(`<base href="${url('')}/"><link rel="stylesheet" href="styles.css"><style>html,body{margin:0!important;padding:0!important;width:1600px!important;height:900px!important;overflow:hidden!important}.deck-slide{width:1600px!important;height:900px!important;aspect-ratio:auto!important;border-radius:0!important;box-shadow:none!important}</style>${slides[i]}`);
  await p.evaluate(()=>document.fonts.ready);
  const n=String(i+1).padStart(2,'0');
  await p.locator('.deck-slide').screenshot({path:path.join(root,`assets/slides-rendered/slide-${n}.png`)});
  const items=await p.evaluate(()=>{
   function direct(el){let v='';for(const n of el.childNodes)if(n.nodeType===3)v+=n.textContent;else if(n.nodeName==='BR')v+='\n';return v.replace(/[ \t]+/g,' ').trim()}
   const items=[];
   for(const el of document.querySelector('.deck-slide').querySelectorAll('*')){
    const value=direct(el);if(!value)continue;
    const nodes=[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim());if(!nodes.length)continue;
    const range=document.createRange();range.setStartBefore(nodes[0]);range.setEndAfter(nodes[nodes.length-1]);const glyph=range.getBoundingClientRect(),parent=el.getBoundingClientRect();
    const nested=[...el.children].some(c=>c.nodeName!=='BR');const r=nested?{x:glyph.x,y:glyph.y,width:el.nodeName==='LI'?parent.right-glyph.x:glyph.width,height:glyph.height}:parent;const s=getComputedStyle(el);
    if(r.width<1||r.height<1||s.display==='none'||s.visibility==='hidden')continue;
    const lines=[];
    for(const node of nodes) for(let j=0;j<node.textContent.length;j++){
     const char=node.textContent[j];const cr=document.createRange();cr.setStart(node,j);cr.setEnd(node,j+1);const box=cr.getBoundingClientRect();if(!box.width||!box.height)continue;
     let line=lines.find(l=>Math.abs(l.y-box.y)<2);if(!line){line={text:'',x:box.x,y:box.y,right:box.right,h:box.height};lines.push(line)}line.text+=char;line.right=Math.max(line.right,box.right);
    }
    const renderedLines=lines.map(l=>({text:l.text.replace(/[ \t]+/g,' ').trim(),x:l.x,y:l.y,w:l.right-l.x,h:l.h})).filter(l=>l.text);
    items.push({text:value,x:r.x,y:r.y,w:r.width,h:r.height,renderedLines,fontSize:parseFloat(s.fontSize),fontWeight:s.fontWeight,fontFamily:s.fontFamily,color:s.color,opacity:parseFloat(s.opacity),lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,textAlign:s.textAlign,textTransform:s.textTransform});
   }return items;
  });
  fs.writeFileSync(path.join(root,`assets/slides-hybrid/slide-${n}.json`),JSON.stringify(items,null,2));
  await p.addStyleTag({content:'.deck-slide,.deck-slide *{color:transparent!important;text-shadow:none!important}'});
  await p.locator('.deck-slide').screenshot({path:path.join(root,`assets/slides-hybrid/slide-${n}-background.png`)});
 }
 console.log(`Slides: ${slides.length} renders + fundos + metadados.`);
 if(process.argv.includes("--slides-only")){await b.close();return;}
 const jobs=[];
 for(const [name,w,h] of [['instagram',1080,1350],['linkedin',1200,1200]]){
  for(const slug of ['contexto','especializacao'])jobs.push([`${slug}-social.html`,`?view=art&format=${name}`,w,h,`exports/${slug}/${name}/post-${slug}-${w}x${h}.png`]);
  for(let n=1;n<=5;n++)jobs.push(['social-semana-07-09.html',`?view=art&format=${name}&piece=carousel&slide=${n}`,w,h,`exports/semana-07-09/${name}/carousel-${String(n).padStart(2,'0')}.png`]);
  jobs.push(['social-semana-07-09.html',`?view=art&format=${name}&piece=single`,w,h,`exports/semana-07-09/${name}/imagem-unica.png`]);
 }
 jobs.push(['ia-84-social.html','?view=art&format=instagram',1080,1350,'assets/social/ia-84/neuralmind-ia-84-instagram-1080x1350.png']);
 for(let n=1;n<=3;n++)jobs.push(['preambulo-tech-2026-social.html',`?asset=ig-${n}`,1080,1350,`assets/social/preambulo-tech-2026/instagram-${n}-1080x1350.png`]);
 jobs.push(['preambulo-tech-2026-social.html','?asset=li-1',1200,1200,'assets/social/preambulo-tech-2026/linkedin-1200x1200.png']);
 for(const [asset,w,h,file] of [['slide-purple',1600,900,'kleber-slide-purple-1600x900.png'],['slide-white',1600,900,'kleber-slide-white-1600x900.png'],['slide-purple-background',1600,900,'kleber-slide-purple-background-1600x900.png'],['slide-white-background',1600,900,'kleber-slide-white-background-1600x900.png'],['social',1080,1350,'kleber-event-social-1080x1350.png'],['social-background',1080,1350,'kleber-event-social-background-1080x1350.png']])jobs.push(['kleber-speaker-kit.html',`?asset=${asset}`,w,h,`assets/kleber/${file}`]);
 for(const [file,query,w,h,out] of jobs){await p.setViewportSize({width:w,height:h});await p.goto(url(file,query));await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});await p.screenshot({path:path.join(root,out)});}
 console.log(`Social e kit executivo: ${jobs.length} PNGs.`,errors);
 await p.goto(url('index.html'));await p.setViewportSize({width:1440,height:1000});await p.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
 for(const id of ['tokens','assets','media-assets','meet'])if(await p.locator('#'+id).count())await p.locator('#'+id).screenshot({path:path.join(root,`.qa/outfit-${id}.png`)});
 await p.setViewportSize({width:390,height:844});await p.screenshot({path:path.join(root,'.qa/outfit-mobile.png')});console.log('Mobile',await p.evaluate(()=>[innerWidth,document.documentElement.scrollWidth]));
 await b.close();
})();
