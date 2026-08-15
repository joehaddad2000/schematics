---
name: explain-codebase
description: Create an evidence-backed, interactive visual explanation of a codebase or scoped subsystem with focused Diagram Design views in Schematics Canvas. Use when a reader needs to understand current architecture, module boundaries, runtime paths, APIs, data models, dependencies, entry points, or where to read next. Do not use for future-state planning, pull request explanation, code review, or a raw file or import graph.
---

# Explain Codebase

Explain how the current codebase or selected subsystem works.
Make the interactive canvas useful before the reader opens the source.

## Workflow

1. Read [codebase-format.md](references/codebase-format.md) completely and treat it as the codebase-specific artifact specification.
2. Read [canvas-format.md](references/canvas-format.md) completely and treat it as the shared interaction specification.
3. Resolve the repository root, requested scope, current branch, HEAD commit, upstream, and working-tree state.
4. State the scope in one sentence.
5. Exclude dependencies, generated output, caches, vendored code, and secrets from inspection.
6. Read architecture documents and manifests, then verify their claims against current code and configuration.
7. Identify entry points, public interfaces, runtime registration, storage boundaries, external systems, and important shared modules.
8. Trace the smallest set of runtime paths that explains the scope.
9. Record exact evidence paths and line references while you inspect.
10. Choose the smallest sufficient hierarchical view set from the codebase format.
11. Use the installed `$diagram-design` skill to create every standalone source view under `views/`.
12. Read Diagram Design's `SKILL.md`, `references/output-spec.md`, `references/style-guide.md`, and the selected diagram-type references completely.
13. Add the Schematics embed markers and stable `data-schematic-id` attributes from the canvas format.
14. Add visible `data-schematic-view` actions where an overview box must open a subsystem or focused flow.
15. Put file paths, responsibilities, contracts, caveats, and source links in inspector detail.
16. Write `canvas-manifest.json` and run the bundled canvas builder.
17. Run Diagram Design's self-check on every source view.
18. Inspect the complete canvas and every standalone view when a callable browser-control runtime is available.
19. Recheck important claims against source before handoff.

## Explanation rules

- Explain observed current behavior, not a desired future state.
- Use runtime responsibilities and domain boundaries as diagram nodes.
- Keep files, classes, and functions in inspector detail unless they are true public interfaces or entry points.
- Use one to five focused views.
- Make each view answer one named reader question.
- Use explicit drill-down actions to move from a system boundary into subsystem, flow, API, or data views.
- Keep overview boxes selectable for detail even when they contain a drill-down action.
- Preserve exact identifiers, routes, event names, table names, configuration keys, and file paths.
- Link every important component and relationship to source evidence when possible.
- Mark an inference as an inference.
- State when a path is representative instead of exhaustive.
- Separate external systems, processes, packages, modules, stores, queues, and tables with distinct visual forms.
- Draw a real ERD only when persistent relationships are important to the requested scope.
- Use Diagram Design as the only visual renderer.
- Use the bundled Schematics Canvas without modifying or recreating its shell files.
- Do not add canvas coordinates, edges, or visual topology to the manifest.
- When browser control is not callable, complete all static checks and state that visual and interaction checks remain unverified.
- Do not expose secrets, credentials, personal data, or `.env` contents.
- Do not turn the artifact into a code review.
- Keep defects, severity, recommendations, and refactor proposals outside the canvas unless the user requests a separate artifact.
- Use short direct sentences and ASD-STE100 principles when practical.

## Quality gate

Confirm all of the following before handoff:

- The title and first view state the inspected scope.
- The artifact records branch, commit, and working-tree state.
- Every visible relationship has source or configuration evidence.
- The first view explains the system without requiring file-level knowledge.
- Runtime paths show inputs, boundaries, durable state, external calls, and outputs when they are relevant.
- The canvas does not imply full coverage when the inspection was sampled.
- Files and imports do not replace architectural concepts.
- The artifact contains no review finding or unsupported claim.
- The artifact satisfies every build and interaction check in `references/canvas-format.md`.

## Handoff

Return the interactive canvas path, standalone view paths, repository scope, commit, working-tree state, source references used, and verification results.
State what the explanation covers and what it omits.
Report any review findings separately in chat, not in the canvas.
