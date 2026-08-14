(() => {
  "use strict";

  const data = window.OVERVIEW_DATA;
  if (!data || !Array.isArray(data.views) || data.views.length === 0) {
    document.body.innerHTML = '<main style="padding:40px;font-family:system-ui">Overview data is missing.</main>';
    return;
  }

  const MIN_SCALE = 0.32;
  const MAX_SCALE = 1.65;
  const SVG_NS = "http://www.w3.org/2000/svg";

  const elements = {
    prTitle: document.getElementById("prTitle"),
    titleMeta: document.getElementById("titleMeta"),
    overviewBadge: document.getElementById("overviewBadge"),
    recapLink: document.getElementById("recapLink"),
    mobileRecapLink: document.getElementById("mobileRecapLink"),
    viewNav: document.getElementById("viewNav"),
    overviewSummary: document.getElementById("overviewSummary"),
    viewKicker: document.getElementById("viewKicker"),
    viewTitle: document.getElementById("viewTitle"),
    viewCount: document.getElementById("viewCount"),
    canvasViewport: document.getElementById("canvasViewport"),
    canvasWorld: document.getElementById("canvasWorld"),
    edgeLayer: document.getElementById("edgeLayer"),
    nodeLayer: document.getElementById("nodeLayer"),
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
  };

  const state = {
    viewId: data.views[0].id,
    scale: 0.8,
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
    if (href === "$pr") return data.meta.url;
    if (href.startsWith("$pr/")) return `${data.meta.url}/${href.slice(4)}`;
    if (href.startsWith("$source/")) {
      return `https://github.com/${data.meta.repository}/blob/${data.meta.head}/${href.slice(8)}`;
    }
    return href;
  }

  function renderHeader() {
    const meta = data.meta;
    document.title = `PR #${meta.number} overview · ${meta.repository}`;
    elements.prTitle.textContent = `#${meta.number} · ${meta.title}`;
    elements.titleMeta.textContent = `${meta.repository} · ${meta.base.slice(0, 7)} → ${meta.head.slice(0, 7)} · ${meta.snapshot}`;
    elements.overviewBadge.textContent = meta.badge;
    elements.overviewBadge.className = `overview-badge ${meta.badgeTone ?? ""}`;
    if (meta.recapHref) {
      elements.recapLink.href = meta.recapHref;
      elements.mobileRecapLink.href = meta.recapHref;
      elements.recapLink.hidden = false;
      elements.mobileRecapLink.hidden = false;
    }
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
    elements.overviewSummary.innerHTML = `
      <div class="section-label">Overview snapshot</div>
      ${(data.meta.summary ?? []).map((item) => `<div class="summary-row"><span>${escapeHtml(item.label)}</span><strong class="${escapeHtml(item.tone ?? "")}">${escapeHtml(item.value)}</strong></div>`).join("")}
    `;
  }

  function renderNode(node) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `overview-node ${node.kind}`;
    button.dataset.nodeId = node.id;
    button.style.left = `${node.x}px`;
    button.style.top = `${node.y}px`;
    button.style.width = `${node.w ?? 250}px`;
    button.style.height = `${node.h ?? 140}px`;
    button.setAttribute("aria-label", `${node.title}. ${node.summary ?? "Open details."}`);

    const tone = node.tone ?? "";
    const status = node.status;
    if (node.kind === "table" || node.kind === "api") {
      const rows = (node.rows ?? [])
        .map(
          (row) => `<div class="node-row"><strong class="${row.key ? "key" : ""}">${escapeHtml(row.label)}</strong><span>${escapeHtml(row.value)}</span></div>`,
        )
        .join("");
      button.innerHTML = `
        <div class="table-head"><div class="node-eyebrow">${escapeHtml(node.eyebrow ?? node.kind)}</div><h3 class="node-title">${escapeHtml(node.title)}</h3></div>
        <div class="node-rows">${rows}</div>
      `;
    } else {
      button.innerHTML = `
        <div class="node-topline">
          <span class="node-eyebrow">${escapeHtml(node.eyebrow ?? node.kind)}</span>
          ${status ? `<span class="node-status ${tone}">${escapeHtml(status)}</span>` : ""}
        </div>
        <h3 class="node-title">${escapeHtml(node.title)}</h3>
        ${node.summary ? `<p class="node-summary">${escapeHtml(node.summary)}</p>` : ""}
        ${(node.tags ?? []).length ? `<div class="node-tags">${node.tags.slice(0, 4).map((tag) => `<span class="node-tag">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      `;
    }
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectNode(node.id);
    });
    elements.nodeLayer.append(button);
  }

  function edgeGeometry(edge, view) {
    const from = nodeById(edge.from, view);
    const to = nodeById(edge.to, view);
    if (!from || !to) return null;
    const fw = from.w ?? 250;
    const fh = from.h ?? 140;
    const tw = to.w ?? 250;
    const th = to.h ?? 140;
    const fromCenter = { x: from.x + fw / 2, y: from.y + fh / 2 };
    const toCenter = { x: to.x + tw / 2, y: to.y + th / 2 };
    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;
    let start;
    let end;
    let path;
    let label;
    if (Math.abs(dx) >= Math.abs(dy)) {
      start = { x: dx >= 0 ? from.x + fw : from.x, y: fromCenter.y };
      end = { x: dx >= 0 ? to.x : to.x + tw, y: toCenter.y };
      const middleX = (start.x + end.x) / 2;
      path = `M ${start.x} ${start.y} H ${middleX} V ${end.y} H ${end.x}`;
      label = {
        x: middleX,
        y: (start.y + end.y) / 2 - 12,
        orientation: "horizontal",
        maxWidth: Math.max(34, Math.abs(end.x - start.x) - 16),
      };
    } else {
      start = { x: fromCenter.x, y: dy >= 0 ? from.y + fh : from.y };
      end = { x: toCenter.x, y: dy >= 0 ? to.y : to.y + th };
      const middleY = (start.y + end.y) / 2;
      path = `M ${start.x} ${start.y} V ${middleY} H ${end.x} V ${end.y}`;
      label = {
        x: (start.x + end.x) / 2,
        y: middleY,
        orientation: "vertical",
        maxWidth: 150,
      };
    }
    return { path, label };
  }

  function renderEdges(view) {
    elements.edgeLayer.querySelectorAll(".edge-group").forEach((group) => group.remove());
    for (const edge of view.edges ?? []) {
      const geometry = edgeGeometry(edge, view);
      if (!geometry) continue;
      const group = document.createElementNS(SVG_NS, "g");
      group.classList.add("edge-group");
      group.dataset.from = edge.from;
      group.dataset.to = edge.to;
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", geometry.path);
      path.classList.add("edge");
      if (edge.tone) path.classList.add(edge.tone);
      group.append(path);
      if (edge.label) {
        const naturalWidth = Math.max(46, edge.label.length * 6.2 + 18);
        const width = Math.min(naturalWidth, geometry.label.maxWidth);
        const rectX = geometry.label.orientation === "vertical" ? geometry.label.x + 8 : geometry.label.x - width / 2;
        const textX = rectX + width / 2;
        const rect = document.createElementNS(SVG_NS, "rect");
        rect.setAttribute("x", rectX);
        rect.setAttribute("y", geometry.label.y - 9);
        rect.setAttribute("width", width);
        rect.setAttribute("height", 18);
        rect.setAttribute("rx", 5);
        rect.classList.add("edge-label-bg");
        const text = document.createElementNS(SVG_NS, "text");
        text.setAttribute("x", textX);
        text.setAttribute("y", geometry.label.y + 3.5);
        text.setAttribute("text-anchor", "middle");
        if (naturalWidth > width) {
          text.setAttribute("textLength", Math.max(18, width - 14));
          text.setAttribute("lengthAdjust", "spacingAndGlyphs");
        }
        text.classList.add("edge-label");
        text.textContent = edge.label;
        group.append(rect, text);
      }
      elements.edgeLayer.append(group);
    }
  }

  function renderView({ fit = true } = {}) {
    const view = currentView();
    elements.viewKicker.textContent = view.label;
    elements.viewTitle.textContent = view.question;
    elements.viewCount.textContent = `${view.nodes.length} nodes · ${(view.edges ?? []).length} links`;
    elements.nodeLayer.replaceChildren();
    view.nodes.forEach(renderNode);
    renderEdges(view);
    renderNavigation();
    clearSelection();
    if (fit) requestAnimationFrame(() => fitView({ readableOnNarrow: true }));
  }

  function switchView(viewId) {
    if (!data.views.some((view) => view.id === viewId)) return;
    state.viewId = viewId;
    elements.sidebar.classList.remove("open");
    renderView();
  }

  function relatedIds(node, view) {
    const ids = new Set(node.focusRelated ?? []);
    for (const edge of view.edges ?? []) {
      if (edge.from === node.id) ids.add(edge.to);
      if (edge.to === node.id) ids.add(edge.from);
    }
    return ids;
  }

  function applyFocus(node) {
    const view = currentView();
    const related = relatedIds(node, view);
    elements.nodeLayer.querySelectorAll(".overview-node").forEach((element) => {
      const id = element.dataset.nodeId;
      element.classList.toggle("selected", id === node.id);
      element.classList.toggle("related", related.has(id));
      element.classList.toggle("dimmed", id !== node.id && !related.has(id));
    });
    elements.edgeLayer.querySelectorAll(".edge-group").forEach((group) => {
      const connected = group.dataset.from === node.id || group.dataset.to === node.id;
      group.querySelector(".edge")?.classList.toggle("highlighted", connected);
      group.querySelector(".edge")?.classList.toggle("dimmed", !connected);
      group.querySelector(".edge-label-bg")?.classList.toggle("dimmed", !connected);
      group.querySelector(".edge-label")?.classList.toggle("dimmed", !connected);
    });
  }

  function renderInspector(node) {
    const tone = node.tone ?? "";
    elements.inspectorKicker.textContent = node.eyebrow ?? node.kind;
    elements.inspectorTitle.textContent = node.title;
    const detail = (node.detail ?? []).map((paragraph) => `<p class="inspector-copy">${escapeHtml(paragraph)}</p>`).join("");
    const fields = node.fields
      ? `<div class="inspector-section"><h3>Evidence</h3>${Object.entries(node.fields)
          .map(([label, value]) => `<div class="summary-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`)
          .join("")}</div>`
      : "";
    const tags = (node.tags ?? []).length
      ? `<div class="inspector-section"><h3>Tags</h3><div class="inspector-tags">${node.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div>`
      : "";
    const links = (node.links ?? []).length
      ? `<div class="inspector-section"><h3>Sources</h3><div class="inspector-links">${node.links.map((link) => `<a class="inspector-link" href="${escapeHtml(linkHref(link))}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}</div></div>`
      : "";
    const status = node.status;
    elements.inspectorBody.innerHTML = `
      ${status ? `<span class="inspector-status ${tone}">${escapeHtml(status)}</span>` : ""}
      ${node.summary ? `<p class="inspector-summary">${escapeHtml(node.summary)}</p>` : ""}
      ${detail}${fields}${tags}${links}
    `;
    elements.inspector.classList.add("open");
    elements.inspector.setAttribute("aria-hidden", "false");
  }

  function selectNode(nodeId) {
    const node = nodeById(nodeId);
    if (!node) return;
    applyFocus(node);
    renderInspector(node);
  }

  function clearSelection() {
    elements.nodeLayer.querySelectorAll(".overview-node").forEach((element) => element.classList.remove("selected", "related", "dimmed"));
    elements.edgeLayer.querySelectorAll(".edge").forEach((edge) => edge.classList.remove("highlighted", "dimmed"));
    elements.edgeLayer.querySelectorAll(".edge-label, .edge-label-bg").forEach((label) => label.classList.remove("dimmed"));
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
      elements.zoomLabel.textContent = `${Math.round(state.scale * 100)}%`;
    });
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
    applyTransform();
  }

  function fitView({ readableOnNarrow = false } = {}) {
    const view = currentView();
    if (view.nodes.length === 0) return;
    const minX = Math.min(...view.nodes.map((node) => node.x));
    const minY = Math.min(...view.nodes.map((node) => node.y));
    const maxX = Math.max(...view.nodes.map((node) => node.x + (node.w ?? 250)));
    const maxY = Math.max(...view.nodes.map((node) => node.y + (node.h ?? 140)));
    const rect = elements.canvasViewport.getBoundingClientRect();
    const paddingX = rect.width < 760 ? 30 : 90;
    const paddingTop = rect.width < 760 ? 100 : 110;
    const paddingBottom = 80;
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const fittedScale = clampScale(
      Math.min((rect.width - paddingX * 2) / contentWidth, (rect.height - paddingTop - paddingBottom) / contentHeight, 1.08),
    );
    state.scale = readableOnNarrow && rect.width < 760 ? Math.max(fittedScale, 0.62) : fittedScale;
    state.panX = readableOnNarrow && state.scale > fittedScale
      ? 18 - minX * state.scale
      : (rect.width - contentWidth * state.scale) / 2 - minX * state.scale;
    state.panY = paddingTop - minY * state.scale;
    applyTransform();
  }

  function searchIndex() {
    return data.views.flatMap((view) =>
      view.nodes.map((node) => ({
        view,
        node,
        text: JSON.stringify(node).toLowerCase(),
      })),
    );
  }

  const indexedNodes = searchIndex();

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
      ? matches
          .map(
            (entry, index) => `<button type="button" class="search-result" data-result-index="${index}"><strong>${escapeHtml(entry.node.title)}</strong><span>${escapeHtml(entry.view.label)} · ${escapeHtml(entry.node.kind)}</span></button>`,
          )
          .join("")
      : '<div class="search-empty">No matching overview nodes.</div>';
    elements.searchResults.querySelectorAll(".search-result").forEach((button) => {
      button.addEventListener("click", () => {
        const entry = matches[Number(button.dataset.resultIndex)];
        if (!entry) return;
        state.viewId = entry.view.id;
        renderView();
        requestAnimationFrame(() => selectNode(entry.node.id));
        elements.searchInput.value = "";
        elements.searchResults.hidden = true;
        elements.sidebar.classList.remove("open");
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

  elements.canvasViewport.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const rect = elements.canvasViewport.getBoundingClientRect();
      const factor = Math.exp(-event.deltaY * 0.0012);
      setScale(state.scale * factor, event.clientX - rect.left, event.clientY - rect.top, rect);
    },
    { passive: false },
  );

  elements.canvasViewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest(".overview-node, .canvas-controls")) return;
    state.dragging = true;
    state.dragMoved = false;
    state.dragStartX = event.clientX;
    state.dragStartY = event.clientY;
    state.panStartX = state.panX;
    state.panStartY = state.panY;
    elements.canvasViewport.classList.add("dragging");
    elements.canvasViewport.setPointerCapture(event.pointerId);
  });

  elements.canvasViewport.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    const dx = event.clientX - state.dragStartX;
    const dy = event.clientY - state.dragStartY;
    if (Math.abs(dx) + Math.abs(dy) > 4) state.dragMoved = true;
    state.panX = state.panStartX + dx;
    state.panY = state.panStartY + dy;
    applyTransform();
  });

  function endDrag(event) {
    if (!state.dragging) return;
    state.dragging = false;
    elements.canvasViewport.classList.remove("dragging");
    if (elements.canvasViewport.hasPointerCapture(event.pointerId)) elements.canvasViewport.releasePointerCapture(event.pointerId);
  }

  elements.canvasViewport.addEventListener("pointerup", endDrag);
  elements.canvasViewport.addEventListener("pointercancel", endDrag);
  elements.canvasViewport.addEventListener("click", (event) => {
    if (state.dragMoved || event.target.closest(".overview-node, .canvas-controls")) return;
    clearSelection();
  });

  document.addEventListener("keydown", (event) => {
    const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      elements.searchInput.focus();
      elements.searchInput.select();
      return;
    }
    if (typing) return;
    if (event.key === "Escape") clearSelection();
    if (event.key === "0") fitView();
    if (event.key === "+" || event.key === "=") setScale(state.scale * 1.18);
    if (event.key === "-") setScale(state.scale / 1.18);
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
