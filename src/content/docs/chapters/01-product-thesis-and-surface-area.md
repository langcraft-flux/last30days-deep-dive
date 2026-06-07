---
title: Product Thesis & Surface Area
description: What Last30Days is actually building, and what the codebase says about that intent.
---

Last30Days is not trying to be a generic search engine.

The repo's thesis is closer to this: **search for what communities are actually saying now, score it by real engagement, then compress it into an agent-friendly brief.** The README says this directly, but the code structure backs it up.

## The thesis shows up everywhere

At the top layer, `skills/last30days/SKILL.md` frames the tool as research over **Reddit, X, YouTube, TikTok, Hacker News, Polymarket, GitHub, and the web**. In other words: not one index, but many disconnected social and information surfaces.

At the engine layer, `skills/last30days/scripts/lib/pipeline.py` treats those surfaces as first-class sources with explicit availability checks in `available_sources()` and explicit dispatch in `_retrieve_stream()`.

At the output layer, `skills/last30days/scripts/lib/render.py` and `lib/html_render.py` are optimized not for raw search results, but for **ranked evidence clusters** and **shareable brief artifacts**.

That is a product shape, not a bag of adapters.

## The actual surface area

The public surface area is broader than the main `/last30days topic` command suggests.

### 1. The skill surface

The core user-facing contract lives in `skills/last30days/SKILL.md`.

That file does more than document usage. It defines:
- the allowed tools
- the runtime preflight rules
- the exact output contract
- the failure modes the host model must avoid
- the required execution path through the Python engine

### 2. The CLI surface

The Python entry point is `skills/last30days/scripts/last30days.py`.

`build_parser()` exposes a surprisingly large command surface, including:
- output modes: `--emit compact|json|context|md|html`
- retrieval controls: `--search`, `--quick`, `--deep`
- planning controls: `--plan`, `--auto-resolve`
- entity targeting: `--x-handle`, `--x-related`, `--subreddits`, `--github-user`, `--github-repo`
- comparison controls: `--competitors`, `--competitors-list`, `--competitors-plan`
- save and persistence flags: `--save-dir`, `--store`

This is one clue that the repo has evolved past a single prompt hack. There is enough control surface here that the engine is behaving more like a compact product runtime.

### 3. The ops surface

There is also a full secondary toolset:
- `scripts/watchlist.py`
- `scripts/store.py`
- `scripts/briefing.py`
- `scripts/verify_v3.py`
- `scripts/evaluate_search_quality.py`

That means the project is not only about one-off research runs. It also supports:
- recurring topic monitoring
- persistent finding accumulation
- daily/weekly digest generation
- evaluation and regression checking

## What kind of product is this, really?

The cleanest description is probably:

> **An agent-native, multi-source recency research engine with a strong host-model contract.**

That phrasing matters because Last30Days is doing three jobs at once:

1. **retrieval** across fragmented platforms
2. **judgment** about which signals actually matter
3. **delivery** in a format a person or another model can use

A lot of tools do one of those. Last30Days tries to do all three.

## Why the repo structure makes sense

Once you see the product thesis, the repo layout stops looking random.

- `SKILL.md` exists because the host model needs a **strict execution contract**
- `last30days.py` exists because the retrieval and rendering logic should not live in prompt prose
- `lib/` is large because each source and stage of the pipeline is specialized
- `store.py` / `watchlist.py` / `briefing.py` exist because the natural next step after research is **monitoring**

In other words, the repo structure is downstream of the product thesis.

## Key takeaways

- Last30Days is best understood as a **multi-source recency research engine**, not just a search prompt
- The codebase has three layers: skill contract, Python engine, and ops/persistence tooling
- The CLI surface is broad because the project supports targeted research, comparisons, persistence, and export
- The architecture already assumes recurring workflows, not only one-off queries
