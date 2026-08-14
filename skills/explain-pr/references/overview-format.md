# Interactive PR overview format

## Output

Create this structure unless the user gives another location:

```text
pr-overview/
├── index.html
├── app.css
├── app.js
├── canvas-data.js
├── canvas-manifest.json
└── views/
    └── <focused-view>.html
```

Follow [canvas-format.md](canvas-format.md) for the shared manifest, Diagram Design marker, build, and interaction contract.
Do not draw cards or connections in the canvas manifest.
Create every visible topology as a Diagram Design source view.

## Required views

### Overview

Show the outcome, change size, current PR state, change slices, and the shortest useful reading path.

### System change

Show the post-change boundaries and primary runtime paths.
Do not use individual files as architecture nodes.

### Lifecycle

Show important state transitions, publication points, and durable facts.

### Data model

Use real table forms and explicit relationship labels.
Show primary and foreign keys that explain the change.

### Status and evidence

Show checks, local verification, generated volume, rollout prerequisites, and author-reported evidence as distinct states.

## Optional views

Add a view when it answers a separate explanation question:

- Product boundary: What can the product-facing service read or expose?
- API surface: Which inputs, outputs, and errors changed?
- Rollout: What must happen before and after merge?
- Before and after: Which old workflow does the PR replace?

## Links

Set `$pr` to the canonical pull request URL in `meta.linkBases`.
Set `$source` to the repository blob URL pinned to the current head SHA.
Use `$pr/files` for the pull request file view.
Use `$source/<path>#<lines>` for a pinned repository file.
Use a full `https://` URL only for an external source.

## Layout checks

- Follow Diagram Design's size, density, connector, and type rules for every source view.
- Keep full explanations in the manifest inspector detail instead of shrinking the visual view.
- At compact widths, prefer a readable initial zoom with pan over an illegible full-graph fit.
- Inspect every view at 1280 by 900 and 520 by 700 before handoff.

## Evidence states

Use separate nodes for:

- GitHub checks.
- Local gates.
- Author-reported evidence.
- Generated file volume.
- Rollout prerequisites.

This separation prevents a green check from looking like deployment proof.

## Verification

Confirm all of the following before handoff:

- The artifact is pinned to the current PR head.
- The first view explains the outcome without judging merge readiness.
- The main runtime flows are traceable.
- Data and API contracts are visible when they changed.
- Generated file volume is separate from authored implementation volume.
- CI, local verification, and rollout state remain separate.
- No finding, severity, recommendation, or review conclusion appears in the canvas.
- Every source view passes Diagram Design's self-check and visual inspection.
- The artifact satisfies every build and interaction check in `references/canvas-format.md`.
- Explanatory copy uses short direct sentences and ASD-STE100 principles when practical.
