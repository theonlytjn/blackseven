# Black Seven

Marketing site for Black Seven — a holding company with two divisions
(Consultancy and Casa). Built as a multi-page static site with **Vite** +
**Tailwind CSS**. Contact and newsletter forms are handled by
[**Web3Forms**](https://web3forms.com) (serverless form-to-email), so the whole
site is 100% static and deploys to **Cloudflare Pages** with no backend.

## Requirements

- Node.js 18+ (developed on Node 25)

## Local development

```bash
npm install
npm run dev       # http://localhost:5173 — live reload
```

Forms submit for real in dev — Web3Forms is a hosted API, so a test submission
will actually send. Use the honeypot-free test sparingly.

## Build for production

```bash
npm run build     # outputs static files to dist/
npm run preview   # optional: preview the built site locally
```

## Deploy: GitHub → Cloudflare Pages → blackseven.co

The site lives in GitHub (`theonlytjn/blackseven`). Cloudflare Pages builds it
on every push. GoDaddy is the domain registrar for `blackseven.co`.

### 1. Push to GitHub

```bash
git add -A
git commit -m "your message"
git push
```

### 2. Connect Cloudflare Pages (one-time)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → pick `theonlytjn/blackseven`.
2. Build settings:
   - **Framework preset:** None (or Vite)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. **Save and Deploy.** Every push to `main` now redeploys automatically.

### 3. Point blackseven.co at Cloudflare (GoDaddy)

Recommended — move DNS to Cloudflare so Pages can attach the domain directly:

1. In Cloudflare, add the site `blackseven.co` (Websites → Add a site). Cloudflare
   gives you two nameservers.
2. In **GoDaddy** → your domain → **Nameservers** → **Change** → **Custom**, and
   enter the two Cloudflare nameservers. (Propagation: minutes to a few hours.)
3. Back in **Workers & Pages → your project → Custom domains**, add
   `blackseven.co` and `www.blackseven.co`. Cloudflare creates the DNS records
   and issues SSL automatically.

> Alternative (keep GoDaddy DNS): in Cloudflare Pages add the custom domain,
> then in GoDaddy DNS add a `CNAME` for `www` → `<your-project>.pages.dev`, and
> for the apex use GoDaddy **Domain Forwarding** to `www`. Moving nameservers to
> Cloudflare (above) is cleaner and gives apex + SSL out of the box.

## Where the form email goes

Forms POST to Web3Forms using the **public access key** in `src/main.js`
(`WEB3FORMS_ACCESS_KEY`). The delivery address (where enquiries land) is set in
the **Web3Forms dashboard** for that key — not in the code. To change the
recipient, log in at [web3forms.com](https://web3forms.com). The hidden
`botcheck` honeypot in each form is honoured by Web3Forms for spam filtering.

## Project structure

```
index.html, consultancy.html, casa.html, contact.html   # pages (Tailwind markup)
src/main.css        # Tailwind directives + component classes (pill, card, faq, forms…)
src/main.js         # header scroll, scroll-reveal, FAQ, mobile menu, Web3Forms submit
public/assets/      # images (copied verbatim to dist/assets/)
tailwind.config.js  # brand tokens: ink, glow, frost, Geist/Playfair, card radius
vite.config.js      # multi-page build config
```

## Design tokens (tailwind.config.js)

- `bg-ink` — `rgb(11,5,22)` near-black violet background
- `text-glow` / hero `.radial-hero` — `#C001FC` brand purple
- `bg-frost/10` etc. — frosted glass panels (`#F8F8F3` + opacity)
- `font-sans` → Geist, `font-display` (`.pf`) → Playfair Display italic
- `rounded-card` → 9.6px, `max-w-content` → 1296px, `cols:` breakpoint → 900px
