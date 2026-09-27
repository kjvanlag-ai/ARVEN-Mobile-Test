'use strict';
const VERSION='0.3.6';
const SAVE_KEY='arven_mobile_036';
const LOOP_XP_RATIO=.01;
const AUTOMATION_UNLOCK=100;
const DECAY_BASE=.24;
const DECAY_PER_ACTIVE_MINUTE=.025;
const SKILLS=['Survival','Foraging','Mycology','Woodcutting','Crafting','Vitality'];
const ACTION_ORDER=['check_self','listen','search_clearing','inspect_tracks','find_berries','berries','search_beyond','inspect_mushrooms','mushrooms','follow_fence','approach_house','inspect_door','enter_house','clear_debris','salvage_boards','pull_nails','gather_moss','chop','patch_frame','refasten','seal_gaps'];
const RESOURCE_ORDER=['berries','mushrooms','wood','boards','nails','moss'];
const FOODS={berries:{name:'Wild Blueberries',cooldown:2.5,heal:2,survivalXp:1}};
const ACTIONS={
check_self:{name:'Check Yourself',desc:'Look for injuries, belongings and anything that explains who you are.',base:12,strain:.5,skill:'Survival',repeatable:false},
listen:{name:'Listen to the Forest',desc:'Stay still and listen for water, people, roads or animals.',base:12,strain:.45,skill:'Survival',repeatable:false},
search_clearing:{name:'Search the Clearing',desc:'Search the ground around the place where you woke.',base:18,strain:.6,skill:'Survival',repeatable:false},
inspect_tracks:{name:'Inspect Faint Tracks',desc:'Follow disturbed needles and shallow marks near the trees.',base:16,strain:.6,skill:'Survival',repeatable:false},
find_berries:{name:'Search the Brambles',desc:'Push through low brush where birds have been feeding.',base:20,strain:.7,skill:'Survival',repeatable:false},
berries:{name:'Pick Wild Blueberries',desc:'Safe early food · gain 1 berry portion.',base:3,strain:.75,skill:'Foraging',repeatable:true},
search_beyond:{name:'Search Beyond the Clearing',desc:'Leave the familiar patch of ground and search deeper between the birches.',base:24,strain:.85,skill:'Survival',repeatable:false},
inspect_mushrooms:{name:'Inspect the Mushroom Patch',desc:'Study several similar orange mushrooms before trusting any of them.',base:16,strain:.65,skill:'Mycology',repeatable:false},
mushrooms:{name:'Gather Chanterelle Mushrooms',desc:'Gain edible Chanterelles, but early identification can fail.',base:4,strain:.85,skill:'Mycology',repeatable:true},
follow_fence:{name:'Follow the Rotten Fence Line',desc:'Follow moss-covered posts that should lead somewhere.',base:24,strain:.9,skill:'Survival',repeatable:false},
approach_house:{name:'Approach the Ruined House',desc:'Study the structure from outside before stepping closer.',base:18,strain:.8,skill:'Survival',repeatable:false},
inspect_door:{name:'Inspect the Doorway',desc:'Check the sagging doorway, hinges and rotten threshold.',base:16,strain:.7,skill:'Survival',repeatable:false},
enter_house:{name:'Enter the Ruin',desc:'Step inside and inspect what remains of the room.',base:20,strain:.8,skill:'Survival',repeatable:false},
clear_debris:{name:'Clear the Fallen Debris',desc:'Move rotten timber and broken thatch so repairs can begin.',base:18,strain:1,skill:'Crafting',repeatable:false},
salvage_boards:{name:'Salvage Usable Boards',desc:'Sort old timber and keep the boards that still have strength.',base:4.8,strain:.85,skill:'Crafting',repeatable:true},
pull_nails:{name:'Pull Reusable Nails',desc:'Work bent iron nails out of rotten boards without snapping them.',base:5.5,strain:.75,skill:'Crafting',repeatable:true},
gather_moss:{name:'Gather Packing Moss',desc:'Collect dense, clean moss for sealing gaps between boards.',base:3.8,strain:.7,skill:'Foraging',repeatable:true},
chop:{name:'Cut Young Birch Poles',desc:'Cut straight young birch for braces and replacement framing.',base:5,strain:1.05,skill:'Woodcutting',repeatable:true},
patch_frame:{name:'Brace the Broken Wall',desc:'Costs 2 Birch Poles + 2 Salvaged Boards.',base:10,strain:1,skill:'Crafting',repeatable:false},
refasten:{name:'Refasten the Wall Boards',desc:'Costs 2 Reusable Nails.',base:8,strain:.85,skill:'Crafting',repeatable:false},
seal_gaps:{name:'Seal the Wall Gaps',desc:'Costs 2 Packing Moss.',base:9,strain:.75,skill:'Crafting',repeatable:false}
};
const RESOURCE_NAMES={berries:'🫐 Wild Blueberries',mushrooms:'🍄 Chanterelle Mushrooms',wood:'🪵 Young Birch Poles',boards:'🪚 Salvaged Boards',nails:'🔩 Reusable Nails',moss:'🌿 Packing Moss'};
function zeroMap(keys,value=0){const o={};for(const k of keys)o[k]=value;return o}
function foodTimerDefaults(){const o={};for(const [id,f] of Object.entries(FOODS))o[id]=f.cooldown;return o}
function fresh(){return{version:VERSION,hp:90,maxHp:100,generation:1,runSeconds:0,perm:0,res:{berries:0,mushrooms:0,wood:0,boards:0,nails:0,moss:0},cap:2,prog:{checked_self:false,listened:false,searched_clearing:false,tracks:false,berry_patch:false,stabilized:false,beyond_clearing:false,mushroom_patch:false,fence_followed:false,house_seen:false,door_checked:false,house_inside:false,debris_cleared:false,frame_braced:false,boards_refastened:false,gaps_sealed:false},runXp:zeroMap(SKILLS),loopXp:zeroMap(SKILLS),lifetime:zeroMap(ACTION_ORDER),autoActions:zeroMap(ACTION_ORDER,false),priorities:zeroMap(ACTION_ORDER,5),active:'',nextAction:'',progress:0,autoEat:true,foodTimers:foodTimerDefaults(),foodsEaten:{berries:0},storySeen:{},latestStory:'Cold needles press through your clothes. Your mouth is dry, your head aches, and the trees around you are unfamiliar. You remember no name, no road, and no reason to be here.',events:[{t:0,text:'You wake on wet pine needles with no memory of how you got here.'}]}}
let s;try{s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null')||fresh();if(s.version!==VERSION)s=fresh()}catch{s=fresh()}
function normalize(){const n=fresh();s={...n,...s};s.res={...n.res,...(s.res||{})};s.prog={...n.prog,...(s.prog||{})};s.runXp={...n.runXp,...(s.runXp||{})};s.loopXp={...n.loopXp,...(s.loopXp||{})};s.lifetime={...n.lifetime,...(s.lifetime||{})};s.autoActions={...n.autoActions,...(s.autoActions||{})};s.priorities={...n.priorities,...(s.priorities||{})};s.foodTimers={...n.foodTimers,...(s.foodTimers||{})};s.foodsEaten={...n.foodsEaten,...(s.foodsEaten||{})};s.storySeen={...(s.storySeen||{})};s.active='';s.nextAction='';s.progress=0;recalcMax(false)}
function save(){s.version=VERSION;localStorage.setItem(SAVE_KEY,JSON.stringify(s))}
function level(x){return Math.floor(Math.sqrt(Math.max(0,x)/20))}
function vitalityLevel(x){return Math.floor(Math.sqrt(Math.max(0,x)/35))}
function recalcMax(addDiff=false){const old=s.maxHp||100,run=vitalityLevel(s.runXp.Vitality||0),loop=vitalityLevel(s.loopXp.Vitality||0),neu=100+run+loop*2;s.maxHp=neu;if(addDiff&&neu>old)s.hp=Math.min(neu,s.hp+(neu-old));else s.hp=Math.min(neu,s.hp)}
function speed(skill){const rl=skill==='Vitality'?vitalityLevel(s.runXp[skill]):level(s.runXp[skill]),ll=skill==='Vitality'?vitalityLevel(s.loopXp[skill]):level(s.loopXp[skill]);return 1+rl*.045+ll*.02}
function duration(id){return ACTIONS[id].base/speed(ACTIONS[id].skill)}
function cap(){return s.cap}
function addXp(skill,amount){s.runXp[skill]+=amount;s.loopXp[skill]+=amount*LOOP_XP_RATIO}
function loseHp(amount){const actual=Math.min(Math.max(0,s.hp),Math.max(0,amount));if(actual<=0)return;s.hp-=actual;addXp('Vitality',actual);recalcMax(false)}
function currentDecay(id){return(DECAY_BASE+DECAY_PER_ACTIVE_MINUTE*(s.runSeconds/60))*ACTIONS[id].strain}
function event(text){s.events.unshift({t:s.runSeconds,text});s.events=s.events.slice(0,20)}
function storyOnce(key,text){if(s.storySeen[key])return false;s.storySeen[key]=true;s.latestStory=text;event(text);return true}
normalize();
