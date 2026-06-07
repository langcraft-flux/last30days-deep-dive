---
title: Why the Design Works
description: The deeper architectural pattern underneath Last30Days.
---

By this point, the repo's core pattern is pretty clear.

Last30Days works because it is not choosing between prompt engineering and software engineering. It is using both, but giving each a specific job.

## The architecture in one sentence

If you wanted to compress the whole repo into one line, it would be something like this:

> **A strict host-model contract wrapped around a deterministic multi-source research engine.**

That is the whole trick.

## The model is used where models help most

The host model is useful for:
- interpreting the user's intent
- generating or refining plans
- turning evidence into readable synthesis
- adapting to the surrounding agent harness

Those are all places where flexibility is a feature.

## The engine is used where software should dominate

The Python layer handles:
- source availability checks
- adapter dispatch
- concurrency
- normalization
- dedupe
- fusion
- rerank fallbacks
- clustering
- persistence
- final artifact generation

Those are all places where determinism and inspectability matter more than style.

This is the correct split.

## The repo resists two common mistakes

### Mistake 1: put everything in the prompt

That leads to fragile behavior, poor reproducibility, and no real product boundary.

Last30Days avoids this by pushing most of the operational work into Python.

### Mistake 2: try to eliminate the model entirely

That often leads to rigid UX and awkward harness integration.

Last30Days avoids this by keeping the model as planner/synthesizer, but boxing it in with a strong skill contract.

So the project lands in a sensible middle ground.

## The most reusable idea here

If there is one idea from this repo that deserves to travel, it is probably this:

**separate the model-facing evidence envelope from the human-facing artifact.**

That pattern shows up in:
- the evidence block in `render_compact()`
- the pass-through footer boundary
- the distinct HTML renderer
- the repeated output laws in `SKILL.md`

It is a very practical answer to a common problem: models need scratchpad-like evidence, humans do not.

## Why the skill contract matters so much

A second reusable idea is that long skills do not have to be sloppy.

`SKILL.md` is long because it is carrying real operational knowledge:
- harness quirks
- output laws
- regressions
- mandatory execution order

That is not glamorous, but it is what makes an agent skill stable.

In a sense, the file is the repo's operational memory.

## What this repo says about agent products more broadly

Last30Days points toward a useful pattern for agent systems:

1. use a model for flexible interpretation and synthesis
2. keep core product behavior in normal code
3. turn known model failures into explicit contracts
4. make deliverables first-class artifacts
5. add persistence once one-shot usage starts repeating

That is a stronger blueprint than "let the model do it" and also better than building a traditional app with a tiny AI garnish.

## Final take

The repo's most impressive feature is not any single adapter or ranking trick.

It is that the whole system is **consciously layered**:
- skill contract
- runtime engine
- retrieval stack
- scoring/fusion stack
- rendering stack
- persistence and briefing stack

That layering is why the project feels coherent instead of accidental.

## Key takeaways

- Last30Days works because it assigns the model and the codebase different jobs
- The strongest pattern is the split between **model-facing evidence** and **human-facing artifact**
- `SKILL.md` functions as operational memory and behavior control, not just instructions
- The repo is a good example of what a serious agent-native product can look like once it grows past prompt glue
