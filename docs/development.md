# Development guide

## Prerequisites

Use Git for repository history.
Use Node.js only to run the skills.sh CLI through `npx`.
Use Claude Code only when you need to validate or test the plugin surface.

The repository itself has no runtime dependencies and no install step.

## Change the skill

1. Read [architecture.md](architecture.md).
2. Read `skills/create-plan-canvas/SKILL.md` completely.
3. Read each reference that the change affects.
4. Put trigger conditions in the frontmatter `description`.
5. Put core execution steps in `SKILL.md`.
6. Put detailed domain rules in one reference file.
7. Keep `SKILL.md` concise and under 500 lines.
8. Update `agents/openai.yaml` when the skill purpose or default prompt changes.
9. Update user documentation only when installation or behavior changes.

Use imperative language in skill instructions.
Use ASD-STE100 style for plan-writing guidance.
Preserve exact technical identifiers and examples.

## Keep the repository lean

Do not add a script for a check that a standard tool already performs.
Do not add a package manifest only to run one command.
Do not commit installed skills, build output, caches, screenshots, or generated plans used only for local testing.
Do not create mirrored skill trees for different agents.

Add a bundled script only when the same deterministic operation is repeatedly required and cannot be expressed reliably with standard tools.
Add an asset only when the skill must copy that asset into its output.

## Validate the skill

Confirm local skills.sh discovery:

```bash
npx skills add . --list
```

The output must list exactly one skill named `create-plan-canvas`.

When the skill-creator validator is available, run:

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py \
  skills/create-plan-canvas
```

Confirm that the validator accepts the name, frontmatter, and description.

## Validate Claude Code integration

Validate each manifest directly:

```bash
claude plugin validate .claude-plugin/plugin.json --strict
claude plugin validate .claude-plugin/marketplace.json --strict
```

Test the plugin from the local checkout when behavior changes:

```bash
claude --plugin-dir .
```

The plugin must expose `/canvas-blocks:create-plan-canvas`.

## Test a local installation

Run the installation from a temporary Git repository so the smoke test does not add provider folders to this repository:

```bash
mkdir /tmp/canvas-blocks-install-smoke
git init -b main /tmp/canvas-blocks-install-smoke
cd /tmp/canvas-blocks-install-smoke
npx skills add /absolute/path/to/canvas-blocks \
  --skill create-plan-canvas \
  --agent claude-code codex \
  --copy \
  --yes
```

Confirm that the installed provider directories contain the same `SKILL.md` and reference files.
Delete the temporary directory after inspection.

## Change plugin metadata

Keep these values aligned in `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`:

- Plugin name.
- Version.
- Description.

Run strict Claude validation after every manifest change.

## Commit policy

Keep commits focused on the skill, its documentation, or its distribution metadata.
Do not commit generated plans from unrelated projects.

## Completion checklist

- The skill-creator validator passes when available.
- skills.sh lists exactly one skill.
- Both Claude manifests pass strict validation.
- The README commands match current local CLI help.
- The repository contains no application or generated provider copy.
- `git status` contains only the intended change.
