---
title: Introduction
description: What this deep dive covers and why Last30Days is worth studying.
---

# Last30Days Skill: Under the Hood

Matt Van Horn's [Last30Days skill](https://github.com/mvanhorn/last30days-skill) looks simple from the outside: ask about a topic, and it searches Reddit, X, YouTube, Hacker News, Polymarket, GitHub, and the web to tell you what people have actually been saying lately.

Under the hood, it is more interesting than that.

This project is really **three systems layered together**:

1. **A very explicit skill contract** in `skills/last30days/SKILL.md`
2. **A Python research engine** centered on `scripts/last30days.py` and `lib/pipeline.py`
3. **An optional persistence and ops layer** for watchlists, stored findings, and briefings (`store.py`, `watchlist.py`, `briefing.py`)

That combination matters. A lot of "AI research" tools are either just prompt wrappers around web search, or raw retrieval stacks with no strong host-model contract. Last30Days is neither. It is opinionated at both layers:

- the **host model** is told exactly how to behave
- the **engine** does the deterministic heavy lifting
- the **artifact layer** separates model-facing scratchpad from shareable output

## What this deep dive covers

This walkthrough focuses on the current v3.3.2 codebase and follows the actual implementation.

**What this is not:**
- a usage tutorial
- a setup guide
- a marketing summary of the README

**What this is:**
- a source-backed architectural tour
- an explanation of why the project is structured this way
- a look at the unusually careful split between planning, retrieval, scoring, clustering, and rendering

## The 10 Chapters

| # | Chapter | What you'll learn |
|---|---------|-------------------|
| 1 | [Product Thesis & Surface Area](/last30days-deep-dive/chapters/01-product-thesis-and-surface-area) | What Last30Days is actually building and how the surface area maps to that thesis |
| 2 | [SKILL.md as Control Plane](/last30days-deep-dive/chapters/02-skill-contract-and-control-plane) | Why the giant skill file exists and what role it plays |
| 3 | [CLI Entry Point & Runtime](/last30days-deep-dive/chapters/03-cli-entry-point-and-runtime) | The Python entry point, argument surface, runtime guards, and save flow |
| 4 | [Query Planning & Topic Resolution](/last30days-deep-dive/chapters/04-query-planning-and-topic-resolution) | How the engine decides where to search before searching |
| 5 | [Source Adapters & Auth Model](/last30days-deep-dive/chapters/05-source-adapters-and-auth-model) | How the source connectors work and why BYO credentials are central |
| 6 | [Ranking, Clustering & Fusion](/last30days-deep-dive/chapters/06-ranking-clustering-and-fusion) | The retrieval-quality stack: RRF, rerank, diversity controls, and story clustering |
| 7 | [Rendering & Shareable HTML](/last30days-deep-dive/chapters/07-rendering-and-shareable-html) | The split between engine evidence, host-model synthesis, and final artifact |
| 8 | [Watchlists, Storage & Briefings](/last30days-deep-dive/chapters/08-watchlists-storage-and-briefings) | SQLite accumulation, scheduled deltas, and briefing generation |
| 9 | [Testing & Release Discipline](/last30days-deep-dive/chapters/09-testing-and-release-discipline) | What the tests and release machinery reveal about project maturity |
| 10 | [Why the Design Works](/last30days-deep-dive/chapters/10-why-the-design-works) | The larger pattern this repo points to |

## The key idea to keep in mind

The most important design choice in this repo is not any individual source adapter.

It is this: **the model is not trusted to invent the product behavior on the fly.**

Instead, Last30Days gives the model a strict contract, then gives the engine the hard deterministic work: planning constraints, retrieval fanout, normalization, fusion, clustering, storage, and rendering.

That is why the system feels more like a product than a prompt.

## About

Built by [LangCraft](https://langcraft.com). Source analysis based on `mvanhorn/last30days-skill` v3.3.2.
