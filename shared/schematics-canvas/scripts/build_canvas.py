#!/usr/bin/env python3
"""Build a static Schematics Canvas from a JSON manifest and Diagram Design views."""

from __future__ import annotations

import argparse
import html
import json
import re
import shutil
import sys
from html.parser import HTMLParser
from pathlib import Path


ID_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
START_MARKER = "<!-- schematics:embed:start -->"
END_MARKER = "<!-- schematics:embed:end -->"


class CanvasBuildError(ValueError):
    """Raised when a canvas manifest or source view is invalid."""


class SchematicMarkerParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=False)
        self.ids: list[str] = []
        self.view_targets: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name == "data-schematic-id" and value:
                self.ids.append(value)
            elif name == "data-schematic-view":
                self.view_targets.append(value or "")


def require_object(value: object, location: str) -> dict:
    if not isinstance(value, dict):
        raise CanvasBuildError(f"{location} must be an object")
    return value


def require_string(value: object, location: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise CanvasBuildError(f"{location} must be a non-empty string")
    return value


def require_id(value: object, location: str) -> str:
    identifier = require_string(value, location)
    if not ID_PATTERN.fullmatch(identifier):
        raise CanvasBuildError(f"{location} must use lowercase kebab-case")
    return identifier


def unique(values: list[str], location: str) -> None:
    duplicates = sorted({value for value in values if values.count(value) > 1})
    if duplicates:
        raise CanvasBuildError(f"{location} contains duplicate IDs: {', '.join(duplicates)}")


def resolve_source(manifest_dir: Path, source: object, location: str) -> Path:
    source_name = require_string(source, location)
    if Path(source_name).is_absolute():
        raise CanvasBuildError(f"{location} must be relative to the manifest")
    source_path = (manifest_dir / source_name).resolve()
    try:
        source_path.relative_to(manifest_dir)
    except ValueError as error:
        raise CanvasBuildError(f"{location} must stay inside the artifact directory") from error
    if not source_path.is_file():
        raise CanvasBuildError(f"{location} does not exist: {source_name}")
    return source_path


def extract_fragment(source_html: str, location: str) -> str:
    if source_html.count(START_MARKER) != 1 or source_html.count(END_MARKER) != 1:
        raise CanvasBuildError(
            f"{location} must contain one {START_MARKER} and one {END_MARKER}"
        )
    start = source_html.index(START_MARKER) + len(START_MARKER)
    end = source_html.index(END_MARKER)
    if end <= start:
        raise CanvasBuildError(f"{location} has reversed embed markers")
    fragment = source_html[start:end].strip()
    if not re.match(r"^<svg\b", fragment, flags=re.IGNORECASE):
        raise CanvasBuildError(f"{location} must place one SVG directly between the embed markers")
    if not re.search(r"</svg>\s*$", fragment, flags=re.IGNORECASE):
        raise CanvasBuildError(f"{location} embed fragment must end after the SVG")
    return fragment


def extract_viewbox(fragment: str, location: str) -> tuple[int, int]:
    match = re.search(
        r"<svg\b[^>]*\bviewBox\s*=\s*(['\"])\s*[-+]?\d+(?:\.\d+)?\s+[-+]?\d+(?:\.\d+)?\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*\1",
        fragment,
        flags=re.IGNORECASE,
    )
    if not match:
        raise CanvasBuildError(f"{location} SVG must have a numeric viewBox")
    width = round(float(match.group(2)))
    height = round(float(match.group(3)))
    if width <= 0 or height <= 0:
        raise CanvasBuildError(f"{location} SVG viewBox must have positive dimensions")
    return width, height


def extract_styles(source_html: str) -> str:
    link_tags = [
        match.group(0)
        for match in re.finditer(
            r"<link\b[^>]*\brel\s*=\s*(['\"])stylesheet\1[^>]*>",
            source_html,
            flags=re.IGNORECASE,
        )
    ]
    style_tags = re.findall(r"<style\b[^>]*>.*?</style>", source_html, flags=re.IGNORECASE | re.DOTALL)
    return "\n".join(link_tags + style_tags)


def embedded_document(source_html: str, fragment: str, title: str) -> str:
    styles = extract_styles(source_html)
    safe_title = html.escape(title)
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{safe_title}</title>
  {styles}
  <style>
    html, body {{ width: 100%; height: 100%; margin: 0; overflow: hidden; background: #f5f5f5; }}
    body {{ display: grid; place-items: center; }}
    body > svg {{ display: block; width: 100%; height: 100%; }}
    [data-schematic-id] {{ cursor: pointer; }}
    [data-schematic-view] {{ cursor: pointer; }}
    [data-schematic-id]:focus-visible,
    [data-schematic-view]:focus-visible {{ outline: 2px solid #eb6c36; outline-offset: 4px; }}
  </style>
</head>
<body>
{fragment}
</body>
</html>"""


def build_view(view_value: object, index: int, manifest_dir: Path) -> dict:
    location = f"views[{index}]"
    view = require_object(view_value, location).copy()
    require_id(view.get("id"), f"{location}.id")
    require_string(view.get("label"), f"{location}.label")
    question = require_string(view.get("question"), f"{location}.question")
    source_path = resolve_source(manifest_dir, view.get("source"), f"{location}.source")

    nodes_value = view.get("nodes")
    if not isinstance(nodes_value, list):
        raise CanvasBuildError(f"{location}.nodes must be an array")
    nodes: list[dict] = []
    node_ids: list[str] = []
    for node_index, node_value in enumerate(nodes_value):
        node_location = f"{location}.nodes[{node_index}]"
        node = require_object(node_value, node_location)
        node_id = require_id(node.get("id"), f"{node_location}.id")
        require_string(node.get("title"), f"{node_location}.title")
        require_string(node.get("kind"), f"{node_location}.kind")
        node_ids.append(node_id)
        nodes.append(node)
    unique(node_ids, f"{location}.nodes")

    source_html = source_path.read_text(encoding="utf-8")
    fragment = extract_fragment(source_html, str(view.get("source")))
    width, height = extract_viewbox(fragment, str(view.get("source")))
    parser = SchematicMarkerParser()
    parser.feed(fragment)
    unique(parser.ids, f"{location} diagram")
    for target_index, target_id in enumerate(parser.view_targets):
        require_id(target_id, f"{location} diagram view target {target_index}")
    marker_ids = set(parser.ids)
    described_ids = set(node_ids)
    missing = sorted(described_ids - marker_ids)
    undocumented = sorted(marker_ids - described_ids)
    if missing:
        raise CanvasBuildError(f"{location} diagram is missing markers for: {', '.join(missing)}")
    if undocumented:
        raise CanvasBuildError(f"{location}.nodes is missing details for: {', '.join(undocumented)}")

    view["nodes"] = nodes
    view["width"] = width
    view["height"] = height
    view["html"] = embedded_document(source_html, fragment, question)
    view["source"] = source_path.relative_to(manifest_dir).as_posix()
    view["_viewTargets"] = parser.view_targets
    return view


def build(manifest_path: Path) -> Path:
    manifest_path = manifest_path.resolve()
    if not manifest_path.is_file():
        raise CanvasBuildError(f"Manifest does not exist: {manifest_path}")
    manifest_dir = manifest_path.parent
    try:
        manifest_value = json.loads(manifest_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise CanvasBuildError(f"Invalid JSON at line {error.lineno}, column {error.colno}: {error.msg}") from error

    manifest = require_object(manifest_value, "manifest").copy()
    meta = require_object(manifest.get("meta"), "meta")
    require_string(meta.get("title"), "meta.title")
    require_string(meta.get("artifactLabel"), "meta.artifactLabel")

    views_value = manifest.get("views")
    if not isinstance(views_value, list) or not views_value:
        raise CanvasBuildError("views must be a non-empty array")
    views = [build_view(view, index, manifest_dir) for index, view in enumerate(views_value)]
    unique([view["id"] for view in views], "views")
    view_ids = {view["id"] for view in views}
    for index, view in enumerate(views):
        unknown_targets = sorted(set(view.pop("_viewTargets")) - view_ids)
        if unknown_targets:
            raise CanvasBuildError(
                f"views[{index}] diagram links to unknown views: {', '.join(unknown_targets)}"
            )
    manifest["views"] = views

    script_path = Path(__file__).resolve()
    template_dir = script_path.parent.parent / "assets" / "schematics-canvas"
    for name in ("index.html", "app.css", "app.js"):
        source = template_dir / name
        if not source.is_file():
            raise CanvasBuildError(f"Canvas asset is missing: {source}")
        destination = manifest_dir / name
        if source.resolve() != destination.resolve():
            shutil.copyfile(source, destination)

    data_path = manifest_dir / "canvas-data.js"
    payload = json.dumps(manifest, ensure_ascii=True, indent=2)
    data_path.write_text(f"window.SCHEMATICS_DATA = {payload};\n", encoding="utf-8")
    return data_path


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build Schematics Canvas files beside a canvas manifest."
    )
    parser.add_argument("manifest", type=Path, help="Path to canvas-manifest.json")
    args = parser.parse_args()
    try:
        data_path = build(args.manifest)
    except (CanvasBuildError, OSError) as error:
        print(f"Canvas build failed: {error}", file=sys.stderr)
        return 1
    print(f"Built {data_path.parent / 'index.html'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
