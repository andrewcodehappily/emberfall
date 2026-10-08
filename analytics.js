(()=>{
 const base=window.EMBERFALL_STATS_URL;if(!base)return;
 let visitor;try{visitor=localStorage.getItem('emberfall-stats-visitor');}catch{}
 if(!/^[a-f0-9-]{36}$/i.test(visitor||'')){visitor=crypto.randomUUID();try{localStorage.setItem('emberfall-stats-visitor',visitor);}catch{}}
 let session=null,busy=false,lastInput=Date.now(),generation=0,nextStartAttempt=0;
 const playing=()=>typeof s!=='undefined'&&s&&s.status==='playing';
 const active=()=>playing()&&!document.hidden&&Date.now()-lastInput<120000;
 const payload=type=>({type,visitor,...session,active:active(),race:typeof s!=='undefined'&&s?s.race:'',job:typeof s!=='undefined'&&s?s.job:'',floor:typeof s!=='undefined'&&s&&typeof level==='function'?level().depth||0:0});
 async function tick(){
 if(busy)return;
 if(!playing()){end();return;}
 if(document.hidden)return;
 busy=true;const version=generation;if(!session)nextStartAttempt=Date.now()+20000;
 try{const type=session?'beat':'start';const res=await fetch(base+'/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload(type))});
 if(res.ok&&type==='start'){const next=await res.json();if(version===generation&&playing()&&!document.hidden)session=next;else navigator.sendBeacon(base+'/api/session',new Blob([JSON.stringify({...payload('end'),...next})],{type:'text/plain'}));}
 if(res.status===404)session=null;
 }catch{}finally{busy=false;}
 }
 function end(){generation++;if(!session)return;const data=payload('end');session=null;try{navigator.sendBeacon(base+'/api/session',new Blob([JSON.stringify(data)],{type:'text/plain'}));}catch{}}
 for(const event of ['keydown','pointerdown','touchstart'])document.addEventListener(event,()=>{lastInput=Date.now();},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)end();else{lastInput=Date.now();tick();}});
 window.addEventListener('pagehide',end);
 const box=document.createElement('div');box.id='statsNotice';box.dataset.noI18n='';box.setAttribute('role','note');box.style.cssText='position:fixed;bottom:12px;right:12px;z-index:10000;max-width:min(420px,calc(100vw - 24px));background:#18232e;color:#fff;padding:12px;border:1px solid #708090;border-radius:10px;font:13px/1.5 system-ui';
 box.textContent='為了遊戲開發、優化與 Debug，可能會記錄部分資料（IP、遊玩時間與活動狀態），保留 30 天。不同意請關閉遊戲。 For game development, optimization and debugging, we may record your IP, play time and activity status for 30 days. If you disagree, close the game.';
 document.body.append(box);
 const earliestNoticeRemoval=Date.now()+6000;
 // A notice appears on each page load, without an acknowledgment or stats toggle.
 // Observe game state separately so collection begins promptly, not 20 seconds late.
 setInterval(()=>{
  if(playing()){
   if(Date.now()>=earliestNoticeRemoval)box.remove();
   if(!session&&Date.now()>=nextStartAttempt)tick();
  }else if(session)end();
 },1000);
 setInterval(tick,20000);tick();
})();
