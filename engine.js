function complete(id){const r=s.res;s.lifetime[id]=(s.lifetime[id]||0)+1;switch(id){
case'forage':r.mushrooms++;addXp('Foraging',8);event('You find a golden Chanterelle beneath the wet birch leaves.');break;
case'cook':r.mushrooms--;r.food++;addXp('Survival',7);event('You prepare a warm bowl of Chanterelle Stew for later.');break;
case'chop':r.wood++;addXp('Woodcutting',9);event('A young birch gives way with a dry crack.');break;
case'shelter':r.wood-=2;s.prog.shelter=true;s.prog.stoneAccess=true;s.runMaxBonus=20;recalcMax(s,false);s.vitality=Math.min(s.maxVitality,s.vitality+20);addXp('Crafting',18);event('The lean-to keeps the wind away. You can work longer now.');break;
case'mine':r.stone++;addXp('Mining',10);event('A rough piece of granite breaks free from the rockslide.');break;
case'fibers':r.fiber++;addXp('Foraging',8);event('You twist long nettle fibers into a strong binding strand.');break;
case'knife':r.wood--;r.stone--;r.fiber--;s.prog.knife=true;addXp('Crafting',22);event('The Stone Knife changes what is possible.');break;
case'trail':s.prog.trail=true;addXp('Survival',30);event('The Dark Forest Trail is open. Something moves beyond the trees.');break}
if((s.lifetime[id]||0)===AUTOMATION_UNLOCK)event(`${ACTIONS[id].name} automation unlocked.`);save()}
function start(id){if(!can(id))return;s.active=id;s.progress=0;render()}
function stop(advance=true){s.active='';s.progress=0;if(advance)advanceQueueOrAuto();render()}
function queue(id){s.nextAction=id;event(`${ACTIONS[id].name} added as Next Action.`);if(!s.active)advanceQueueOrAuto();save();render()}
function advanceQueueOrAuto(){if(s.active)return;if(s.nextAction){const q=s.nextAction;s.nextAction='';if(can(q)){start(q);return}}
  for(const id of ACTION_ORDER){if(s.autoActions[id]&&(s.lifetime[id]||0)>=AUTOMATION_UNLOCK&&can(id)){start(id);return}}
}
function toggleMode(id){s.modes[id]=s.modes[id]==='once'?'repeat':'once';save();render()}
function toggleAuto(id){if((s.lifetime[id]||0)<AUTOMATION_UNLOCK)return;s.autoActions[id]=!s.autoActions[id];if(s.autoActions[id]&&!s.active)advanceQueueOrAuto();save();render()}
function die(){const loop={...s.loopXp},life={...s.lifetime},modes={...s.modes},autos={...s.autoActions},gen=s.generation+1,autoEat=s.autoEat,perm=s.perm;const oldEvents=[...s.events];s=fresh();s.loopXp=loop;s.lifetime=life;s.modes=modes;s.autoActions=autos;s.generation=gen;s.autoEat=autoEat;s.perm=perm;recalcMax(s,false);s.vitality=s.maxVitality;s.events=oldEvents.slice(0,7);s.events.unshift({t:0,text:`Generation ${gen} begins. Loop Skill XP and mastery remain.`});save();advanceQueueOrAuto()}
function fmt(x){const t=Math.floor(x),m=Math.floor(t/60),q=t%60;return String(m).padStart(2,'0')+':'+String(q).padStart(2,'0')}
