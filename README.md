# Black Seven

Marketing site for Black Seven — a holding company with two divisions
(Consultancy and Casa). Built as a multi-page static site with **Vite** +
**Tailwind CSS**, with contact/newsletter forms handled by a small **PHP** mail
script for cPanel hosting (UK Host4u).

## Requirements

- Node.js 18+ (developed on Node 25)
- PHP is only needed on the **server** (cPanel provides it) — not for local dev.

## Local development

```bash
npm install
npm run dev       # http://localhost:5173 — live reload
```

> Note: the mail forms POST to `contact.php`, which only runs on a PHP server.
> During `npm run dev` a submission will show a friendly error instead of
> sending. To test the PHP end-to-end locally, build first and serve `dist/`
> with PHP:
>
> ```bash
> npm run build
> php -S localhost:8000 -t dist   # then open http://localhost:8000
> ```

## Build for production

```bash
npm run build     # outputs static files to dist/
npm run preview   # optional: preview the built site
```

## Deploy to cPanel (UK Host4u)

1. Run `npm run build`.
2. Upload **everything inside `dist/`** into `public_html` (the site is served
   from the domain root, so keep the folder structure — `assets/`, the `.html`
   files, and `contact.php` all sit at the top level of `public_html`).
3. Done — the forms will email `richard@blackseven.co`.

## Where the form email goes

`public/contact.php` (copied to `dist/contact.php` on build) handles both the
contact form and the footer newsletter form. At the top of that file:

```php
$TO   = 'richard@blackseven.co';   // delivery address
$FROM = 'website@blackseven.co';   // must be an address on your own domain
```

**Deliverability — do this once in cPanel:** create the mailbox (or an
alias/forwarder) **`website@blackseven.co`** so the `From` address exists on
your domain. Sending "from" an address on a domain you don't control is the
usual reason contact-form mail lands in spam. Replies to the received email go
straight back to the person who filled in the form (set via `Reply-To`).

To change the recipient later, edit `$TO` in `public/contact.php` and rebuild
(or edit `contact.php` directly in `public_html`).

## Project structure

```
index.html, consultancy.html, casa.html, contact.html   # pages (Tailwind markup)
src/main.css        # Tailwind directives + component classes (pill, card, faq, forms…)
src/main.js         # header scroll, scroll-reveal, FAQ, mobile menu, form submit
public/assets/      # images (copied verbatim to dist/assets/)
public/contact.php  # PHP mail handler (copied verbatim to dist/)
tailwind.config.js  # brand tokens: ink, glow, frost, Geist/Playfair, card radius
vite.config.js      # multi-page build config
```

## Design tokens (tailwind.config.js)

- `bg-ink` — `rgb(11,5,22)` near-black violet background
- `text-glow` / hero `.radial-hero` — `#C001FC` brand purple
- `bg-frost/10` etc. — frosted glass panels (`#F8F8F3` + opacity)
- `font-sans` → Geist, `font-display` (`.pf`) → Playfair Display italic
- `rounded-card` → 9.6px, `max-w-content` → 1296px, `cols:` breakpoint → 900px
