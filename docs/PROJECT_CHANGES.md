# Project Changes

This file records project changes starting from the current baseline. Everything
listed in the `Baseline` section is treated as the initial state for future
change history.

## Baseline

The current project is a React/Vite application for generating a single A4
handwriting worksheet. It has no backend, keeps state only in the browser, and
prints through the standard `window.print()` flow.

### Implemented

- Settings panel with a student name input.
- Phrase input for the worksheet.
- Handwriting size adjustment from `24px` to `42px`.
- A4 sheet preview in the browser.
- One sample row with the entered phrase.
- `20` empty practice rows with writing guide lines.
- Print and PDF save through the browser system dialog.
- Local handwriting fonts from `public/fonts`.
- Production build through Vite.
- Post-build script that patches `dist/index.html` so the build can be opened
  directly through `file://`.

### Project Commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Current Limitations

- The student name is stored in state but is not rendered on the worksheet yet.
- The app generates one sheet for one phrase.
- Long phrases do not wrap automatically; the text is designed for one line.
- PDF output is produced by the browser, not by a dedicated PDF engine.
- User settings are not persisted between sessions.
- There are no UI tests or visual regression checks for the printed sheet.

## 2026-06-28

### Features

- Added Latin handwriting fallback support for worksheet sample text.
- Mixed Cyrillic and Latin phrases now render each script with an appropriate
  handwriting font stack.
- Added local `Playwrite US Trad` for slanted connected English worksheet
  handwriting, with its SIL Open Font License file.
- Restored readable Russian UI/default text in the React source.

### Documentation

- Shortened `README.md` into a project entry point with quick start commands and
  links to detailed documentation.
- Added the `docs` directory.
- Added this project change log.
- Added the architecture document.
- Standardized project documentation language as English.
- Added the feature orchestration process for future feature work.
- Strengthened the feature orchestration process with task classification,
  agent entry rules, fast paths, and an owner decision gate for product
  research.
