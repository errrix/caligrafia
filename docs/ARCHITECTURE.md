# Architecture

The project is a single-page React application built with Vite. Its main job is
to collect worksheet parameters in a control panel, render an A4 sheet in the
browser, and pass that sheet to the browser print dialog.

## High-Level Flow

```text
User
  -> React UI
  -> App.tsx state
  -> A4 sheet markup
  -> screen / print CSS
  -> window.print()
  -> printer or browser PDF
```

## Technology Stack

- React - UI and form state.
- TypeScript - application typing.
- Vite - development server and production build.
- CSS - layout, sheet geometry, print styles, and font loading.
- lucide-react - icons used in buttons and the control panel header.
- oxlint - static code checks.

## Project Structure

```text
.
|-- docs/
|   |-- ARCHITECTURE.md
|   |-- FEATURE_ORCHESTRATION.md
|   `-- PROJECT_CHANGES.md
|-- public/
|   |-- favicon.svg
|   |-- icons.svg
|   `-- fonts/
|       |-- playwrite-us-trad-OFL.txt
|       |-- playwrite-us-trad.ttf
|       |-- primo.ttf
|       `-- propisi.ttf
|-- scripts/
|   `-- fix-dist-file-url.mjs
|-- src/
|   |-- App.css
|   |-- App.tsx
|   |-- index.css
|   `-- main.tsx
|-- index.html
|-- package.json
|-- tsconfig*.json
`-- vite.config.ts
```

## Entry Points

### `src/main.tsx`

Mounts the React application into the `#root` DOM element from `index.html`.

### `src/App.tsx`

The main application component. It currently owns:

- phrase state;
- student name state;
- handwriting font size state;
- phrase segmentation by script for handwriting font selection;
- handlers for size controls, reset, and print;
- control panel markup;
- sheet preview markup;
- empty practice row generation through `practiceRows`.

The component is still monolithic. That is acceptable at the current project
size, but the first likely extraction points are `ControlPanel` and
`PracticeSheet`.

### `src/App.css`

Contains most of the visual behavior:

- application layout;
- control panel styles;
- A4 sheet dimensions;
- writing guide lines;
- responsive preview scaling;
- print mode through `@media print`.

Sheet geometry is controlled by CSS variables inside `.sheet`:

- `--copy-size` - handwriting text size passed from React;
- `--row-height` - practice row height;
- `--baseline-y` - baseline position;
- `--x-height` - upper guide line position.

### `src/index.css`

Global application styles:

- local font loading;
- handwriting font stacks for Cyrillic/default text and Latin text;
- color CSS variables;
- base styles for `html`, `body`, `button`, `input`, and `textarea`.

Worksheet handwriting fonts are part of the product behavior, not decorative UI
styling. Fonts used on the A4 sheet should look like school copybook models. For
Latin cursive worksheets, the primary font must support connected letters,
visible rightward slant, and complete cursive letterforms with the expected
entry/exit strokes and loops. Decorative script fonts, casual handwriting fonts,
upright joined fonts, non-joined manuscript fonts, and generic system fallbacks
should only be fallback options after a suitable local worksheet font.

## Data and State

State lives only in `App.tsx` through `useState`:

```text
sourcePhrase -> worksheet phrase text
phraseRuns   -> derived script-aware phrase segments
studentName  -> student name in the control panel
fontSize     -> handwriting text size
```

There is no external store, URL state, localStorage, or backend. After a page
reload, settings return to their default values.

## Printing

Printing is triggered by buttons that call:

```ts
window.print()
```

In print mode, CSS hides the control panel and the preview toolbar. Only `.sheet`
with `210mm x 297mm` dimensions is sent to print.

Key rules live in `@media print`:

- `@page { size: A4; margin: 0; }`;
- hide `.control-panel` and `.preview-toolbar`;
- reset screen preview scaling;
- remove shadows;
- preserve printed colors through `print-color-adjust`.

## Build

Vite is configured with `base: './'` so built assets use relative paths. This is
important for opening the production build directly from the file system.

Build command:

```bash
npm run build
```

It performs three steps:

1. `tsc -b` - TypeScript check.
2. `vite build` - static asset build into `dist`.
3. `node scripts/fix-dist-file-url.mjs` - post-build HTML patch.

## Post-Build Script

`scripts/fix-dist-file-url.mjs` reads `dist/index.html` and:

- replaces a module script with a deferred regular script;
- removes `crossorigin`.

This supports the scenario where `dist/index.html` is opened directly from disk
instead of through an HTTP server.

## Future Growth Areas

- Render the student name on the sheet.
- Add multiple phrases or multiple sheets.
- Implement wrapping for long phrases.
- Extract `ControlPanel` and `PracticeSheet` components.
- Add settings persistence.
- Add visual verification for the printed sheet.
- Add direct PDF export if consistent cross-browser output becomes required.
