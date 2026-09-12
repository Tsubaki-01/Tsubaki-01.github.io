# Night Store Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development for the independent content task; the primary agent owns the scene, integration and deployment.

**Goal:** Deliver a playful night convenience store with strange creatures and publish it with two blog homepage entries.

**Architecture:** Buildless HTML/CSS/SVG and four classic deferred scripts. A small pure state module drives local discoveries and an event-driven UI.

**Tech Stack:** Native browser APIs, SVG, optional Web Audio, Node built-in test runner, existing Hexo 7.3.0.

**Spec:** `docs/superpowers/specs/2026-09-12-night-store-design.md`

## Global Constraints

- Fun and exploration, not career-oriented content.
- No framework, third-party runtime/font, backend or large image assets; target new site assets below 250 KB.
- Preserve all existing files, pages, local edits and Git history. No deletion or force push.
- User has authorized the selected idea, implementation and publication to the existing public site.
- Original J drive working copy remains untouched; use current independent source/publish checkouts.

## Task 1: Original shop content

Files: `source/night-store/content.js`; exact content schema and IDs in `docs/night-store-content-brief.md`. A single content worker owns this file. Produce twelve goods, six creatures, newspaper/fortune/radio/bell text, and a complete finite story graph with three endings. Test by loading with Node and traversing the story graph; no dependency install. Commit only the owned content file. Primary agent reviews references and writing, then a task reviewer reads the scoped diff.

- [ ] Write and self-review original content.
- [ ] Check graph endings and item/creature references.
- [ ] Complete scoped content review.

## Task 2: State and illustrated shop

Primary agent owns `index.html`, `style.css`, `scene.js`, `state.js`, `app.js`, `tests/night-store/state.test.cjs`. Write user-flow tests first. Run `node --test tests/night-store/state.test.cjs`, implement the state transitions from the spec, and rerun. UI reads global `NightStoreContent` and `NightStoreState`. Use native dialog, button event delegation and a single localStorage key `night-store-v1`. Each first-time item produces one receipt; lending never consumes it. Use CSS transform/opacity animation and suspend it when hidden.

- [ ] Meaningful state behavior tests, then state implementation.
- [ ] Build scene, product/bestiary/pocket/story views and audio controls.
- [ ] Test desktop, mobile, keyboard and reload using real browser.

## Task 3: Homepage entries and publication

Add `side-quests.swig` before homepage posts and two menu entries. Add the new skip_render pattern. Generate into a fresh owned output directory with the existing Hexo dependencies. Source content, partial and config changes go to src; new site resources and the surgically updated homepage go to main. Do not overwrite unrelated static pages merely because a snapshot rebuild differs.

- [ ] Implement and inspect both homepage entries.
- [ ] Generate Hexo output and inspect relevant differences.
- [ ] Independent final review of core flows and deployment integration.
- [ ] Commit, push, wait for Pages success and verify online links and interactions.
