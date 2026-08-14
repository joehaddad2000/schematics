# Pull request recap format

## Artifact layout

Use this layout unless the user provides another location:

```text
pr-recap/
├── recap.md
└── change-map.html
```

Create `change-map.html` only when it materially improves understanding.

## Required structure

Use the following structure and remove sections that do not apply:

```markdown
# PR #<number>: <title>

**State:** <Open | Draft | Merged | Closed>
**Base:** `<base>`
**Head:** `<head>@<short-sha>`
**Snapshot:** <timestamp>
**Scope:** <files, additions, deletions, commits>

## Outcome

State the result of the change in one sentence.

## Why this exists

Describe the old condition and the problem that this PR resolves.

## System change

Describe the important before and after boundaries.
Link the change map when one exists.

## Change slices

| Slice | What changes | Representative evidence |
|---|---|---|
| <Behavior or boundary> | <Concise explanation> | <Pinned file links> |

## Important flows

### <Flow name>

Describe the actor, entry point, domain behavior, durable state, and result.

## Data and API contract

Use compact tables for new or changed entities and routes.

## Reading guide

Give a numbered reading order.
Explain what behavior or contract each stop clarifies.

## Proof and readiness

### Implemented proof

List current checks, tests, migrations, rehearsals, or demonstrations with evidence.

### Remaining rollout

List operator work, deployment order, migration work, configuration, or external coordination that is not complete.

## Pull request state

State formal reviews, review requests, unresolved threads, comments, mergeability, and CI separately.

## Open questions and prerequisites

List explicit open decisions, rollout prerequisites, and material areas that the recap does not cover.

## Sources

Link the PR, head commit, checks, discussion, plan, and representative changed files.
```

## Size guidance

Keep the initial recap between 900 and 1,800 words for a large PR.
Use tables to compress inventories.
Link to detail instead of repeating long PR descriptions.

## Reading-order heuristic

Use this order when it fits:

1. Read the contract or plan that defines the intended behavior.
2. Read migrations and schema invariants.
3. Read domain state transitions and calculations.
4. Read transaction and persistence boundaries.
5. Read public or privileged API projections.
6. Read external integrations and scheduled jobs.
7. Read deployment configuration.
8. Read the highest-value behavior tests.
9. Read generated files last or skip them after generation checks pass.

## Status language

Use `passes current CI` for a green check.
Use `has no submitted review` when reviews are absent.
Use `mergeable at the snapshot time` for GitHub mergeability.
Use `rollout remains` for post-merge operator steps.
Do not use `ready`, `safe`, `approved`, or `production-ready` unless the evidence supports the exact term.

## Verification

Confirm all of the following before handoff:

- The headline explains the user or system outcome.
- The recap identifies the actual base and head SHA.
- File statistics separate generated content from authored implementation volume.
- Every change slice names representative evidence.
- The main runtime flows are traceable.
- Data and API contracts are visible when they changed.
- Pull request, CI, local verification, and rollout states remain separate.
- The reading guide reaches the main implementation before broad tests or generated files.
- Open decisions and operational prerequisites are explicit.
- No defect, finding, severity, merge recommendation, or suspected risk appears in the recap.
- The recap does not claim that the PR is correct, safe, approved, merged, or deployed without evidence.
