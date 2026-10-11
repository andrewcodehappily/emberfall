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
 setInterval(()=>{
  if(playing()){
   if(!session&&Date.now()>=nextStartAttempt)tick();
  }else if(session)end();
 },1000);
 setInterval(tick,20000);tick();
})();
