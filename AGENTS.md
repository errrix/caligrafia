# AGENTS.md

## Project Overview

Caligrafia is a browser-based A4 handwriting worksheet generator. The app lets
users enter a phrase, adjust the handwriting size, preview the sheet, and print
it or save it as PDF through the browser print dialog.

## Quick Start

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Checks:

```bash
npm run lint
```

## Documentation Language

All project documentation must be written in English.

Team chat and planning may happen in Russian, but committed documentation in
`README.md`, `AGENTS.md`, and `docs/` stays English.

## Documentation Map

- `docs/FEATURE_ORCHESTRATION.md` - required route selection and delivery
  workflow.
- `docs/ARCHITECTURE.md` - application structure, state, rendering, print, and
  build behavior.
- `docs/PROJECT_CHANGES.md` - baseline, limitations, and user-visible change
  history.

## Repository Entry Protocol

Before making any code, UI, behavior, print, A4 sheet, or documentation change:

1. Read `README.md`.
2. If the task can affect product behavior, read:
   - `docs/FEATURE_ORCHESTRATION.md`
   - `docs/ARCHITECTURE.md`
   - `docs/PROJECT_CHANGES.md`
3. Classify the task using `docs/FEATURE_ORCHESTRATION.md`.
4. State the selected route or stage before editing files.

Do not start implementation from `src/` files until the entry protocol above is complete.

## Feature Work

Before implementing any new feature or user-visible behavior change, classify
the task and follow the matching route in
`docs/FEATURE_ORCHESTRATION.md`. Clear features start with Business Analysis,
then move through development, QA/testing, and documentation/release.

When the desired solution is unclear, start with the Product Research stage
instead. For example: "Run product research: I do not like this result, but I do
not know what I want yet. Do not code; suggest options first."

## Required Defaults

- Keep committed project documentation in English.
- Preserve browser-only runtime and static build support.
- Preserve A4 print behavior unless the task explicitly changes it.
- Run `npm run lint` and `npm run build` for feature or behavior changes.
- Update `docs/PROJECT_CHANGES.md` for user-visible or workflow-relevant changes.
- Update `docs/ARCHITECTURE.md` when state ownership, rendering behavior, print behavior, build flow, or major technical behavior changes.
