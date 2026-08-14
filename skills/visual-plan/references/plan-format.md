# Plan document format

## Artifact layout

Use this layout unless the user or repository provides another convention:

```text
docs/plans/YYYY-MM-DD-<short-name>/
├── plan.md
├── index.html
├── app.css
├── app.js
├── canvas-data.js
├── canvas-manifest.json
└── views/
    ├── system-overview.html
    ├── api-surface.html
    └── relational-model.html
```

Create only the views that the plan needs.
Use a relative link from `plan.md` to `index.html` as the primary visual artifact.
Link each standalone view only when a reader benefits from opening it outside the canvas.

## Required plan structure

Use the following structure and remove sections that do not apply:

```markdown
# <Plan title>

**Status:** Draft | Approved | In progress | Done
**Last updated:** YYYY-MM-DD
**Owner:** <Only when known>

## Decision

State the proposed or approved outcome in one sentence.

## Context

State the current condition, problem, evidence, and important constraints.

## Scope

### In scope

- <Included outcome>

### Out of scope

- <Explicit non-goal>

## System model

Describe boundaries, internal subsystems, external systems, and important flows.
Link the interactive canvas when one exists.

## Interfaces and data

Describe changed APIs, events, stored data, and compatibility rules.
Name the canvas views that explain the API, data flow, or relational model.

## Execution plan

### Phase 1: <Outcome>

- [ ] <Concrete work item>
- [ ] <Concrete verification item>

**Exit condition:** <Observable result>

## Verification

- <Command, test, inspection, or measurable acceptance condition>

## Decisions

| Decision | Rationale | Consequence |
|---|---|---|
| <Choice> | <Why> | <Tradeoff> |

## Risks and open questions

| Item | Impact | Resolution or owner |
|---|---|---|
| <Risk or question> | <Why it matters> | <Next action> |

## Sources

- [<Source label>](<URL or repository-relative path>)
```

## Writing rules

State the decision before the mechanics.
Separate observed facts from assumptions.
Use one term for one concept.
Use checkboxes only for work with an observable completion condition.
Set status to `Done` only when evidence proves the exit conditions.
Add an owner only when the source or user provides one.
Use repository-relative file links and include line numbers when they help.
Use external URLs for current specifications, issues, and vendor documentation.
Keep implementation code out of the plan unless exact code is necessary to remove ambiguity.

## Plan-to-diagram traceability

Give each important component, endpoint family, table, decision, and risk one stable term.
Use that same term in the plan and every diagram.
Link from the plan section to the canvas view that explains it.
Make inspector titles and plan headings use the same stable terms.
