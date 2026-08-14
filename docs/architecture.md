# Repository architecture

## Purpose

Schematics teaches agents to plan and explain technical work with durable documents and focused diagrams.
The repository distributes instructions and reference material.
It does not run the resulting plans.

## Canonical source

Each canonical skill lives in its own directory under `skills/`.

```text
skills/
├── explain-pr/
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   ├── assets/overview-canvas/
│   └── references/overview-format.md
├── recap-pr/
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   └── references/recap-format.md
└── visual-plan/
    ├── SKILL.md
    ├── agents/openai.yaml
    └── references/
```

Edit the owning skill directory directly.
Do not generate copies under `.claude/`, `.agents/`, `.codex/`, or another provider directory.
skills.sh and the Claude plugin consume the same canonical source.

## Distribution surfaces

### Agent Skills and skills.sh

skills.sh discovers each `skills/*/SKILL.md` directly.
The repository does not need a package manifest or installer.

### Claude Code

`.claude-plugin/plugin.json` defines the plugin identity.
`.claude-plugin/marketplace.json` makes the repository a Claude marketplace.
Claude Code discovers the canonical `skills/` directory at the plugin root.

Keep the version and description aligned in both manifests.

### Codex

Codex reads the standard `SKILL.md` through skills.sh installation.
`agents/openai.yaml` supplies optional Codex interface metadata.
Each sidecar describes its owning skill without copying the skill instructions.

## External dependency

`visual-plan` and the optional `recap-pr` change map use [Diagram Design](https://github.com/cathrynlavery/diagram-design) to create standalone HTML and SVG diagrams.
Do not vendor Diagram Design or copy its reference files into this repository.
Read its installed skill and the selected diagram-type references at execution time.

This boundary keeps visual composition in one maintained project and planning semantics in Schematics.

`explain-pr` uses its own small standalone browser asset because interactive search, focus, inspection, pan, zoom, and fit are part of that skill's output contract.
The asset is copied into the output directory and receives one PR-specific `overview-data.js` file.
It does not create a repository server or hosted application.

## Visual Plan output contract

The plan document is the source of truth.
Diagrams are companion views.

```text
docs/plans/YYYY-MM-DD-<short-name>/
├── plan.md
└── diagrams/
    └── <focused-view>.html
```

The plan owns context, scope, decisions, interfaces, execution, verification, risks, and sources.
Each diagram answers one reader question.

Optional click-to-read detail stays inside the standalone HTML file.
It uses native anchors and CSS `:target` by default.
It does not require JavaScript, a server, or a framework.

## Pull request output contracts

`recap-pr` creates `recap.md` and at most one optional static change map by default.
It is designed for fast author handoff or attachment.

`explain-pr` creates a multi-view standalone browser overview.
It uses distinct node forms for systems, services, APIs, stores, tables, flows, decisions, and evidence.
It keeps defects, severity, and merge recommendations outside the artifact.

Both pull request skills pin evidence to the current head when possible.
They separate CI state, local verification, and rollout state.

## Progressive disclosure

Each `SKILL.md` contains the execution path and non-negotiable quality rules.
Reference files contain detailed guidance that the agent reads only when needed.

- Read `plan-format.md` for every use.
- Read `composition.md` for every use.
- Read `visual-grammar.md` for engineering diagrams.
- Read `linked-details.md` only when the output needs selectable nodes.

Do not duplicate full reference content in `SKILL.md`.

## Explicit non-goals

- No repository-hosted canvas application.
- No React components.
- No semantic JSON schema.
- No repository-hosted renderer or development server.
- No repository CLI.
- No package manager.
- No generated distribution tree.
- No provider-specific instruction fork.
