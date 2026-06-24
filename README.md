# Parkov Photography

Next.js 16 photography portfolio and owner-management application for Parkov.

Project status and the next implementation milestone are tracked in
[`PROJECT_PLAN.md`](PROJECT_PLAN.md). Deployment, staging ownership, secret
handling, and the eventual client-account transfer are documented in
[`DEPLOYMENT_AND_HANDOFF.md`](DEPLOYMENT_AND_HANDOFF.md).

## Local Development

Copy `.env.example` to `.env`, configure local values, start PostgreSQL, apply
development migrations, and run the application:

```bash
npm install
npm run db:up
npm run db:migrate
npm run dev
```

Open <http://localhost:3000>. Localized public routes begin at `/bg` and `/en`.
The owner portal path is recorded in `PROJECT_PLAN.md`. Never put credential
values in tracked files.

Normal local development uses Docker through `.env`. Supabase staging settings
live separately in the ignored `.env.staging.local`:

```bash
npm run db:staging:deploy
npm run dev:staging
```

Netlify does not read either local file. Its staging environment variables must
be entered separately in the Netlify dashboard.

## Verification

Before merging deployment or data changes:

```bash
npm run lint
npm run build
```

Production database changes must use committed Prisma migrations and
`prisma migrate deploy`, not `prisma migrate dev`.

## Deployment

The approved stack is:

- Netlify for Next.js hosting
- Supabase for PostgreSQL and image storage
- Resend for transactional inquiry email

Staging is created under developer-owned accounts. After approval, production
ownership, credentials, domain, and DNS move to client-controlled accounts by
following `DEPLOYMENT_AND_HANDOFF.md`.
