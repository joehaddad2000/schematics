# Engineering diagram grammar

## Architecture

Draw external systems outside the product or trust boundary.
Draw each internal subsystem inside a named boundary.
Do not use the same shape and treatment for every component.

Use recognizable forms:

- Use a browser or screen treatment for a frontend.
- Use a service treatment for an API, worker, or backend.
- Use a database or table treatment for stored data.
- Use a queue or stream treatment for asynchronous events.
- Use an external treatment for third-party systems.
- Use a note treatment only for supporting context.

Label connections by protocol, operation, event, or data artifact.
Use solid lines for primary runtime flow.
Use dashed lines for optional, asynchronous, or administrative relationships only when the legend states that meaning.

## API surface

Default to one API boundary with compact route rows.
Show method, path, authentication boundary, main input, and main output.
Put exhaustive field definitions and error cases in the matching plan section.

Use separate endpoint nodes only when topology, ownership, security, or endpoint-to-endpoint flow is the point of the view.
Do not make a large diagram that contains one identical card for every route.

## Entity-relationship diagram

Use one table-shaped entity for each relational table.
Show the table name in the header.
Show relevant fields in rows.
Mark `PK`, `FK`, and `UQ` on the rows where they apply.
Show data types when they affect the design.

Draw the relationship from the referenced parent entity to the referencing child entity.
Terminate the line at the correct table boundary.
Show cardinality at both ends.
Use zero-to-many when a parent can have no children.
Use one-to-many only when at least one child is required.
Label ambiguous foreign keys with the child column name.

Keep a single ER view at eight entities or fewer.
Split a larger schema by bounded context and add one small context map when necessary.

## Data flow and events

Name the artifact that moves between components.
Distinguish synchronous requests from asynchronous events.
Show the producer, transport, consumer, and durable state when all four matter.
Do not use a generic arrow when the protocol or event name changes the design.

## Sequence

Use a sequence diagram only when order, retry, timeout, or concurrency matters.
Name the caller and receiver for every message.
Show important responses and failure branches.
Move implementation commentary into the plan document.

## Visual review

Confirm that a reader can identify component types before reading all labels.
Confirm that boundaries remain clear at the initial browser size.
Confirm that API route rows and ERD fields remain legible.
Confirm that every relationship line has an unambiguous source and target.
Reduce content before you reduce the font size.
