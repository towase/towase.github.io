# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
make build   # Generate static HTML into /docs/
make serve   # Local preview server (wraps mdbook serve)
```

## Architecture

This is a **mdBook**-based static portfolio site deployed to GitHub Pages.

- `src/` — Markdown source files; `SUMMARY.md` defines the navigation structure
- `docs/` — Build output (generated HTML); committed to the repo for GitHub Pages
- `book.toml` — mdBook config; language is `ja` (Japanese), output dir is `docs/`
- `index.html` — Root redirect to `./docs/index.html`

**Workflow:** Edit Markdown in `src/` → `make build` regenerates `docs/` → commit both.

The `docs/` directory is a build artifact but must be committed since GitHub Pages serves from it.
