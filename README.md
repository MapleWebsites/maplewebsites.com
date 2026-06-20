# Maple — Marketing Website

A fast, modern marketing site for Maple, a Vancouver custom web-design studio.
Pure HTML/CSS/JS — no build step, no dependencies, no framework. Every page is
self-contained (styles and scripts are inlined), so it runs on any static host.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, services, pricing, proof, quote form, AI chatbot |
| `services.html` | Detailed services + per-service FAQs |
| `portfolio.html` | Work / concept gallery |
| `pricing.html` | Plans, add-ons, Care subscriptions, comparison matrix |
| `case-study.html` | Sample case study |
| `about.html` | Studio story, values, team |
| `blog.html` | Blog index |
| `faq.html` | Frequently asked questions |
| `contact.html` | Multi-step quote form + contact details |
| `favicon.svg` | Site icon (green maple leaf) |
| `robots.txt` / `sitemap.xml` | SEO basics |
| `CNAME` | Custom domain for GitHub Pages (`www.maplewebsites.com`) |

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8888   # then visit http://localhost:8888
```

## Forms

The quote form (`contact.html`) and the home-page lead form + chatbot lead
capture submit to [Web3Forms](https://web3forms.com), which delivers
submissions to **info@maplewebsites.com**.

Each page holds its own Web3Forms access key in two synced spots: the hidden
`access_key` input and the `WEB3FORMS_KEY` variable in the page's script. If a
key is left as the `YOUR-WEB3FORMS-ACCESS-KEY` placeholder, the form fails safe
(it tells the visitor to email us instead of pretending to send).

## Deploy

Hosted on **GitHub Pages** with the custom domain in `CNAME`. Any static host
also works (Netlify, Vercel, Cloudflare Pages, S3 + CloudFront) — just upload
the folder.
