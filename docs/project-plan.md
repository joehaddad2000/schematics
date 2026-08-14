# Schematics skill collection plan

**Status:** Unified canvas implemented
**Last updated:** 2026-08-14

## Decision

Publish Schematics as three focused Agent Skills with one shared interactive canvas contract.
Use Diagram Design as the only visual renderer.
Use Schematics Canvas as the common interaction shell for visual plans and full pull request explanations.
Keep the quick pull request recap static.

## Current skills

| Skill | Job | Output |
|---|---|---|
| `visual-plan` | Plan complex technical work. | Markdown plan plus an interactive canvas of standalone Diagram Design views. |
| `recap-pr` | Create a fast pull request handoff. | Markdown recap plus an optional static change map. |
| `explain-pr` | Explain a large pull request interactively. | Interactive canvas of standalone Diagram Design views. |

The pull request skills are explanation tools, not code-review tools.
Possible defects stay in chat unless the user requests a separate review artifact.

## Product evolution

The project began as a custom React canvas reader with a JSON topology schema, renderer, CLI, and generated static artifacts.
That implementation proved the interaction model but duplicated visual composition inside Schematics.

The next version used standalone Diagram Design files for planning and a separate custom card renderer for interactive pull request explanations.
That split produced two competing visual systems and made the product difficult to explain.

The unified model keeps the useful boundaries from both experiments:

- Diagram Design creates every visible technical diagram.
- Schematics Canvas provides one reusable interactive reading surface.
- The manifest stores only navigation metadata and inspector detail.
- The Markdown plan or recap remains the durable prose artifact.

## Research baseline

The repository structure was compared with these active skill projects:

| Repository | Useful pattern | Decision for Schematics |
|---|---|---|
| [Anthropic Skills](https://github.com/anthropics/skills) | Canonical `skills/` tree plus a root Claude marketplace. | Use the same canonical tree and marketplace location. |
| [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) | Agent Skills standard with direct skills.sh installation. | Use direct repository discovery. |
| [Matt Pocock Skills](https://github.com/mattpocock/skills) | Explicit Claude plugin metadata for a skill collection. | Use explicit metadata and focused skills. |
| [Superpowers](https://github.com/obra/superpowers) | Portable canonical skills with harness manifests. | Keep one portable canonical skills tree. |
| [Diagram Design](https://github.com/cathrynlavery/diagram-design) | Progressive references and high-quality standalone HTML output. | Make it the only visual renderer. |
| [Impeccable](https://github.com/pbakaus/impeccable) | Canonical source with generated provider builds when behavior differs. | Avoid a provider build because Schematics uses portable Agent Skills. |
| [Caveman](https://github.com/JuliusBrussee/caveman) | Clear installation matrix and native manifests. | Document skills.sh and Claude plugin installation without a custom installer. |

## Repository model

The user-facing sources live under `skills/`.
The shared canvas source lives once under `shared/schematics-canvas/`.
Repository-relative links expose it inside each interactive skill.

The source tree has no hand-maintained runtime copies.
An installed individual skill is self-contained because skills.sh dereferences the internal links during copy.

## Output model

Each interactive use creates:

1. A durable Markdown document when the workflow requires one.
2. A small set of standalone Diagram Design views.
3. One canvas manifest with navigation and inspector detail.
4. One generated static canvas shell.

The builder embeds the selected SVG from each source view.
This preserves local-file compatibility and keeps the original standalone views available.

## Explicit non-goals

- Do not restore the old React application.
- Do not add canvas-owned nodes, edges, coordinates, or automatic layout.
- Do not turn `recap-pr` into a full interactive overview.
- Do not vendor Diagram Design.
- Do not add a package manager or development server.

## Verification

- Validate all skill frontmatter.
- Confirm skills.sh lists the three public skills.
- Confirm individual skill installation includes shared canvas resources.
- Validate the builder with valid and invalid marked diagrams.
- Validate the Claude plugin and marketplace.
- Inspect a complex plan canvas and pull request canvas in the browser.
- Verify pointer and keyboard selection, background clearing, search, pan, zoom, fit, and narrow layout.

## Exit condition

The unified canvas work is complete when both interactive skills create the same shell around Diagram Design views, the quick recap remains static, installation remains portable, and all validation and browser checks pass.
