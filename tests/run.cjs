'use strict';
const {spawnSync}=require('node:child_process'),path=require('node:path');
for(const test of ['ascendant-races','race-chronicles','advanced-classes','expedition-systems','narrative','analytics']){
  const result=spawnSync(process.execPath,[path.join(__dirname,test+'.cjs')],{stdio:'inherit'});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}
