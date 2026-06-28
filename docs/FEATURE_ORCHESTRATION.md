# Feature Orchestration

This document defines the standard process for implementing new features. It is
not a per-feature archive. It is the reusable workflow that every feature should
follow.

## Goals

- Turn raw user requests into scoped, implementable work.
- Protect existing project behavior from accidental regressions.
- Keep development, testing, documentation, and release handoffs explicit.
- Make feature delivery repeatable without adding process overhead that does not
  improve quality.

## Agent Entry Protocol

Before doing work, the agent must:

1. Read `README.md`, this document, `ARCHITECTURE.md`, and
   `PROJECT_CHANGES.md` when the task may affect product behavior.
2. Classify the request using the task classification table below.
3. State which route or stage is being used and why.
4. Avoid file edits during Product Research and Business Analysis unless the
   user explicitly asks to update documentation.
5. Stop at the owner decision gate when the next step depends on a subjective
   product choice.

The default failure mode to avoid is starting with code before the request has
been classified.

## Task Classification

| Request type | Route | Notes |
| --- | --- | --- |
| Unclear dissatisfaction, weak result, or "I do not know what I want" | Product Research | No code edits. Produce options and criteria first. |
| Clear user-visible feature | Business Analysis -> Development -> QA -> Documentation & Release | Use the full pipeline. |
| Bug with clear expected behavior | Business Analysis -> Development -> QA -> Documentation & Release | Keep the analysis brief, but still define expected behavior. |
| Visual/UI change | Business Analysis -> Development -> QA -> Documentation & Release | QA must include browser verification. |
| Print, A4, font, or sheet rendering change | Business Analysis -> Development -> QA -> Documentation & Release | QA must include print/PDF or sheet-specific verification. |
| Refactor without intended behavior change | Technical Brief -> Development -> QA | Define invariants before editing. |
| Docs-only or process-only change | Documentation Fast Path | No app build required unless docs describe commands, build flow, or runtime behavior. |
| Code review request | Review Path | Findings first. Do not edit files unless the user asks for fixes. |
| Simple question | Answer Path | Do not edit files. Cite local docs or code when useful. |

## Fast Paths

Fast paths are allowed only when they reduce process overhead without weakening
quality.

### Documentation Fast Path

Use for README, docs, workflow, or process-only changes.

Required steps:

- Read the affected documentation.
- Make the smallest useful documentation change.
- Review `git diff`.
- State whether app checks were skipped and why.

### Technical Brief

Use for refactors or internal technical changes with no intended user-visible
behavior change.

Required output:

```md
## Technical Brief

### Goal
What internal change is being made.

### Invariants
- User-visible behavior that must not change.

### Scope
- Files or modules likely affected.

### QA Handoff
- Checks that prove behavior was preserved.
```

### Review Path

Use when the user asks for a review, audit, or critique.

Required behavior:

- Report findings first, ordered by severity.
- Include file and line references when reviewing code.
- Do not change files unless the user explicitly asks for fixes.

### Answer Path

Use when the user asks a conceptual or explanatory question.

Required behavior:

- Answer directly.
- Reference project documentation or code when relevant.
- Do not change files.

## Required Pipeline

```text
Feature Request
  -> Product Research (when the desired solution is unclear)
  -> Business Analysis
  -> Development
  -> QA / Testing
  -> Documentation & Release
```

Each stage receives a structured input and must produce a structured handoff for
the next stage.

## Optional Stage 0: Product Research

### Responsibility

The product researcher helps when the user can describe dissatisfaction,
friction, or a weak result, but cannot yet define the desired solution. This
stage explores alternatives and turns vague feedback into a small set of
actionable product directions. It must not edit code.

### Inputs

- User feedback in plain language.
- Screenshots or examples of what feels wrong, when available.
- Current project documentation.
- Current implementation, when needed to understand constraints.
- Comparable product patterns or external references, when useful.

### Required Checks

- What exactly feels wrong to the user?
- Is the problem visual, workflow-related, technical, content-related, or a
  mismatch with the product concept?
- What constraints must any solution preserve?
- What are 2-4 plausible directions?
- What are the tradeoffs between those directions?
- What would be a minimal experiment or prototype for each viable direction?
- What decision does the user need to make before Business Analysis can produce
  acceptance criteria?

### Output Format

```md
## Product Research Result

### Problem Framing
Short description of the dissatisfaction or weak result.

### Observations
- Concrete observations from screenshots, implementation, documentation, or
  references.

### Product Criteria
- Qualities the eventual solution should satisfy.

### Options
- Option name: what it changes, why it may help, and tradeoffs.

### Recommendation
The best next direction and why.

### Open Questions
- Questions that need user or product-owner input.

### Business Analysis Handoff
Concrete brief or decision needed before entering Business Analysis.
```

### Stop Conditions

The product researcher must stop before Business Analysis if:

- multiple viable directions remain and the choice is subjective;
- the problem depends on audience, pedagogy, brand, or domain knowledge that is
  not documented;
- no observable acceptance criteria can be written yet.

### Owner Decision Gate

Product Research may recommend a direction, but it must not silently promote a
subjective choice into implementation. If more than one viable option remains,
the owner must choose an option before Business Analysis starts.

### How To Invoke

Use this stage when the request sounds like:

- "I do not like this, but I do not know what I want."
- "Something feels wrong."
- "Suggest better approaches before implementation."
- "Research options first."
- "Do not code yet; help me decide."

## Stage 1: Business Analysis

### Responsibility

The business analyst turns the raw feature request into a clear implementation
brief. This stage decides whether the request is feasible as stated, whether it
conflicts with current behavior, and what the development agent should build.

### Inputs

- Raw feature request.
- Current project documentation.
- Current implementation, when needed to check feasibility.
- Known limitations from `PROJECT_CHANGES.md`.

### Required Checks

- What user problem does this solve?
- What exact user workflow changes?
- Does it conflict with existing behavior?
- Does it affect printing, A4 layout, build output, or static file usage?
- Does it require new dependencies?
- Is the request small enough to implement directly?
- What is explicitly out of scope?

### Output Format

```md
## Business Analysis Result

### Summary
Short description of the requested feature.

### User Story
As a <user>, I want <capability>, so that <outcome>.

### Scope
- What must be included.

### Out of Scope
- What must not be included in this iteration.

### Architecture Impact
- Files or modules likely affected.
- Dependencies, if any.
- Risk areas.

### Acceptance Criteria
- Observable, testable requirements.

### Developer Task
Concrete implementation instruction for the development stage.
```

### Stop Conditions

The business analyst must stop and request clarification if:

- the desired behavior is ambiguous;
- the request conflicts with a core project constraint;
- the feature requires product decisions that cannot be inferred;
- acceptance criteria cannot be written.

## Stage 2: Development

### Responsibility

The development agent implements the feature exactly within the approved scope.
It should prefer the existing project structure and avoid unrelated refactors.

### Inputs

- Business analysis result.
- Current codebase.
- Current architecture documentation.

### Required Checks

- Does the implementation match every acceptance criterion?
- Are changes limited to the necessary files?
- Does the implementation preserve current behavior outside the feature?
- Does the implementation avoid new dependencies unless approved?
- Does the implementation preserve print behavior when print is in scope or at
  risk?

### Output Format

```md
## Development Result

### Changed Files
- Files changed.

### Implementation Notes
- What was implemented and why.

### Known Risks
- Areas QA should inspect closely.

### QA Handoff
- Specific scenarios the QA stage should test.
```

### Stop Conditions

The development agent must stop or return to business analysis if:

- the brief is technically incomplete;
- implementation would exceed the approved scope;
- the codebase reveals a conflict not identified during analysis;
- a required dependency or architectural change was not approved.

## Stage 3: QA / Testing

### Responsibility

The QA agent verifies that the feature satisfies acceptance criteria and does not
regress existing behavior.

### Inputs

- Business analysis result.
- Development result.
- Current changed code.

### Required Checks

- Run project checks:

```bash
npm run lint
npm run build
```

- Verify each acceptance criterion.
- Check expected browser behavior manually when the feature affects UI.
- Check print/PDF behavior when the feature affects the sheet, layout, fonts, or
  print flow.
- Check important edge cases identified by the development handoff.

### Output Format

```md
## QA Result

### Automated Checks
- `npm run lint`: passed / failed
- `npm run build`: passed / failed

### Manual Checks
- Scenario: passed / failed / warning

### Issues
- [Severity] Description, file/area, reproduction if relevant.

### Verdict
Approved / Needs Fix / Blocked
```

### Verdict Rules

- `Approved` means the feature can move to documentation and release.
- `Needs Fix` means the work returns to the development stage.
- `Blocked` means QA cannot complete verification without missing information or
  an external change.

## Stage 4: Documentation & Release

### Responsibility

The documentation and release agent records the change, verifies final project
state, and prepares or performs the git release step.

### Inputs

- Approved QA result.
- Development result.
- Current documentation.

### Required Checks

- Update `PROJECT_CHANGES.md` for every user-visible or workflow-relevant
  feature.
- Update `ARCHITECTURE.md` when structure, state ownership, build flow, print
  flow, or major technical behavior changes.
- Update `README.md` only when quick start, project description, commands, or
  documentation navigation changes.
- Keep all documentation in English.
- Review `git diff` before committing.
- Do not commit generated build output unless explicitly required.

### Output Format

```md
## Release Result

### Documentation Updated
- Files updated.

### Verification
- Final checks run.

### Commit
Commit hash and message, if committed.

### Push
Remote branch and URL, if pushed.

### Status
Ready / Pushed / Blocked
```

## Feature Gates

### Gate 0: Owner Decision Gate

Research may enter Business Analysis only when the owner has selected a
direction or the recommendation is clearly non-subjective and low risk.

If the user says "choose for me", the agent may choose, but it must state the
assumption and the tradeoff.

### Gate 1: Analysis Gate

The feature may enter development only when the business analysis result has
clear scope, out-of-scope items, architecture impact, and acceptance criteria.

### Gate 2: Development Gate

The feature may enter QA only when the development result includes changed files,
implementation notes, known risks, and a QA handoff.

### Gate 3: QA Gate

The feature may enter release only when QA verdict is `Approved`.

### Gate 4: Release Gate

The feature may be committed and pushed only when required checks pass or the
release notes explicitly explain why a check could not be run.

## Default Git Flow

For small changes, work may happen directly on `main` when the owner explicitly
allows it.

For feature work, prefer:

```bash
git checkout -b feature/<short-name>
```

After implementation and verification:

```bash
npm run lint
npm run build
git add .
git commit -m "<imperative feature summary>"
git push -u origin feature/<short-name>
```

Merge back to `main` after review or owner approval.

## Default Quality Bar

Every feature should preserve:

- static build support;
- browser-only runtime;
- A4 print layout;
- existing default worksheet behavior;
- English documentation;
- clean `npm run lint`;
- clean `npm run build`.

Any exception must be called out in the handoff where it is introduced.

## Definition Of Done By Route

- Product Research is done when it produces criteria, options, tradeoffs, a
  recommendation, and a clear owner decision or Business Analysis handoff.
- Business Analysis is done when acceptance criteria are observable and the
  developer task is concrete.
- Development is done when the implementation matches the approved scope and the
  QA handoff identifies risk areas.
- QA is done when required automated checks and relevant manual checks are
  recorded with a verdict.
- Documentation & Release is done when relevant docs are updated, final state is
  reviewed, and commit/push status is clear.
- Documentation Fast Path is done when the documentation diff has been reviewed
  and skipped checks are justified.
- Review Path is done when findings, risks, and test gaps are reported without
  unrequested edits.
