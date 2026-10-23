# Results Quantified website

Website source for https://resultsquantified.com.

## Hosting

- Cloudflare Pages project: `results-quantified`
- Pages hostname: `results-quantified.pages.dev`
- GitHub source: `npistolesi2026/results-quantified-website`, branch `main`
- Deployment uses a self-contained Pages Worker generated from the static files.
- The Worker serves the page, CSS, JavaScript, and image assets, applies security headers, and redirects `www` to the apex domain.
- GitHub is the source backup. Pushes do not currently deploy automatically: Cloudflare rejected its Git installation connection during setup.

## Edit and preview

Edit the HTML, CSS, JavaScript, and `assets/` files in this repository. There are no runtime package dependencies.

```sh
python3 -m http.server 8080
```

## Build and deploy

```sh
node scripts/build-worker.mjs
```

This writes `deployment/worker.mjs`. The generator embeds only the 12 public website files; documentation and build scripts are not served.

Deploy through Cloudflare's Pages deployments API using a multipart form with `_worker.js` containing that generated module, `manifest` set to `{}`, `branch` set to `main`, and the matching Git commit hash. The Pages project remains `results-quantified`.

All website files remain editable in their original static format.

## Brand colors

The brand uses black `#0b0b0b` and medium green `#2fa34f`, with a darker green `#1c7032` for text on light backgrounds. Core text and button color pairs have at least 4.5:1 contrast.

The favicon and social sharing graphic have editable SVG sources. To regenerate their PNG exports with Inkscape installed, run `bash scripts/build-brand.sh`, then rebuild the Worker. Asset links include a version query to refresh previously cached graphics.

## Contact

The form prepares an email addressed to `hello@resultsquantified.com` in the visitor's mail application. It does not store submissions or send email itself.

Email hosting uses iCloud Mail. The domain now has Apple's two MX records, its existing domain verification and DKIM records, and the required SPF record. Both `nick@resultsquantified.com` and `hello@resultsquantified.com` were created in Nicholas's existing iCloud Mail account and confirmed in the signed-in Custom Email Domain settings on October 23, 2026. The existing `npistolesi@resultsquantified.com` address remains in place. These addresses share the existing iCloud inbox. No end-to-end delivery test has been performed.

## Verification

Verified all 12 generated asset responses against the source bytes, 31 local links and anchors, security headers, cache revalidation, HEAD requests, custom 404 responses, method restrictions, HTTPS redirects, and the www redirect including paths and query strings.
