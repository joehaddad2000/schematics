# Linked diagram details

Use this pattern only when the user needs to select a diagram node and read more detail.
Keep `plan.md` as the source of truth.

## Use native HTML first

Keep the Diagram Design output as one self-contained HTML file.
Do not add a framework, package manager, server, schema, or build step.
Do not dim or blur the rest of the diagram when a reader selects one node.

Wrap each selectable SVG node in an anchor that points to a matching detail section:

```html
<a href="#detail-order-api" aria-label="Read Order API details">
  <g id="node-order-api">
    <!-- Diagram Design node -->
  </g>
</a>
```

Add one matching detail region after the diagram:

```html
<aside id="detail-order-api" class="node-detail" tabindex="-1">
  <a href="#diagram" class="node-detail__close">Close</a>
  <h2>Order API</h2>
  <p>Accepts idempotent order creation requests.</p>
  <a href="./plan.md#interfaces-and-data">Read the complete contract</a>
</aside>
```

Use CSS `:target` to show the selected detail region.
Keep all other detail regions hidden.
Use a close link that returns to the diagram anchor.
This gives pointer and keyboard access without JavaScript.

## Content rules

Keep the visible node short.
Put a compact summary and the most useful links in the detail region.
Put the complete rationale, contract, acceptance criteria, and evidence in `plan.md`.
Do not duplicate long plan sections in the HTML file.
Do not make ordinary labels selectable when they have no additional detail.

## Verification

Open every selectable node with a pointer.
Open every selectable node with a keyboard.
Close the detail region and confirm that the complete diagram remains readable.
Confirm that direct URLs with a detail fragment work.
Confirm that the plan link reaches the correct section.
Confirm that the diagram remains usable at a narrow viewport.
