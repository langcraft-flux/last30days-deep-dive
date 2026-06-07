---
title: Testing & Release Discipline
description: What the test suite, fixtures, and release machinery reveal about the maturity of the project.
---

One easy way to tell whether a repo is still a clever demo or already a real product is to inspect the test surface.

Last30Days looks like a product.

## The test suite is not small

The repo currently has **90+ test files** under `tests/`, covering everything from source adapters to planner behavior to HTML rendering and workflow regressions.

Even without running the entire suite, the file list tells a clear story:
- `test_pipeline_v3.py`
- `test_planner_v3.py`
- `test_cluster_v3.py`
- `test_render_v3.py`
- `test_html_render.py`
- `test_setup_wizard.py`
- `test_watchlist_delivery.py`
- `test_cli_competitors.py`
- many source-specific tests for Reddit, GitHub, Polymarket, Bluesky, TikTok, YouTube, and more

This is not only unit coverage. It is coverage of product behavior.

## The tests are organized around failure domains

You can infer the architecture from the tests because they line up with the major subsystems:
- retrieval adapters
- planner/query logic
- fusion/rerank/cluster logic
- rendering and HTML export
- setup/auth flows
- comparison mode
- persistence and watchlists

That is generally what you want. Good tests often mirror real module boundaries.

## Regression memory is visible in the codebase

The project is unusually explicit about past failures.

You can see that in:
- the comments and laws in `SKILL.md`
- named regression behavior in tests
- helper scripts like `verify_v3.py`
- release notes under `docs/releases/`

That matters because one of the hardest parts of agent products is not building the first version. It is stopping the system from quietly sliding backward as prompts, models, and integrations change.

The repo clearly knows this.

## Release infrastructure is already present

The repo includes GitHub workflows such as:
- `.github/workflows/validate.yml`
- `.github/workflows/release.yml`
- `.github/workflows/security.yml`

That suggests the project has moved beyond local-only iteration. There is a release cadence, validation gate, and at least some security posture around shipping changes.

## Fixtures matter here

The `fixtures/` directory is also a useful signal.

A multi-source research tool is hard to test if every run depends on live, drifting APIs. Fixtures give the project a way to test parsing, normalization, and formatting deterministically.

That is especially important for sources like Reddit, TikTok, or search backends where live responses can change shape.

## The repo is testing both code and behavior

There are two levels of quality control here:

1. **code correctness** - parsing, normalization, schema, storage, rendering
2. **behavior correctness** - planning quality, output shape, comparison flow, setup experience

That second category is more interesting. It shows the author understands that agent systems fail at the level of behavior contracts, not just function return values.

## Why this matters for the deep dive

The reason to care about tests here is not just to praise discipline.

It changes how you interpret the architecture.

A repo with this many tests, release notes, and behavior guards is not accidentally complex. It is complex because the author has already encountered enough real-world failure cases to encode them.

That usually correlates with something valuable: the project has been used enough to learn from its own mistakes.

## Key takeaways

- The test surface suggests Last30Days is being run like a real product, not a side experiment
- Tests are aligned with real subsystems and real failure domains
- The repo contains explicit regression memory in both code and documentation
- Release workflows and fixtures reinforce the sense that this is a maintained system, not just a prompt wrapper
