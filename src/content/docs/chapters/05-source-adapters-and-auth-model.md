---
title: Source Adapters & Auth Model
description: How Last30Days connects to many different surfaces without pretending they are the same.
---

Once the plan exists, Last30Days has to do the messy part: actually talk to the sources.

This is where a lot of projects either over-centralize everything or hard-code one brittle path per platform. Last30Days takes a more pragmatic route.

## Retrieval dispatch is centralized

`skills/last30days/scripts/lib/pipeline.py::_retrieve_stream()` is the hub that maps a `(subquery, source)` pair to the right adapter.

That centralization is useful because it gives the engine one place to coordinate:
- depth budgets
- availability checks
- source-specific fallbacks
- source-specific enrichment

But each source still has its own module, which keeps platform weirdness isolated.

## The adapters are intentionally uneven

One of the best things about this codebase is that it does **not** pretend every source should be accessed the same way.

Examples:

### Reddit
Reddit retrieval favors free/public paths first.

Relevant files include:
- `lib.reddit_public`
- `lib.reddit`
- `lib.reddit_enrich`
- `lib.reddit_listing`
- `lib.reddit_rss`
- `lib.reddit_shreddit`

That tells you the author has spent real time dealing with Reddit's constantly shifting access patterns.

### X
X has several backends:
- `lib.bird_x`
- `lib.xai_x`
- `lib.xurl_x`
- `lib.xquik`

Again: pragmatic, not ideologically pure. If one route is better in one environment, use it.

### YouTube
`lib.youtube_yt` prefers a local/tooling path and transcript extraction, with fallback logic when necessary.

### GitHub
GitHub is not just a generic search source. It has dedicated modes in `lib.github`:
- `search_github()`
- `search_github_person()`
- `search_github_project()`

That is a strong design choice because searching a person, a project, and an issue keyword are not the same research task.

## Availability is explicit

`pipeline.available_sources()` computes what can actually run from the current config and machine state.

It checks things like:
- API keys
- local binaries such as `yt-dlp`
- opt-in include/exclude source flags
- browser-auth-backed source availability

That means the engine does not assume one universal fully-provisioned environment.

It degrades according to what is really available.

## BYO credentials is part of the product thesis

The auth/config layer in `skills/last30days/scripts/lib/env.py` is central to how the project works.

`get_config()` merges configuration from:
1. process env
2. project-local env file
3. global env file
4. macOS Keychain

There are also helpers for browser credential extraction and auth-source selection.

This matters because Last30Days is deliberately built around the idea that no single provider has access to everything. Instead, the user brings their own keys, tokens, cookies, and local tools.

That is not an implementation detail. It is the product strategy.

## Browser and cookie support is treated seriously

`env.py` includes browser-credential helpers and X-source detection helpers such as:
- `extract_browser_credentials()`
- `get_x_source()`
- `get_x_source_status()`

The repo also includes source-specific cookie extraction helpers like:
- `chrome_cookies.py`
- `safari_cookies.py`
- `cookie_extract.py`

This is another sign that the author is building for reality. Some platforms are simply easier to access via authenticated browser state than via neat public APIs.

## Setup is productized, not tribal knowledge

The configuration story is reinforced by `lib.setup_wizard.py`, which includes:
- `run_auto_setup()`
- `run_openclaw_setup()`
- `run_full_device_auth()`
- `run_github_auth()`

This means setup is not only documented - it is encoded.

That is important for an agent skill, because setup friction kills adoption faster than almost anything else.

## The auth model matches the adapter model

The broader pattern is consistent:
- many sources
- many auth methods
- many fallbacks
- one normalized runtime view

The repo does not try to unify every source at the access layer. It only unifies them **after retrieval**, once items can be normalized, scored, and fused.

That is the right abstraction boundary.

## Key takeaways

- Adapter dispatch is centralized, but each platform keeps its own retrieval logic
- The system uses **different access strategies for different sources**, which is a strength, not a weakness
- `env.py` and `setup_wizard.py` are core product code, not just support code
- BYO credentials and browser-backed auth are part of the product design, not a workaround
