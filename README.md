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
{ "query": "X-Men 1 CGC 4.0" }
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
2. Connect the repo to Codex in the cloud. OpenAI's Codex web setup says you can connect a GitHub repository and create pull requests from its work. citeturn158005search5turn158005search13
3. Ask Codex for focused UI changes in small tasks.
4. Review diffs or PRs in GitHub. OpenAI's GitHub integration docs say Codex can review pull requests from GitHub comments like `@codex review`. citeturn158005search1
5. Let GitHub Actions run the included CI build.
6. Deploy from GitHub to Netlify or Vercel.

## Notes on GitHub + Codex workflow
OpenAI's current docs say Codex web connects to GitHub repositories for cloud workflows and can create pull requests from its work. GitHub-connected ChatGPT can also read repo contents live when connected. citeturn158005search5turn158005search13turn158005search3
