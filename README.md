# Gathered

A collaborative watchlist app for movies and TV shows. Create shared lists with friends, track what you're watching, and discover what's trending — all in one place.

> **Note:** This project has been sunsetted and is no longer actively maintained. The live site at [gathered.watch](https://gathered.watch) is offline.

---

## What it does

- **Google sign-in** — authentication via Google OAuth
- **Shared watchlists** — create lists and invite others by email to collaborate
- **Search** — find movies and TV shows powered by the TMDB API
- **Progress tracking** — mark movies as watched, or track season/episode progress for TV shows
- **Trending** — browse what's popular when you haven't searched yet
- **Theme customization** — personalize the UI with custom colors, saved to your profile

## Tech stack

**Frontend**
- React 18 + TypeScript, built with Vite
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- Deployed on Vercel

**Backend**
- Node.js + Express
- Passport.js (Google OAuth 2.0) + JWT cookies
- Firebase Firestore (database + session store)
- TMDB API for movie/TV data
- Deployed on Render

## Project structure

```
gathered/
├── frontend/   # React + TypeScript app
└── backend/    # Express API server
```

## Environment variables

### Backend

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `TMDB_API_KEY` | The Movie Database API key |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `SESSION_SECRET` | Secret for Express sessions |
| `URL` | Frontend URL (e.g. `https://gathered.watch`) |
| `PORT` | Server port (default: 3000) |

The Firebase service account key should be placed at `/etc/secrets/serviceAccountKey.json` (Render secret files).

## Running locally

**Backend**
```bash
cd backend
npm install
# create a .env file with the variables listed above
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
