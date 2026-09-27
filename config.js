'use strict';
const VERSION='0.3.4';
const SAVE_KEY='arven_mobile_034';
const OLD_SAVE_KEY='arven_mobile_033';
const AUTO_EAT_INTERVAL=10;
const AUTO_EAT_HEAL=28;
const AUTOMATION_UNLOCK=100;
const ACTION_ORDER=['forage','cook','chop','shelter','mine','fibers','knife','trail'];
const SKILLS=['Survival','Foraging','Woodcutting','Mining','Crafting','Endurance'];
const ACTIONS={
  forage:{section:'FOOD & FORAGING',name:'Forage Chanterelle Mushrooms',desc:'Gain 1 Chanterelle Mushroom · infinite source',base:3.6,drain:1.1,skill:'Foraging'},
  cook:{section:'FOOD & FORAGING',name:'Cook Chanterelle Stew',desc:'Uses 1 Chanterelle Mushroom · gain 1 Chanterelle Stew',base:2.0,drain:.45,skill:'Survival'},
  chop:{section:'RESOURCES',name:'Fell Young Birch Trees',desc:'Gain 1 Young Birch Log · infinite source',base:5,drain:1.45,skill:'Woodcutting'},
  shelter:{section:'PROGRESSION',name:'Build a Lean-to Shelter',desc:'Costs 2 Young Birch Logs · +20 Max Vitality this run',base:7.5,drain:1.25,skill:'Crafting'},
  mine:{section:'RESOURCES',name:'Break Granite from the Rockslide',desc:'Gain 1 Granite Stone · infinite source',base:6.2,drain:1.7,skill:'Mining'},
  fibers:{section:'RESOURCES',name:'Strip Stinging Nettle Fiber',desc:'Gain 1 Stinging Nettle Fiber · infinite source',base:4.4,drain:1.2,skill:'Foraging'},
  knife:{section:'PROGRESSION',name:'Craft a Stone Knife',desc:'Costs 1 Young Birch Log + 1 Granite Stone + 1 Stinging Nettle Fiber',base:8.5,drain:1.5,skill:'Crafting'},
  trail:{section:'PROGRESSION',name:'Open the Dark Forest Trail',desc:'Requires Stone Knife · Chapter 1 milestone',base:10,drain:2,skill:'Survival'}
};
const RESOURCE_NAMES={mushrooms:'🍄 Chanterelle Mushrooms',wood:'🪵 Young Birch Logs',stone:'🪨 Granite Stones',fiber:'🌿 Stinging Nettle Fiber',food:'🍲 Chanterelle Stew'};
function zeroMap(keys,value=0){const o={};for(const k of keys)o[k]=value;return o}
function fresh(){return{version:VERSION,vitality:100,maxVitality:100,generation:1,runSeconds:0,perm:0,res:{mushrooms:0,wood:0,stone:0,fiber:0,food:0},cap:2,prog:{shelter:false,stoneAccess:false,knife:false,trail:false},runXp:zeroMap(SKILLS),loopXp:zeroMap(SKILLS),lifetime:zeroMap(ACTION_ORDER),modes:zeroMap(ACTION_ORDER,'repeat'),autoActions:zeroMap(ACTION_ORDER,false),active:'',nextAction:'',progress:0,autoEat:true,eatElapsed:0,runMaxBonus:0,events:[{t:0,text:'You wake on the damp forest floor beneath a pale morning sky.'}]}}
function normalize(x){const n=fresh();if(!x||typeof x!=='object')return n;
  n.generation=Number(x.generation??1);n.runSeconds=Number(x.runSeconds??x.run??0);n.perm=Number(x.perm??0);n.res={...n.res,...(x.res||x.resources||{})};n.cap=Number(x.cap??x.cap_base??2);n.prog={...n.prog,...(x.prog||x.progress||{})};if(n.prog.stone_access!==undefined)n.prog.stoneAccess=!!n.prog.stone_access;
  const rx=x.runXp||x.rx||x.run_xp||{},lx=x.loopXp||x.lx||x.loop_xp||{};for(const sk of SKILLS){n.runXp[sk]=Number(rx[sk]||0);n.loopXp[sk]=Number(lx[sk]||0)}
  n.lifetime={...n.lifetime,...(x.lifetime||{})};n.modes={...n.modes,...(x.modes||{})};n.autoActions={...n.autoActions,...(x.autoActions||{})};n.autoEat=x.autoEat??x.auto??x.auto_eat_enabled??true;n.eatElapsed=Number(x.eatElapsed??x.eat??x.auto_eat_elapsed??0);n.events=Array.isArray(x.events)?x.events:n.events;n.runMaxBonus=n.prog.shelter?20:0;n.active='';n.nextAction='';n.progress=0;recalcMax(n,false);n.vitality=Math.min(n.maxVitality,Number(x.vitality??n.maxVitality));return n}
let s;try{const raw=localStorage.getItem(SAVE_KEY)||localStorage.getItem(OLD_SAVE_KEY);s=normalize(raw?JSON.parse(raw):null)}catch{ s=fresh() }
function save(){s.version=VERSION;localStorage.setItem(SAVE_KEY,JSON.stringify(s))}
function level(x){return Math.floor(Math.sqrt(Math.max(0,x)/20))}
function enduranceLevel(x){return Math.floor(Math.sqrt(Math.max(0,x)/35))}
function recalcMax(st=s,keepRatio=false){const old=Number(st.maxVitality||100),ratio=old>0?Number(st.vitality||0)/old:1;const run=enduranceLevel(st.runXp.Endurance||0),loop=enduranceLevel(st.loopXp.Endurance||0);st.maxVitality=100+run*1+loop*2+(st.runMaxBonus||0);if(keepRatio)st.vitality=Math.min(st.maxVitality,Math.max(0,ratio*st.maxVitality));else st.vitality=Math.min(st.maxVitality,Number(st.vitality??st.maxVitality))}
function speed(skill){return 1+level(s.runXp[skill])*.045+level(s.loopXp[skill])*.02}
function duration(id){return ACTIONS[id].base/speed(ACTIONS[id].skill)}
function cap(){return s.cap}
function unlocked(id){if(id==='mine')return !!s.prog.stoneAccess;if(id==='fibers'||id==='knife')return !!s.prog.shelter;if(id==='trail')return !!s.prog.knife;return true}
function can(id){if(!unlocked(id))return false;const r=s.res;switch(id){case'forage':return r.mushrooms<cap();case'cook':return r.mushrooms>=1&&r.food<cap();case'chop':return r.wood<cap();case'shelter':return !s.prog.shelter&&r.wood>=2;case'mine':return s.prog.stoneAccess&&r.stone<cap();case'fibers':return s.prog.shelter&&r.fiber<cap();case'knife':return !s.prog.knife&&r.wood>=1&&r.stone>=1&&r.fiber>=1;case'trail':return s.prog.knife&&!s.prog.trail}return false}
function addXp(skill,amount){s.runXp[skill]+=amount;s.loopXp[skill]+=amount}
function loseVitality(amount){const actual=Math.min(Math.max(0,s.vitality),Math.max(0,amount));if(actual<=0)return;s.vitality-=actual;s.runXp.Endurance+=actual;s.loopXp.Endurance+=actual;recalcMax(s,false)}
function event(text){s.events.unshift({t:s.runSeconds,text});s.events=s.events.slice(0,12)}
