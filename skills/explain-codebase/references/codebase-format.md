# Interactive codebase explanation format

## Output

Create the artifact under `docs/codebase/<short-scope>/` unless the user or repository gives another location.
Follow the complete output, manifest, Diagram Design marker, build, and interaction contract in [canvas-format.md](canvas-format.md).
Create every visible topology as a Diagram Design source view.

## Scope and snapshot

Use the user-supplied scope when it is precise.
Otherwise, use the smallest scope that answers the request and state it before inspection.
For a whole repository, identify the primary product or runtime boundary before you inspect internal modules.

Record all of the following in canvas metadata or summary rows:

- Repository name or local root.
- Inspected subsystem or workflow.
- Current branch.
- Full HEAD commit when Git is available.
- Clean or modified working-tree state.
- Inspection date.

If the working tree is modified, state that source links pinned to HEAD do not prove uncommitted content.
Use HEAD-pinned links only for unchanged content.
For modified or untracked content, show the repository-relative path and line range instead.
Do not label a codebase current when the repository snapshot is unknown.

## Evidence collection

Start with repository manifests, entry points, runtime registration, routes, schemas, migrations, configuration, and architecture documents.
Verify documentation claims against current code.
Trace call sites and configuration wiring before you draw a relationship.
Use tests only as supporting behavior evidence.
Do not treat mocks or fixtures as production topology.

Exclude common non-source directories such as:

- `.git/`
- dependency directories
- build and coverage output
- generated clients and generated schema output
- vendored code
- caches
- secret and credential files

Do not read `.env` values or copy credentials into the artifact.

## Select views by reader question

Use one to five views.
Start with one overview and add a view only when it answers a different question.
Connect overview boxes to focused views with the `data-schematic-view` drill-down contract.

### Whole repository

Prefer:

1. System landscape: What does this repository own, and what is outside it?
2. Primary runtime flow: How does one important input become an output?
3. Module map: How do the main internal responsibilities divide?

Add an API surface, ERD, event flow, or deployment view only when it is material.

### Scoped subsystem

Prefer:

1. Subsystem map: What does this subsystem own and depend on?
2. Runtime sequence: How does its main behavior execute?

Add a contract or data view only when it removes ambiguity.

### Single workflow

Prefer a sequence or data-flow view plus one compact contract or state view.
Do not add a repository overview that does not help explain the workflow.

### Library or package

Prefer a public API view, an internal module map, and one representative call path.
Show extension points when they are part of the public contract.

### Monorepo

Prefer a workspace boundary view, one representative cross-workspace runtime flow, and a shared-package map.
Do not draw every workspace when the request concerns one product path.

## Drill-down hierarchy

Treat the first view as the system map.
Add a visible drill-down action inside a box when that boundary has a focused child view.
Use labels such as `Explore subsystem`, `Open runtime flow`, `Open API`, or `Open data model`.

Keep the box itself selectable for inspector detail.
Use the nested action only for navigation.
Provide a clear path back through the sidebar or a visible action in the child view.

Do not create unlimited depth.
Prefer this hierarchy:

1. System landscape.
2. Subsystem or product boundary.
3. Focused runtime, API, state, or data view.

Stop when a source link communicates the next level better than another diagram.

## Abstraction rules

Use one node for one runtime responsibility, public interface, durable store, external dependency, or meaningful module boundary.
Do not create one node per file, directory, class, function, route, or import.
Put implementation paths in inspector links and fields.

Show direction only when data, control, events, or dependencies move in that direction.
Label a connection with the request, event, record, artifact, or action that crosses it.
Do not infer a runtime call from a package dependency alone.
Do not infer ownership from directory placement alone.

Use a sequence view for time-ordered behavior.
Use Diagram Design's Data flow type only when typed payloads move through stable role lanes.
Use Architecture, Process, or Sequence for a general runtime path.
Use an architecture view for boundaries and responsibility.
Use a real ERD for persistent relational structure.

## Inspector detail

Give each marked item concise, source-backed detail.
Include only fields that help the reader:

- Responsibility.
- Entry point or public interface.
- Important inputs and outputs.
- Runtime callers or dependencies.
- Durable state.
- Configuration or registration source.
- Evidence classification: observed or inferred.
- Exact source links.

Use exact code identifiers in fields.
Use short explanatory sentences in `summary` and `detail`.
Do not paste large source excerpts.

## Source links

Set `$source` to a repository blob URL pinned to the inspected HEAD commit when a public or accessible remote exists.
Use `$source/<path>#L<start>-L<end>` for a pinned file range.
Use full URLs for external specifications or services.

When a pinned remote link is not available, show the repository-relative path and line range in inspector fields.
Do not invent a clickable URL.

## Neutrality

Describe current structure and behavior.
Do not include defect findings, severity, redesign advice, refactor proposals, or quality scores.
If inspection reveals a possible defect, report it separately in chat under `Separate review notes`.

## Verification

Confirm all of the following before handoff:

- The displayed scope matches the inspected files.
- Branch, commit, and working-tree state are accurate.
- Each node and connection has evidence.
- Every important source link resolves to the intended file or clearly shows a local path.
- The overview uses architectural concepts instead of a file tree.
- Representative flows are labeled as representative.
- External systems and repository-owned components are visually distinct.
- Tables, queues, APIs, processes, and modules use appropriate visual forms.
- Every source view passes Diagram Design's self-check and visual inspection when browser control is callable.
- When browser control is not callable, the handoff states that visual and interaction checks remain unverified.
- The artifact satisfies every build and interaction check in `references/canvas-format.md`.
- Explanatory copy uses short direct sentences and ASD-STE100 principles when practical.
