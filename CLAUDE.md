# Albums — Design & Build Instructions

Instructions for Claude to design and build this project. Read this fully before writing code.

## What this is

A personal single-page website listing Bert's favorite **artists** (left column) and favorite **albums** (right column). Both are ranked: **higher on the list = liked more**. Hosted on GitHub Pages.

## Hard constraints

- **Single page, static only.** One `index.html`. No backend, no database.
- **No build step.** No Astro, no bundler, no GitHub Actions. The repo is served by GitHub Pages exactly as committed. Pushing to `main` is the deploy.
- **Data lives in a separate file from markup.** The page reads the data at load time. Editing the lists must never require touching HTML.
- **Updating = editing one data file and committing.** Git history is the changelog — this is intentional and desired.

## Architecture

Plain static page driven by a data file:

- `index.html` — markup + styling + a small inline script.
- `data.yaml` — the source of truth for both lists.
- `img/` — optional, committed cover/portrait images.

On load, `index.html` fetches `data.yaml`, parses it client-side with **js-yaml** (one `<script>` tag from a CDN, e.g. cdnjs), and renders the two columns. Works on GitHub Pages because Pages serves over HTTP (`fetch` of a local file only fails on `file://`).

Keep everything in as few files as possible. Inline the CSS and JS inside `index.html` — do not split into separate `.css`/`.js` files.

## Data format

YAML, where **order = rank** (top entry is the favorite). Editing a ranking means moving lines up or down — nothing else.

```yaml
artists:
  - name: Radiohead
    note: never makes the same record twice
    img: img/radiohead.jpg   # optional
  - name: Aphex Twin
    year: 1992               # any extra field is optional

albums:
  - name: Kid A
    artist: Radiohead
    year: 2000
    img: img/kida.jpg
  - name: Selected Ambient Works 85-92
    artist: Aphex Twin
```

Rules for the data:
- Only `name` is required per entry. Everything else (`note`, `year`, `artist`, `img`) is optional.
- The renderer must **degrade gracefully**: missing optional text fields simply aren't shown.
- Images are expected, not optional, but the page must never show a broken-image icon. When `img` is missing or fails to load, render a **styled placeholder showing the entry's name** in its place (a clean text tile, not a generic icon).
- Comments are allowed and encouraged (one of the reasons we chose YAML).

## Images

- Covers/portraits are **expected** and **committed locally** in `img/`. Entries should normally have one.
- Reference them by relative path (`img/kida.jpg`). No external image URLs — avoids link rot.
- When an entry omits `img`, or the file is missing/fails to load, render a **styled name placeholder** in the image's slot: a clean tile showing the entry's name, matching the layout's image dimensions. Never a broken-image icon. The page must look complete and intentional whether covers are present or not.

## Layout & design

- Two columns side by side: **artists left, albums right**, each a clearly ranked vertical list, best at top.
- Rank should read instantly from position. A subtle rank number is fine; do not rely on numeric scores (ranking is positional, not scored).
- Clean, readable, personal. Mobile: stack the two columns vertically (artists first, then albums).
- No heavy frameworks or CSS libraries. Hand-written CSS, inline.

## Deliverables

1. `index.html` — self-contained page (markup + inline CSS + inline JS, js-yaml from CDN).
2. `data.yaml` — seeded with a few real-or-example entries so the page renders immediately.
3. `README.md` — short: how to edit `data.yaml` to update rankings, how to add an image, and how to publish/enable GitHub Pages.

## Done means

- Open `index.html` via a local HTTP server (or on Pages) and both ranked columns render from `data.yaml`.
- Reordering entries in `data.yaml` reorders the page with no other changes.
- Entries with no extras and no image still look clean — the missing cover shows a name placeholder tile, never a broken-image icon.
