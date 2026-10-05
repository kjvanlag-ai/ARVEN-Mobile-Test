# RELIVOR v0.4.23 changed files

Migration production files:

- `game/scripts/simulation.gd`: content revision/mapping/filtering and invalid-content guards; exact legacy Creek work preservation.
- `game/scripts/main.gd`: immutable backup before restore; archive failure/future revision block writes and fallback.
- `game/scripts/local_save.gd`: exact archive verification and hash-qualified collision archives.

Compared with the originally supplied v0.4.23 source:

- `game/assets/icon_stone.svg`
- `game/project.godot`
- `game/scripts/local_save.gd`
- `game/scripts/main.gd`
- `game/scripts/simulation.gd`
- `game/scripts/skill_field.gd`

Added isolated QA/build helpers:

- `game/assets/artpack/character/fisher-body.png.import`
- `game/assets/artpack/character/fisher-right-forearm.png.import`
- `game/assets/artpack/character/fishing-rod.png.import`
- `game/assets/artpack/items/clay.png.import`
- `game/assets/artpack/items/cooked_perch.png.import`
- `game/assets/artpack/items/fiber.png.import`
- `game/assets/artpack/items/mushroom.png.import`
- `game/assets/artpack/items/raw_pelt.png.import`
- `game/assets/artpack/items/raw_perch.png.import`
- `game/assets/artpack/items/stone.png.import`
- `game/assets/artpack/items/wood.png.import`
- `game/assets/artpack/scene/bobber.svg.import`
- `game/assets/artpack/scene/lake_background.png.import`
- `game/assets/artpack/scene/ripple.svg.import`
- `game/assets/artpack/ui/button.png.import`
- `game/assets/artpack/ui/inventory_tile.png.import`
- `game/assets/artpack_v12/assets/corner_ornament_v2.png.import`
- `game/assets/artpack_v12/assets/dark_wood_texture.png.import`
- `game/assets/artpack_v12/assets/gold_separator_v2.png.import`
- `game/assets/artpack_v12/assets/status_bar_bg_v2.png.import`
- `game/assets/artpack_v13/assets/inventory_slot_v3.png.import`
- `game/assets/artpack_v13/assets/panel_frame_v3.png.import`
- `game/assets/artpack_v13/assets/panel_surface_v3.png.import`
- `game/assets/artpack_v13/assets/relivor_logo_header.png.import`
- `game/assets/cinzel.ttf.import`
- `game/assets/fishing_emblem.svg.import`
- `game/assets/frame1.png.import`
- `game/assets/frame2.png.import`
- `game/assets/frame3.png.import`
- `game/assets/frame4.png.import`
- `game/assets/frame5.png.import`
- `game/assets/frame6.png.import`
- `game/assets/frame7.png.import`
- `game/assets/frame8.png.import`
- `game/assets/icon_axe.svg.import`
- `game/assets/icon_chapter.svg.import`
- `game/assets/icon_clay.svg.import`
- `game/assets/icon_cook.svg.import`
- `game/assets/icon_craft.svg.import`
- `game/assets/icon_fight.svg.import`
- `game/assets/icon_fish.svg.import`
- `game/assets/icon_generation.svg.import`
- `game/assets/icon_heart.svg.import`
- `game/assets/icon_hide.svg.import`
- `game/assets/icon_hunger.svg.import`
- `game/assets/icon_meat.svg.import`
- `game/assets/icon_moss.svg.import`
- `game/assets/icon_run.svg.import`
- `game/assets/icon_save.svg.import`
- `game/assets/icon_settings.svg.import`
- `game/assets/icon_stone.svg.import`
- `game/assets/icon_story.svg.import`
- `game/assets/icon_strap.svg.import`
- `game/assets/icon_wood.svg.import`
- `game/assets/ui_v2/skills/cooking.png.import`
- `game/assets/ui_v2/skills/crafting.png.import`
- `game/assets/ui_v2/skills/fighting.png.import`
- `game/assets/ui_v2/skills/fishing.png.import`
- `game/assets/ui_v2/skills/running.png.import`
- `game/assets/ui_v2/skills/vitality.png.import`
- `game/assets/ui_v2/skills/woodcutting.png.import`
- `game/tools/finalize_web.py`
- `game/tools/test_v0423.gd`
- `game/tools/test_v0423.gd.uid`
- `game/tools/test_v0423_migration.gd`
- `game/tools/test_v0423_migration.gd.uid`
- `game/tools/ui_coords.gd`
- `game/tools/ui_coords.gd.uid`
- `game/tools/visual_v0423.gd`
- `game/tools/visual_v0423.gd.uid`

Root QA/release helpers: browser-migration-qa.cjs, record.cjs, verify_public.py, package-release.py; reports/evidence/archives. Generated import metadata is listed separately in qa/changed-files.json. All seven supplied painted skill PNGs unchanged. No new artwork or UI redesign.
