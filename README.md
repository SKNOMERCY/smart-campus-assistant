# Northbridge Navigator

Northbridge Navigator is a polished FAQ chatbot web application built for a college and city information assistant use case. It combines a React + Tailwind frontend with an Express backend, structured FAQ JSON storage, keyword and fuzzy matching, session chat history, downloadable transcripts, and a clean glassmorphism UI designed for demos, showcases, and hackathons.

## Highlights

- Modern chat interface with welcome screen, avatars, timestamps, auto-scroll, and typing animation
- 38 curated FAQ entries across admissions, academics, campus life, career support, student services, safety, and city guidance
- Intelligent FAQ matching with lowercase normalization, punctuation cleanup, synonym mapping, overlap scoring, small-talk handling, and fuzzy similarity
- Searchable FAQ directory with category filters and quick-send question cards
- Dark and light theme toggle
- Session-based chat persistence using `sessionStorage`
- Transcript export and clear chat controls
- Admin-editable JSON data source at [backend/src/data/faqs.json](backend/src/data/faqs.json)
- Modular code structure ready for customization

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Data: Structured JSON file
- Styling: Custom glassmorphism UI with responsive layouts and theme variables

## Folder Structure

```text
.
|-- backend
|   |-- src
|   |   |-- config
|   |   |   `-- constants.js
|   |   |-- controllers
|   |   |   |-- chatController.js
|   |   |   `-- faqController.js
|   |   |-- data
|   |   |   `-- faqs.json
|   |   |-- routes
|   |   |   |-- chatRoutes.js
|   |   |   `-- faqRoutes.js
|   |   |-- services
|   |   |   `-- faqService.js
|   |   |-- utils
|   |   |   |-- fileStore.js
|   |   |   `-- textProcessing.js
|   |   |-- app.js
|   |   `-- server.js
|   `-- package.json
|-- frontend
|   |-- src
|   |   |-- api
|   |   |   `-- client.js
|   |   |-- components
|   |   |   |-- chat
|   |   |   `-- layout
|   |   |-- data
|   |   |   `-- constants.js
|   |   |-- hooks
|   |   |   |-- useChatbot.js
|   |   |   `-- useTheme.js
|   |   |-- styles
|   |   |   `-- index.css
|   |   |-- utils
|   |   |   `-- chat.js
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- index.html
|   `-- package.json
|-- package.json
`-- README.md
```

## Setup Instructions

### 1. Install dependencies

From the project root:

```bash
npm run install:all
```

If you prefer, you can also install packages separately:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 2. Configure environment variables

Backend:

Create `backend/.env` from `backend/.env.example`.

Frontend:

Create `frontend/.env` from `frontend/.env.example`.

Default values already point the frontend to `http://localhost:5000/api`.

## Deployment Configuration

For Vercel:

- Set `VITE_API_BASE_URL=https://smart-campus-assistant-d8i1.onrender.com/api`

For Render:

- Set `FRONTEND_ORIGIN=https://smart-campus-assistant-kappa.vercel.app,http://localhost:5173,http://127.0.0.1:5173`
- Optional health check path: `/api/health`

### 3. Start the application

Run both frontend and backend together:

```bash
npm run dev
```

Frontend:

- `http://localhost:5173`

Backend:

- `http://localhost:5000`
- Health endpoint: `http://localhost:5000/api/health`

## Editing the FAQ Dataset

The FAQ knowledge base lives in [backend/src/data/faqs.json](backend/src/data/faqs.json). Each entry includes:

- `category`
- `question`
- `answer`
- `keywords`
- `aliases`
- `relatedTopics`
- `featured`

You can edit the JSON file directly, or use the backend FAQ endpoints for CRUD-style admin operations.

## API Endpoints

- `POST /api/chat` sends a user message and returns the best FAQ response plus follow-up suggestions
- `GET /api/faqs` returns the FAQ directory and category counts
- `GET /api/faqs/categories` returns category summaries and matching question previews
- `POST /api/faqs` creates a new FAQ entry
- `PUT /api/faqs/:id` updates an FAQ entry
- `DELETE /api/faqs/:id` removes an FAQ entry

## Project Notes

- Chat history is preserved for the active browser session
- Unknown questions are handled with graceful fallback responses instead of hard failures
- The matching layer is intentionally simple and explainable, making it easy to extend with embeddings or a database later
- The included dataset is fictional and meant as a showcase-ready sample that can be customized for a real college or city

## Demo Readiness Checklist

- Responsive layout for desktop, tablet, and mobile
- Professional visual design with light and dark themes
- Clean component separation and reusable utilities
- Structured backend for future expansion into admin dashboards or database persistence
