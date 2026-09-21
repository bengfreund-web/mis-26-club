# The 26 Club — Members Site

A private, password-protected members' hub for the **Montana Institute of Sport
26 Club**: mission, membership perks, a living newsletter, and a video gallery.

Plain static site (HTML/CSS/JS, no build step) matching the main Montana
Institute of Sport site. White theme, navy-blue + yellow accents.

Live: https://the26club.org (and https://bengfreund-web.github.io/mis-26-club/)

## Sections
- **Impact** — headline stats
- **About / What We're About** — the mission (from the MIS site)
- **What It Supports** — where membership goes (the TRY Sport initiative)
- **Membership / What You Get** — trips, experiences, events + a trips & events list
- **Latest** — the club newsletter feed
- **Videos** — YouTube/Vimeo gallery

---

## Everyday tasks (no coding needed)

### Change the password
Open **`js/config.js`** and edit the `password` line:
```js
password: "TryRugby-26Club-2026",   // <-- your shared club password
```
Save. That's the single shared password every member types to get in.

### Edit content
Open **`content/content.js`** — everything is plain, labelled lists:
- `CLUB_IMPACT` — the four stat tiles
- `CLUB_POSTS` — newsletter updates (newest first): `date`, `tag`, `title`,
  `body`, optional `image` (`"images/your-photo.jpg"`), optional `link`
- `CLUB_BENEFITS` — the "What You Get" cards (`icon`, `title`, `desc`)
- `CLUB_EVENTS` — trips & events (`date`, `status` "Upcoming"/"Past", `title`, `place`)
- `CLUB_VIDEOS` — `title`, `desc`, and a YouTube/Vimeo `url` (thumbnail is automatic)

Copy an existing `{ ... }` block, change the text between the quotes, keep the
punctuation, save, and refresh. To use your own photo, drop it in `images/` and
point at it.

> In practice, just send the updates to Claude Code and it will make the edits
> and push them for you.

---

## A note on the password
This is **light, front-end-only protection**: it keeps the page private and out
of search results, but the password lives in the site's code, so a technical
person could find it. Fine for a members' newsletter; not for anything truly
sensitive. Real per-member sign-in (Google / Cloudflare Access) can be added
later if needed.

---

## Running locally
```bash
cd mis-26-club && python3 -m http.server 8080
```
Then open http://localhost:8080

## Publishing
Hosted on GitHub Pages from `main` (root), custom domain `the26club.org` via the
`CNAME` file. Set to `noindex`. To push an update:
```bash
git add -A && git commit -m "Update site" && git push
```

## File map
| File | What it's for |
|------|----------------|
| `index.html` | Page structure + login gate |
| `css/style.css` | Brand styling |
| `js/config.js` | **Password** and site title |
| `content/content.js` | **Your content** — impact, posts, benefits, events, videos |
| `js/site.js` | Behavior (login, rendering) — no need to edit |
| `images/` | Logos and photos |
| `CNAME` | Custom domain (the26club.org) |
