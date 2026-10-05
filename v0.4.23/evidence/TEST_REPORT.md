# RELIVOR v0.4.23 — QA PASS

Date: 2026-10-05. Release URL: https://kjvanlag-ai.github.io/ARVEN-Mobile-Test/v0.4.23/
Publication is allowed by the handoff only after this complete local QA gate. Deployment/live verification is recorded separately in DEPLOYMENT.txt after publication.

SAVE COMPATIBILITY: PASS. EEL BLOCKER: PASS. ENGLISH UI: PASS. RUNNING/FIGHTING PAINTED CARDS: PASS.

## Exact legacy mapping

Both run.frame and persistent.furthest use this semantic table.

| v0.4.22 | v0.4.23 | Result |
|---|---|---|
| 1 Lake Edge | 3 Lake Shore | PASS |
| 2 The Outer Forest | 5 Pine Trail | PASS |
| 3 Creek Hollow | 6 Creek Crossing | PASS |
| 4 Stony Rise | 7 Stony Rise | PASS |
| 5 Old Hunter Trail | 8 Old Hunter Camp | PASS |
| 6 Wolf Hollow | 11 Wolf Hollow | PASS |
| 7 Bear Country | 11 Wolf Hollow | PASS |
| 8 The Bear's Den | 12 The Bear's Den | PASS |

## Migration and backup results

- 784/784 native migration assertions PASS.
- 41/41 existing route/simulation assertions PASS.
- 36/36 existing visual/runtime assertions PASS.
- 278/278 actual exported WebGL browser assertions PASS; zero page/console/network/browser errors.
- Godot 4.7.2 parser/import and final release Web export PASS.
- All 8 old locations and furthest records tested with synthetic v0.4.22 schema2/version0.4.6/xp_curve_revision1 saves.
- Fresh saves begin with content_revision1 and are not remapped. Current save saved/reloaded twice is byte-identical in a paused isolated browser state. Unsupported/fractional content revisions fail safely.
- Original .pre-v0.4.23 archive is byte-verified BEFORE any restore/mutation or migrated primary write. Existing differing archives remain immutable; a second incoming save receives its own SHA256-qualified archive. Actual browser backend tested.
- Injected archive failure blocks primary/autosave/rolling backup/fallback writes, including pagehide and a real autosave interval. Original stays byte-identical. Future content revisions cannot be replaced by an older backup or fresh profile.
- Old travel2–travel8 and Eel work are cancelled/filtered with exact queue ownership, including duplicate IDs. Old Eel inventory and all earned XP/mastery remain.
- No new Eel is obtainable in Chapter1 after migration; partial active/queued/suspended eel/cook_eel/eat_eel work cannot reward. Previously owned cooked Eel continues the existing Auto-Eat behavior as explicitly grandfathered by the handoff.
- Compatible non-travel done flags, XP, Vitality, generation, Auto/settings, inventory, capacity/weapon/gear, craft-paid/batches/stages, HP/hunger/time, chapter_complete and bear records survive unchanged. Repurposed travel flags/work and incompatible future work are the only intentional removals.
- Old suspended Creek work30s remains exact through migration and two reloads despite supplied new18s duration; no restore-time reward/XP, completion only after real resume/tick. Old50s boundary and invalid unrelated work reject safely.
- Content guards at discovery/start, step BEFORE time/XP, and completion BEFORE payment/output/mastery/loot defend against stale work and explicit Chapter2 metadata.

## Existing gameplay and visual QA

- Actual ordered travel/prerequisites reach all12 areas (controlled QA materials/HP; not a full balance/survival playthrough).
- Fresh Forest Edge, Mushroom first; Perch first area3, Boar first area10; Eel unavailable at each Chapter1 area.
- food_rules.json declares 1–3 families and no automatic carry. No new Chapter2 runtime was invented.
- 38 protected gameplay/save function bodies match v0.4.22 code exactly (excluding comments); formulas, Hunger, XP, skills, food timers, combat, recipes, queue scheduler and death/restart unchanged. Only content migration/eligibility safety changed in simulation.
- Supplied v0.4.23 route/action duration changes retained; no additional balancing by this pass.
- Inventory0→1→0, Run/Queue/Info, Stop/save/reload/resume, 15-second visual cycle without animation rewards, switch to Wood/back, and actual prepared death/StartNextRun PASS.
- Desktop1448×1086; mobile390×844/430×844; actual touch scroll, no horizontal overflow, five desktop skill columns / one mobile column, painted Running/Fighting PNGs, both progressions and stable level-up geometry PASS.
- Current screenshots inspected. Existing v0.4.22 large-card design/materials/scene/fisher retained. Narrow desktop flavor descriptions still use the supplied clipped single-line geometry; no redesign performed and no100% match claim.
- Final-export17-second actual gameplay MP4 contains normal simulation progression and a real catch. Animation unchanged.

## Files and evidence

Migration production files: simulation.gd, main.gd, local_save.gd. Prior local import/English repairs retained. Full list: CHANGED_FILES.md / qa/changed-files.json.
Native matrix: qa/migration/test-results.json. Browser: qa/browser-migration-results.json. Immutable archive order, failure, idempotence and original/migrated fixture evidence under qa/.
No actual player/browser profile was touched: tests use synthetic/native mocks and isolated browser contexts. Older blocked-candidate evidence is historical, not the final QA result.
v0.4.22 publication folder must remain the unchanged Git tree `2c133c39a217e1ef8243b46b5bb4d37c3b878c35`. One v0.4.23 publication only; live file/hash/browser verification follows CI.
