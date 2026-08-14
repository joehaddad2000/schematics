# Development guide

## Prerequisites

Use Git for repository history.
Use Node.js only for skills.sh and JavaScript syntax checks.
Use Python 3 for the canvas builder and skill validator.
Use Claude Code when plugin validation or local plugin loading is required.

The repository has no dependency installation step.

## Change a skill

1. Read [architecture.md](architecture.md).
2. Read the affected `SKILL.md` completely.
3. Read each affected reference completely.
4. Put trigger conditions in the frontmatter `description`.
5. Put core execution steps in `SKILL.md`.
6. Put detailed domain rules in one reference file.
7. Keep `SKILL.md` concise and under 500 lines.
8. Regenerate `agents/openai.yaml` when the purpose or default prompt changes.
9. Update user documentation when installation, output, or behavior changes.

Use imperative language in skill instructions.
Use ASD-STE100 principles for plan-writing guidance.
Preserve exact technical identifiers and examples.

## Change Schematics Canvas

Edit the canonical files only under `shared/schematics-canvas/`.
Do not replace the links under `skills/visual-plan/` or `skills/explain-pr/` with copies.

Preserve these boundaries:

- Diagram Design renders all visible SVG topology.
- The canvas manifest stores view metadata and inspector detail only.
- The builder validates and packages authored artifacts.
- The browser shell supplies interaction only.

Run a plan artifact and a pull request artifact through the builder after any canvas change.
Inspect both at desktop and narrow viewport sizes.

## Keep the repository lean

Do not add a package manifest only to run one command.
Do not commit installed skills, caches, screenshots, or generated user artifacts.
Do not create mirrored provider-specific skill trees.

Add a script only when a deterministic operation is repeatedly required.
Add an asset only when a skill must copy it into output.
Keep tests focused on installation, build behavior, interaction, and failure handling.
Do not test Markdown wording, private function structure, or exact generated source formatting.

## Validate skill discovery

```bash
npx skills add . --list
```

The output must list exactly `visual-plan`, `recap-pr`, and `explain-pr`.

## Validate skill metadata

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py skills/visual-plan
python3 /path/to/skill-creator/scripts/quick_validate.py skills/recap-pr
python3 /path/to/skill-creator/scripts/quick_validate.py skills/explain-pr
```

## Validate shared code

```bash
python3 -m py_compile shared/schematics-canvas/scripts/build_canvas.py
node --check shared/schematics-canvas/assets/schematics-canvas/app.js
```

Run Diagram Design's self-check on each source view before the canvas build.
Run the canvas builder on the authored manifest.

## Validate Claude Code integration

```bash
claude plugin validate . --strict
```

Test the plugin from the local checkout when behavior changes:

```bash
claude --plugin-dir .
```

## Test individual skills.sh installation

Run each install from a temporary Git repository so the smoke test does not add provider folders here:

```bash
mkdir /tmp/schematics-install-smoke
git init -b main /tmp/schematics-install-smoke
cd /tmp/schematics-install-smoke
npx skills add /absolute/path/to/schematics \
  --skill visual-plan \
  --agent claude-code codex \
  --copy \
  --yes
```

Confirm that the installed skill contains its own `assets/schematics-canvas/`, `scripts/build_canvas.py`, and `references/canvas-format.md`.
Repeat for `explain-pr`.

## Change plugin metadata

Keep the plugin name, version, and description aligned in both Claude manifests.
Run strict Claude validation after every manifest change.

## Completion checklist

- The skill validator accepts all three skills.
- skills.sh lists exactly three skills.
- Individual installation includes the dereferenced shared resources.
- The builder accepts valid artifacts and rejects missing diagram markers.
- Both Claude manifests pass strict validation.
- A plan canvas and pull request canvas pass browser interaction checks.
- The README commands match current CLI help.
- `git status` contains only the intended change.
