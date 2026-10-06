# RELIVOR v0.4.24 — LOCAL QA PASS

Date: 2026-10-06. All required local checks pass. Publication and live verification are recorded separately in DEPLOYMENT.txt.

VERSION: v0.4.24
LOCAL QA: PASS
SAVE COMPATIBILITY: PASS
LEGACY REWARD CURVE: PASS
ONE-REWARD-PER-CHAPTER-PER-LEGACY: PASS
REBIRTH RESET: PASS
PERMANENT +1% UPGRADES: PASS
CHAPTER STATS: PASS
FULL LEGACY STATS: PASS
DESKTOP 1448x1086: PASS
MOBILE 390: PASS
MOBILE 430: PASS
ANY BLOCKERS: None.

Counts: {"browser_legacy": 92, "browser_migration": 278, "legacy": 453, "migration": 784, "preservation": 92, "route": 41, "saves": 166, "ui": 165}. Zero errors in both final browser suites. Godot 4.7.2 final import and Web export logs are clean.

Reward QA proves first claims 1.000000, 0.990000, 0.980100 and 0.970299, separate per-chapter decay and one pending reward per chapter per Legacy. Clear pays zero; Rebirth is the payment moment. No-purchase Rebirth, same-Rebirth Woodcutting purchase, all six speed upgrades, 1.01x/1.02x and additive-before-tool math pass. Underfunded and noninteger/nonfinite purchases are blocked.

Reset QA compares normal gameplay with a fresh profile and proves settings, points, upgrades, claims and permanent records survive. Active simulated clocks persist through ordinary deaths, freeze chapter time after completion, and update clear/Last/Best and same-depth Full Legacy records correctly.

Save A-H QA uses fresh, real/synthetic v0.4.23 progress and completed saves, retained v0.4.22 migration, and before/after Rebirth decimal/upgraded reloads. Old completion is eligible for pending 1.000000 with unknown historical times left unknown. No progress wipe. Exact immutable numbered/digest archives are verified before reset writes. Cancellation creates no archive. Injected archive and post-reset write failures preserve progress. Native tests include real local_save transactions and isolated paths. Browser tests use isolated contexts/localStorage only.

92 preservation checks prove Chapter 1 data byte-identical to v0.4.23 and original Hunger, combat, recipes, queue, food timers and death mechanics retained except intentional Legacy integration. All twelve areas are reached using actual prerequisites with controlled QA materials/HP; this is a reachability test, not a new balance assessment. Chapter 1 food remains Mushroom/Perch/Boar; no new Eel. All seven painted skill PNGs retain supplied hashes.

Native rendered checks and actual WebGL browser interaction cover desktop 1448x1086 and mobile 390x844/430x844, Legacy scrolling, purchase/confirmation controls, saved state and reload. Screenshots are archived under qa. Mobile skills remain one column; all skill descriptions fit. English controls pass, including damage. Sidebar and Legacy dialog show six decimals.

The browser migration suite tolerates at most 1e-12 seconds of JSON floating-point round-trip error in suspended progress; owner IDs and combat state must remain exact. This addresses a final-bit numeric representation difference without allowing lost work.

Publication plan preserves v0.4.23 tree ced6358d4dd79cf70c3a234a91d63f258e4cc81e and v0.4.22 tree 2c133c39a217e1ef8243b46b5bb4d37c3b878c35. One publication commit/push is allowed after this gate. Final live bytes, deployed commit and both browser suites must be verified before marking deployment complete.

CHANGED FILES: CHANGED_FILES.md and qa/changed-files.json.
