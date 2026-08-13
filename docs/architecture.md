# Repository architecture

## Purpose

Canvas Blocks teaches an agent to create documented visual plans.
The repository distributes instructions and reference material.
It does not run the resulting plans.

## Canonical source

The canonical skill lives at `skills/create-plan-canvas/`.

```text
skills/create-plan-canvas/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── composition.md
    ├── linked-details.md
    ├── plan-format.md
    └── visual-grammar.md
```

Edit this directory directly.
Do not generate copies under `.claude/`, `.agents/`, `.codex/`, or another provider directory.
skills.sh and the Claude plugin consume the same canonical source.

## Distribution surfaces

### Agent Skills and skills.sh

skills.sh discovers `skills/create-plan-canvas/SKILL.md` directly.
The repository does not need a package manifest or installer.

### Claude Code

`.claude-plugin/plugin.json` defines the plugin identity.
`.claude-plugin/marketplace.json` makes the repository a Claude marketplace.
Claude Code discovers the canonical `skills/` directory at the plugin root.

Keep the version and description aligned in both manifests.

### Codex

Codex reads the standard `SKILL.md` through skills.sh installation.
`agents/openai.yaml` supplies optional Codex interface metadata.
It does not contain a second copy of the skill instructions.

## External dependency

The skill uses [Diagram Design](https://github.com/cathrynlavery/diagram-design) to create standalone HTML and SVG diagrams.
Do not vendor Diagram Design or copy its reference files into this repository.
Read its installed skill and the selected diagram-type references at execution time.

This boundary keeps visual composition in one maintained project and planning semantics in Canvas Blocks.

## Output contract

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

## Progressive disclosure

`SKILL.md` contains the execution path and non-negotiable quality rules.
Reference files contain detailed guidance that the agent reads only when needed.

- Read `plan-format.md` for every use.
- Read `composition.md` for every use.
- Read `visual-grammar.md` for engineering diagrams.
- Read `linked-details.md` only when the output needs selectable nodes.

Do not duplicate full reference content in `SKILL.md`.

## Explicit non-goals

- No canvas application.
- No React components.
- No semantic JSON schema.
- No renderer or development server.
- No repository CLI.
- No package manager.
- No generated distribution tree.
- No provider-specific instruction fork.
