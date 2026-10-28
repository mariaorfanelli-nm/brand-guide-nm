/* Render the approved 08D study with the browser's original font and stroke. */
const fs = require('fs');
const path = require('path');
const {pathToFileURL} = require('url');
const {chromium} = require('playwright');
const sharp = require('sharp');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({headless:true, executablePath:process.env.CHROME_PATH || undefined});
 const page=await browser.newPage({viewport:{width:2200,height:500},deviceScaleFactor:2});
 await page.goto(pathToFileURL(path.join(root,'logo-options-selected.html')).href);
 await page.evaluate(async()=>{await document.fonts.ready; document.body.innerHTML='<span id="mark">NEURALMIND</span>'; document.head.insertAdjacentHTML('beforeend',`<style>html,body{background:transparent;margin:0;padding:0}#mark{display:inline-block;margin:24px;padding:16px;font-family:"Cormorant Garamond";font-size:180px;font-weight:700;letter-spacing:.15em;-webkit-text-stroke:.032em currentColor;paint-order:stroke fill;line-height:1.2}</style>`)});
 for(const [suffix,color] of [['purple','#290241'],['white','#fffffc']]){
  for(const compact of [false,true]){
   await page.locator('#mark').evaluate((el,{color,compact})=>{el.style.color=color;el.textContent=compact?'NM':'NEURALMIND'}, {color,compact});
   const raw=await page.locator('#mark').screenshot({omitBackground:true});
   await sharp(raw).trim({background:'#00000000',threshold:1}).extend({top:8,bottom:8,left:8,right:8,background:'#00000000'}).png().toFile(path.join(root,`assets/brand/neuralmind-ai-${compact?'icon-':''}${suffix}.png`));
  }
 }
 await browser.close();
})();
