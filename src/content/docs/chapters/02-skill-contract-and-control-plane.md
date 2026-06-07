---
title: SKILL.md as Control Plane
description: Why Last30Days puts so much logic in the skill contract, and what that buys the system.
---

The most unusual file in this repo is not Python.

It is `skills/last30days/SKILL.md`.

This file is enormous, but that is not accidental bloat. In Last30Days, `SKILL.md` acts as a **control plane for the host model**.

## Why such a large skill file exists

Most skill files just describe a command and maybe list a few arguments.

Last30Days uses `SKILL.md` for something more ambitious:
- prevent known host-model failure modes
- force the model to load the right tools
- define a strict execution path
- constrain output shape
- separate what the model should synthesize from what it should pass through verbatim

The opening sections make this explicit. The file contains named historical regressions, concrete examples of bad outputs, and very specific countermeasures.

That is a clue that the author learned the hard way that "just prompt it better" is not enough.

## Step 0 is not decoration

Early in the file, the skill mandates a stale-clone self-check for Claude Code plugin cache layouts. That looks oddly specific until you read the reasoning around it.

The point is simple: if the harness loaded an out-of-date copy of `SKILL.md`, the model may miss new flags or behavioral rules and silently take the wrong path.

So the skill starts by asking the model to verify that it is reading the right artifact.

That is not normal README behavior. That is **runtime hygiene**.

## The skill treats the host model as fallible middleware

A lot of the file is written around the assumption that the host model will drift unless anchored.

Examples:
- it explicitly forbids inventing title lines and section headers for normal outputs
- it forbids appending a trailing `Sources:` block
- it requires a badge and strict formatting anchors
- it tells the model to run the Python engine rather than answer from web search alone
- it distinguishes evidence scratchpad from user-visible output

In other words, the model is not treated as an autonomous co-designer. It is treated as a useful but failure-prone runtime that needs careful boundaries.

That sounds harsh, but it is also why the system is relatively robust.

## The file does real orchestration work

`SKILL.md` is not just style guidance. It actively controls execution.

It specifies:
- load `WebSearch` first
- run `scripts/last30days.py`
- generate a `--plan` for named-entity topics
- use explicit preflight targeting like handles, subreddits, and GitHub users
- pass through the engine footer verbatim
- synthesize only from the evidence envelope

This means the system is split in a deliberate way:

- **`SKILL.md` decides how the host model should behave**
- **Python decides how the research engine behaves**

That is the core control-plane split.

## Why this is better than moving everything into Python

You could imagine pushing all of this into the engine and making the host model a dumb wrapper.

But Last30Days still needs the host model to do things the Python runtime cannot do cleanly by itself inside every harness:
- interpret the user request
- construct or pass a query plan
- obey formatting rules in the final answer
- manage tool loading within the host environment

So instead of trying to eliminate the host model, the project **disciplines it**.

That is a stronger design than pretending the model will naturally do the right thing.

## Why this is better than leaving everything in prompt space

The inverse mistake would be to keep the whole product in prose instructions.

Last30Days does not do that either.

The retrieval pipeline, storage layer, rendering logic, and source integrations live in Python. The skill file does not try to simulate that logic in text.

So the division of labor is clean:
- prose for runtime contract
- code for deterministic behavior

That is a surprisingly mature boundary for an agent skill.

## Key takeaways

- `SKILL.md` is a **control plane**, not just documentation
- The file encodes historical failure modes and concrete countermeasures
- Last30Days assumes the host model will drift unless constrained
- The project's strongest architectural move is the split between **model contract** and **engine implementation**
