---
title: Query Planning & Topic Resolution
description: How Last30Days decides where to search, and why that is one of the smartest parts of the system.
---

The best part of Last30Days is not that it talks to many sources.

It is that the engine tries to decide **where to search before it searches**.

That is the real difference between a broad but noisy system and one that can find the right subreddits, handles, repos, and communities for a topic.

## Planning sits near the center of the architecture

In `skills/last30days/scripts/lib/pipeline.py`, `run()` resolves a query plan before retrieval.

There are two entry paths:
- a host-supplied `--plan`, sanitized through `planner._sanitize_plan()`
- an internally generated plan from `planner.plan_query()`

This means the system supports both:
- **host-model-first planning** when the harness is capable
- **engine fallback planning** when it is not

That is a good design for multi-harness compatibility.

## The planner is LLM-first, but not LLM-only

`skills/last30days/scripts/lib/planner.py` describes itself as **LLM-first query planning with deterministic guards**.

That is exactly what it is.

The planner:
- infers intent categories like `factual`, `product`, `comparison`, `breaking_news`, `prediction`
- chooses source priorities by intent
- generates subqueries with separate `search_query` and `ranking_query`
- sanitizes and constrains source choices to available sources
- falls back deterministically when needed

That separation between `search_query` and `ranking_query` is especially smart:
- the search query can stay keyword-heavy and platform-friendly
- the ranking query can stay natural-language and semantically richer

In effect, the system decouples **retrieval phrasing** from **judgment phrasing**.

## The repo is very aware of query traps

The code and skill contract both show a learned fear of bad literal queries.

There is a preflight quality gate in `lib.preflight.check_class_1_trap()` for obviously poor prompt shapes. On top of that, `planner.py` contains explicit prompt rules about stripping phrases like:
- use cases
- workflows
- examples
- reviews
- comparison

from raw search queries when those phrases would hurt retrieval.

That is not theoretical neatness. It is a response to observed failure modes.

## Auto-resolution is the Step 0.55 equivalent in code

`skills/last30days/scripts/lib/resolve.py::auto_resolve()` is one of the repo's most useful pieces.

It fans out several web searches concurrently to find:
- likely subreddits
- current-news context
- likely X handle
- likely GitHub profile and repos

Then it extracts and canonicalizes those hints with helpers like:
- `_extract_subreddits()`
- `_extract_x_handle()`
- `_extract_github_user()`
- `_extract_github_repos()`
- `canonicalize_github_repos()`

So the engine can move from a vague topic like **OpenClaw** or **Peter Steinberger** toward targeted retrieval inputs.

That is a major quality multiplier.

## Category widening is a subtle but important idea

`resolve._merge_category_peers()` widens subreddit coverage through `lib.categories`.

That means the resolver is not just collecting literal matches. It can also widen into category-adjacent communities when the topic implies them.

This is exactly the sort of thing a human researcher does instinctively and naive search pipelines miss.

## Competitor mode is also planning infrastructure

Comparison is not handled as a prompt trick.

The repo has a real competitor subsystem:
- CLI logic in `last30days.py`
- entity discovery in `lib.competitors.discover_competitors()`
- per-entity targeting overrides via `--competitors-plan`

`competitors.py` uses deterministic multi-query web search and capitalized-entity extraction to discover peers. It is a practical choice: cheap, explainable, and good enough for seeding a multi-run comparison.

## Why planning is the leverage point

Many retrieval systems focus almost entirely on source adapters.

Last30Days is stronger because it invests in the step before adapters: **forming the right search program**.

That matters more than it sounds. If you search the wrong communities, with the wrong handles, and the wrong phrasing, every later stage becomes cleanup.

If you plan well, fusion and rerank get much better inputs.

## Key takeaways

- `pipeline.run()` treats planning as a first-class stage, not a preamble
- `planner.py` separates retrieval queries from ranking queries
- `resolve.auto_resolve()` is one of the highest-leverage parts of the repo
- Comparison and competitor discovery are real pipeline features, not presentation sugar
- Last30Days wins a lot of its quality by deciding **where to look** before it starts fetching
