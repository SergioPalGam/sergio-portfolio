# Sergio Portfolio

Custom portfolio built with Eleventy + Decap CMS and intended for Cloudflare Pages.

## Local development

```bash
npm install
npm run serve
```

Eleventy outputs the site to `_site/`.

## Cloudflare Pages

Use:

- Framework preset: Eleventy
- Production branch: `main`
- Build command: `npx @11ty/eleventy`
- Build output directory: `_site`

## Decap CMS

The CMS is available at `/admin/` after deployment. Before login will work, replace the placeholder `base_url` in `src/admin/config.yml` with the URL of the GitHub OAuth proxy Worker.

Content editing is split into:

- **Site**: Welcome backgrounds, Tasting Menu, social links and About.
- **Projects**: create, reorder and edit individual project pages, including image captions and layout widths.

Uploaded images are stored in `src/assets/uploads/` and published at `/assets/uploads/`.
