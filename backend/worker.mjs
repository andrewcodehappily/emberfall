import dashboard from './dashboard.mjs';
const UUID=/^[a-f0-9-]{36}$/i;
const json=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
async function secureEqual(a,b){
 const hash=async x=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(x)));
 const [x,y]=await Promise.all([hash(a),hash(b)]);let d=0;for(let i=0;i<x.length;i++)d|=x[i]^y[i];return d===0;
}
export default {
 async scheduled(event,env){await env.DB.prepare('DELETE FROM sessions WHERE last_seen < ?').bind(Date.now()-30*86400000).run();},
 async fetch(req,env){
 const url=new URL(req.url),origin=req.headers.get('Origin');
 const cors=origin===env.GAME_ORIGIN?{'Access-Control-Allow-Origin':origin,'Vary':'Origin'}:{};
 const reply=(v,s=200)=>json(v,s,cors);
 if(url.pathname==='/admin'&&req.method==='GET')return new Response(dashboard,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'",'X-Content-Type-Options':'nosniff'}});
 if(url.pathname==='/api/stats'){
 if(req.method!=='GET')return reply({error:'Method not allowed'},405);
 const supplied=req.headers.get('Authorization')||'';
 if(!env.ADMIN_TOKEN||env.ADMIN_TOKEN.length<24||!await secureEqual(supplied,'Bearer '+env.ADMIN_TOKEN))return reply({error:'Unauthorized'},401);
 const now=Date.now();const days=Math.min(30,Math.max(1,Number(url.searchParams.get('days'))||7));
 const from=now-days*86400000;const page=Math.max(0,Math.min(10000,parseInt(url.searchParams.get('page'))||0));
 const summary=await env.DB.prepare('SELECT COUNT(*) sessions, COUNT(DISTINCT visitor) players, COUNT(DISTINCT ip) ips, COALESCE(SUM(active_ms),0) active_ms FROM sessions WHERE started >= ?').bind(from).first();
 const online=await env.DB.prepare('SELECT COUNT(DISTINCT visitor) players FROM sessions WHERE ended IS NULL AND active=1 AND last_seen > ?').bind(now-60000).first();
 const rows=await env.DB.prepare('SELECT id,visitor,ip,started,last_seen,ended,active_ms,active,race,job,floor FROM sessions WHERE started >= ? ORDER BY started DESC LIMIT 100 OFFSET ?').bind(from,page*100).all();
 return reply({summary,online:online.players,now,page,rows:rows.results});
 }
 if(url.pathname!=='/api/session')return reply({error:'Not found'},404);
 if(origin!==env.GAME_ORIGIN)return reply({error:'Origin denied'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{...cors,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'}});
 if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 // Bound the body before parsing, even if Content-Length is absent.
 const reader=req.body?.getReader();let body='',size=0;
 if(!reader)return reply({error:'Missing body'},400);
 try{const decoder=new TextDecoder();while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>2048){await reader.cancel();return reply({error:'Too large'},413);}body+=decoder.decode(value,{stream:true});}body+=decoder.decode();}catch{return reply({error:'Bad body'},400);}
 let data;try{data=JSON.parse(body);}catch{return reply({error:'Bad JSON'},400);}
 if(!data||!UUID.test(data.visitor||'')||!['start','beat','end'].includes(data.type))return reply({error:'Invalid event'},400);
 const now=Date.now(),ip=req.headers.get('CF-Connecting-IP')||'unknown';
 const race=typeof data.race==='string'?data.race.slice(0,32):'';
 const job=typeof data.job==='string'?data.job.slice(0,32):'';
 const floor=Number.isInteger(data.floor)?Math.max(0,Math.min(1000,data.floor)):0;
 if(data.type==='start'){
 const count=await env.DB.prepare('SELECT COUNT(*) n FROM sessions WHERE ip=? AND started>?').bind(ip,now-60000).first();
 if(count.n>=60)return reply({error:'Try later'},429);
 const id=crypto.randomUUID(),token=crypto.randomUUID();
 await env.DB.prepare('INSERT INTO sessions(id,token,visitor,ip,started,last_seen,active,race,job,floor) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(id,token,data.visitor,ip,now,now,data.active===true?1:0,race,job,floor).run();
 return reply({id,token});
 }
 if(!UUID.test(data.id||'')||!UUID.test(data.token||''))return reply({error:'Invalid session'},400);
 // Atomic update: duplicate requests cannot count the same interval twice.
 const result=await env.DB.prepare(`UPDATE sessions SET active_ms=active_ms+CASE WHEN active=1 THEN MIN(30000,MAX(0,?-last_seen)) ELSE 0 END, last_seen=MAX(last_seen,?), ended=CASE WHEN ?='end' THEN ? ELSE ended END, active=?,race=?,job=?,floor=? WHERE id=? AND token=? AND visitor=? AND ended IS NULL`).bind(now,now,data.type,now,data.type==='end'?0:(data.active===true?1:0),race,job,floor,data.id,data.token,data.visitor).run();
 return reply({ok:!!result.meta.changes},result.meta.changes?200:404);
 }
};
