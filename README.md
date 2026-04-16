# Northbridge Navigator

Northbridge Navigator is now a frontend-only FAQ chatbot that runs entirely in the browser. It uses React + Vite + Tailwind, a bundled JSON knowledge base, and in-browser matching logic, so you can deploy it directly to GitHub Pages and share a public link without running a backend server.

## Highlights

- Modern chat interface with welcome screen, avatars, timestamps, auto-scroll, and typing animation
- 38 curated FAQ entries across admissions, academics, campus life, career support, student services, safety, and city guidance
- Browser-side FAQ matching with normalization, synonym mapping, overlap scoring, small-talk handling, and fuzzy similarity
- Searchable FAQ directory with category filters and quick-send question cards
- Dark and light theme toggle
- Session-based chat persistence using `sessionStorage`
- Transcript export and clear chat controls
- Static hosting ready for GitHub Pages

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Data: Local JSON file bundled into the app
- Deployment: GitHub Pages via GitHub Actions

## Important Files

- App entry: [frontend/src/main.jsx](frontend/src/main.jsx)
- Local FAQ dataset: [frontend/src/data/faqs.json](frontend/src/data/faqs.json)
- Browser-side FAQ engine: [frontend/src/services/faqEngine.js](frontend/src/services/faqEngine.js)
- GitHub Pages workflow: [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)

## Run Locally

Install the frontend dependencies:

```bash
npm --prefix frontend install
```

Start the local dev server:

```bash
npm --prefix frontend run dev
```

Open:

- `http://localhost:5173`

## Edit the FAQ Content

The deployed site reads its knowledge base from [frontend/src/data/faqs.json](frontend/src/data/faqs.json).

Each FAQ entry includes:

- `category`
- `question`
- `answer`
- `keywords`
- `aliases`
- `relatedTopics`
- `featured`

After editing that JSON file, rebuild or push to GitHub so Pages redeploys the updated site.

## Deploy on GitHub Pages

1. Push this repository to GitHub.
2. Open the repo on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, set `Source` to `GitHub Actions`.
5. Push to your `main` branch.
6. Wait for the `Deploy GitHub Pages` workflow to finish in the `Actions` tab.
7. Open the published link shown in Pages settings or Actions.

Your public URL will usually look like:

```text
https://<your-github-username>.github.io/<your-repository-name>/
```

## Share the Link

Once GitHub Pages finishes deploying, send your friends the GitHub Pages URL. They can use the full chatbot from that link because the FAQ dataset and matching logic are both bundled into the frontend build.

## Notes

- No backend or environment variables are required for the GitHub Pages version
- Chat history is stored only in the visitor's browser session
- The included dataset is fictional and meant as a showcase-ready sample
- The legacy `backend/` folder can stay in the repo for reference, but GitHub Pages does not use it
