# Rabee Captures — Backend

A simple Node.js + Express + SQLite backend for the Rabee Captures portfolio
site's project dashboard. It replaces the old browser-only `localStorage`
storage with a real database and a server-checked passcode, so your project
data now persists properly and can be accessed from any device.

## What's included

```
rabee-backend/
├── server.js          → main Express server
├── db.js              → SQLite database setup (auto-creates tables + demo data)
├── routes/
│   ├── projects.js     → CRUD API for projects
│   └── auth.js         → passcode verification
├── public/
│   └── index.html      → your portfolio site (now calls the backend API)
├── data/               → SQLite database file lives here (auto-created)
├── .env                → your organizer passcode & port config
└── package.json
```

## Setup (one-time)

1. Install [Node.js](https://nodejs.org) version 18 or newer if you don't have it.
2. Open a terminal in this folder and run:

   ```bash
   npm install
   ```

## Running the server

```bash
npm start
```

The server starts at **http://localhost:4000**. Open that link in your
browser — it serves your portfolio page directly, now wired up to the
database.

The dashboard's lock icon still opens the same passcode gate. Once you enter
the correct passcode (set in `.env`), the projects table loads live from the
database and every add/edit/delete is saved permanently.

## Changing the organizer passcode

Open `.env` and change this line:

```
ORG_PASSCODE=mr rabeeh
```

Restart the server after changing it (`Ctrl+C` then `npm start` again).

## API reference

| Method | Endpoint              | Description                |
|--------|------------------------|-----------------------------|
| GET    | `/api/projects`        | List all projects           |
| GET    | `/api/projects/:id`    | Get one project              |
| POST   | `/api/projects`        | Create a project             |
| PUT    | `/api/projects/:id`    | Update a project             |
| DELETE | `/api/projects/:id`    | Delete a project             |
| POST   | `/api/auth/verify`     | Check the organizer passcode |
| GET    | `/api/health`          | Health check                 |

## Deploying online (so it's live 24/7)

To make this accessible outside your own computer, you'll need to host it
somewhere. Good beginner-friendly options that support Node.js + a
persistent disk (needed for the SQLite file):

- **Render.com** — free tier, easy GitHub deploy
- **Railway.app** — simple deploys, has a free trial tier
- **A basic VPS** (DigitalOcean, Hostinger, etc.) with Node.js installed

General steps for any of these:

1. Push this folder to a GitHub repository.
2. Connect the repo to the hosting platform.
3. Set the start command to `npm start` (or `node server.js`).
4. Add an environment variable `ORG_PASSCODE` with your passcode (instead of
   relying on the `.env` file, most hosts want env vars set in their dashboard).
5. Deploy — you'll get a public URL like `https://rabee-captures.onrender.com`.

## Notes

- The database file (`data/rabee_captures.db`) is created automatically on
  first run, seeded with 3 sample projects. Delete the file if you ever want
  to start fresh.
- This uses a simple shared passcode for the organizer dashboard — good
  enough for a solo freelancer, but not meant for multi-user access control.
- CORS is open by default so the frontend can call the API easily. If you
  deploy the frontend and backend on different domains, no changes are
  needed since CORS is already enabled server-side.
