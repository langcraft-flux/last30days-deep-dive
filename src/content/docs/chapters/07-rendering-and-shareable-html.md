---
title: Rendering & Shareable HTML
description: The deliberate split between model-facing evidence and human-facing artifacts.
---

The rendering layer is where Last30Days becomes really interesting as an agent product.

Many systems produce one blob of markdown and hope it serves every purpose.

Last30Days does something better: it separates **engine evidence for the host model** from **shareable output for humans**.

## `render_compact()` is not a normal final output

In `skills/last30days/scripts/lib/render.py`, `render_compact()` emits a structured markdown envelope with several layers:
- a badge
- metadata and warnings
- an `<!-- EVIDENCE FOR SYNTHESIS -->` block
- an optional comparison scaffold
- a `<!-- PASS-THROUGH FOOTER -->` block
- a canonical boundary

This is not just formatting. It is execution design.

The host model is meant to:
- **read** the evidence block
- **synthesize** from it
- **pass through** the footer verbatim
- avoid leaking the scratchpad directly

That is a much stronger pattern than handing the model raw results and hoping it formats them well.

## The comments are architecture, not comments

The comments around the evidence and footer envelopes are extremely explicit.

That tells you these boundaries were learned through real failures. The code is effectively teaching the model where scratchpad ends and output contract begins.

This is one of the clearest examples in the repo of the broader design pattern:

> Use code and explicit boundaries to constrain model behavior, rather than relying on vague instruction-following.

## HTML is a separate rendering path

The shareable HTML path uses:
- `render.render_for_html()`
- `render.render_for_html_comparison()`
- `html_render.render_html()`
- `html_render.render_html_comparison()`

This is the right architecture.

The HTML artifact is not derived by naïvely pasting compact markdown into a converter. Instead, the HTML pipeline intentionally strips the parts that only exist for the host model.

## `html_render.py` does real post-processing

Some of the important helpers in `html_render.py` include:
- `_strip_evidence_block()`
- `_strip_invitation()`
- `_strip_canonical_boundary()`
- `_protect_engine_footers()`
- `_wrap_engine_footer()`
- `_markdown_to_html()`
- `_wrap_in_template()`

This means the HTML renderer is doing selective transformation, not dumb conversion.

In other words, the system knows that the model-facing markdown and the human-facing HTML have related but different jobs.

## The artifact philosophy is thoughtful

The README promise about shareable HTML is reflected in code:
- standalone output
- inline CSS
- no JavaScript
- dark mode
- printable/shareable formatting

That is a small but meaningful detail. If the output is meant to be dragged into Slack, email, or Notion, then portability matters.

The system is not only generating analysis. It is generating a **deliverable**.

## The footer is part of the product language

The emoji footer in `render.py` is not a cosmetic add-on.

It gives the final output a stable machine-generated status section with source counts and summary stats. Because the footer is passed through verbatim, it acts as a trustworthy anchor between engine and host-model prose.

That is clever.

The prose may vary a bit depending on the host model, but the footer remains engine-authored.

## Why this matters beyond Last30Days

This rendering split is one of the strongest ideas in the repo.

A lot of agent systems still conflate:
- internal evidence
- model scratchpad
- user-visible artifact

Last30Days draws cleaner boundaries:
- evidence envelope for synthesis
- pass-through machine footer
- separate final HTML renderer

That pattern is reusable well beyond this specific skill.

## Key takeaways

- `render_compact()` is a **host-model interface**, not just a final markdown export
- The evidence and footer envelopes are part of the system design
- `html_render.py` exists because human-facing output has different constraints from model-facing output
- Last30Days treats the final artifact as a first-class product surface, not an afterthought
