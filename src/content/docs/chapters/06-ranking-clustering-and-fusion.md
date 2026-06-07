---
title: Ranking, Clustering & Fusion
description: How Last30Days turns many streams of noisy evidence into a ranked narrative.
---

Multi-source retrieval is the easy part to describe and the hard part to make useful.

Last30Days gets useful by stacking several quality-control layers on top of raw fetching.

## The pipeline does not jump straight from retrieval to prose

Inside `skills/last30days/scripts/lib/pipeline.py::run()`, the middle of the pipeline is roughly:

1. normalize and annotate streams
2. prune weak items
3. dedupe
4. fuse streams
5. rerank candidates
6. add fun/virality scores
7. cluster stories

That ordering matters. The repo is not relying on one heroic LLM rerank call to clean up chaos.

## Fusion uses weighted reciprocal rank fusion

Cross-stream fusion is handled by `lib.fusion.weighted_rrf()`.

That is a good fit for this problem because the engine is combining many partial rankings from different sources and subqueries. RRF is simple, robust, and tolerant of disagreement.

The implementation adds a few important practical ideas:
- URL-based candidate identity with `candidate_key()`
- per-author cap with `_apply_per_author_cap()`
- source reservation/diversification with `_diversify_pool()`

That means the system is optimizing for more than raw rank score. It is also trying to avoid one loud author or one source dominating the final pool.

## Reranking is not naive semantic scoring

`lib.rerank.rerank_candidates()` is where the repo becomes noticeably more careful.

It supports an LLM reranker when a provider is available, but also has a fallback scoring path. More importantly, it contains explicit entity-sensitive logic such as:
- `_primary_entity()`
- `_candidate_haystack()`
- entity-miss penalties

That matters because one of the hardest problems in social/web search is not generic relevance. It is **false positives around adjacent entities**.

For example, if the topic is about a person or product with a common name, ordinary semantic similarity is not enough. The reranker needs to know what entity the run is really about.

The code reflects that.

## Fun scoring is a separate layer

One of the more distinctive features is `lib.rerank.score_fun()`.

This is the system behind the repo's "Best Takes" behavior - effectively a second scoring layer for humor, virality, and quotability.

That sounds gimmicky until you think about the product goal. Last30Days is not only trying to answer factual questions. It is trying to surface what communities are actually saying, including the parts that make a topic culturally legible.

So fun scoring is not a random flourish. It is part of the signal model.

## Clustering happens after fusion and rerank

`lib.cluster.cluster_candidates()` groups the ranked candidates into story clusters.

Important ingredients include:
- text similarity
- representative selection via `_mmr_representatives()`
- uncertainty labeling via `_cluster_uncertainty()`

Then there is a clever second pass: `_merge_entity_clusters()`.

This tries to merge small clusters by **entity overlap**, not just lexical overlap.

That is a strong move because the same story often appears across Reddit, X, and YouTube with very different wording.

A purely lexical clusterer would fragment those into separate stories. Entity-aware merging gives the system a better shot at reconstructing one cross-platform narrative.

## The system is also honest about thin evidence

The clustering layer can label uncertainty, and the rendering layer carries those signals through.

This is important because multi-source systems are often tempted to imply stronger corroboration than they actually have.

Last30Days at least has infrastructure for saying: this cluster exists, but the support is thin or single-source.

That is the kind of modesty you want from a system that is aggregating noisy human content.

## Why this middle layer is the real moat

Source adapters are easy to copy in principle.

The harder part is the middle layer:
- how you combine partial rankings
- how you avoid source and author domination
- how you punish entity drift
- how you merge differently worded stories into one cluster

That is where Last30Days feels more productized than many research wrappers.

## Key takeaways

- Last30Days uses a **multi-stage quality stack**, not one monolithic scoring step
- `weighted_rrf()` is the backbone of cross-source fusion
- Reranking contains explicit entity-aware defenses against false positives
- Fun/virality scoring is a deliberate part of the product, not just flavor
- Entity-aware cluster merging is one of the smartest pieces of the repo
