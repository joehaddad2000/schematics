# Canvas Blocks

Canvas Blocks is an agent skill for creating documented visual plans.
It turns complex product or engineering work into one durable Markdown plan and a small set of focused architecture, API, data-flow, sequence, or entity-relationship diagrams.

The repository contains no application runtime.
It has no custom schema, renderer, server, CLI, package manager, or build step.

## What the skill produces

The default artifact uses this structure:

```text
docs/plans/YYYY-MM-DD-<short-name>/
├── plan.md
└── diagrams/
    ├── system-overview.html
    ├── api-surface.html
    └── relational-model.html
```

`plan.md` is the source of truth.
The standalone HTML diagrams help readers scan system boundaries, interfaces, flows, and relationships.
The skill uses [Diagram Design](https://github.com/cathrynlavery/diagram-design) for visual composition.

## Install with skills.sh

Install the Diagram Design dependency first:

```bash
npx skills add cathrynlavery/diagram-design --skill diagram-design
```

Install Canvas Blocks from GitHub:

```bash
npx skills add joehaddad2000/canvas-blocks --skill create-plan-canvas
```

Target specific agents when required:

```bash
npx skills add joehaddad2000/canvas-blocks \
  --skill create-plan-canvas \
  --agent claude-code codex
```

Use the current checkout during local development:

```bash
npx skills add . \
  --skill create-plan-canvas \
  --agent claude-code codex
```

## Install as a Claude Code plugin

Add and install Diagram Design:

```text
/plugin marketplace add cathrynlavery/diagram-design
/plugin install diagram-design@diagram-design
```

Add and install Canvas Blocks from GitHub:

```bash
claude plugin marketplace add joehaddad2000/canvas-blocks
claude plugin install canvas-blocks@canvas-blocks
```

Use `claude plugin marketplace add .` when testing the current checkout.

Claude Code exposes the skill under the plugin namespace as `/canvas-blocks:create-plan-canvas`.
Claude can also invoke it automatically when the request matches the skill description.

## Use the skill

Ask the agent in natural language:

```text
Create a plan canvas for a new checkout frontend, public API, order backend, and relational data model.
Show internal and external systems, API inputs and outputs, and a real ERD.
```

You can also invoke it explicitly:

```text
Use $create-plan-canvas to document this migration with an architecture view and an ERD.
```

In Claude Code plugin form, use:

```text
/canvas-blocks:create-plan-canvas Plan this API and database change.
```

## Design rules

- Write the plan before polishing the diagrams.
- State the decision or outcome before implementation mechanics.
- Use one to four focused diagrams instead of one large diagram.
- Use different visual forms for tables, services, frontends, external systems, streams, stores, decisions, and notes.
- Draw real table rows, keys, foreign keys, and cardinality for an ERD.
- Use one compact API surface with route rows unless topology requires separate endpoint nodes.
- Keep rationale, acceptance criteria, risks, and evidence in the Markdown plan.
- Use native HTML anchors and CSS for optional click-to-read detail.
- Do not add a framework or runtime for interaction.
- Use ASD-STE100 style for plan prose and preserve exact technical identifiers.

The complete workflow is in [SKILL.md](skills/create-plan-canvas/SKILL.md).
The output contract is in [plan-format.md](skills/create-plan-canvas/references/plan-format.md).

## Repository structure

```text
canvas-blocks/
├── .claude-plugin/
│   ├── marketplace.json
│   └── plugin.json
├── .github/workflows/
│   └── validate.yml
├── docs/
│   ├── README.md
│   ├── architecture.md
│   ├── development.md
│   └── project-plan.md
├── skills/
│   └── create-plan-canvas/
│       ├── SKILL.md
│       ├── agents/openai.yaml
│       └── references/
│           ├── composition.md
│           ├── linked-details.md
│           ├── plan-format.md
│           └── visual-grammar.md
├── .gitignore
└── README.md
```

The `skills/create-plan-canvas/` directory is the only skill source.
Claude Code, Codex, and skills.sh consume that same directory.
The repository does not generate or maintain provider-specific copies.

## Validate changes

Check skills.sh discovery:

```bash
npx skills add . --list
```

Validate the skill frontmatter with the local skill validator:

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py \
  skills/create-plan-canvas
```

Validate the Claude plugin and marketplace:

```bash
claude plugin validate . --strict
```

Test local plugin loading:

```bash
claude --plugin-dir .
```

## Project decisions

Start with the [documentation index](docs/README.md).
The repository architecture is in [docs/architecture.md](docs/architecture.md).
The maintainer workflow is in [docs/development.md](docs/development.md).
The repository research and simplification decisions are in [docs/project-plan.md](docs/project-plan.md).
