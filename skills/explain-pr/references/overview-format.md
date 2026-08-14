# Interactive PR overview format

## Output

Create this structure unless the user gives another location:

```text
pr-overview/
├── index.html
├── app.css
├── app.js
└── overview-data.js
```

Copy `index.html`, `app.css`, and `app.js` from `assets/overview-canvas/`.
Write only the PR-specific content in `overview-data.js`.

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

## Data object

Define `window.OVERVIEW_DATA` with this shape:

```js
window.OVERVIEW_DATA = {
  meta: {
    repository: "owner/repository",
    number: 123,
    title: "Pull request title",
    url: "https://github.com/owner/repository/pull/123",
    base: "full base sha",
    head: "full head sha",
    badge: "Interactive overview",
    badgeTone: "good",
    snapshot: "ISO timestamp",
    summary: [
      { label: "Changed files", value: "42" },
      { label: "Checks", value: "Passing", tone: "good" }
    ]
  },
  views: [
    {
      id: "overview",
      label: "Overview",
      question: "What changed, and how does it fit together?",
      nodes: [
        {
          id: "outcome",
          kind: "summary",
          x: 120,
          y: 120,
          w: 320,
          title: "Outcome",
          eyebrow: "System change",
          summary: "Short visible summary.",
          detail: ["Inspector paragraph one.", "Inspector paragraph two."],
          tags: ["overview"],
          status: "implemented",
          tone: "good",
          links: [{ label: "Source", href: "$source/src/service.ts#L10-L40" }],
          focusRelated: ["non-edge-association"]
        }
      ],
      edges: [
        { from: "outcome", to: "service-one", label: "implemented by" }
      ]
    }
  ]
};
```

Use stable IDs within the artifact.
Keep node coordinates on a 20px grid.
Use `detail` for complete context and `summary` for scan text.
Use `tone` for an explicit `good`, `warn`, or `danger` status color.
Do not infer a color from free-form status text.
The viewer derives focused neighbors from `edges`.
Use `focusRelated` only for an important association that is not already an edge.

## Links

Use `meta.url` as the canonical pull request URL.
Use `$pr` for the pull request and `$pr/files` for its file view.
Use `$source/<path>#<lines>` for a repository file pinned to `meta.head`.
Use a full `https://` URL only for an external source.

## Layout checks

- Keep the visible graph near 1,300 world pixels wide when practical.
- Use multiple rows instead of one long horizontal chain.
- Leave enough space between nodes for the complete edge label.
- Shorten an edge label when the full phrase cannot fit cleanly.
- Remove a nonessential edge when it would cross an unrelated node.
- Increase a node height or reduce visible copy when its content clips.
- Keep full explanations in the inspector instead of shrinking the whole view.
- At compact widths, prefer a readable initial zoom with pan over an illegible full-graph fit.
- Inspect every view at 1280 by 900 and 520 by 700 before handoff.

## Node kinds

| Kind | Use |
|---|---|
| `summary` | Outcome, scope, or orientation |
| `decision` | Product, architecture, or rollout choice |
| `service` | Internal or product service |
| `external` | External actor or system |
| `api` | Compact API surface |
| `store` | Database or durable store |
| `table` | Relational table or table family |
| `flow` | State transition or lifecycle step |
| `evidence` | Test, check, source, or rollout state |

Do not add `finding`, `risk`, or severity concepts to the overview schema.

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
- No node overlaps another node.
- No edge label overlaps a node.
- No connector crosses an unrelated node.
- No card clips or scrolls its content.
- Every view is readable at 1280 by 900 and 520 by 700.
- View switching, search, node selection, inspector links, pan, zoom, fit, background deselection, and keyboard access work.
- Essential information does not depend on hover.
- Explanatory copy uses short direct sentences and ASD-STE-100 principles when practical.
