# GitHub Pages Setup

## Purpose
The StudioFlow AI front end is a static site that can be hosted on GitHub Pages. The chatbot UI calls the deployed Cloudflare Worker, which handles the OpenAI secret and live Google Sheet access.

## Files to publish
- `index.html`
- `styles.css`
- `app.js`
- `.nojekyll`

## Worker endpoint already configured
The front end currently points to:

- `https://studioflow-ai-worker.tomaspfcrotty.workers.dev`

That means the static site can be published without exposing any API key in the browser.

## Current published URL
- `https://tomaspfcrotty-spec.github.io/studioflow-ai/`

## Publish steps
1. Create a GitHub repository for the project if one does not already exist.
2. Upload the front-end files to the repository root.
3. In GitHub, open `Settings` -> `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select the main branch and the root folder.
6. Save the settings.
7. Wait for GitHub Pages to publish the site.

## Expected site contents
The site should load a customer-facing page with:
- the StudioFlow AI heading
- AI disclosure
- a working chat form
- quick prompts
- responses from the Cloudflare Worker

## Recommended post-publish checks
1. Open the GitHub Pages URL.
2. Confirm the status indicator changes from `Not connected` to `Connected`.
3. Ask `What classes are on Friday?`
4. Ask `How much is Intro 2 Weeks?`
5. Confirm the chatbot warns that the `5000` euro price appears unusual.
6. Ask `Who teaches Pilates?`

## Recommended final hardening
Once the GitHub Pages URL is known, update `wrangler.toml`:

```toml
ALLOWED_ORIGIN = "https://yourusername.github.io"
```

Then redeploy the Worker so CORS is restricted to the published site.

## Assignment note
This architecture is defensible because:
- the static front end is publicly reachable on GitHub Pages
- the private OpenAI key remains in Cloudflare only
- the Worker performs the live Google Sheet fetch at runtime
- the browser never receives the API key
