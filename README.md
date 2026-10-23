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

## Contact

The form prepares an email addressed to `hello@resultsquantified.com` in the visitor's mail application. It does not store submissions or send email itself.

The domain already has iCloud Mail DNS records. These were preserved. Receiving mail at the specific `hello` address still needs verification in iCloud; domain-level MX records alone do not prove that mailbox exists.

## Verification

Verified all 12 generated asset responses against the source bytes, 31 local links and anchors, security headers, cache revalidation, HEAD requests, custom 404 responses, method restrictions, HTTPS redirects, and the www redirect including paths and query strings.
