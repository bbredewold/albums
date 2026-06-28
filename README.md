# Albums

A personal single page listing my favorite **artists** (left) and **albums** (right). Both are ranked — **higher on the list = liked more**. Static, no build step: the page reads `data.yaml` at load time and renders it.

## Editing the lists

All content lives in **`data.yaml`** — you never touch `index.html` to update rankings.

Order is the ranking: the **top entry is the favorite**. To re-rank, move lines up or down. To add an entry, copy an existing block. Only `name` is required; everything else is optional.

```yaml
artists:
  - name: Nina Simone
    note: the voice that taught me phrasing   # optional one-liner
    img: img/nina-simone.jpg                  # optional

albums:
  - name: Laughing Stock
    artist: Talk Talk    # optional
    year: 1991           # optional
    img: img/laughing-stock.jpg
```

Commit the change and the page updates. Git history is the changelog.

## Adding an image

Drop a square-ish image into `img/` and reference it by relative path:

```yaml
  - name: Kid A
    artist: Radiohead
    img: img/kida.jpg
```

Use local files only (no external URLs — avoids link rot). If `img` is omitted or the file is missing, the row shows a clean **initials tile** instead — never a broken-image icon.

## Viewing locally

`fetch` doesn't work from `file://`, so open the page over HTTP:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publishing (GitHub Pages)

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch.**
3. Choose branch `main`, folder `/ (root)`, save.
4. The site goes live at `https://<user>.github.io/<repo>/`.

Pushing to `main` is the deploy — there's no build step or action.
