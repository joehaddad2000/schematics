# Schematics initial skill plan

**Status:** Published
**Last updated:** 2026-08-13

## Decision

Publish Schematics as a portable collection of Agent Skills with standard skills.sh discovery and a standard Claude Code plugin marketplace.
Start with one plan-focused skill named `visual-plan`.

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
| [Matt Pocock Skills](https://github.com/mattpocock/skills) | Explicit Claude plugin metadata for a skill collection | Use explicit metadata, but keep one skill and no collection router. |
| [Superpowers](https://github.com/obra/superpowers) | Portable canonical skills with harness manifests | Keep one portable skill source and avoid copied provider trees. |
| [Diagram Design](https://github.com/cathrynlavery/diagram-design) | Progressive references and standalone HTML output | Use it as the required visual composition dependency. |
| [Impeccable](https://github.com/pbakaus/impeccable) | Canonical source with generated provider builds when provider behavior differs | Do not copy this build system because Schematics has no provider-specific runtime. |
| [Caveman](https://github.com/JuliusBrussee/caveman) | Clear installation matrix and native manifests for many agents | Document skills.sh and Claude plugin commands without adding an installer. |

## Scope

### In scope

- One initial `visual-plan` skill.
- Progressive reference files for plan format, composition, engineering diagrams, and linked detail.
- One Codex interface metadata file inside the skill.
- One Claude Code plugin manifest.
- One Claude Code marketplace manifest.
- skills.sh-compatible repository discovery.
- Root documentation for installation, use, and validation.
- A small CI check for skill discovery and manifest syntax.

### Out of scope

- A React viewer.
- A canvas JSON schema.
- A custom renderer or validation CLI.
- A development server.
- A package manager or build step.
- Generated provider-specific skill copies.
- A custom installer.

## Repository model

The canonical source lives at `skills/visual-plan/`.
skills.sh discovers this directory directly.
Claude Code loads the same directory through the root plugin.
Codex reads the same `SKILL.md` and its `agents/openai.yaml` sidecar.

Future skills can explain code, pull requests, architecture, or other technical artifacts.
Each skill must own one clear job and use the same canonical `skills/` tree.

No synchronization step exists because no duplicate source exists.

## Output model

Each use creates one Markdown plan and only the diagrams that the plan needs.
The plan records context, scope, system model, interfaces, execution phases, verification, decisions, risks, and sources.
The diagrams answer focused reader questions and link back to the plan for depth.

## Verification

- Validate skill frontmatter with the skill-creator validator.
- Confirm skills.sh lists `visual-plan` from the local repository.
- Validate the Claude plugin and marketplace with `claude plugin validate . --strict`.
- Confirm the repository contains no runtime, package manifest, schema, build output, or generated application.
- Review the README commands against installed CLI help.

## Initial repository setup

1. Validate the skill with the skill-creator validator.
2. Confirm local skills.sh discovery.
3. Validate the local Claude plugin and marketplace.
4. Create the initial commit on `main`.
5. Create the local `v1.0.0` tag after the committed tree passes validation.
6. Publish `main` and `v1.0.0` to the public GitHub repository.

## Exit condition

The repository is complete when the skill, manifests, README, CI definition, and validation commands pass from the published Git commit.
