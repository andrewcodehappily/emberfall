const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/../game.js','utf8');
const functions=['pathStep','allyRegroupStep','alliesTurn'].map(name=>source.split('\n').find(l=>l.startsWith('function '+name+'('))).join('\n');
let f,s;const W=20,H=12,dirs=[[1,0],[-1,0],[0,1],[0,-1]];
const key=(x,y)=>y*W+x,distance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const ctx={W,H,dirs,key,distance,inside:(x,y)=>x>=0&&y>=0&&x<W&&y<H,level:()=>f,tile:(x,y)=>f.map[key(x,y)],walkable:(x,y)=>x>=0&&y>=0&&x<W&&y<H&&[0,3,4,5].includes(f.map[key(x,y)]),enemyAt:(x,y)=>f.enemies.find(e=>e.hp>0&&e.x===x&&e.y===y),allyAt:(x,y)=>f.allies.find(a=>a.hp>0&&a.x===x&&a.y===y),growAlly:()=>{},storyPerk:()=>0,spec:()=>false,los:()=>true,log:()=>{},damageEnemy:e=>e.hp--};
vm.createContext(ctx);vm.runInContext(functions,ctx);
function reset(){f={map:Array(W*H).fill(0),enemies:[],allies:[],env:[],objects:[]};s={turn:1,job:'warden',p:{x:10,y:5,hp:20,maxHp:20},exp:{order:'follow'}};ctx.s=s;}
function ally(x,y=5){const a={x,y,hp:20,maxHp:20,atk:3,kind:'celestial',ttl:1000,permanent:true};f.allies.push(a);return a;}
reset();let a=ally(2);f.enemies.push({id:1,x:1,y:5,hp:10});ctx.alliesTurn();assert.equal(a.x,4);assert.equal(f.enemies[0].hp,10);
reset();a=ally(2);f.map.fill(1);for(let x=1;x<12;x++)f.map[key(x,5)]=0;f.map[key(3,5)]=2;ctx.alliesTurn();assert.equal(f.map[key(3,5)],3);assert.equal(a.x,2);ctx.alliesTurn();assert.equal(a.x,4);
reset();const rear=ally(2),middle=ally(3),front=ally(4);f.map.fill(1);for(let x=1;x<12;x++)f.map[key(x,5)]=0;ctx.alliesTurn();assert.equal(front.x,6);assert.equal(middle.x,5);assert.equal(rear.x,4);assert.equal(new Set(f.allies.map(a=>key(a.x,a.y))).size,3);
reset();a=ally(2);s.exp.order='guard';a.anchor={x:2,y:5};ctx.alliesTurn();assert.equal(a.x,2);
reset();a=ally(9);f.enemies.push({id:1,x:9,y:4,hp:10});ctx.alliesTurn();assert.equal(f.enemies[0].hp,9);
reset();a=ally(2);f.map[key(3,5)]=4;ctx.alliesTurn();assert.notEqual(f.map[key(a.x,a.y)],4);
console.log('Ally follow regressions passed: regroup, catch-up, doors, corridor queue, guard, nearby combat, hazards');
