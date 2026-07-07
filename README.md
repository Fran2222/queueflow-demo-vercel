# QueueFlow Tutorial Visibility Hotfix

This patch fixes the all-in-one control room tutorial overlay so the guide card is no longer covered by the highlighted module.

## What changed

- Tutorial card now uses a higher layer than highlighted modules.
- The dark backdrop is separated from the tutorial card.
- Highlighted modules stay visible while the tutorial text stays readable.
- The tutorial card moves left/right depending on the focused section.
- The page auto-scrolls the focused section into view when moving through tutorial steps.
- Existing audio fix and all-in-one command center behavior are preserved.

## Upload to GitHub

Upload/overwrite these files only:

- `README.md`
- `src/main.jsx`
- `src/styles.css`

Commit message suggestion:

`Fix tutorial overlay visibility`

After committing to `main`, Vercel should redeploy automatically.
