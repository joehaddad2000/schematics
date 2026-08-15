(() => {
  "use strict";

  const data = window.SCHEMATICS_DATA;
  if (!data || !data.meta || !Array.isArray(data.views) || data.views.length === 0) {
    document.body.innerHTML = '<main class="fatal-error">Canvas data is missing or invalid.</main>';
    return;
  }

  const MIN_SCALE = 0.28;
  const MAX_SCALE = 2.2;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const linkAliases = Object.entries(data.meta.linkBases ?? {}).sort(([left], [right]) => right.length - left.length);

  const elements = {
    artifactLabel: document.getElementById("artifactLabel"),
    artifactTitle: document.getElementById("artifactTitle"),
    titleMeta: document.getElementById("titleMeta"),
    canvasBadge: document.getElementById("canvasBadge"),
    artifactLinks: document.getElementById("artifactLinks"),
    viewNav: document.getElementById("viewNav"),
    viewsLabel: document.getElementById("viewsLabel"),
    canvasSummary: document.getElementById("canvasSummary"),
    viewKicker: document.getElementById("viewKicker"),
    viewTitle: document.getElementById("viewTitle"),
    viewSource: document.getElementById("viewSource"),
    canvasViewport: document.getElementById("canvasViewport"),
    canvasWorld: document.getElementById("canvasWorld"),
    diagramFrame: document.getElementById("diagramFrame"),
    inspector: document.getElementById("inspector"),
    inspectorKicker: document.getElementById("inspectorKicker"),
    inspectorTitle: document.getElementById("inspectorTitle"),
    inspectorBody: document.getElementById("inspectorBody"),
    closeInspector: document.getElementById("closeInspector"),
    zoomOut: document.getElementById("zoomOut"),
    zoomIn: document.getElementById("zoomIn"),
    zoomLabel: document.getElementById("zoomLabel"),
    fitCanvas: document.getElementById("fitCanvas"),
    searchInput: document.getElementById("searchInput"),
    searchResults: document.getElementById("searchResults"),
    sidebar: document.getElementById("sidebar"),
    mobileNavButton: document.getElementById("mobileNavButton"),
    mobileBackdrop: document.getElementById("mobileBackdrop"),
  };

  const state = {
    viewId: data.views[0].id,
    scale: 1,
    panX: 0,
    panY: 0,
    dragging: false,
    dragMoved: false,
    dragStartX: 0,
    dragStartY: 0,
    panStartX: 0,
    panStartY: 0,
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function currentView() {
    return data.views.find((view) => view.id === state.viewId) ?? data.views[0];
  }

  function nodeById(id, view = currentView()) {
    return view.nodes.find((node) => node.id === id) ?? null;
  }

  function linkHref(link) {
    const href = String(link.href ?? "");
    for (const [alias, baseValue] of linkAliases) {
      const base = String(baseValue);
      if (href === alias) return base;
      if (href.startsWith(`${alias}/`)) return `${base.replace(/\/$/, "")}/${href.slice(alias.length + 1)}`;
      if (href.startsWith(`${alias}#`)) return `${base}${href.slice(alias.length)}`;
    }
    return href;
  }

  function renderArtifactLinks() {
    const links = data.meta.links ?? [];
    elements.artifactLinks.replaceChildren();
    elements.artifactLinks.hidden = links.length === 0;
    for (const link of links) {
      const element = document.createElement(link.active ? "span" : "a");
      element.textContent = link.label;
      if (link.active) {
        element.className = "active";
      } else {
        element.href = linkHref(link);
      }
      elements.artifactLinks.append(element);
    }
  }

  function renderHeader() {
    const meta = data.meta;
    document.title = `${meta.title} · Schematics`;
    elements.artifactLabel.textContent = meta.artifactLabel;
    elements.artifactTitle.textContent = meta.title;
    elements.titleMeta.textContent = [meta.subtitle, meta.snapshot].filter(Boolean).join(" · ");
    if (meta.badge) {
      elements.canvasBadge.textContent = meta.badge;
      elements.canvasBadge.className = `canvas-badge ${meta.badgeTone ?? ""}`;
      elements.canvasBadge.hidden = false;
    }
    elements.searchInput.placeholder = meta.searchPlaceholder ?? "Find a component, route, table...";
    elements.viewsLabel.textContent = meta.viewsLabel ?? "Views";
    renderArtifactLinks();
  }

  function renderNavigation() {
    elements.viewNav.replaceChildren();
    data.views.forEach((view, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `view-button${view.id === state.viewId ? " active" : ""}`;
      button.setAttribute("aria-current", view.id === state.viewId ? "page" : "false");
      button.innerHTML = `
        <span class="view-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="view-copy"><strong>${escapeHtml(view.label)}</strong><span>${escapeHtml(view.question)}</span></span>
        <span class="view-node-count">${view.nodes.length}</span>
      `;
      button.addEventListener("click", () => switchView(view.id));
      elements.viewNav.append(button);
    });
  }

  function renderSummary() {
    const summary = data.meta.summary ?? [];
    elements.canvasSummary.hidden = summary.length === 0;
    elements.canvasSummary.innerHTML = `
      <div class="section-label">${escapeHtml(data.meta.summaryLabel ?? "Snapshot")}</div>
      ${summary.map((item) => `<div class="summary-row"><span>${escapeHtml(item.label)}</span><strong class="${escapeHtml(item.tone ?? "")}">${escapeHtml(item.value)}</strong></div>`).join("")}
    `;
  }

  function renderInspector(node) {
    elements.inspectorKicker.textContent = node.eyebrow ?? node.kind;
    elements.inspectorTitle.textContent = node.title;
    const detail = (node.detail ?? []).map((paragraph) => `<p class="inspector-copy">${escapeHtml(paragraph)}</p>`).join("");
    const fields = node.fields
      ? `<div class="inspector-section"><h3>${escapeHtml(node.fieldsLabel ?? "Details")}</h3>${Object.entries(node.fields)
          .map(([label, value]) => `<div class="summary-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`)
          .join("")}</div>`
      : "";
    const tags = (node.tags ?? []).length
      ? `<div class="inspector-section"><h3>Tags</h3><div class="inspector-tags">${node.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div>`
      : "";
    const links = (node.links ?? []).length
      ? `<div class="inspector-section"><h3>Sources</h3><div class="inspector-links">${node.links.map((link) => `<a class="inspector-link" href="${escapeHtml(linkHref(link))}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}</div></div>`
      : "";
    elements.inspectorBody.innerHTML = `
      ${node.status ? `<span class="inspector-status ${escapeHtml(node.tone ?? "")}">${escapeHtml(node.status)}</span>` : ""}
      ${node.summary ? `<p class="inspector-summary">${escapeHtml(node.summary)}</p>` : ""}
      ${detail}${fields}${tags}${links}
    `;
    elements.inspector.classList.add("open");
    elements.inspector.setAttribute("aria-hidden", "false");
  }

  function frameDocument() {
    return elements.diagramFrame.contentDocument;
  }

  function clearHighlight() {
    frameDocument()?.querySelector(".schematics-selection-outline")?.remove();
  }

  function highlightNode(nodeId) {
    clearHighlight();
    const target = frameDocument()?.querySelector(`[data-schematic-id="${CSS.escape(nodeId)}"]`);
    if (!target || typeof target.getBBox !== "function") return;
    const box = target.getBBox();
    const outline = target.ownerDocument.createElementNS(SVG_NS, "rect");
    outline.setAttribute("x", String(box.x - 5));
    outline.setAttribute("y", String(box.y - 5));
    outline.setAttribute("width", String(box.width + 10));
    outline.setAttribute("height", String(box.height + 10));
    outline.setAttribute("rx", "8");
    outline.setAttribute("fill", "none");
    outline.setAttribute("stroke", "#eb6c36");
    outline.setAttribute("stroke-width", "2");
    outline.setAttribute("vector-effect", "non-scaling-stroke");
    outline.setAttribute("pointer-events", "none");
    outline.classList.add("schematics-selection-outline");
    target.ownerSVGElement?.append(outline);
  }

  function selectNode(nodeId) {
    const node = nodeById(nodeId);
    if (!node) return;
    highlightNode(nodeId);
    renderInspector(node);
  }

  function clearSelection() {
    clearHighlight();
    elements.inspector.classList.remove("open");
    elements.inspector.setAttribute("aria-hidden", "true");
  }

  function clampScale(value) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
  }

  let transformFrame;
  function applyTransform() {
    if (transformFrame) return;
    transformFrame = requestAnimationFrame(() => {
      transformFrame = undefined;
      elements.canvasWorld.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.scale})`;
    });
  }

  function updateZoomLabel() {
    elements.zoomLabel.textContent = `${Math.round(state.scale * 100)}%`;
  }

  function setScale(nextScale, anchorX, anchorY, viewportRect) {
    const rect = viewportRect ?? elements.canvasViewport.getBoundingClientRect();
    const localX = anchorX ?? rect.width / 2;
    const localY = anchorY ?? rect.height / 2;
    const worldX = (localX - state.panX) / state.scale;
    const worldY = (localY - state.panY) / state.scale;
    state.scale = clampScale(nextScale);
    state.panX = localX - worldX * state.scale;
    state.panY = localY - worldY * state.scale;
    updateZoomLabel();
    applyTransform();
  }

  function fitView({ readableOnNarrow = false } = {}) {
    const view = currentView();
    const rect = elements.canvasViewport.getBoundingClientRect();
    const paddingX = rect.width < 760 ? 24 : 72;
    const paddingTop = rect.width < 760 ? 96 : 104;
    const paddingBottom = 72;
    const fittedScale = clampScale(
      Math.min((rect.width - paddingX * 2) / view.width, (rect.height - paddingTop - paddingBottom) / view.height, 1.12),
    );
    state.scale = readableOnNarrow && rect.width < 760 ? Math.max(fittedScale, 0.58) : fittedScale;
    state.panX = readableOnNarrow && state.scale > fittedScale
      ? 16
      : (rect.width - view.width * state.scale) / 2;
    state.panY = paddingTop;
    updateZoomLabel();
    applyTransform();
  }

  function startDrag(clientX, clientY) {
    state.dragging = true;
    state.dragMoved = false;
    state.dragStartX = clientX;
    state.dragStartY = clientY;
    state.panStartX = state.panX;
    state.panStartY = state.panY;
    elements.canvasViewport.classList.add("dragging");
  }

  function moveDrag(clientX, clientY) {
    if (!state.dragging) return;
    const dx = clientX - state.dragStartX;
    const dy = clientY - state.dragStartY;
    if (Math.abs(dx) + Math.abs(dy) > 4) state.dragMoved = true;
    state.panX = state.panStartX + dx;
    state.panY = state.panStartY + dy;
    applyTransform();
  }

  function endDrag() {
    if (!state.dragging) return;
    state.dragging = false;
    elements.canvasViewport.classList.remove("dragging");
    if (!state.dragMoved) clearSelection();
  }

  function handleFrameWheel(event) {
    event.preventDefault();
    const viewportRect = elements.canvasViewport.getBoundingClientRect();
    const frameRect = elements.diagramFrame.getBoundingClientRect();
    const anchorX = frameRect.left - viewportRect.left + event.clientX * state.scale;
    const anchorY = frameRect.top - viewportRect.top + event.clientY * state.scale;
    setScale(state.scale * Math.exp(-event.deltaY * 0.0012), anchorX, anchorY, viewportRect);
  }

  function activateFrameTarget(target) {
    const viewTarget = target.closest?.("[data-schematic-view]");
    if (viewTarget) {
      switchView(viewTarget.dataset.schematicView);
      return true;
    }
    const nodeTarget = target.closest?.("[data-schematic-id]");
    if (nodeTarget) {
      selectNode(nodeTarget.dataset.schematicId);
      return true;
    }
    return false;
  }

  function setupFrame(view, selectedNodeId) {
    const doc = frameDocument();
    if (!doc) return;
    doc.querySelectorAll("[data-schematic-view], [data-schematic-id]").forEach((target) => {
      target.setAttribute("tabindex", "0");
      if (target.dataset.schematicView) {
        const destination = data.views.find((candidate) => candidate.id === target.dataset.schematicView);
        target.setAttribute("role", "link");
        if (destination) target.setAttribute("aria-label", `Open ${destination.label} view.`);
      } else {
        const node = nodeById(target.dataset.schematicId, view);
        target.setAttribute("role", "button");
        if (node) target.setAttribute("aria-label", `${node.title}. Open details.`);
      }
    });
    doc.addEventListener("click", (event) => {
      if (activateFrameTarget(event.target)) {
        event.preventDefault();
      } else if (!state.dragMoved) {
        clearSelection();
      }
    });
    doc.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && activateFrameTarget(event.target)) {
        event.preventDefault();
      } else if (event.key === "Escape") {
        clearSelection();
      }
    });
    doc.addEventListener("wheel", handleFrameWheel, { passive: false });
    doc.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest?.("[data-schematic-id], [data-schematic-view]")) return;
      startDrag(event.clientX, event.clientY);
    });
    doc.addEventListener("pointermove", (event) => moveDrag(event.clientX, event.clientY));
    doc.addEventListener("pointerup", endDrag);
    doc.addEventListener("pointercancel", endDrag);
    requestAnimationFrame(() => fitView({ readableOnNarrow: true }));
    if (selectedNodeId) requestAnimationFrame(() => selectNode(selectedNodeId));
  }

  function renderView(selectedNodeId = null) {
    const view = currentView();
    elements.viewKicker.textContent = view.label;
    elements.viewTitle.textContent = view.question;
    elements.viewSource.href = view.source;
    elements.diagramFrame.title = view.question;
    elements.diagramFrame.style.width = `${view.width}px`;
    elements.diagramFrame.style.height = `${view.height}px`;
    elements.canvasWorld.style.width = `${view.width}px`;
    elements.canvasWorld.style.height = `${view.height}px`;
    elements.diagramFrame.onload = () => setupFrame(view, selectedNodeId);
    elements.diagramFrame.srcdoc = view.html;
    renderNavigation();
    clearSelection();
  }

  function switchView(viewId, nodeId = null) {
    state.viewId = viewId;
    elements.sidebar.classList.remove("open");
    renderView(nodeId);
  }

  const indexedNodes = data.views.flatMap((view) =>
    view.nodes.map((node) => ({
      view,
      node,
      text: JSON.stringify(node).toLowerCase(),
    })),
  );

  function renderSearchResults() {
    const query = elements.searchInput.value.trim().toLowerCase();
    if (!query) {
      elements.searchResults.hidden = true;
      elements.searchResults.replaceChildren();
      return;
    }
    const matches = indexedNodes.filter((entry) => entry.text.includes(query)).slice(0, 10);
    elements.searchResults.hidden = false;
    elements.searchResults.innerHTML = matches.length
      ? matches.map((entry, index) => `<button type="button" class="search-result" data-result-index="${index}"><strong>${escapeHtml(entry.node.title)}</strong><span>${escapeHtml(entry.view.label)} · ${escapeHtml(entry.node.kind)}</span></button>`).join("")
      : '<div class="search-empty">No matching items.</div>';
    elements.searchResults.querySelectorAll(".search-result").forEach((button) => {
      button.addEventListener("click", () => {
        const entry = matches[Number(button.dataset.resultIndex)];
        if (!entry) return;
        elements.searchInput.value = "";
        elements.searchResults.hidden = true;
        switchView(entry.view.id, entry.node.id);
      });
    });
  }

  elements.searchInput.addEventListener("input", renderSearchResults);
  elements.searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      elements.searchInput.value = "";
      elements.searchResults.hidden = true;
      elements.searchInput.blur();
    }
  });
  elements.closeInspector.addEventListener("click", clearSelection);
  elements.zoomOut.addEventListener("click", () => setScale(state.scale / 1.18));
  elements.zoomIn.addEventListener("click", () => setScale(state.scale * 1.18));
  elements.zoomLabel.addEventListener("click", () => setScale(1));
  elements.fitCanvas.addEventListener("click", () => fitView());
  elements.mobileNavButton.addEventListener("click", () => elements.sidebar.classList.toggle("open"));
  elements.mobileBackdrop.addEventListener("click", () => elements.sidebar.classList.remove("open"));

  elements.canvasViewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    const rect = elements.canvasViewport.getBoundingClientRect();
    setScale(
      state.scale * Math.exp(-event.deltaY * 0.0012),
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect,
    );
  }, { passive: false });
  elements.canvasViewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest(".canvas-controls")) return;
    startDrag(event.clientX, event.clientY);
    elements.canvasViewport.setPointerCapture(event.pointerId);
  });
  elements.canvasViewport.addEventListener("pointermove", (event) => moveDrag(event.clientX, event.clientY));
  elements.canvasViewport.addEventListener("pointerup", (event) => {
    if (elements.canvasViewport.hasPointerCapture(event.pointerId)) elements.canvasViewport.releasePointerCapture(event.pointerId);
    endDrag();
  });
  elements.canvasViewport.addEventListener("pointercancel", endDrag);

  window.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      elements.searchInput.focus();
    } else if (event.key === "Escape") {
      clearSelection();
      elements.sidebar.classList.remove("open");
    } else if (event.key === "0" && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName ?? "")) {
      fitView();
    }
  });

  let resizeFrame;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => fitView({ readableOnNarrow: true }));
  });

  renderHeader();
  renderSummary();
  renderView();
})();
