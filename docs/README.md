# Schematics documentation

This directory explains how the skill repository works and how to change it without restoring the removed application architecture.

## Read order

1. Read [architecture.md](architecture.md) to understand the repository boundaries and canonical source.
2. Read [development.md](development.md) before you edit the skill or manifests.
3. Read [project-plan.md](project-plan.md) for the research baseline, completed migration, and repository completion criteria.
4. Read [the skill](../skills/visual-plan/SKILL.md) and only the references needed for the current change.

## Core rule

Schematics is a skill repository.
It is not an application repository.

Do not add a viewer, renderer, schema, server, package manager, build system, or generated provider copy unless a future requirement proves that a standard skill and standalone HTML output cannot meet the need.

## Documentation ownership

| Document | Purpose |
|---|---|
| `README.md` | User-facing installation, use, structure, and validation. |
| `docs/architecture.md` | Stable repository architecture and source-of-truth rules. |
| `docs/development.md` | Maintainer workflow and validation commands. |
| `docs/project-plan.md` | Research record, migration scope, and completion criteria. |
| `skills/visual-plan/SKILL.md` | Visual Plan execution workflow and quality gate. |
| `skills/visual-plan/references/*.md` | Detailed guidance loaded only when the task needs it. |

Keep each fact in one owning document.
Link to that document instead of copying the same instructions into several files.
