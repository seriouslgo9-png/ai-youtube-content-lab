# AI YouTube Content Lab

A React and Vite app for YouTube creators, with AI generation, account features, and saved content.

## Deploy to Vercel

1. Import this repository into Vercel and keep the project root set to the repository root.
2. Add these environment variables in the Vercel project settings, using the same public values as the local `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Deploy. Vercel uses `npm run build` and serves the generated `dist` folder; `vercel.json` handles direct links and page refreshes.

The app's AI, sign-in, and saved account data continue to use the existing Lovable Cloud project. Deploying the website to Vercel does not migrate or replace those services. Keep private service keys out of Vercel's `VITE_` variables.

## Run locally

```sh
npm install
npm run dev
```

Create a local `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` before starting the app. To check a production build locally, run `npm run build`.