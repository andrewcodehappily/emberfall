'use strict';
// Requires Playwright; optionally set CHROMIUM_PATH to an existing Chromium binary.
const {chromium}=require('playwright'),path=require('node:path');
(async()=>{
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});
let checks=0;const errors=[],assert=(v,m)=>{if(!v)throw Error(m);checks++};
for(const saved of [null,'auto','invalid','zh','en']){
 const context=await b.newContext({locale:'zh-TW'}),p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
 if(saved!==null)await context.addInitScript(v=>localStorage.setItem('emberfall-language',v),saved);
 await p.goto('file://'+path.resolve(__dirname,'..','index.html'));await p.waitForSelector('#languageSelect');
 if(!['zh','en'].includes(saved)){
  assert(await p.locator('#firstLanguageEn').isVisible(),'Prompt missing: '+saved);
  assert((await p.locator('#modal').innerText()).includes('Choose your language'),'Bilingual prompt');
  await p.keyboard.press('Escape');assert(await p.locator('#firstLanguageEn').isVisible(),'Escape bypass');
  await p.click('#firstLanguageEn');assert(await p.locator('#create').isVisible(),'Menu missing');
  assert(await p.evaluate(()=>document.documentElement.lang)==='en','Chinese browser overrode choice');
  assert(await p.evaluate(()=>localStorage.getItem('emberfall-language'))==='en','Choice not stored');
 }else{assert(await p.locator('#create').isVisible(),'Saved preference asks again');assert(await p.evaluate(()=>document.documentElement.lang)===(saved==='zh'?'zh-Hant':'en'),'Saved language ignored')}
 assert(await p.locator('#languageSelect option[value="auto"]').count()===0,'Automatic option remains');
 await p.selectOption('#languageSelect','zh');assert(await p.evaluate(()=>document.documentElement.lang)==='zh-Hant','Manual switch failed');await context.close();
}
const context=await b.newContext({locale:'zh-TW'}),p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('file://'+path.resolve(__dirname,'..','index.html'));await p.click('#firstLanguageEn');await p.reload();await p.waitForSelector('#languageSelect');assert(await p.locator('#create').isVisible()&&await p.locator('#firstLanguageEn').count()===0,'Reload prompted again');assert(await p.evaluate(()=>document.documentElement.lang)==='en','Reload lost English');
const blocked=await b.newContext({locale:'en-US'});await blocked.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked')};Storage.prototype.setItem=()=>{throw Error('blocked')}});const q=await blocked.newPage();q.on('pageerror',e=>errors.push(e.message));await q.goto('file://'+path.resolve(__dirname,'..','index.html'));await q.click('#firstLanguageZh');assert(await q.locator('#create').isVisible(),'Blocked storage prevents play');assert(await q.evaluate(()=>document.documentElement.lang)==='zh-Hant','Blocked storage loses session choice');
assert(!errors.length,errors.join('\n'));await b.close();console.log(checks+' real-browser language checks passed');
})().catch(e=>{console.error(e);process.exit(1)});
