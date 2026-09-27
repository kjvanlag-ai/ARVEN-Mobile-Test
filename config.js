'use strict';
const VERSION='0.3.8';
const SAVE_KEY='arven_mobile_038';
const PREVIOUS_SAVE_KEYS=['arven_mobile_037','arven_mobile_036'];
const LOOP_XP_RATIO=.01;
const AUTOMATION_UNLOCK=100;
const DECAY_BASE=.24;
const SKILLS=['Survival','Foraging','Mycology','Woodcutting','Crafting','Vitality'];
const ACTION_ORDER=['check_self','listen','search_clearing','inspect_tracks','find_berries','berries','search_beyond','inspect_mushrooms','mushrooms','follow_fence','approach_house','inspect_door','enter_house','clear_debris','salvage_boards','pull_nails','gather_moss','chop','patch_frame','refasten','seal_gaps','follow_path','enter_deeper','hear_movement','underbrush','wolf_tracks','thornbush','dark_berries','marker','safer_route'];
const RESOURCE_ORDER=['berries','mushrooms','wood','boards','nails','moss','dark_berries'];
const FOODS={berries:{name:'Wild Blueberries',cooldown:2.5,heal:2,survivalXp:1}};
const ACTIONS={
check_self:{section:'PART I · THE COLD CLEARING',name:'Check Yourself',desc:'Look for injuries, belongings and anything that explains who you are.',base:12,strain:.5,skill:'Survival',repeatable:false},
listen:{section:'PART I · THE COLD CLEARING',name:'Listen to the Forest',desc:'Stay still and listen for water, people, roads or animals.',base:12,strain:.45,skill:'Survival',repeatable:false},
search_clearing:{section:'PART I · THE COLD CLEARING',name:'Search the Clearing',desc:'Search the ground around the place where you woke.',base:18,strain:.6,skill:'Survival',repeatable:false},
inspect_tracks:{section:'PART I · THE COLD CLEARING',name:'Inspect Faint Tracks',desc:'Follow disturbed needles and shallow marks near the trees.',base:16,strain:.6,skill:'Survival',repeatable:false},
find_berries:{section:'PART I · THE COLD CLEARING',name:'Search the Brambles',desc:'Push through low brush where birds have been feeding.',base:20,strain:.7,skill:'Survival',repeatable:false},
berries:{section:'PART I · THE COLD CLEARING',name:'Pick Wild Blueberries',desc:'Safe early food · gain 1 berry portion.',base:3,strain:.75,skill:'Foraging',repeatable:true},
search_beyond:{section:'PART I · THE COLD CLEARING',name:'Search Beyond the Clearing',desc:'Leave the familiar patch and search deeper between the birches.',base:24,strain:.85,skill:'Survival',repeatable:false},
inspect_mushrooms:{section:'PART I · THE COLD CLEARING',name:'Inspect the Mushroom Patch',desc:'Study several similar orange mushrooms before trusting any of them.',base:16,strain:.65,skill:'Mycology',repeatable:false},
mushrooms:{section:'PART I · THE COLD CLEARING',name:'Gather Chanterelle Mushrooms',desc:'Gain edible Chanterelles, but early identification can fail.',base:4,strain:.85,skill:'Mycology',repeatable:true},
follow_fence:{section:'PART II · THE RUIN',name:'Follow the Rotten Fence Line',desc:'Follow moss-covered posts that should lead somewhere.',base:24,strain:.9,skill:'Survival',repeatable:false},
approach_house:{section:'PART II · THE RUIN',name:'Approach the Ruined House',desc:'Study the structure from outside before stepping closer.',base:18,strain:.8,skill:'Survival',repeatable:false},
inspect_door:{section:'PART II · THE RUIN',name:'Inspect the Doorway',desc:'Check the sagging doorway, hinges and rotten threshold.',base:16,strain:.7,skill:'Survival',repeatable:false},
enter_house:{section:'PART II · THE RUIN',name:'Enter the Ruin',desc:'Step inside and inspect what remains of the room.',base:20,strain:.8,skill:'Survival',repeatable:false},
clear_debris:{section:'HOUSE REPAIR',name:'Clear the Fallen Debris',desc:'Move rotten timber and broken thatch so repairs can begin.',base:18,strain:1,skill:'Crafting',repeatable:false},
salvage_boards:{section:'HOUSE REPAIR',name:'Salvage Usable Boards',desc:'Sort old timber and keep the boards that still have strength.',base:4.8,strain:.85,skill:'Crafting',repeatable:true},
pull_nails:{section:'HOUSE REPAIR',name:'Pull Reusable Nails',desc:'Work bent iron nails out of rotten boards without snapping them.',base:5.5,strain:.75,skill:'Crafting',repeatable:true},
gather_moss:{section:'HOUSE REPAIR',name:'Gather Packing Moss',desc:'Collect dense, clean moss for sealing gaps between boards.',base:3.8,strain:.7,skill:'Foraging',repeatable:true},
chop:{section:'HOUSE REPAIR',name:'Cut Young Birch Poles',desc:'Cut straight young birch for braces and replacement framing.',base:5,strain:1.05,skill:'Woodcutting',repeatable:true},
patch_frame:{section:'HOUSE REPAIR',name:'Brace the Broken Wall',desc:'Costs 2 Birch Poles + 2 Salvaged Boards.',base:10,strain:1,skill:'Crafting',repeatable:false},
refasten:{section:'HOUSE REPAIR',name:'Refasten the Wall Boards',desc:'Costs 2 Reusable Nails.',base:8,strain:.85,skill:'Crafting',repeatable:false},
seal_gaps:{section:'HOUSE REPAIR',name:'Seal the Wall Gaps',desc:'Costs 2 Packing Moss.',base:9,strain:.75,skill:'Crafting',repeatable:false},
follow_path:{section:'PART III · THE DEEPER FOREST',name:'Follow the Narrow Path',desc:'Leave the repaired ruin and follow the faint path beyond the trees.',base:18,strain:.9,skill:'Survival',repeatable:false},
enter_deeper:{section:'PART III · THE DEEPER FOREST',name:'Enter the Deeper Forest',desc:'Move beneath the denser canopy where the light fades and the ground changes.',base:20,strain:1,skill:'Survival',repeatable:false},
hear_movement:{section:'PART III · THE DEEPER FOREST',name:'Listen to Something Moving',desc:'Stop and locate the heavy movement somewhere beyond the brush.',base:12,strain:.7,skill:'Survival',repeatable:false},
underbrush:{section:'PART III · THE DEEPER FOREST',name:'Search the Underbrush',desc:'Search disturbed leaves and low brush for signs of what passed through.',base:18,strain:.9,skill:'Foraging',repeatable:false},
wolf_tracks:{section:'PART III · THE DEEPER FOREST',name:'Inspect the Wolf Tracks',desc:'Study the fresh paw prints and work out how recently the animal passed.',base:16,strain:.8,skill:'Survival',repeatable:false},
thornbush:{section:'PART III · THE DEEPER FOREST',name:'Push Through the Thornbush',desc:'Force a careful route through dense thorns without losing the trail.',base:22,strain:1.15,skill:'Survival',repeatable:false},
dark_berries:{section:'PART III · THE DEEPER FOREST',name:'Gather Dark Berries',desc:'Collect unfamiliar dark berries for later study. You do not trust them as food yet.',base:4,strain:.85,skill:'Foraging',repeatable:true},
marker:{section:'PART III · THE DEEPER FOREST',name:'Inspect the Broken Hunting Marker',desc:'Examine a weathered human marker partly hidden behind the brush.',base:16,strain:.75,skill:'Survival',repeatable:false},
safer_route:{section:'PART III · THE DEEPER FOREST',name:'Find a Safer Route Back',desc:'Map a route between the deeper forest and the ruined house that avoids the worst ground.',base:24,strain:1.05,skill:'Survival',repeatable:false}
};
const RESOURCE_NAMES={berries:'🫐 Wild Blueberries',mushrooms:'🍄 Chanterelle Mushrooms',wood:'🪵 Young Birch Poles',boards:'🪚 Salvaged Boards',nails:'🔩 Reusable Nails',moss:'🌿 Packing Moss',dark_berries:'◉ Unfamiliar Dark Berries'};
const JOURNEY=[
{flag:'',title:'Awoke in the Cold Clearing',info:'You woke alone on wet pine needles with no memory of your name, your route or how you reached the forest.'},
{flag:'checked_self',title:'Checked Yourself',info:'No serious wound, no useful belongings and nothing in your pockets explains who you are.'},
{flag:'listened',title:'Listened to the Forest',info:'No road, voices or machinery answered you—only wind, birds and deep forest.'},
{flag:'searched_clearing',title:'Searched the Clearing',info:'The ground showed disturbed soil, broken twigs and signs that something had moved through recently.'},
{flag:'tracks',title:'Found Faint Tracks',info:'One scrape looked almost like a dragged boot heel before the trail vanished beneath brambles.'},
{flag:'berry_patch',title:'Found Wild Blueberries',info:'The berries became your first safe food and the first thing your instincts recognized with confidence.'},
{flag:'stabilized',title:'Stabilized with Berries',info:'After eating enough berries, the shaking eased and you felt steady enough to leave the clearing.'},
{flag:'beyond_clearing',title:'Searched Beyond the Clearing',info:'Old cuts, shifted stones and scarred bark suggested that people had once used this part of the forest.'},
{flag:'mushroom_patch',title:'Found the Mushroom Patch',info:'Chanterelles offered better food, but similar toxic mushrooms made identification dangerous and trained Mycology.'},
{flag:'fence_followed',title:'Followed the Rotten Fence',info:'Moss-covered posts formed an old line downhill—too regular to be natural.'},
{flag:'house_seen',title:'Found the Ruined House',info:'A small timber house stood half-collapsed among the trees, abandoned for years but still useful enough to investigate.'},
{flag:'house_inside',title:'Entered the Ruined House',info:'Inside you found a surviving hearth, old repair work, reusable boards and iron nails beneath the debris.'},
{flag:'debris_cleared',title:'Began Restoring the Shelter',info:'Clearing the debris revealed how the old walls were built and opened the first real repair jobs.'},
{flag:'frame_braced',title:'Braced the Broken Wall',info:'Fresh birch poles and salvaged boards pulled the weakest wall back toward square.'},
{flag:'boards_refastened',title:'Refastened the Wall Boards',info:'Recovered nails secured the repaired boards and made the wall hold together again.'},
{flag:'gaps_sealed',title:'Sealed the Wall Gaps',info:'Packed moss blocked the worst drafts. The ruin finally began to feel like somewhere you could survive a night.'},
{flag:'narrow_path',title:'Followed the Narrow Path',info:'Beyond the ruin, a thin route led toward denser forest where the canopy swallowed more of the light.'},
{flag:'deeper_forest',title:'Entered the Deeper Forest',info:'The ground became darker and softer, the trees tighter, and familiar sightlines disappeared behind brush.'},
{flag:'heard_movement',title:'Heard Something Moving',info:'Heavy movement stopped when you stopped. Whatever made it was large enough to push through brush without caring about noise.'},
{flag:'underbrush_searched',title:'Searched the Underbrush',info:'Freshly pressed leaves and snapped stems showed that an animal had crossed the path recently.'},
{flag:'wolf_tracks',title:'Found Wolf Tracks',info:'The prints were canine, broad and fresh. You were no longer the only hunter-sized creature using these paths.'},
{flag:'thorn_path',title:'Pushed Through the Thornbush',info:'Past the thorns, the ground opened into a small pocket of berries and old human signs.'},
{flag:'dark_berries_found',title:'Found Unfamiliar Dark Berries',info:'The fruit looked edible but unfamiliar. You gathered samples instead of risking them as food.'},
{flag:'hunting_marker',title:'Found a Broken Hunting Marker',info:'A weathered carved marker proved that someone had once mapped or hunted this deeper part of the forest.'},
{flag:'safe_route',title:'Mapped a Safer Route Back',info:'You connected the deeper forest to the ruined house by a route you could follow quickly without crossing the worst ground.'}
];
function zeroMap(keys,value=0){const o={};for(const k of keys)o[k]=value;return o}
function foodTimerDefaults(){const o={};for(const [id,f] of Object.entries(FOODS))o[id]=f.cooldown;return o}
function progressDefaults(){return{checked_self:false,listened:false,searched_clearing:false,tracks:false,berry_patch:false,stabilized:false,beyond_clearing:false,mushroom_patch:false,fence_followed:false,house_seen:false,door_checked:false,house_inside:false,debris_cleared:false,frame_braced:false,boards_refastened:false,gaps_sealed:false,narrow_path:false,deeper_forest:false,heard_movement:false,underbrush_searched:false,wolf_tracks:false,thorn_path:false,dark_berries_found:false,hunting_marker:false,safe_route:false}}
function resourceDefaults(){return{berries:0,mushrooms:0,wood:0,boards:0,nails:0,moss:0,dark_berries:0}}
function fresh(){return{version:VERSION,hp:90,maxHp:100,generation:1,runSeconds:0,perm:0,res:resourceDefaults(),cap:2,prog:progressDefaults(),runXp:zeroMap(SKILLS),loopXp:zeroMap(SKILLS),lifetime:zeroMap(ACTION_ORDER),autoActions:zeroMap(ACTION_ORDER,false),priorities:zeroMap(ACTION_ORDER,5),active:'',actionQueue:[],progress:0,autoEat:true,foodTimers:foodTimerDefaults(),foodsEaten:{berries:0},storySeen:{},latestStory:'Cold needles press through your clothes. Your mouth is dry, your head aches, and the trees around you are unfamiliar. You remember no name, no road, and no reason to be here.',events:[{t:0,text:'You wake on wet pine needles with no memory of how you got here.'}]}}
let s,migrated=false;
try{
  const current=localStorage.getItem(SAVE_KEY);let raw=current;
  if(!raw){for(const key of PREVIOUS_SAVE_KEYS){raw=localStorage.getItem(key);if(raw){migrated=true;break}}}
  s=JSON.parse(raw||'null')||fresh();
  if(!current&&raw)s.version=VERSION; else if(s.version!==VERSION)s=fresh();
}catch{s=fresh()}
function normalize(){const n=fresh(),legacyNext=s.nextAction||'';s={...n,...s};s.res={...n.res,...(s.res||{})};s.prog={...n.prog,...(s.prog||{})};s.runXp={...n.runXp,...(s.runXp||{})};s.loopXp={...n.loopXp,...(s.loopXp||{})};s.lifetime={...n.lifetime,...(s.lifetime||{})};s.autoActions={...n.autoActions,...(s.autoActions||{})};s.priorities={...n.priorities,...(s.priorities||{})};s.foodTimers={...n.foodTimers,...(s.foodTimers||{})};s.foodsEaten={...n.foodsEaten,...(s.foodsEaten||{})};s.storySeen={...(s.storySeen||{})};s.actionQueue=Array.isArray(s.actionQueue)?s.actionQueue.filter(id=>ACTIONS[id]):[];if(!s.actionQueue.length&&legacyNext&&ACTIONS[legacyNext])s.actionQueue.push(legacyNext);s.active='';s.progress=0;delete s.nextAction;recalcMax(false)}
function save(){s.version=VERSION;localStorage.setItem(SAVE_KEY,JSON.stringify(s))}
function level(x){return Math.floor(Math.sqrt(Math.max(0,x)/20))}
function vitalityLevel(x){return Math.floor(Math.sqrt(Math.max(0,x)/35))}
function recalcMax(addDiff=false){const old=s.maxHp||100,run=vitalityLevel(s.runXp.Vitality||0),loop=vitalityLevel(s.loopXp.Vitality||0),neu=100+run+loop*2;s.maxHp=neu;if(addDiff&&neu>old)s.hp=Math.min(neu,s.hp+(neu-old));else s.hp=Math.min(neu,s.hp)}
function speed(skill){const rl=skill==='Vitality'?vitalityLevel(s.runXp[skill]):level(s.runXp[skill]),ll=skill==='Vitality'?vitalityLevel(s.loopXp[skill]):level(s.loopXp[skill]);return 1+rl*.045+ll*.02}
function duration(id){return ACTIONS[id].base/speed(ACTIONS[id].skill)}
function cap(){return s.cap}
function addXp(skill,amount){if(!Number.isFinite(amount)||amount<=0)return;s.runXp[skill]+=amount;s.loopXp[skill]+=amount*LOOP_XP_RATIO}
function loseHp(amount){const actual=Math.min(Math.max(0,s.hp),Math.max(0,amount));if(actual<=0)return;s.hp-=actual;addXp('Vitality',actual);recalcMax(false)}
normalize();if(migrated){s.events.unshift({t:s.runSeconds||0,text:'v0.3.7 save migrated to v0.3.8 mobile preview.'});save()}
