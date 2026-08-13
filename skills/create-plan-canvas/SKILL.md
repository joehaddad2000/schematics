---
name: create-plan-canvas
description: Create documented visual plans, architecture maps, API diagrams, data flows, and entity-relationship diagrams for complex product or engineering work. Use when a plan needs clear system boundaries, subsystems, external dependencies, endpoint contracts, visible table schemas, typed relationships, phased execution, clickable detail, or links to source evidence. Do not use for a trivial checklist, a quantitative chart, or a diagram that adds no information beyond the prose.
---

# Create Plan Canvas

Create a durable Markdown plan and a small set of focused Diagram Design views.
The plan is the source of truth.
The diagrams help the reader scan structure, boundaries, flow, and relationships.

## Workflow

1. Read [plan-format.md](references/plan-format.md) completely.
2. Read [composition.md](references/composition.md) completely.
3. Read [visual-grammar.md](references/visual-grammar.md) completely for architecture, API, integration, subsystem, database, or ERD work.
4. Inspect the available source material before you state the plan.
5. Write one sentence that states what the reader must understand or decide.
6. Create `docs/plans/YYYY-MM-DD-<short-name>/plan.md` unless the user or repository gives another location.
7. Complete and save the first plan draft before you load diagram-specific references.
8. Choose the smallest sufficient diagram set and create its files under `diagrams/` one view at a time.
9. Use the installed `$diagram-design` skill for every diagram.
10. Read Diagram Design's `SKILL.md`, shared output rules, style guide, and the selected diagram-type reference completely.
11. Keep scan-critical structure visible in each diagram.
12. Put rationale, caveats, contracts, acceptance criteria, and evidence in `plan.md`.
13. Read [linked-details.md](references/linked-details.md) only when the user needs clickable nodes or a compact inspector.
14. Run Diagram Design's self-check on every HTML file.
15. Inspect every view in a browser when browser access is available.
16. Add another view only when it answers a different reader question.
17. Revise the plan and diagrams until they agree.

## Authoring rules

- Use ASD-STE100 style for plan prose.
- Use short active sentences, one term for one concept, and no contractions.
- Keep exact code, identifiers, API paths, schema names, and quoted source text unchanged.
- Use one to four focused diagrams by default.
- Keep architecture and flow views at nine visible nodes or fewer.
- Keep an ER view at eight visible entities or fewer.
- Split overview, API, ERD, sequence, and deployment concerns when they answer different reader questions.
- Use distinct visual forms for tables, services, frontends, external systems, event streams, stores, decisions, and notes.
- Show system and trust boundaries before you place internal components.
- Prefer one API surface with visible route rows over one large box for every endpoint.
- Draw a real ERD when the request asks for data relationships.
- Show table names, relevant columns, data types, primary keys, foreign keys, and cardinality.
- Label directional connections with the artifact or action that moves across them.
- Link claims to repository files, issues, documents, or URLs when evidence exists.
- Do not invent status, owners, evidence, dates, or source locations.
- Do not create a custom schema, renderer, application, server, package, or build system for the plan.
- Do not add a diagram when a short table or paragraph communicates the same information better.

## Quality gate

Confirm all of the following before handoff:

- The plan states the decision or outcome first.
- The plan separates scope, system model, interfaces, execution, verification, risks, and sources.
- Every diagram answers one named reader question.
- The same terms and boundaries appear in the plan and diagrams.
- Tables do not look like services.
- External systems do not look internal.
- API inputs and outputs are visible or linked to exact plan sections.
- Foreign-key lines terminate at the correct entities and show cardinality.
- Labels do not clip or overlap at the initial browser size.
- Optional linked detail works with a pointer and a keyboard.
- The artifact contains no unsupported claims or decorative filler.

## Handoff

Return the plan path, diagram paths, source references used, and the checks that you performed.
State what remains uncertain.
Do not call the plan complete based only on file creation.
