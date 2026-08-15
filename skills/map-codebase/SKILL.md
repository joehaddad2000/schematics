---
name: map-codebase
description: Create an evidence-backed, interactive map of a codebase or scoped subsystem with focused Diagram Design views in Schematics Canvas. Use when a reader needs to understand current architecture, module boundaries, runtime paths, APIs, data models, dependencies, entry points, or where to read next. Do not use for future-state planning, pull request explanation, code review, or a raw file or import graph.
---

# Map Codebase

Map how the current codebase or selected subsystem works.
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
11. Use the installed `$diagram-design` skill and its authoring workflow to create every standalone source view.
12. Add inspector markers and visible drill-down actions, write the manifest, build the artifact, and complete every verification check in the canvas format.
13. Recheck important claims against source before handoff.

## Non-negotiable boundaries

- Map observed current behavior, not a desired future state.
- Keep defects, severity, recommendations, and refactor proposals outside the canvas unless the user requests a separate artifact.
- Do not expose secrets, credentials, personal data, or `.env` contents.
- Use Diagram Design as the only visual renderer.
- Use the bundled Schematics Canvas without modifying or recreating its shell files.
- Do not add canvas coordinates, edges, or visual topology to the manifest.

## Handoff

Return the interactive canvas path, standalone view paths, repository scope, commit, working-tree state, source references used, and verification results.
State what the map covers and what it omits.
Report any review findings separately in chat, not in the canvas.
