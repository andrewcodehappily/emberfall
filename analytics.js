(()=>{
 const base=window.EMBERFALL_STATS_URL;if(!base)return;
 let consent;try{consent=localStorage.getItem('emberfall-stats-consent');}catch{}
 let visitor;try{visitor=localStorage.getItem('emberfall-stats-visitor');}catch{}
 if(!/^[a-f0-9-]{36}$/i.test(visitor||'')){visitor=crypto.randomUUID();try{localStorage.setItem('emberfall-stats-visitor',visitor);}catch{}}
 let session=null,busy=false,lastInput=Date.now(),generation=0;
 const playing=()=>typeof s!=='undefined'&&s&&s.status==='playing';
 const active=()=>playing()&&!document.hidden&&Date.now()-lastInput<120000;
 const payload=type=>({type,visitor,...session,active:active(),race:typeof s!=='undefined'&&s?s.race:'',job:typeof s!=='undefined'&&s?s.job:'',floor:typeof s!=='undefined'&&s&&typeof level==='function'?level().depth||0:0});
 async function tick(){
 if(consent!=='yes'||busy)return;
 if(!playing()){end();return;}
 if(document.hidden)return;
 busy=true;const version=generation;
 try{const type=session?'beat':'start';const res=await fetch(base+'/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload(type))});
 if(res.ok&&type==='start'){const next=await res.json();if(version===generation&&consent==='yes'&&!document.hidden)session=next;else navigator.sendBeacon(base+'/api/session',new Blob([JSON.stringify({...payload('end'),...next})],{type:'text/plain'}));}
 if(res.status===404)session=null;
 }catch{}finally{busy=false;}
 }
 function end(){generation++;if(!session)return;const data=payload('end');session=null;try{navigator.sendBeacon(base+'/api/session',new Blob([JSON.stringify(data)],{type:'text/plain'}));}catch{}}
 for(const event of ['keydown','pointerdown','touchstart'])document.addEventListener(event,()=>{lastInput=Date.now();},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)end();else{lastInput=Date.now();tick();}});
 window.addEventListener('pagehide',end);
 const box=document.createElement('div');box.dataset.noI18n='';box.style.cssText='position:fixed;bottom:12px;right:12px;z-index:10000;max-width:340px;background:#18232e;color:#fff;padding:12px;border:1px solid #708090;border-radius:10px;font:14px system-ui';
 function settings(){box.replaceChildren();const p=document.createElement('p');p.textContent='遊玩統計 / Play stats: Andrew 可查看 IP、遊玩時間與在線狀態。保留 30 天。Andrew can see your IP, play time and online status for 30 days.';box.append(p);
 for(const [value,label] of [['yes','開啟 / Enable'],['no','關閉 / Disable']]){const button=document.createElement('button');button.textContent=label;button.onclick=()=>{consent=value;try{localStorage.setItem('emberfall-stats-consent',value);}catch{}if(value==='no')end();box.replaceChildren(settingsButton);if(value==='yes')tick();};box.append(button);}}
 const settingsButton=document.createElement('button');settingsButton.textContent='統計設定 / Stats';settingsButton.onclick=settings;
 document.body.append(box);if(consent==='yes'||consent==='no')box.append(settingsButton);else settings();
 setInterval(tick,20000);tick();
})();
