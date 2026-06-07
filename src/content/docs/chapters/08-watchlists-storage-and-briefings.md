---
title: Watchlists, Storage & Briefings
description: The persistence layer that turns one-off searches into an ongoing research system.
---

If the repo stopped at ad hoc topic research, it would already be useful.

But there is a second layer underneath it: **persistent accumulation**.

That layer lives mostly in:
- `skills/last30days/scripts/store.py`
- `skills/last30days/scripts/watchlist.py`
- `skills/last30days/scripts/briefing.py`

Together, these files turn Last30Days from a one-shot research command into something closer to a monitoring system.

## `store.py` is a real database layer

`store.py` manages a SQLite database at `~/.local/share/last30days/research.db`.

The file is more serious than its size-first impression suggests. It includes:
- WAL mode
- schema versioning
- migrations
- topic tables
- research run records
- findings storage
- FTS5 full-text search
- dedupe and re-sighting logic

The opening schema comment is basically a product statement: this is an **accumulator**, not a transient cache.

## The data model matches the product

The schema includes tables for:
- `topics`
- `research_runs`
- `findings`
- `settings`
- later `finding_sightings` via migration

That design says the system cares about:
- what topic was monitored
- when a run happened
- what findings were seen
- whether they were new or updates of old items

This is exactly what you need for watchlists and deltas.

## Findings are treated as evolving objects

One subtle but important point: findings are not stored as immutable single-run blobs.

The store tracks things like:
- `first_seen`
- `last_seen`
- `sighting_count`
- engagement updates

That means the repo is modeling recurring evidence, not only isolated search results.

This is the right move for a "last 30 days" product, because the same story often resurfaces with new engagement and new corroboration.

## `watchlist.py` is operational glue

`watchlist.py` provides commands to:
- add topics
- remove topics
- list topics
- run one topic
- run all topics
- compute deltas
- configure delivery

This file is effectively the automation shell around `last30days.py`.

The noteworthy part is `_run_topic()`: it runs the main engine in JSON mode, parses the report, stores findings, updates run status, and optionally triggers webhook delivery.

That means the watchlist system is not a separate product. It is a thin automation layer on top of the same research engine.

## Budgeting and delivery are built in

`watchlist.py` also includes:
- daily budget checks
- delivery mode and delivery channel settings
- Slack and generic webhook delivery helpers

That is a nice example of product realism. As soon as research becomes recurring, cost and notification behavior matter.

## `briefing.py` closes the loop

`briefing.py` builds daily and weekly summaries from stored findings.

Key functions:
- `generate_daily()`
- `generate_weekly()`
- `show_briefing()`

The script does not attempt to become the final writing model. Instead, it gathers the structured data that an agent can then synthesize into a nicer briefing.

That mirrors the architecture of the main engine itself:
- structured evidence first
- human-readable synthesis second

## Why this layer matters

A lot of AI research tools stop at retrieval.

Last30Days goes one step further and says: once you have findings, you probably want to:
- save them
- compare them over time
- monitor them repeatedly
- summarize them periodically

That is exactly the progression from tool to workflow.

## Key takeaways

- The SQLite layer makes Last30Days a **persistent research system**, not just a query command
- Findings are treated as recurring evolving evidence, not one-off rows
- `watchlist.py` turns the engine into a scheduled monitoring workflow
- `briefing.py` turns stored findings into summary-ready structured data
