# Schematics skill collection plan

**Status:** Published and expanded
**Last updated:** 2026-08-14

## Decision

Publish Schematics as a portable collection of Agent Skills with standard skills.sh discovery and a standard Claude Code plugin marketplace.
Start with one plan-focused skill named `visual-plan`.
Add `recap-pr` and `explain-pr` after the pull request explanation experiment proves their separate use cases.

## Current skills

| Skill | Job | Output |
|---|---|---|
| `visual-plan` | Plan complex technical work. | Markdown plan plus focused diagrams. |
| `recap-pr` | Create a fast pull request handoff. | Markdown recap plus an optional static change map. |
| `explain-pr` | Explain a large pull request interactively. | Multi-view standalone browser overview. |

The pull request skills are explanation tools, not code-review tools.
Possible defects stay in chat unless the user requests a separate review artifact.

## Context

The project began as a custom React canvas reader with a JSON schema, renderer, CLI, and generated static artifacts.
That implementation proved the interaction model but made the planning skill depend on a private runtime.
The durable product is the planning workflow, not the viewer.

The repository now uses Markdown as the plan source of truth and Diagram Design for standalone visual output.
Optional click-to-read detail uses native HTML anchors and CSS.

## Research baseline

The repository structure was compared with these active skill projects:

| Repository | Useful pattern | Decision for Schematics |
|---|---|---|
| [Anthropic Skills](https://github.com/anthropics/skills) | Canonical `skills/` tree plus a root Claude marketplace | Use the same canonical tree and marketplace location. |
| [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) | Agent Skills standard with direct skills.sh installation | Use direct `npx skills add owner/repo` discovery. |
| [Matt Pocock Skills](https://github.com/mattpocock/skills) | Explicit Claude plugin metadata for a skill collection | Use explicit metadata and focused skills without a collection router. |
| [Superpowers](https://github.com/obra/superpowers) | Portable canonical skills with harness manifests | Keep one portable canonical skills tree and avoid copied provider trees. |
| [Diagram Design](https://github.com/cathrynlavery/diagram-design) | Progressive references and standalone HTML output | Use it as the required visual composition dependency. |
| [Impeccable](https://github.com/pbakaus/impeccable) | Canonical source with generated provider builds when provider behavior differs | Do not copy this build system because Schematics has no provider-specific runtime. |
| [Caveman](https://github.com/JuliusBrussee/caveman) | Clear installation matrix and native manifests for many agents | Document skills.sh and Claude plugin commands without adding an installer. |

## Scope

### In scope

- Three focused skills: `visual-plan`, `recap-pr`, and `explain-pr`.
- Progressive reference files for plan format, composition, engineering diagrams, linked detail, PR recap, and interactive PR explanation.
- One Codex interface metadata file inside each skill.
- One Claude Code plugin manifest.
- One Claude Code marketplace manifest.
- skills.sh-compatible repository discovery.
- Root documentation for installation, use, and validation.
- A small CI check for skill discovery and manifest syntax.
- One standalone browser asset owned by `explain-pr` and copied into its generated output.

### Out of scope

- A repository-hosted React viewer.
- A canvas JSON schema.
- A custom renderer or validation CLI.
- A development server.
- A package manager or build step.
- Generated provider-specific skill copies.
- A custom installer.

## Repository model

The canonical sources live at `skills/visual-plan/`, `skills/recap-pr/`, and `skills/explain-pr/`.
skills.sh discovers these directories directly.
Claude Code loads the same directories through the root plugin.
Codex reads each `SKILL.md` and its `agents/openai.yaml` sidecar.

Future skills can explain code, architecture, or other technical artifacts.
Each skill must own one clear job and use the same canonical `skills/` tree.

No synchronization step exists because no duplicate source exists.

## Output model

Each use creates one Markdown plan and only the diagrams that the plan needs.
The plan records context, scope, system model, interfaces, execution phases, verification, decisions, risks, and sources.
The diagrams answer focused reader questions and link back to the plan for depth.

`recap-pr` creates a compact Markdown handoff and an optional static change map.
`explain-pr` creates a standalone interactive overview with focused views and exact source links.
Both keep review findings outside their artifacts.

## Verification

- Validate all skill frontmatter with the skill-creator validator.
- Confirm skills.sh lists `visual-plan`, `recap-pr`, and `explain-pr` from the local repository.
- Validate the Claude plugin and marketplace with `claude plugin validate . --strict`.
- Confirm the repository contains no hosted runtime, package manifest, build output, or generated application.
- Review the README commands against installed CLI help.

## Initial repository setup

The following `v1.0.0` setup is complete:

1. Validate the skill with the skill-creator validator.
2. Confirm local skills.sh discovery.
3. Validate the local Claude plugin and marketplace.
4. Create the initial commit on `main`.
5. Create the local `v1.0.0` tag after the committed tree passes validation.
6. Publish `main` and `v1.0.0` to the public GitHub repository.

## Pull request skill release

1. Promote the validated `recap-pr` and `explain-pr` skill sources into the canonical `skills/` tree.
2. Confirm skills.sh discovers all three skills.
3. Confirm local provider installation copies the interactive canvas asset without modification.
4. Validate all skill frontmatter and Claude manifests.
5. Publish the expansion as `v1.1.0`.

## Exit condition

The repository is complete when the skills, manifests, README, CI definition, and validation commands pass from the published Git commit.
