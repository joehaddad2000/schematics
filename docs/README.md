# Schematics documentation

This directory explains the skill collection, shared canvas boundary, and maintainer workflow.

## Read order

1. Read [architecture.md](architecture.md) to understand the source-of-truth and distribution boundaries.
2. Read [development.md](development.md) before you edit a skill, shared canvas resource, or manifest.
3. Read [project-plan.md](project-plan.md) for the research baseline and product decisions.
4. Read the affected `SKILL.md` and only the references needed for the current change.
5. Read [canvas-format.md](../shared/schematics-canvas/references/canvas-format.md) when a change affects interactive artifacts.

## Core rule

Schematics is a skill repository with one reusable static canvas resource.
It is not a hosted application repository.

Diagram Design owns visual rendering.
Schematics Canvas owns navigation and interaction.
The canvas manifest must not duplicate diagram coordinates, edges, or topology.

## Documentation ownership

| Document | Purpose |
|---|---|
| `README.md` | User-facing installation, use, structure, and validation. |
| `docs/architecture.md` | Stable repository and output architecture. |
| `docs/development.md` | Maintainer workflow and validation commands. |
| `docs/project-plan.md` | Research record and product decisions. |
| `shared/schematics-canvas/references/canvas-format.md` | Shared interactive artifact contract. |
| `skills/visual-plan/SKILL.md` | Visual Plan workflow and quality gate. |
| `skills/visual-plan/references/*.md` | Detailed plan and engineering-diagram guidance. |
| `skills/map-codebase/SKILL.md` | Interactive codebase and subsystem mapping workflow. |
| `skills/map-codebase/references/*.md` | Codebase scope, evidence, hierarchy, and view rules. |
| `skills/recap-pr/SKILL.md` | Static pull request recap workflow. |
| `skills/recap-pr/references/*.md` | Static recap format and verification contract. |
| `skills/explain-pr/SKILL.md` | Interactive pull request explanation workflow. |
| `skills/explain-pr/references/*.md` | Pull request view and evidence rules. |

Keep each fact in one owning document.
Link to the owner instead of copying the same instructions into several files.
