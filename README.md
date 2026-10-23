# Results Quantified website

Static production-ready website for `resultsquantified.com`.

## Recommended launch path: Cloudflare Pages + GitHub

The domain is already parked at Cloudflare Registrar. For reliable version control and automatic deployments:

1. Create a private or public GitHub repository named `results-quantified-website`.
2. Upload this folder's contents to the repository root.
3. In Cloudflare: **Workers & Pages → Create application → Pages → Connect to Git**.
4. Select the repository.
5. Framework preset: **None**.
6. Build command: leave blank.
7. Build output directory: `/`.
8. Deploy.
9. In the Pages project: **Custom domains → Set up a domain**.
10. Add `resultsquantified.com`, then add `www.resultsquantified.com` and redirect `www` to the apex domain.

## Faster one-time launch: Direct Upload

Zip this folder and use Cloudflare Pages' drag-and-drop Direct Upload. Cloudflare currently does not allow an existing Direct Upload project to switch to Git integration later; use Git integration from the start if ongoing edits will be frequent.

## Before public launch

- Configure `hello@resultsquantified.com` using Cloudflare Email Routing or another provider.
- Confirm the legal name and business contact information in the Terms and Privacy pages.
- Add a scheduling link later if desired.
- Add Cloudflare Web Analytics only after deciding whether to use analytics.
- Replace the mailto-based contact flow with a server-side form only when there is a defined storage/notification process.

## Local preview

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
