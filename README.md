# Schematics

Schematics is a collection of agent skills for planning and explaining technical work with durable documents and interactive technical views.

The repository ships four focused skills:

- `visual-plan` creates a Markdown engineering plan and an interactive canvas of architecture, API, data-flow, sequence, or entity-relationship views.
- `map-codebase` creates an evidence-backed interactive map of a codebase or scoped subsystem with drill-down views.
- `recap-pr` creates a concise Markdown pull request recap and an optional static change map.
- `explain-pr` creates a neutral interactive pull request overview with clickable system, lifecycle, data, rollout, and evidence views.

Schematics uses [Diagram Design](https://github.com/cathrynlavery/diagram-design) as its only visual renderer.
The shared Schematics Canvas adds navigation, search, pan, zoom, selection, and a detail inspector around those diagrams.

The repository has no hosted application, development server, package manager, or framework runtime.
It ships one static browser shell and one Python standard-library builder as reusable skill resources.

## Output model

### Visual Plan

The default artifact uses this structure:

```text
docs/plans/YYYY-MM-DD-<short-name>/
├── plan.md
├── index.html
├── app.css
├── app.js
├── canvas-data.js
├── canvas-manifest.json
└── views/
    ├── system-overview.html
    ├── api-surface.html
    └── relational-model.html
```

`plan.md` is the source of truth.
`index.html` is the primary interactive reading surface.
Each file under `views/` is also a valid standalone Diagram Design artifact.

### Map Codebase

The codebase map uses a hierarchical interactive canvas:

```text
docs/codebase/<short-scope>/
├── index.html
├── app.css
├── app.js
├── canvas-data.js
├── canvas-manifest.json
└── views/
    ├── system-landscape.html
    ├── subsystem-map.html
    └── runtime-flow.html
```

The first view shows the current system boundary.
Visible drill-down actions inside overview boxes open focused subsystem, runtime, API, or data views.
The box body remains selectable for inspector detail.

### Recap PR

The quick recap uses this structure:

```text
pr-recap/
├── recap.md
└── change-map.html
```

The change map is optional and static.
Use `explain-pr` when the reader needs navigation, search, zoom, or clickable detail.

### Explain PR

The interactive overview uses the same shared canvas contract as Visual Plan:

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

The canvas explains the pull request without placing defects, severity, or merge recommendations in the artifact.
Possible review findings stay in chat unless the user requests a separate review artifact.

## Install with skills.sh

Install Diagram Design:

```bash
npx skills add cathrynlavery/diagram-design --skill diagram-design
```

Install the complete Schematics collection:

```bash
npx skills add joehaddad2000/schematics --skill '*'
```

Install one focused skill when required:

```bash
npx skills add joehaddad2000/schematics --skill visual-plan
npx skills add joehaddad2000/schematics --skill map-codebase
npx skills add joehaddad2000/schematics --skill recap-pr
npx skills add joehaddad2000/schematics --skill explain-pr
```

Target specific agents when required:

```bash
npx skills add joehaddad2000/schematics \
  --skill '*' \
  --agent claude-code codex
```

Use the current checkout during local development:

```bash
npx skills add . \
  --skill '*' \
  --agent claude-code codex \
  --copy
```

## Install as a Claude Code plugin

Add and install Diagram Design:

```text
/plugin marketplace add cathrynlavery/diagram-design
/plugin install diagram-design@diagram-design
```

Add and install Schematics:

```bash
claude plugin marketplace add joehaddad2000/schematics
claude plugin install schematics@schematics
```

Use `claude plugin marketplace add .` when testing the current checkout.

Claude Code exposes `/schematics:visual-plan`, `/schematics:map-codebase`, `/schematics:recap-pr`, and `/schematics:explain-pr`.
Claude can also invoke each skill automatically when a request matches its description.

## Use the skills

Create an interactive engineering plan:

```text
Use $visual-plan to plan a new checkout frontend, public API, order backend, and relational data model.
Show internal and external systems, API inputs and outputs, and a real ERD.
```

Map a codebase or one subsystem:

```text
Use $map-codebase to map this repository as a system.
Show internal and external boundaries, the primary runtime path, and drill-down views for important subsystems.
```

Create a quick pull request handoff:

```text
Use $recap-pr to summarize this pull request and create a static change map when it helps.
```

Create the complete interactive explanation:

```text
Use $explain-pr to explain this pull request with a neutral clickable overview.
```

## How the shared canvas works

Each source view is created by Diagram Design.
The agent adds stable `data-schematic-id` attributes to meaningful SVG groups and records their inspector detail in `canvas-manifest.json`.

The bundled builder then:

1. Validates the manifest and diagram markers.
2. Extracts the marked Diagram Design SVG from each standalone source.
3. Embeds each SVG into the static canvas data.
4. Copies the shared shell beside the manifest.

The manifest does not contain coordinates, edges, or visual topology.
Diagram Design remains the only source of visual structure.
Nested `data-schematic-view` actions connect overview boxes to focused views without replacing inspector selection.

The complete contract is in [Schematics Canvas format](shared/schematics-canvas/references/canvas-format.md).

## Design rules

- Write the plan or explanation before polishing its views.
- State the decision or outcome before implementation mechanics.
- Use a small set of focused views instead of one large diagram.
- Use explicit drill-down actions when an overview boundary has a focused subsystem, flow, API, or data view.
- Use different visual forms for tables, services, frontends, external systems, streams, stores, decisions, and notes.
- Draw real table rows, keys, foreign keys, and cardinality for an ERD.
- Use one compact API surface with route rows unless topology requires separate endpoint nodes.
- Keep rationale, acceptance criteria, risks, and evidence in the document or inspector.
- Use ASD-STE100 principles for plan and explanatory prose.
- Preserve exact technical identifiers.
- Do not add a second renderer, node schema, edge schema, or coordinate model.
- Keep pull request explanation artifacts descriptive and neutral.
- Keep codebase maps descriptive, source-backed, and separate from code review.
- Pin pull request source links to the current head SHA when possible.
- Separate CI state, local verification, and rollout state.

## Repository structure

```text
schematics/
├── .claude-plugin/
├── .github/workflows/
├── docs/
├── shared/
│   └── schematics-canvas/
│       ├── assets/schematics-canvas/
│       ├── references/canvas-format.md
│       └── scripts/build_canvas.py
├── skills/
│   ├── explain-pr/
│   ├── map-codebase/
│   ├── recap-pr/
│   └── visual-plan/
├── .gitignore
└── README.md
```

Each user-facing skill remains canonical under `skills/`.
The three interactive skills link to one canonical canvas resource under `shared/`.
skills.sh dereferences those internal links when it copies an individual skill, so each installed skill remains self-contained.

## Validate changes

Check skills.sh discovery:

```bash
npx skills add . --list
```

Validate each skill:

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py skills/visual-plan
python3 /path/to/skill-creator/scripts/quick_validate.py skills/map-codebase
python3 /path/to/skill-creator/scripts/quick_validate.py skills/recap-pr
python3 /path/to/skill-creator/scripts/quick_validate.py skills/explain-pr
```

Validate the Claude plugin and marketplace:

```bash
claude plugin validate . --strict
```

Check the reusable code:

```bash
python3 -m py_compile shared/schematics-canvas/scripts/build_canvas.py
node --check shared/schematics-canvas/assets/schematics-canvas/app.js
```

Start with the [documentation index](docs/README.md) for maintainer guidance and project decisions.
