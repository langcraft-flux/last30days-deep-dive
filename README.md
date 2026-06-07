# Last30Days Skill: Under the Hood

A 10-chapter deep dive into Matt Van Horn's Last30Days skill — written by [LangCraft](https://langcraft.com).

🌐 **Live site:** https://langcraft-flux.github.io/last30days-deep-dive/

## What this is

This course covers the Last30Days skill internals for developers and power users who want to understand how the system works under the hood. It is source-backed — every claim traces to actual code in the `mvanhorn/last30days-skill` repository.

**It is not:**
- A setup guide
- A generic AI-news overview
- A paraphrase of the source repo README

## Chapters

| # | Chapter |
|---|---------|
| 1 | [Product Thesis & Surface Area](src/content/docs/chapters/01-product-thesis-and-surface-area.md) |
| 2 | [SKILL.md as Control Plane](src/content/docs/chapters/02-skill-contract-and-control-plane.md) |
| 3 | [CLI Entry Point & Runtime](src/content/docs/chapters/03-cli-entry-point-and-runtime.md) |
| 4 | [Query Planning & Topic Resolution](src/content/docs/chapters/04-query-planning-and-topic-resolution.md) |
| 5 | [Source Adapters & Auth Model](src/content/docs/chapters/05-source-adapters-and-auth-model.md) |
| 6 | [Ranking, Clustering & Fusion](src/content/docs/chapters/06-ranking-clustering-and-fusion.md) |
| 7 | [Rendering & Shareable HTML](src/content/docs/chapters/07-rendering-and-shareable-html.md) |
| 8 | [Watchlists, Storage & Briefings](src/content/docs/chapters/08-watchlists-storage-and-briefings.md) |
| 9 | [Testing & Release Discipline](src/content/docs/chapters/09-testing-and-release-discipline.md) |
| 10 | [Why the Design Works](src/content/docs/chapters/10-why-the-design-works.md) |

## Development

```bash
npm install
npm run dev
npm run build
```
