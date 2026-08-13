# Plan canvas composition

## Start with reader questions

Write one sentence that states what the reader must understand or decide.
Turn each additional reader question into a plan section or a focused diagram.
Remove any element that does not help answer one of those questions.

Use this order when it fits the work:

1. Show the system overview and its boundaries.
2. Show the interface or data flow that changes.
3. Show the relational model when stored data changes.
4. Show a sequence only when order over time matters.
5. Show the execution phases and verification in the plan document.

Do not combine these views into one large diagram.

## Select the diagram type

Use an architecture diagram for boundaries, ownership, and runtime dependencies.
Use a data-flow diagram for artifacts that move through transformations.
Use an ER diagram for entities, fields, keys, and cardinality.
Use a sequence diagram for calls that depend on order or timing.
Use a flowchart for decisions and branching work.
Use a swimlane when responsibility across teams or systems is the main question.
Use a layer stack for strict platform or application layers.

Use the exact Diagram Design type reference that matches the selected view.

## Separate visible and documented detail

Keep these items visible in the diagram:

- System and trust boundaries.
- Component names and distinct component types.
- Route method and path when the API surface matters.
- Table names, important fields, keys, and cardinality in an ERD.
- Direction, protocol, event, or artifact on important connections.
- Decisions or risks that change the reader's interpretation.

Keep these items in `plan.md`:

- Rationale and tradeoffs.
- Exhaustive request and response contracts.
- Acceptance criteria and verification commands.
- Rollout and rollback detail.
- Source evidence and caveats.
- Owners and dates when they are known.

## Control density

Use one to four views by default.
Keep architecture and flow views at nine visible nodes or fewer.
Keep an ER view at eight visible entities or fewer.
Split a larger data model by bounded context.
Use one to three meaningful connections per node as a normal range.
Avoid crossings before you add bends or labels.

## Review the complete set

Read the plan without the diagrams.
Confirm that it remains complete and actionable.
Read each diagram without the plan.
Confirm that its main message is still clear.
Then read both together and remove contradictions, duplicate explanation, and inconsistent terms.
