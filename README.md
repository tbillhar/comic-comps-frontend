# Comic Comps Frontend

A mobile-first frontend repo for an iPhone Safari app that talks to your sold-comps Python backend.

This is designed to fit a GitHub + Codex workflow similar to the one you're already using for your Forex ML work:
- keep the repo in GitHub
- ask Codex to implement UI changes
- review diffs / PRs
- deploy the frontend to Netlify or Vercel

## Stack
- React + TypeScript + Vite
- Static frontend only
- Reads backend URL from `VITE_API_BASE_URL`

## Expected backend contract
`POST /comps`

Request:
```json
{ "query": "X-Men 1 CGC 4.0", "cert_type": "cgc" }
```

Response:
```json
{
  "query": "X-Men 1 CGC 4.0",
  "median": 6850,
  "low": 6500,
  "high": 7100,
  "usable_count": 5,
  "safe_buy": 5200,
  "sales": [
    {
      "title": "X-Men 1 CGC 4.0",
      "price": 6500,
      "date": "2026-04-01",
      "url": "https://example.com"
    }
  ]
}
```

## Local run
```bash
npm install
cp .env.example .env
npm run dev
```

## Deploy
### Netlify
- Import this repo
- Set `VITE_API_BASE_URL` in Netlify environment variables
- Build command: `npm run build`
- Publish directory: `dist`

### Vercel
- Import this repo
- Set `VITE_API_BASE_URL`
- Framework preset: Vite

## Suggested Codex prompts
- "Add a grade dropdown and raw/slab toggle to the search form."
- "Add client-side validation so the query must include an issue number."
- "Add a saved recent searches section backed by localStorage."
- "Make the results cards denser and easier to scan on iPhone Safari."
- "Add a loading skeleton and friendlier error states."
- "Prepare this app to be installed to the iPhone home screen as a PWA."

## Suggested repo workflow
1. Push this repo to GitHub.
2. Connect the repo to Codex in the cloud.
3. Ask Codex for focused UI changes in small tasks.
4. Review diffs or PRs in GitHub.
5. Let GitHub Actions run the included CI build.
6. Deploy from GitHub to Netlify or Vercel.

## Notes on GitHub + Codex workflow
Use small, focused frontend tasks so each Codex change stays easy to review and test.
