const fs=require('fs'),vm=require('vm'),assert=require('assert');
const els=new Map(); function el(sel){if(!els.has(sel))els.set(sel,{textContent:'',innerHTML:'',onclick:null,classList:{remove(){},add(){},toggle(){}},querySelector(){return null}});return els.get(sel)}
const store=new Map();const document={querySelector:el,querySelectorAll:()=>[],addEventListener(){},createElement:()=>({click(){}})};
const ctx={console,Date,Math,Number,String,Object,Array,JSON,Intl,URL,Blob:function(){},FileReader:function(){},document,window:{scrollTo(){},addEventListener(){}},navigator:{serviceWorker:{register:()=>Promise.resolve()}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},innerWidth:400,setTimeout:()=>0,confirm:()=>true,alert(){},prompt:()=>null,Event:function(){}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),ctx);
assert.equal(vm.runInContext('LESSONS.length',ctx),100);
assert.equal(vm.runInContext('phases.length',ctx),7);
assert.equal(vm.runInContext("DATES[1]",ctx),'2026-11-14');
assert.equal(vm.runInContext("DATES[74]",ctx),'2027-02-08');
assert.equal(vm.runInContext("DATES[75]",ctx),'2027-03-18');
assert.equal(vm.runInContext("new Set(Object.values(DATES)).size",ctx),100);
assert.equal(vm.runInContext("Object.values(DATES).some(d=>d>='2027-02-09'&&d<='2027-03-17')",ctx),false);
assert.equal(vm.runInContext("Object.values(DATES).filter(d=>new Date(d+'T12:00:00').getDay()===0).length",ctx),0);
// Render must not create an empty day record.
assert.equal(vm.runInContext('Object.keys(state.days).length',ctx),0);
// Backup normalization rejects malformed objects and sanitizes nested data.
assert.equal(vm.runInContext("normalizeState({days:{},lessons:{},projects:'bad'}).projects.length",ctx),0);
assert.equal(vm.runInContext("(()=>{try{normalizeState({days:[],lessons:{}});return false}catch(e){return true}})()",ctx),true);
// Streak correctly carries yesterday forward if today has no check-in.
vm.runInContext("state.days[addDays(todayISO(),-1)]={checkin:true,tasks:{review:false}}",ctx);
assert.equal(vm.runInContext('calcStreak()',ctx),1);
// Empty days must not bias quality averages.
assert.equal(vm.runInContext("average('energy')",ctx),'—');
console.log('PASS: 15 application assertions');
