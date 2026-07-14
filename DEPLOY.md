# Deploying **mydockguide.com** on Vercel

The site is 100% static (all 22 routes pre-rendered at build time), so Vercel just serves the pre-built HTML from its edge CDN. No serverless functions run at request time.

---

## 1. First-time deploy

### Option A — via the Vercel dashboard (easiest)

1. Go to <https://vercel.com/new>
2. **Import Git Repository** → pick `rahulpatel84/dockline`
3. Vercel auto-detects Next.js. Leave everything default:
   - Framework Preset: **Next.js**
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default — do **not** set to `out`)
   - Install Command: `npm install` (default)
   - Root Directory: `./`
4. Click **Deploy**

First build takes ~1–2 min. You'll get a `dockline-<hash>.vercel.app` URL when it's done.

### Option B — via the Vercel CLI

```bash
npm i -g vercel
cd /path/to/dock-builder
vercel login
vercel                  # first run: link to a project (accept defaults)
vercel --prod           # promote to production
```

---

## 2. Attach the domain

1. In the Vercel dashboard → **Project → Settings → Domains**
2. Add `mydockguide.com` and `www.mydockguide.com`
3. Vercel will show you the DNS records to set at your registrar:
   - `mydockguide.com` → **A** record → `76.76.21.21`
   - `www.mydockguide.com` → **CNAME** → `cname.vercel-dns.com`
   (Exact values will be shown in the UI — use what Vercel gives you.)
4. Once DNS propagates (usually minutes), Vercel provisions a Let's Encrypt SSL cert automatically.
5. Pick which one is canonical (e.g., apex `mydockguide.com`) and the other will 308-redirect to it.

That's it — no nginx, no certbot, no manual renewals.

---

## 3. Routine deploys (git push = deploy)

Vercel's GitHub integration is on by default. From here on:

- **Push to `main`** → new production deploy at `mydockguide.com`
- **Push to any other branch** → preview deploy at `<branch>-dockline-<hash>.vercel.app`
- **Open a PR** → Vercel comments the preview URL on the PR

You never SSH anywhere.

---

## 4. Adding new guides or builders

1. Edit `data/posts.json` (guides) or `data/builders.json` (builders) locally
2. Commit and push to `main`
3. Vercel rebuilds and redeploys automatically (~1 min)

New URLs appear in `/sitemap.xml` after the build. Because `dynamicParams = false`, only slugs listed in JSON are reachable.

---

## 5. Environment variables (if you add any)

**Dashboard → Project → Settings → Environment Variables**. Add per environment:

- **Production** — used on `mydockguide.com`
- **Preview** — used on PR/branch deploys
- **Development** — pulled to your machine via `vercel env pull .env.local`

Anything client-side must be prefixed `NEXT_PUBLIC_`.

---

## 6. Useful CLI shortcuts

```bash
vercel                    # deploy to preview
vercel --prod             # deploy straight to production
vercel logs               # tail latest deploy logs
vercel domains ls         # list attached domains
vercel env pull .env.local # sync env vars to local dev
vercel rollback           # roll back to the previous production deploy
```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Build fails on Vercel but works locally | Node version mismatch — set **Project → Settings → Node.js Version** to `20.x` (or match `package.json` `engines`) |
| Domain shows "Invalid Configuration" | DNS not yet propagated. Wait 5–15 min. Verify with `dig mydockguide.com` |
| SSL cert stuck on "Issuing" | Usually resolves within 10 min once DNS is correct; hit **Refresh** in the domains panel |
| Old content still showing after deploy | Hard refresh (`Cmd+Shift+R`) — Vercel's CDN is instant but your browser may cache |
| Preview deploys leaking to Google | They're `noindex` by default on `*.vercel.app`; no action needed |

---

## What NOT to do

- Do **not** set `output: 'export'` in `next.config.mjs` — Vercel handles static pages natively and picks up on-demand ISR / dynamic routes when you add them later. Static export removes those future options.
- Do **not** commit `.vercel/` — it's already in `.gitignore`.
