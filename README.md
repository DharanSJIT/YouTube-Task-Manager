# Learning Topic Manager (Frontend Only)

A React + Vite + Tailwind + Firebase (Firestore) app to track:
- Topic name
- Learning hours
- One required YouTube link
- One optional additional YouTube link

## Tech Stack
- React 19
- Vite
- Tailwind CSS
- Firebase Firestore
- TypeScript

## Project Structure

```text
task_manager/
├── client/
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── SearchBar.tsx
│       │   ├── FilterBar.tsx
│       │   ├── EmptyState.tsx
│       │   ├── TaskCard.tsx
│       │   ├── TaskModal.tsx
│       │   └── ui/
│       │       ├── button.tsx
│       │       ├── input.tsx
│       │       ├── label.tsx
│       │       └── sonner.tsx
│       ├── lib/
│       │   ├── firebase.ts
│       │   └── utils.ts
│       ├── pages/
│       │   └── Home.tsx
│       ├── services/
│       │   └── taskService.ts
│       └── types/
│           └── task.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json
```

## Run Locally

```bash
pnpm install
pnpm dev
```

App runs on the Vite default local URL shown in terminal.

## Firebase Env Variables

Set these in `.env` (local) and in Vercel Project Settings (Production):

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Build

```bash
pnpm build
```

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Framework preset: `Vite`.
4. Build command: `pnpm build`.
5. Output directory: `dist`.
6. Add all `VITE_FIREBASE_*` environment variables.
7. Deploy.

`vercel.json` is already included to handle SPA routing.

## Notes on Your Requested Changes

- Removed old full-stack/backend structure and configs.
- Kept frontend-only with Firebase Firestore.
- Removed completion/pending flow.
- Form now uses only topic, learning hours, and YouTube links.
- Added `+` optional additional YouTube link.
- Save button state resets correctly after submit.
