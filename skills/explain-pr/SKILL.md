---
name: explain-pr
description: Create an evidence-backed, interactive overview of a pull request with focused Diagram Design views in Schematics Canvas. Use when a reader needs to understand a large or unfamiliar PR through clickable views of its purpose, system boundaries, runtime flows, data model, API surface, lifecycle, rollout, and proof. Do not use this skill to perform a code review or place defects, findings, severity, or merge recommendations in the canvas.
---

# Explain PR

Explain what the pull request changes and how the resulting system works.
Make the interactive canvas useful before the reader opens the diff.

## Workflow

1. Read [overview-format.md](references/overview-format.md) completely and treat it as the PR-specific artifact specification.
2. Read [canvas-format.md](references/canvas-format.md) completely and treat it as the shared interaction specification.
3. Resolve the repository, PR number, base SHA, head SHA, and current PR state.
4. Read the title, body, commits, discussion, changed files, and checks.
5. Separate production code, migrations, generated files, tests, documentation, and deployment changes.
6. Inspect the base and head behavior for each important change slice.
7. Trace public inputs through authorization, domain rules, storage, external services, and outputs.
8. Identify the system boundaries, lifecycle, data relationships, API contracts, and rollout order that explain the change.
9. Reuse an existing head-pinned evidence snapshot when one is available for the same PR head.
10. Use the installed `$diagram-design` skill to create every standalone source view under `views/`.
11. Add the Schematics embed markers and stable `data-schematic-id` attributes from the canvas format.
12. Write `canvas-manifest.json` and run the bundled canvas builder.
13. Validate every view and interaction against both reference specifications.
14. Refresh PR state and checks immediately before handoff.

## Separation from review

- Keep the canvas descriptive and neutral.
- Do not include defects, findings, severity, merge recommendations, review comments, or suspected risks in the canvas.
- Do not turn an architectural choice into a warning node.
- If source inspection reveals a possible defect, report it separately in chat under `Separate review notes`.
- Keep separate review notes outside the artifact even when the issue affects a diagrammed component.
- Add findings to an artifact only when the user explicitly requests a separate review artifact.

## Evidence rules

- Distinguish source evidence from author claims.
- Pin source links to the head SHA when possible.
- State base and head SHA in the artifact.
- Separate CI state, local verification, and rollout state.
- Do not infer correctness, approval, or deployment from green CI.
- Treat generated line counts separately from authored implementation volume.
- Preserve exact identifiers, paths, routes, table names, and error codes.

## Handoff

Return the interactive overview URL or path, any companion recap path, the PR URL, the head SHA, and the verification results.
State what the overview covers and what it omits.
Report any review findings separately in chat, not in the canvas.
