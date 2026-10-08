const {chromium}=require('playwright'),path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('file://'+path.resolve(__dirname,'..','index.html'));if(process.env.CJK_FONT_PATH){const font=fs.readFileSync(process.env.CJK_FONT_PATH).toString('base64');await page.addStyleTag({content:`@font-face{font-family:ViewportCJK;src:url(data:font/woff2;base64,${font})}body{font-family:system-ui,ViewportCJK,sans-serif}`});await page.evaluate(()=>document.fonts.ready);}
await page.selectOption('#languageSelect','zh');await page.evaluate(()=>startGame(false));let checks=0;
for(const lang of ['zh','en'])for(const [width,height] of [[2048,1044],[1920,1080],[1440,900],[1366,768],[1024,600],[900,600]]){
 await page.setViewportSize({width,height});await page.selectOption('#languageSelect',lang);await page.waitForTimeout(150);
 const boxes=await page.evaluate(()=>({height:innerHeight,width:innerWidth,scrollH:document.documentElement.scrollHeight,scrollW:document.documentElement.scrollWidth,rects:[...document.querySelectorAll('header,.layout,.left,.stage,.right,.skill,.touch,.legend,#game')].map(e=>{const r=e.getBoundingClientRect();return{class:e.id||e.className,x:r.left,y:r.top,right:r.right,bottom:r.bottom}})}));
 assert(boxes.scrollH<=height+1,`Page scroll ${lang} ${width}x${height}: ${boxes.scrollH}`);assert(boxes.scrollW<=width+1,'Horizontal overflow');checks+=2;
 for(const r of boxes.rects){assert(r.x>=-1&&r.y>=-1&&r.right<=width+1&&r.bottom<=height+1,JSON.stringify({lang,width,height,r}));checks++;}
 const canvas=await page.locator('#game').boundingBox();assert(Math.abs(canvas.width/canvas.height-10/7)<0.01,'Distorted canvas');checks++;
 // Click a real visible cell using the scaled bounding rectangle; target must match.
 const enemy=await page.evaluate(()=>{const f=level(),e=f.enemies.find(e=>e.hp>0);f.visible[key(e.x,e.y)]=true;target=null;return{id:e.id,x:e.x,y:e.y,W,H}});
 await page.mouse.click(canvas.x+(enemy.x+.5)/enemy.W*canvas.width,canvas.y+(enemy.y+.5)/enemy.H*canvas.height);
 assert.equal(await page.evaluate(()=>target),enemy.id,'Scaled hit testing');checks++;
}
await page.setViewportSize({width:1366,height:768});await page.selectOption('#languageSelect','zh');await page.evaluate(()=>startGame(true));await page.waitForTimeout(150);
assert((await page.locator('.touch').boundingBox()).y+(await page.locator('.touch').boundingBox()).height<=768);checks++;
await page.screenshot({path:path.resolve(__dirname,'..','viewport-desktop.png')});
await page.setViewportSize({width:390,height:844});await page.waitForTimeout(150);assert.equal(await page.locator('#gameSurface').evaluate(e=>getComputedStyle(e).position),'static');assert.equal(await page.locator('#gameSurface').evaluate(e=>getComputedStyle(e).transform),'none');checks+=2;
await page.keyboard.press('h');assert(await page.locator('#modal').isVisible(),'Mobile overlay broken');assert.deepEqual(errors,[]);checks+=2;console.log(checks+' browser viewport checks passed');}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
