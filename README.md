# Schematics

Schematics is a collection of agent skills for planning and explaining technical work with durable documents and focused diagrams.

The repository ships three focused skills:

- `visual-plan` turns complex product or engineering work into one Markdown plan and a small set of architecture, API, data-flow, sequence, or entity-relationship views.
- `recap-pr` creates a concise Markdown pull request recap and an optional static change map.
- `explain-pr` creates a neutral interactive pull request overview with clickable system, lifecycle, data, product-boundary, rollout, and evidence views.

The repository contains no application runtime.
It has no server, CLI, package manager, or build step.
The only browser code is the standalone canvas asset bundled inside `explain-pr`.

## What the skills produce

### Visual Plan

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

### Recap PR

The quick recap uses this structure:

```text
pr-recap/
├── recap.md
└── change-map.html
```

The change map is optional.
The recap stays descriptive and keeps code-review findings outside the artifact.

### Explain PR

The interactive overview uses this structure:

```text
pr-overview/
├── index.html
├── app.css
├── app.js
└── overview-data.js
```

The skill copies a standalone browser asset and writes one head-pinned data file for the pull request.
The canvas supports focused views, search, clickable nodes, source links, pan, zoom, fit, and background deselection.
It explains the change without placing defects, severity, or merge recommendations in the artifact.

## Install with skills.sh

Install the Diagram Design dependency first:

```bash
npx skills add cathrynlavery/diagram-design --skill diagram-design
```

Install a skill from GitHub:

```bash
npx skills add joehaddad2000/schematics --skill visual-plan
npx skills add joehaddad2000/schematics --skill recap-pr
npx skills add joehaddad2000/schematics --skill explain-pr
```

Target specific agents when required:

```bash
npx skills add joehaddad2000/schematics \
  --skill explain-pr \
  --agent claude-code codex
```

Use the current checkout during local development:

```bash
npx skills add . \
  --skill explain-pr \
  --agent claude-code codex
```

## Install as a Claude Code plugin

Add and install Diagram Design:

```text
/plugin marketplace add cathrynlavery/diagram-design
/plugin install diagram-design@diagram-design
```

Add and install Schematics from GitHub:

```bash
claude plugin marketplace add joehaddad2000/schematics
claude plugin install schematics@schematics
```

Use `claude plugin marketplace add .` when testing the current checkout.

Claude Code exposes the skills as `/schematics:visual-plan`, `/schematics:recap-pr`, and `/schematics:explain-pr`.
Claude can also invoke them automatically when a request matches a skill description.

## Use the skills

Ask the agent in natural language:

```text
Create a visual plan for a new checkout frontend, public API, order backend, and relational data model.
Show internal and external systems, API inputs and outputs, and a real ERD.
```

You can also invoke it explicitly:

```text
Use $visual-plan to document this migration with an architecture view and an ERD.
```

Ask for a quick pull request recap:

```text
Use $recap-pr to summarize this pull request and create a static change map when it helps.
```

Ask for the complete interactive explanation:

```text
Use $explain-pr to explain this pull request with a neutral clickable overview.
```

In Claude Code plugin form, use:

```text
/schematics:visual-plan Plan this API and database change.
/schematics:recap-pr Recap this pull request.
/schematics:explain-pr Explain this pull request interactively.
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
- Keep pull request explanation artifacts descriptive and neutral.
- Report possible defects separately in chat unless the user requests a separate review artifact.
- Pin pull request source links to the current head SHA when possible.
- Separate CI state, local verification, and rollout state.

The complete workflows are in [Visual Plan](skills/visual-plan/SKILL.md), [Recap PR](skills/recap-pr/SKILL.md), and [Explain PR](skills/explain-pr/SKILL.md).
Each skill owns its output contract in its `references/` directory.

## Repository structure

```text
schematics/
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
│   ├── explain-pr/
│   │   ├── SKILL.md
│   │   ├── agents/openai.yaml
│   │   ├── assets/overview-canvas/
│   │   └── references/overview-format.md
│   ├── recap-pr/
│   │   ├── SKILL.md
│   │   ├── agents/openai.yaml
│   │   └── references/recap-format.md
│   └── visual-plan/
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

Each directory under `skills/` is a canonical skill source.
Claude Code, Codex, and skills.sh consume those same directories.
The repository does not generate or maintain provider-specific copies.

Future skills can add code explanation and other focused technical views without changing the existing skill contracts.

## Validate changes

Check skills.sh discovery:

```bash
npx skills add . --list
```

Validate the skill frontmatter files with the local skill validator:

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py \
  skills/visual-plan
python3 /path/to/skill-creator/scripts/quick_validate.py \
  skills/recap-pr
python3 /path/to/skill-creator/scripts/quick_validate.py \
  skills/explain-pr
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
