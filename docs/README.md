# Schematics documentation

This directory explains how the skill repository works and how to change it without creating a repository-hosted application runtime.

## Read order

1. Read [architecture.md](architecture.md) to understand the repository boundaries and canonical source.
2. Read [development.md](development.md) before you edit a skill or manifest.
3. Read [project-plan.md](project-plan.md) for the research baseline, completed migration, and repository completion criteria.
4. Read the affected `SKILL.md` and only the references needed for the current change.

## Core rule

Schematics is a skill repository.
It is not an application repository.

Do not add a repository server, package manager, build system, generated provider copy, or hosted viewer.
`explain-pr` may own its standalone browser asset because that asset is copied into the generated overview and has no repository runtime.

## Documentation ownership

| Document | Purpose |
|---|---|
| `README.md` | User-facing installation, use, structure, and validation. |
| `docs/architecture.md` | Stable repository architecture and source-of-truth rules. |
| `docs/development.md` | Maintainer workflow and validation commands. |
| `docs/project-plan.md` | Research record, migration scope, and completion criteria. |
| `skills/visual-plan/SKILL.md` | Visual Plan execution workflow and quality gate. |
| `skills/visual-plan/references/*.md` | Detailed guidance loaded only when the task needs it. |
| `skills/recap-pr/SKILL.md` | Static pull request recap workflow and review-separation rules. |
| `skills/recap-pr/references/*.md` | Static recap format and verification contract. |
| `skills/explain-pr/SKILL.md` | Interactive pull request explanation workflow and evidence rules. |
| `skills/explain-pr/references/*.md` | Interactive overview data, layout, and verification contract. |
| `skills/explain-pr/assets/*` | Standalone browser files copied into an interactive overview. |

Keep each fact in one owning document.
Link to that document instead of copying the same instructions into several files.
