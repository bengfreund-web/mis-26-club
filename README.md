# The 26 Club — Members Site (encrypted)

A private members' hub for the **Montana Institute of Sport 26 Club** — a living
newsletter with impact numbers, updates, and a video gallery.

It's a plain static site (HTML/CSS/JS, no framework) that matches the main
Montana Institute of Sport site: white theme, navy-blue + yellow accents.

## How the password protection works

The club content (posts, videos, impact numbers) is **AES-256-GCM encrypted**.
The published site ships only the encrypted blob (`enc/payload.js`). When a
member enters the password, the browser derives the decryption key (PBKDF2) and
decrypts the content locally. **Without the password the content is unreadable** —
there is no plaintext copy anywhere on the server, and the password itself is
never stored or published.

That means the page can live on a **public** GitHub Pages URL (reachable by
anyone with the link) while the actual content stays genuinely protected.

> The photos in `images/` are served normally (not encrypted). Keep anything
> truly private out of that folder.

---

## Updating the content (the important part)

The editable content lives in **`src/content.json`** — this file is **NOT
published** (it's gitignored). You edit it, then re-encrypt.

1. Edit `src/content.json`:
   - `impact` — the four stat tiles
   - `posts` — newsletter updates (put the newest first). Each has a `date`,
     `tag`, `title`, `body`, optional `image` (`"images/your-photo.jpg"`), and
     optional `link`.
   - `videos` — `title`, `desc`, and a YouTube/Vimeo `url`. Thumbnails are
     pulled in automatically.
2. Re-encrypt with your club password:
   ```bash
   CLUB_PASSWORD="your-club-password" node scripts/build.js
   ```
   This regenerates `enc/payload.js`.
3. Commit and push (see below). GitHub Pages updates in a minute or two.

> In practice, just send the updates to Claude Code and it will edit, re-encrypt,
> and push for you.

### Changing the password

The password isn't stored in a file — it's whatever you pass to the build step.
To change it, re-run `scripts/build.js` with the new `CLUB_PASSWORD`, commit, and
push. Share the new password with members. (Anything encrypted with the old
password stays readable only with the old password until you rebuild.)

---

## Running locally

```bash
cd mis-26-club && python3 -m http.server 8080
```
Then open http://localhost:8080 and enter the club password.

## Publishing (GitHub Pages)

The repo is public (required for free Pages) but safe — only encrypted content
is committed. To push an update:

```bash
git add -A && git commit -m "Update newsletter" && git push
```

The site is set to `noindex`, so search engines won't list it.

---

## File map

| File | Published? | What it's for |
|------|-----------|----------------|
| `src/content.json` | **No (gitignored)** | **Your editable content** |
| `scripts/build.js` | yes | Encrypts content → `enc/payload.js` |
| `enc/payload.js` | yes | The encrypted content blob (safe) |
| `js/gate.js` | yes | Password prompt, decrypt, render |
| `index.html` | yes | Page shell + login gate |
| `css/style.css` | yes | Brand styling |
| `images/` | yes | Logos and photos |
