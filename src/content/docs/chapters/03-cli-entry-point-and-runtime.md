---
title: CLI Entry Point & Runtime
description: The thin Python shell around the engine, and how it manages lifecycle, arguments, and output.
---

The main entry point is `skills/last30days/scripts/last30days.py`.

This file is not where most of the product logic lives. That is a good sign. It behaves more like a proper CLI shell:
- validate runtime
- parse flags
- dispatch to the pipeline
- handle save/output modes
- coordinate comparison and persistence paths

## Python version guard comes first

At the top of the file, `ensure_supported_python()` enforces Python 3.12+.

That matters because this repo is fairly modern Python and is clearly intended to run consistently across multiple agent harnesses. A hard early exit is better than letting the tool half-run under the wrong interpreter and produce weird downstream failures.

## The file manages child processes carefully

`last30days.py` also tracks child PIDs with:
- `register_child_pid()`
- `unregister_child_pid()`
- `_cleanup_children()`

and registers cleanup with `atexit`.

That is another sign this is operating in real agent environments, not just local happy-path scripting. Search/transcript/provider subprocesses can outlive the main process if you do not manage them. This file explicitly cleans them up.

## The parser surface is the product surface

`build_parser()` is the clearest summary of what the runtime supports.

Some of the notable groups:

### Retrieval and output
- `--emit`
- `--search`
- `--quick`
- `--deep`
- `--debug`
- `--mock`
- `--diagnose`

### Planning and targeting
- `--plan`
- `--auto-resolve`
- `--x-handle`
- `--x-related`
- `--subreddits`
- `--github-user`
- `--github-repo`

### Comparison mode
- `--competitors`
- `--competitors-list`
- `--competitors-plan`

### Artifact and storage
- `--save-dir`
- `--synthesis-file`
- `--store`
- `--save-suffix`

That is not just a search CLI. It is a compact runtime for research, comparison, export, and persistence.

## The entry point stays thin on purpose

Most of the important work is delegated outward:
- planning and retrieval to `lib.pipeline`
- runtime/provider resolution to `lib.providers`
- HTML generation to `lib.html_render`
- markdown generation to `lib.render`
- persistence to `store.py`

That makes `last30days.py` easier to reason about. It is the composition layer, not the dumping ground.

## Output modes are treated as first-class

The CLI supports several output shapes.

`emit_output()` and `emit_comparison_output()` branch between:
- JSON
- compact markdown
- context mode
- full markdown
- shareable HTML

This is important architecturally because the repo serves **two consumers**:

1. the **host model**, which needs compact structured evidence
2. the **human recipient**, who may want a clean HTML artifact

The code reflects that split rather than forcing one representation to do both jobs.

## Save behavior is built in, not bolted on

`save_output()` and `compute_save_path_display()` show that the system expects outputs to become reusable files.

Saved outputs are slugged by topic and emit mode, with suffix handling and collision fallback. That sounds mundane, but it is exactly the kind of detail missing from many agent tools that are still effectively terminal demos.

## Comparison mode is a real execution path

The CLI does not treat "vs" as a cosmetic prompt variation.

It has dedicated logic for:
- competitor argument normalization via `resolve_competitors_args()`
- plan parsing via `parse_competitors_plan()`
- per-entity subrun kwargs via `subrun_kwargs_for()`

This matters because Last30Days is not just rewriting one prompt for several names. It is faning out multiple targeted runs and then rendering a comparison artifact.

## Key takeaways

- `last30days.py` is a **thin orchestration shell**, which is the right design
- The file handles runtime safety, parser surface, save/output paths, and comparison wiring
- Output modes are treated as product features, not debug conveniences
- The CLI is broad because the project now supports research, comparisons, persistence, and export in one runtime
