# Schematics Canvas format

Use Schematics Canvas as the interactive shell for Diagram Design views.
Diagram Design owns every SVG, layout, connector, node form, and visual style.
Schematics Canvas owns navigation, search, pan, zoom, selection, and the detail inspector.

## Output

Create this structure inside the requested plan or explanation directory:

```text
<artifact>/
├── index.html
├── app.css
├── app.js
├── canvas-data.js
├── canvas-manifest.json
└── views/
    ├── overview.html
    └── <focused-view>.html
```

Write `canvas-manifest.json` and the Diagram Design files under `views/`.
Run the bundled builder to copy the shared shell and create `canvas-data.js`:

```bash
python3 <skill-dir>/scripts/build_canvas.py <artifact>/canvas-manifest.json
```

Do not edit `index.html`, `app.css`, `app.js`, or `canvas-data.js` after the build.
Rebuild from the manifest and source views instead.

## Diagram contract

Create each view with the installed `$diagram-design` skill.
Keep the view as valid standalone Diagram Design HTML.
Place these markers immediately around the one SVG that the canvas must display:

```html
<!-- schematics:embed:start -->
<svg viewBox="0 0 960 600" role="img" aria-labelledby="system-title system-desc">
  <title id="system-title">System overview</title>
  <desc id="system-desc">System boundaries and the primary request path.</desc>
  <!-- diagram -->
</svg>
<!-- schematics:embed:end -->
```

The markers must contain only the SVG.
The builder carries the source styles into an isolated embedded document.
It keeps the complete source HTML under `views/` so a reader can open the diagram directly.

Add `data-schematic-id` to each meaningful SVG group that must open inspector detail:

```html
<g data-schematic-id="order-api">
  <!-- Diagram Design node -->
</g>
```

Use lowercase kebab-case IDs.
Give every marked group exactly one matching node entry in the manifest.
Do not mark labels, legends, boundaries, or decorative shapes that have no additional detail.
Do not add a second click-to-read implementation inside the Diagram Design file.
Schematics Canvas supplies the inspector.

## Manifest

Use this shape:

```json
{
  "meta": {
    "title": "Checkout service plan",
    "artifactLabel": "Interactive plan",
    "subtitle": "Architecture, API, and data model",
    "snapshot": "2026-08-14",
    "badge": "Draft plan",
    "badgeTone": "warn",
    "viewsLabel": "Plan views",
    "summaryLabel": "Plan snapshot",
    "searchPlaceholder": "Find a service, route, table...",
    "summary": [
      { "label": "Views", "value": "3" },
      { "label": "Status", "value": "Draft", "tone": "warn" }
    ],
    "links": [
      { "label": "Plan", "href": "$plan" },
      { "label": "Interactive views", "active": true }
    ],
    "linkBases": {
      "$plan": "./plan.md",
      "$source": "https://github.com/owner/repository/blob/full-sha"
    }
  },
  "views": [
    {
      "id": "system-overview",
      "label": "System overview",
      "question": "Where are the boundaries and primary runtime path?",
      "source": "views/system-overview.html",
      "nodes": [
        {
          "id": "order-api",
          "kind": "api",
          "title": "Order API",
          "eyebrow": "Internal API",
          "summary": "Accepts idempotent order creation requests.",
          "detail": [
            "The API validates the request before it calls the order service."
          ],
          "fieldsLabel": "Contract",
          "fields": {
            "Input": "POST /v1/orders",
            "Output": "201 Order"
          },
          "tags": ["HTTP", "internal"],
          "links": [
            { "label": "Route source", "href": "$source/src/routes/orders.ts#L10-L40" }
          ]
        }
      ]
    }
  ]
}
```

## Metadata rules

Use `meta.title` for the artifact title in the top bar.
Use `artifactLabel` for the small Schematics product label.
Use `subtitle` and `snapshot` for concise provenance.
Use `links` for related documents or artifacts.
Mark the current artifact link with `active: true`.

Use `linkBases` to avoid repeated repository and revision prefixes.
An inspector link can use an exact alias such as `$plan`, an alias plus a path such as `$source/src/api.ts`, or an alias plus a fragment such as `$plan#interfaces`.

Use only `good`, `warn`, or `danger` for a tone.
Use tone only when the underlying state is factual.
Do not infer readiness or correctness from a green status.

## View rules

Make each view answer one reader question.
Use the smallest sufficient set of views.
Keep the visible diagram within Diagram Design's complexity budget.
Put long explanation and source links in manifest node details.
Keep scan-critical names, boundaries, routes, fields, keys, cardinality, and connection labels visible in the SVG.

Do not add canvas coordinates or duplicate Diagram Design edges in the manifest.
The SVG is the only source of visual topology.
The manifest is the only source of inspector detail.

## Verification

Run Diagram Design's self-check on every file under `views/` before the canvas build.
Run the canvas builder and treat any missing or undocumented marker as an error.
Use `shared/schematics-canvas/examples/minimal/` as a small source example when working from the repository checkout.
Serve or open `index.html` and confirm all of the following:

- Every view opens.
- Every marked diagram item opens the correct inspector detail.
- Clicking the diagram background clears the inspector without changing the rest of the diagram.
- Search opens the correct view and detail.
- Pan, zoom, fit, and direct diagram links work.
- Keyboard selection works with Enter and Space.
- Escape clears selection.
- The initial view is readable at 1280 by 900 and 520 by 700.
- The interface uses the same neutral Diagram Design tokens and Geist type.
- No item overlaps, clips, or depends on hover.
