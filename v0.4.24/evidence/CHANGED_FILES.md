# RELIVOR v0.4.24 changed files

Production fixes to the supplied implementation:

- game/scripts/main.gd: remaining "skade" display text becomes "damage"; confirmation wraps and fits mobile; the exact current save is archived only at confirmation; Rebirth milestone/autosave writes are blocked during the guarded transaction; failed writes roll back current progress.
- game/scripts/local_save.gd: optional isolated native save path for QA, with no player-profile fallback when set. Default production paths are retained.
- game/scripts/sidebar_readout.gd: six-decimal Legacy balance and pending reward display.
- game/scripts/simulation.gd: strict insufficient-funds rejection; finite purchase validation; strict Legacy revision and canonical chapter/depth keys; canonical integer counters on load.

The supplied UI, painted artwork, Chapter 1 route and gameplay formulas are retained. No v0.4.25 is created.

QA additions: Legacy, save and native UI scripts; browser migration and Legacy suites; preservation audit; release packaging and verification. Full source and generated metadata lists are in qa/changed-files.json.
