#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path

BUMP_LEVELS = ("patch", "minor", "major")


def find_repo_root(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / "package.json").exists() and (candidate / ".changeset" / "config.json").exists():
            return candidate
    raise FileNotFoundError("Could not find repo root containing package.json and .changeset/config.json")


def load_packages(repo_root: Path) -> list[dict[str, object]]:
    packages: list[dict[str, object]] = []
    for base in ("apps", "packages"):
        base_dir = repo_root / base
        if not base_dir.is_dir():
            continue
        for package_json in sorted(base_dir.glob("*/package.json")):
            data = json.loads(package_json.read_text())
            name = data.get("name")
            if not isinstance(name, str) or not name:
                continue
            packages.append(
                {
                    "name": name,
                    "dir": package_json.parent.relative_to(repo_root).as_posix(),
                    "version": data.get("version"),
                }
            )
    return packages


def load_fixed_groups(repo_root: Path) -> list[list[str]]:
    config = json.loads((repo_root / ".changeset" / "config.json").read_text())
    fixed = config.get("fixed", [])
    return [group for group in fixed if isinstance(group, list)]


def build_package_index(packages: list[dict[str, object]]) -> dict[str, dict[str, object]]:
    return {str(package["name"]): package for package in packages}


def parse_package_spec(spec: str) -> tuple[str, str]:
    if "=" in spec:
        name, bump = spec.rsplit("=", 1)
    elif ":" in spec:
        name, bump = spec.rsplit(":", 1)
    else:
        raise ValueError(f"Invalid package spec '{spec}'. Use name=patch or name:patch.")

    name = name.strip()
    bump = bump.strip().lower()
    if bump not in BUMP_LEVELS:
        raise ValueError(f"Invalid bump level '{bump}' for '{name}'. Use patch, minor, or major.")
    if not name:
        raise ValueError(f"Invalid package spec '{spec}'. Package name is empty.")
    return name, bump


def normalize_rel_path(repo_root: Path, raw_path: str) -> str:
    path = Path(raw_path)
    if path.is_absolute():
        try:
            return path.resolve().relative_to(repo_root.resolve()).as_posix()
        except ValueError as exc:
            raise ValueError(f"Path '{raw_path}' is outside the repository root.") from exc
    return path.as_posix().lstrip("./")


def package_for_path(repo_root: Path, packages: list[dict[str, object]], raw_path: str) -> dict[str, object]:
    rel_path = normalize_rel_path(repo_root, raw_path)
    matches = []
    for package in packages:
        package_dir = str(package["dir"])
        if rel_path == package_dir or rel_path.startswith(f"{package_dir}/"):
            matches.append(package)
    if not matches:
        raise ValueError(f"Could not map path '{raw_path}' to a workspace package.")
    matches.sort(key=lambda package: len(str(package["dir"])), reverse=True)
    return matches[0]


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "changeset"


def generate_filename(package_names: list[str]) -> str:
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    package_slug = "-".join(slugify(name) for name in package_names[:2])
    package_slug = package_slug[:48].strip("-")
    if package_slug:
        return f"{stamp}-{package_slug}.md"
    return f"{stamp}-changeset.md"


def render_changeset(entries: list[tuple[str, str]], summary: str) -> str:
    lines = ["---"]
    for name, bump in entries:
        lines.append(f'"{name}": {bump}')
    lines.append("---")
    lines.append("")
    lines.append(summary.strip())
    lines.append("")
    return "\n".join(lines)


def write_output(content: str, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if output_path.exists():
        raise FileExistsError(f"Refusing to overwrite existing file: {output_path}")
    output_path.write_text(content)


def main() -> int:
    parser = argparse.ArgumentParser(description="Preview or create a Changesets markdown entry.")
    parser.add_argument("--package", action="append", default=[], help="Package bump spec: name=patch")
    parser.add_argument("--from-path", action="append", default=[], help="Infer package from repo path")
    parser.add_argument("--default-level", choices=BUMP_LEVELS, default="patch", help="Default bump for --from-path")
    parser.add_argument("--summary", help="Release note summary text")
    parser.add_argument("--filename", help="Custom filename under .changeset/")
    parser.add_argument("--output", help="Write to an explicit file path instead of .changeset/")
    parser.add_argument("--stdout", action="store_true", help="Print generated content instead of writing a file")
    parser.add_argument("--list-packages", action="store_true", help="List valid workspace package names")
    parser.add_argument("--show-fixed-groups", action="store_true", help="Print fixed-version groups from config")
    args = parser.parse_args()

    try:
        repo_root = find_repo_root(Path.cwd().resolve())
    except FileNotFoundError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    packages = load_packages(repo_root)
    package_index = build_package_index(packages)

    if args.list_packages:
        for package in packages:
            print(f'{package["name"]}\t{package["dir"]}\t{package["version"]}')
        return 0

    if args.show_fixed_groups:
        for index, group in enumerate(load_fixed_groups(repo_root), start=1):
            print(f"fixed-group-{index}")
            for name in group:
                print(f"  {name}")
        return 0

    if args.stdout and args.output:
        print("error: --stdout and --output cannot be used together.", file=sys.stderr)
        return 1

    if not args.summary or not args.summary.strip():
        print("error: --summary is required when generating a changeset.", file=sys.stderr)
        return 1

    selected: dict[str, str] = {}

    try:
        for spec in args.package:
            name, bump = parse_package_spec(spec)
            if name not in package_index:
                raise ValueError(f"Unknown package '{name}'. Use --list-packages to inspect valid names.")
            selected[name] = bump

        for raw_path in args.from_path:
            package = package_for_path(repo_root, packages, raw_path)
            selected[str(package["name"])] = args.default_level
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    if not selected:
        print("error: add at least one --package or --from-path value.", file=sys.stderr)
        return 1

    ordered_names = [str(package["name"]) for package in packages if str(package["name"]) in selected]
    entries = [(name, selected[name]) for name in ordered_names]
    content = render_changeset(entries, args.summary)

    if args.stdout:
        sys.stdout.write(content)
        return 0

    if args.output:
        output_path = Path(args.output).expanduser().resolve()
    else:
        filename = args.filename or generate_filename(ordered_names)
        if not filename.endswith(".md"):
            filename = f"{filename}.md"
        output_path = repo_root / ".changeset" / filename

    try:
        write_output(content, output_path)
    except FileExistsError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    print(output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
