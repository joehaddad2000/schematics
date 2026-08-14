# Repository architecture

## Purpose

Schematics teaches agents to plan and explain technical work with durable documents and focused technical views.
It distributes three Agent Skills and one shared static interaction shell.

## Product boundary

Schematics has two visual layers with separate ownership:

| Layer | Owner | Responsibility |
|---|---|---|
| Diagram view | Diagram Design | SVG structure, node forms, layout, connectors, typography, and visual QA. |
| Interactive shell | Schematics Canvas | View navigation, search, pan, zoom, selection, inspector detail, and artifact links. |

Do not draw nodes or edges in Schematics Canvas.
Do not add canvas navigation or a second inspector inside a Diagram Design view.

## Canonical source

Each user-facing skill lives under `skills/`.

```text
skills/
├── explain-pr/
├── recap-pr/
└── visual-plan/
```

The shared canvas source lives once under `shared/schematics-canvas/`.

```text
shared/schematics-canvas/
├── assets/schematics-canvas/
│   ├── index.html
│   ├── app.css
│   └── app.js
├── references/canvas-format.md
└── scripts/build_canvas.py
```

`visual-plan` and `explain-pr` contain repository-relative links to the shared asset, reference, and builder.
The links resolve inside the Claude plugin root.
skills.sh dereferences them when it copies one skill so the installed skill is self-contained.

Do not create hand-maintained copies of the shared canvas under each skill.

## Distribution surfaces

### skills.sh and Agent Skills

skills.sh discovers each `skills/*/SKILL.md` directly.
The repository does not need a package manifest or custom installer.

### Claude Code

`.claude-plugin/plugin.json` defines the plugin identity.
`.claude-plugin/marketplace.json` makes the repository a Claude marketplace.
Claude Code discovers the canonical `skills/` directory at the plugin root.

### Codex

Codex reads the standard `SKILL.md` through skills.sh installation.
`agents/openai.yaml` supplies optional Codex interface metadata.

## External dependency

All technical views use [Diagram Design](https://github.com/cathrynlavery/diagram-design).
Do not vendor Diagram Design or copy its references into this repository.
Read its installed skill and selected type references during artifact authoring.

This keeps visual composition in one maintained project and planning or explanation semantics in Schematics.

## Interactive artifact contract

The author writes `canvas-manifest.json` and standalone Diagram Design files under `views/`.
Each interactive SVG group has one stable `data-schematic-id`.
The manifest gives that ID its inspector text and source links.

The builder validates the mapping, extracts each marked SVG, and creates `canvas-data.js`.
The generated shell remains static and works without a repository server or framework.

The standalone Diagram Design files remain available beside the canvas.
The shell loads embedded SVG documents from `canvas-data.js` so local file viewing does not require cross-file fetch access.

## Skill output contracts

`visual-plan` creates a Markdown plan, an interactive canvas, and standalone views.
The plan remains the source of truth.

`recap-pr` creates a Markdown recap and at most one optional static Diagram Design map.
It stays optimized for quick handoff or attachment.

`explain-pr` creates a multi-view interactive canvas.
It keeps defects, severity, and merge recommendations outside the artifact.

## Progressive disclosure

Each `SKILL.md` contains its execution path and non-negotiable rules.
Reference files contain details that load only when needed.

The shared canvas format is linked into both interactive skills so one canonical contract governs the shell.

## Explicit non-goals

- No repository-hosted viewer.
- No React components.
- No node or edge renderer in Schematics Canvas.
- No duplicate visual-topology schema.
- No development server.
- No package manager.
- No generated provider-specific skill tree.
- No vendored Diagram Design copy.
