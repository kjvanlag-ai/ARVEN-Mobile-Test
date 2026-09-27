'use strict';
const VERSION='0.3.5';
const SAVE_KEY='arven_mobile_035';
const OLD_SAVE_KEYS=['arven_mobile_034','arven_mobile_033'];
const AUTOMATION_UNLOCK=100;
const DECAY_BASE=.24;
const DECAY_PER_ACTIVE_MINUTE=.025;
const ACTION_ORDER=['berries','forage','cook','chop','shelter','mine','fibers','knife','trail'];
const SKILLS=['Survival','Foraging','Woodcutting','Mining','Crafting','Endurance'];
const FOODS={
  berries:{name:'Wild Blueberries',cooldown:2.5,heal:1,survivalXp:1},
  stew:{name:'Chanterelle Stew',cooldown:8,heal:4,survivalXp:4}
};
const ACTIONS={
  berries:{section:'FOOD & FORAGING',name:'Pick Wild Blueberries',desc:'Gain 1 Wild Blueberry portion · quick food',base:2.6,strain:.75,skill:'Foraging'},
  forage:{section:'FOOD & FORAGING',name:'Forage Chanterelle Mushrooms',desc:'Gain 1 Chanterelle Mushroom · ingredient',base:3.6,strain:.85,skill:'Foraging'},
  cook:{section:'FOOD & FORAGING',name:'Cook Chanterelle Stew',desc:'Uses 1 Chanterelle Mushroom · gain 1 Chanterelle Stew',base:2,strain:.55,skill:'Survival'},
  chop:{section:'RESOURCES',name:'Fell Young Birch Trees',desc:'Gain 1 Young Birch Log · infinite source',base:5,strain:1.05,skill:'Woodcutting'},
  shelter:{section:'PROGRESSION',name:'Build a Lean-to Shelter',desc:'Costs 2 Young Birch Logs · +20 Max Vitality this run',base:7.5,strain:.85,skill:'Crafting'},
  mine:{section:'RESOURCES',name:'Break Granite from the Rockslide',desc:'Gain 1 Granite Stone · infinite source',base:6.2,strain:1.25,skill:'Mining'},
  fibers:{section:'RESOURCES',name:'Strip Stinging Nettle Fiber',desc:'Gain 1 Stinging Nettle Fiber · infinite source',base:4.4,strain:.9,skill:'Foraging'},
  knife:{section:'PROGRESSION',name:'Craft a Stone Knife',desc:'Costs 1 Young Birch Log + 1 Granite Stone + 1 Stinging Nettle Fiber',base:8.5,strain:1,skill:'Crafting'},
  trail:{section:'PROGRESSION',name:'Open the Dark Forest Trail',desc:'Requires Stone Knife · Chapter 1 milestone',base:10,strain:1.35,skill:'Survival'}
};
const RESOURCE_NAMES={mushrooms:'🍄 Chanterelle Mushrooms',berries:'🫐 Wild Blueberries',wood:'🪵 Young Birch Logs',stone:'🪨 Granite Stones',fiber:'🌿 Stinging Nettle Fiber',stew:'🍲 Chanterelle Stew'};
const RESOURCE_ORDER=['mushrooms','berries','wood','stone','fiber','stew'];
function zeroMap(keys,value=0){const o={};for(const k of keys)o[k]=value;return o}
function foodTimerDefaults(){const o={};for(const [id,f] of Object.entries(FOODS))o[id]=f.cooldown;return o}
function fresh(){return{version:VERSION,vitality:100,maxVitality:100,generation:1,runSeconds:0,perm:0,res:{mushrooms:0,berries:0,wood:0,stone:0,fiber:0,stew:0},cap:2,prog:{shelter:false,stoneAccess:false,knife:false,trail:false},runXp:zeroMap(SKILLS),loopXp:zeroMap(SKILLS),lifetime:zeroMap(ACTION_ORDER),autoActions:zeroMap(ACTION_ORDER,false),priorities:zeroMap(ACTION_ORDER,5),active:'',activeOnce:false,nextAction:'',progress:0,autoEat:true,foodTimers:foodTimerDefaults(),runMaxBonus:0,events:[{t:0,text:'You wake on the damp forest floor beneath a pale morning sky.'}]}}
function normalize(x){const n=fresh();if(!x||typeof x!=='object')return n;
  n.generation=Number(x.generation??1);n.runSeconds=Number(x.runSeconds??x.run??0);n.perm=Number(x.perm??0);const oldRes=x.res||x.resources||{};n.res={...n.res,...oldRes};if(oldRes.food!==undefined&&oldRes.stew===undefined)n.res.stew=Number(oldRes.food||0);n.cap=Number(x.cap??x.cap_base??2);n.prog={...n.prog,...(x.prog||x.progress||{})};if(n.prog.stone_access!==undefined)n.prog.stoneAccess=!!n.prog.stone_access;
  const rx=x.runXp||x.rx||x.run_xp||{},lx=x.loopXp||x.lx||x.loop_xp||{};for(const sk of SKILLS){n.runXp[sk]=Number(rx[sk]||0);n.loopXp[sk]=Number(lx[sk]||0)}
  n.lifetime={...n.lifetime,...(x.lifetime||x.lifetime_completions||{})};n.autoActions={...n.autoActions,...(x.autoActions||x.auto_actions||{})};n.priorities={...n.priorities,...(x.priorities||{})};n.autoEat=x.autoEat??x.auto??x.auto_eat_enabled??true;n.foodTimers={...n.foodTimers,...(x.foodTimers||x.food_timers||{})};n.events=Array.isArray(x.events)?x.events:n.events;n.runMaxBonus=n.prog.shelter?20:0;n.active='';n.activeOnce=false;n.nextAction='';n.progress=0;recalcMax(n,false);n.vitality=Math.min(n.maxVitality,Number(x.vitality??n.maxVitality));return n}
let s;try{let raw=localStorage.getItem(SAVE_KEY);if(!raw){for(const k of OLD_SAVE_KEYS){raw=localStorage.getItem(k);if(raw)break}}s=normalize(raw?JSON.parse(raw):null)}catch{s=fresh()}
function save(){s.version=VERSION;localStorage.setItem(SAVE_KEY,JSON.stringify(s))}
function level(x){return Math.floor(Math.sqrt(Math.max(0,x)/20))}
function enduranceLevel(x){return Math.floor(Math.sqrt(Math.max(0,x)/35))}
function recalcMax(st=s,keepRatio=false){const old=Number(st.maxVitality||100),ratio=old>0?Number(st.vitality||0)/old:1;const run=enduranceLevel(st.runXp.Endurance||0),loop=enduranceLevel(st.loopXp.Endurance||0);st.maxVitality=100+run+loop*2+(st.runMaxBonus||0);if(keepRatio)st.vitality=Math.min(st.maxVitality,Math.max(0,ratio*st.maxVitality));else st.vitality=Math.min(st.maxVitality,Number(st.vitality??st.maxVitality))}
function speed(skill){return 1+level(s.runXp[skill])*.045+level(s.loopXp[skill])*.02}
function duration(id){return ACTIONS[id].base/speed(ACTIONS[id].skill)}
function cap(){return s.cap}
function unlocked(id){if(id==='mine')return !!s.prog.stoneAccess;if(id==='fibers'||id==='knife')return !!s.prog.shelter;if(id==='trail')return !!s.prog.knife;return true}
function can(id){if(!unlocked(id))return false;const r=s.res;switch(id){case'berries':return r.berries<cap();case'forage':return r.mushrooms<cap();case'cook':return r.mushrooms>=1&&r.stew<cap();case'chop':return r.wood<cap();case'shelter':return !s.prog.shelter&&r.wood>=2;case'mine':return s.prog.stoneAccess&&r.stone<cap();case'fibers':return s.prog.shelter&&r.fiber<cap();case'knife':return !s.prog.knife&&r.wood>=1&&r.stone>=1&&r.fiber>=1;case'trail':return s.prog.knife&&!s.prog.trail}return false}
function addXp(skill,amount){s.runXp[skill]+=amount;s.loopXp[skill]+=amount}
function loseVitality(amount){const actual=Math.min(Math.max(0,s.vitality),Math.max(0,amount));if(actual<=0)return;s.vitality-=actual;s.runXp.Endurance+=actual;s.loopXp.Endurance+=actual;recalcMax(s,false)}
function currentDecay(id){return(DECAY_BASE+DECAY_PER_ACTIVE_MINUTE*(s.runSeconds/60))*ACTIONS[id].strain}
function event(text){s.events.unshift({t:s.runSeconds,text});s.events=s.events.slice(0,14)}
