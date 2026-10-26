# Development & deployment

## Local development

```bash
pnpm install
docker compose up -d            # Postgres on :5434, Mailpit on :1025 (inbox: http://localhost:8025)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm --filter api exec node ace generate:key
pnpm --filter api exec node ace migration:run
pnpm --filter api exec node ace db:seed --files database/seeders/main_seeder.ts   # demo@beebudget.app / demo1234
pnpm dev
```

## Production

| Part     | Host            | Notes                                     |
| -------- | --------------- | ----------------------------------------- |
| Database | Neon (Postgres) | Free tier, suspends after 5 min idle      |
| API      | Render (free)   | `render.yaml`, sleeps after 15 min idle   |
| Web      | Vercel          | Root directory `apps/web`                 |

Both free tiers sleep, so the first visit after a while waits on a cold
start. The web app handles it: `apps/web/proxy.ts` serves a loader page
(`app/starting/[locale]`) that polls the API's `/health` route, which wakes
Render and runs `SELECT 1` to wake Neon. Once `/health` answers, the loader
sets a `BACKEND_READY` cookie and reloads. The proxy renews that cookie
(10 min) on every request, so an active session never sees the loader again.

### 1. Database (Neon)

Use the **direct** host (without `-pooler`) for `DB_HOST`: Lucid migrations
take a session-level advisory lock, which the PgBouncer pooler does not
support. Set `DB_SSL=true`.

To reset and seed it from your machine:

```bash
cd apps/api
NODE_ENV=production DB_HOST=<direct-host> DB_PORT=5432 DB_USER=<user> \
DB_PASSWORD=<password> DB_DATABASE=neondb DB_SSL=true \
  sh -c 'node ace migration:fresh --force && node ace db:seed --files database/seeders/main_seeder.ts'
```

### 2. API (Render)

1. Render dashboard > **New > Blueprint** > select this repository. It reads
   `render.yaml` (free web service `bee-budget-api`).
2. Fill in the `sync: false` variables, or paste the whole env with
   **Environment > Add from .env**. The build is
   `npx pnpm@12.8.1 install --filter api... && npx pnpm@12.8.1 --filter api build`
   (keep that version in sync with `packageManager` in the root `package.json`), and the start
   command runs `migration:run --force` before `node bin/server.js`.
3. Check `https://<service>.onrender.com/health` returns `{"status":"ok"}`.

> **Email:** Render free instances block outbound SMTP on ports 25, 465 and
> 587, so Gmail SMTP can't send from the free tier. Either upgrade the
> instance, or use a provider that listens on another port (e.g. Resend on
> `smtp.resend.com:2465`, user `resend`, password = API key).

### 3. Web (Vercel)

1. **Add New > Project** > import this repository.
2. **Root Directory:** `apps/web` (Next.js is detected; keep "Include files
   outside the root directory" on, the app uses workspace packages).
3. Environment variables (Production):
   - `NEXT_PUBLIC_API_URL` = the Render URL, no trailing slash
   - `ENABLE_EXPERIMENTAL_COREPACK=1` (installs the pnpm version pinned in
     the root `package.json`)
4. Deploy.

### 4. Connect them

Back on Render, set `FRONTEND_APP_URL` and `CORS_ORIGIN` to the Vercel
production URL (plus any custom domain in `CORS_ORIGIN`, comma-separated),
then redeploy. CORS matters for the loader: its `/health` call goes from the
browser straight to Render.
