// Fit the complete desktop play surface, while keeping overlays outside the scale.
(()=>{
 const header=document.querySelector('body > header'),main=document.querySelector('main.layout');
 if(!header||!main)return;
 const viewport=document.createElement('div');viewport.id='gameViewport';
 const surface=document.createElement('div');surface.id='gameSurface';
 header.before(viewport);viewport.append(surface);surface.append(header,main);
 let queued=false;
 function fit(){
  queued=false;
  if(!matchMedia('(min-width: 900px)').matches){viewport.style.height='';surface.style.transform='';return;}
  const height=surface.offsetHeight;
  if(!height)return;
  const scale=Math.min(1,Math.max(1,window.innerHeight-4)/height);
  surface.style.transform='translateX(-50%) scale('+scale+')';
  viewport.style.height=Math.ceil(height*scale)+'px';
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(fit);}}
 new ResizeObserver(schedule).observe(surface);
 window.addEventListener('resize',schedule);
 document.fonts?.ready.then(schedule);
 schedule();
})();
