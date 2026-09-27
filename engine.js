'use strict';
function complete(id){const r=s.res;s.lifetime[id]=(s.lifetime[id]||0)+1;switch(id){
case'berries':r.berries++;addXp('Foraging',6);event('You gather a handful of cold Wild Blueberries.');break;
case'forage':r.mushrooms++;addXp('Foraging',8);event('You find a golden Chanterelle beneath the wet birch leaves.');break;
case'cook':r.mushrooms--;r.stew++;addXp('Survival',7);event('You prepare a warm bowl of Chanterelle Stew for later.');break;
case'chop':r.wood++;addXp('Woodcutting',9);event('A young birch gives way with a dry crack.');break;
case'shelter':r.wood-=2;s.prog.shelter=true;s.prog.stoneAccess=true;s.runMaxBonus=20;recalcMax(s,false);s.vitality=Math.min(s.maxVitality,s.vitality+20);addXp('Crafting',18);event('The lean-to keeps the wind away. You can work longer now.');break;
case'mine':r.stone++;addXp('Mining',10);event('A rough piece of granite breaks free from the rockslide.');break;
case'fibers':r.fiber++;addXp('Foraging',8);event('You twist long nettle fibers into a strong binding strand.');break;
case'knife':r.wood--;r.stone--;r.fiber--;s.prog.knife=true;addXp('Crafting',22);event('The Stone Knife changes what is possible.');break;
case'trail':s.prog.trail=true;addXp('Survival',30);event('The Dark Forest Trail is open. Something moves beyond the trees.');break}
if((s.lifetime[id]||0)===AUTOMATION_UNLOCK)event(`${ACTIONS[id].name} automation unlocked.`);save()}
function start(id,once=false){if(!can(id))return;s.active=id;s.activeOnce=!!once;s.progress=0;render()}
function stop(advance=true){s.active='';s.activeOnce=false;s.progress=0;if(advance)advanceQueueOrAuto();render()}
function queue(id){if(!unlocked(id))return;s.nextAction=id;event(`${ACTIONS[id].name} queued for one completion.`);if(!s.active)advanceQueueOrAuto();save();render()}
function toggleAuto(id){if((s.lifetime[id]||0)<AUTOMATION_UNLOCK)return;s.autoActions[id]=!s.autoActions[id];if(s.autoActions[id]&&!s.active)advanceQueueOrAuto();save();render()}
function cyclePriority(id){s.priorities[id]=((Number(s.priorities[id]??5)+1)%11);save();render()}
function advanceQueueOrAuto(){if(s.active)return;if(s.nextAction){const q=s.nextAction;s.nextAction='';if(can(q)){start(q,true);return}}
  let best='',bestP=-1;for(const id of ACTION_ORDER){if(!s.autoActions[id]||(s.lifetime[id]||0)<AUTOMATION_UNLOCK||!can(id))continue;const p=Number(s.priorities[id]??5);if(p>bestP){bestP=p;best=id}}if(best)start(best,false)
}
function consumeFood(id){const f=FOODS[id];if(!f||s.res[id]<=0)return;s.res[id]--;s.vitality=Math.min(s.maxVitality,s.vitality+f.heal);s.foodTimers[id]=f.cooldown;addXp('Survival',f.survivalXp);event(`Auto-Eat consumes ${f.name} and restores ${f.heal} Vitality.`);save()}
function processFoodTimers(dt){if(!s.autoEat)return;for(const [id,f] of Object.entries(FOODS)){if((s.res[id]||0)<=0)continue;let rem=Number(s.foodTimers[id]??f.cooldown);if(rem>0){rem=Math.max(0,rem-dt);s.foodTimers[id]=rem}if(rem>0||s.vitality>=s.maxVitality-.01)continue;consumeFood(id)}}
function die(){const loop={...s.loopXp},life={...s.lifetime},autos={...s.autoActions},priorities={...s.priorities},gen=s.generation+1,autoEat=s.autoEat,perm=s.perm,oldEvents=[...s.events];s=fresh();s.loopXp=loop;s.lifetime=life;s.autoActions=autos;s.priorities=priorities;s.generation=gen;s.autoEat=autoEat;s.perm=perm;recalcMax(s,false);s.vitality=s.maxVitality;s.events=oldEvents.slice(0,7);s.events.unshift({t:0,text:`Generation ${gen} begins. Loop Skill XP and mastery remain.`});save();advanceQueueOrAuto()}
function fmt(x){const t=Math.floor(x),m=Math.floor(t/60),q=t%60;return String(m).padStart(2,'0')+':'+String(q).padStart(2,'0')}
