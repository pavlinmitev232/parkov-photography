# Parkov Deployment And Client Handoff

This is the operational checklist for deploying Parkov through the developer's
accounts first, then transferring the approved project to client-owned accounts.

Do not store passwords, API keys, database URLs, recovery codes, or DNS login
details in this file, source control, screenshots, issue comments, or chat.
Record only secret names and where each secret is stored.

## Ownership Strategy

### Staging

- GitHub: developer-owned private repository.
- Supabase: dedicated Parkov project in a developer-owned organization.
- Resend: developer account using the test sender until real-domain approval.
- Netlify: dedicated Parkov site in the developer's team.
- URL: temporary Netlify staging URL.

### Client handoff

- The client creates or joins their own Supabase organization, Resend team,
  Netlify team, GitHub account or organization, and domain/DNS account.
- Transfer resources where the provider supports clean ownership transfer.
- Recreate credentials under client ownership and rotate every secret.
- Keep staging available until production passes the full acceptance checklist.

## Resource Register

Complete this table without entering secret values.

| Resource | Staging owner | Resource name or ID | Region | Client owner | Status |
| --- | --- | --- | --- | --- | --- |
| GitHub repository | Developer | `parkov-photography` | N/A | TBD | Not started |
| Supabase organization | Developer | `pavlinmitev232's Org` (`gdhynxrhykcagdtsodhd`) | N/A | TBD | Active |
| Supabase project | Developer | `parkov-photography-staging` (`klrsdryijpqujznnggqh`) | Central EU (Frankfurt), `eu-central-1` | TBD | Healthy |
| Supabase Storage | Developer | `portfolio`, `site-assets` | Project region | TBD | Healthy |
| Resend team | Developer | Developer account sandbox | N/A | TBD | Active |
| Resend sending domain | Client DNS required | TBD | EU proposed | TBD | Not started |
| Netlify team | Developer | `pavlinmitev232's team` | N/A | TBD | Active |
| Netlify site | Developer | `parkov-photography-staging` (`22c9d936-1e79-4164-9e10-ae144b1c0f7a`) | N/A | TBD | Live |
| Public domain and DNS | Client | TBD | N/A | Client | Not started |

## Environment Variable Register

The tracked `.env.example` is the canonical list of variable names. Actual
values belong in local `.env` files or provider secret stores.

- `.env` is reserved for the local Docker database and local filesystem uploads.
- `.env.staging.local` contains ignored Supabase staging values for explicit
  `dev:staging`, `build:staging`, and `db:staging:deploy` commands.
- Netlify variables are configured separately; Netlify cannot read local files.

| Variable | Purpose | Staging | Client production | Secret |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | Pooled runtime database connection | Required | Required | Yes |
| `DIRECT_URL` | Direct migration connection | Required | Required | Yes |
| `SUPABASE_URL` | Server-side project URL | Required | Required | No |
| `SUPABASE_SECRET_KEY` | Server-only Storage access | Required | Required | Yes |
| `SUPABASE_PORTFOLIO_BUCKET` | Portfolio bucket name | Required | Required | No |
| `SUPABASE_SITE_ASSETS_BUCKET` | Site asset bucket name | Required | Required | No |
| `ADMIN_EMAIL` | Owner login | Required | Required | Sensitive |
| `ADMIN_PASSWORD` | Owner login | Required | Required | Yes |
| `AUTH_SECRET` | Signs owner sessions | Required | Newly generated | Yes |
| `RESEND_API_KEY` | Inquiry notifications | Required later | Newly created | Yes |
| `INQUIRY_TO_EMAIL` | Inquiry recipient | Required later | Required | Sensitive |
| `RESEND_FROM_EMAIL` | Verified sender | Test sender first | Client sender | No |
| `NEXT_PUBLIC_CONTACT_PHONE` | Public contact | Staging value | Client value | No |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact | Staging value | Client value | No |

Never expose database credentials, `SUPABASE_SECRET_KEY`, `ADMIN_PASSWORD`,
`AUTH_SECRET`, or `RESEND_API_KEY` through a `NEXT_PUBLIC_` variable.

## Phase 1: Developer-Owned Supabase Staging

### Project

- [x] Sign in to the developer's Supabase account.
- [x] Create a dedicated Parkov project in an appropriate organization.
- [x] Select a European region and record the exact region above.
- [x] Store the generated database password in a password manager.
- [x] Record the project reference and dashboard URL without secrets.

### Database and Prisma

- [x] Collect the pooled runtime URL for `DATABASE_URL`.
- [x] Collect the non-transaction pooled migration URL for `DIRECT_URL`.
- [x] Configure Prisma to use the pooled URL at runtime and a non-transaction
      pooled URL for production migrations.
- [ ] Keep every schema change in committed Prisma migrations.
- [x] Generate Prisma Client.
- [x] Apply committed migrations with `prisma migrate deploy`.
- [x] Verify all expected tables exist.
- [x] Create, read, and remove a reversible test record.
- [x] Confirm database credentials are absent from tracked files.

### Storage

- [x] Create separate portfolio and site-asset buckets.
- [x] Document whether each bucket is public or private.
- [x] Keep upload, replacement, and deletion behind authenticated owner routes.
- [x] Use server-only credentials for privileged Storage operations.
- [x] Validate file type and maximum size.
- [x] Generate unique object paths.
- [x] Delete superseded objects only after replacement succeeds.
- [x] Preserve a documented local-development fallback if useful.
- [x] Add the Storage hostname to Next.js image configuration.
- [x] Test upload, display, replacement, and deletion for both buckets.
- [x] Confirm unauthenticated callers cannot use owner upload endpoints.

### Supabase acceptance

- [x] `npm run lint` passes.
- [x] `npm run build` passes.
- [x] `prisma migrate deploy` succeeds against staging.
- [x] Owner login and all database-backed management screens work.
- [ ] Uploads persist after a fresh deployment.
- [x] Bulgarian and English pages load database content.
- [x] A reversible inquiry test succeeds.

## Phase 2: Developer-Owned Resend Staging

- [x] Create a dedicated Parkov configuration in the developer's Resend account.
- [x] Install a pinned compatible Resend SDK and commit the lockfile.
- [x] Create a minimum-permission staging sending key.
- [x] Store the token immediately; Resend shows it only once.
- [x] Never call Resend directly from browser code.
- [x] Integrate Resend in the server-side inquiry notification module.
- [x] Check the SDK's returned `error` value explicitly.
- [x] Use an inquiry-ID idempotency key to prevent duplicate delivery.
- [x] Use the inquiry email as `replyTo` only when valid.
- [x] Use the test sender and verified account recipient during staging.
- [x] Test successful delivery through the Resend sandbox sender.
- [ ] Log failures without logging credentials or full sensitive inquiry data.
- [ ] Delay real-domain DNS changes until the client explicitly approves them.

Current email scope:

- Owner inquiry notifications are implemented and tested.
- Manual replies are sent from the owner's normal inbox using the notification's
  customer `replyTo`.
- Automatic customer confirmations and custom owner-portal email composition are
  future work and must use the customer's submitted email dynamically.

## Phase 3: Developer-Owned Netlify Staging

- [x] Sign in using the developer's Netlify account.
- [x] Create a dedicated Parkov site in the developer's team.
- [x] Connect the private GitHub repository.
- [x] Confirm Next.js and the Netlify Next.js runtime are detected.
- [x] Keep build configuration tracked and secrets out of `netlify.toml`.
- [x] Add environment variables with the correct deploy-context scopes.
- [x] Safely include Prisma generation and `prisma migrate deploy`.
- [x] Deploy to a draft or staging URL first.
- [ ] Verify pages, APIs, locale routing, proxy/middleware, images, and owner routes.
- [ ] Confirm uploads survive a fresh deployment.
- [ ] Inspect build and function logs for secret leakage.
- [ ] Record the staging URL and Netlify site ID above.

## Phase 4: Staging Review

- [ ] Client reviews the temporary staging URL.
- [ ] Client supplies or approves logo, favicon, images, contacts, social links,
      services, pricing, and bilingual copy.
- [ ] Approved content is entered through the owner portal.
- [ ] Test Bulgarian and English routes.
- [ ] Test light and dark modes.
- [ ] Test desktop, tablet, and mobile layouts.
- [ ] Run keyboard, accessibility, performance, and image-delivery checks.
- [ ] Test inquiry creation, notification, owner display, and status updates.
- [ ] Obtain explicit approval before ownership transfer or production DNS work.

## Phase 5: Client Account Preparation

- [ ] Client creates a Supabase account and organization.
- [ ] Client creates a Resend account or team.
- [ ] Client creates a Netlify account or team.
- [ ] Client identifies the final GitHub owner.
- [ ] Client confirms access to the registrar and DNS provider.
- [ ] Client invites the developer temporarily with the minimum required role.
- [ ] Compare destination plans with staging features.
- [ ] Schedule a transfer window and pause content edits.

## Phase 6: Supabase Transfer

Preferred path: transfer the existing project to the client's organization.

- [ ] Review Supabase's current transfer warnings and billing effects.
- [ ] Export a database backup and Storage inventory.
- [ ] Record current migration status and environment-variable names.
- [ ] Transfer the project from its general settings.
- [ ] Confirm project reference, region, database, Storage objects, and URLs.
- [ ] Create new database and server-only credentials under client control.
- [ ] Replace Supabase variables in Netlify and authorized local environments.
- [ ] Redeploy and repeat the Supabase acceptance checklist.
- [ ] Revoke old credentials only after the replacement deployment passes.

Fallback if transfer is unavailable:

- [ ] Create a client project in the chosen region.
- [ ] Apply committed Prisma migrations.
- [ ] Export and import database data.
- [ ] Recreate Storage buckets and access rules.
- [ ] Copy objects and update stored URLs if the project URL changes.
- [ ] Complete regression testing before deleting developer resources.

## Phase 7: Resend Transfer

If staging used only the test sender:

- [ ] Client adds a dedicated sending subdomain such as `send.example.com`.
- [ ] Choose the domain region deliberately; it cannot be changed later.
- [ ] Add the exact DNS records returned by Resend.
- [ ] Confirm domain verification.
- [ ] Client creates a domain-scoped sending key.
- [ ] Update Netlify, redeploy, and test real delivery.

If the real domain was verified in the developer's Resend team:

- [ ] Client starts a domain claim and adds the returned TXT proof record.
- [ ] Wait until the claim completes.
- [ ] Fetch the newly issued DKIM records.
- [ ] Replace old DKIM records; they cannot be reused after a claim.
- [ ] Verify the domain again in the client's team.
- [ ] Create a new domain-scoped sending key.
- [ ] Update Netlify and test before revoking the developer key.

## Phase 8: Netlify And GitHub Transfer

- [ ] Invite the client to the destination Netlify team.
- [ ] Ensure transfers are allowed and compare plan features.
- [ ] Transfer the Netlify project to the client's team.
- [ ] Confirm members, deploy settings, variables, hooks, and GitHub access.
- [ ] Rotate developer-owned Netlify tokens and hooks.
- [ ] Transfer the GitHub repository or grant agreed client ownership.
- [ ] Re-authorize GitHub-to-Netlify access under client control if needed.
- [ ] Trigger and verify a clean client-controlled deployment.

## Phase 9: Domain And Launch

- [ ] Lower DNS TTL in advance when possible.
- [ ] Add the production domain to the client-owned Netlify site.
- [ ] Configure apex and `www` behavior.
- [ ] Add or update DNS records.
- [ ] Confirm TLS certificate issuance.
- [ ] Update canonical URLs, metadata, and allowed-origin configuration.
- [ ] Run the full acceptance checklist on the real domain.
- [ ] Monitor email, errors, database connections, images, and deploy logs.
- [ ] Keep staging until the production observation window completes.

## Final Acceptance

- [ ] Client can access every production provider and DNS.
- [ ] Client is an Owner or equivalent everywhere.
- [ ] Developer-owned credentials have been replaced.
- [ ] Old credentials, hooks, tokens, and sessions have been revoked.
- [ ] Database and Storage backups exist.
- [ ] All Prisma migrations are committed and applied.
- [ ] Owner authentication and all CRUD workflows work.
- [ ] Upload, replacement, and deletion work.
- [ ] Inquiry persistence, notification, reply-to, and statuses work.
- [ ] Both languages, themes, and desktop/mobile layouts pass.
- [ ] Accessibility and performance checks pass.
- [ ] Production secrets are absent from Git, browser bundles, and logs.
- [ ] Client has the variable inventory and recovery notes.
- [ ] Client explicitly accepts the handoff.

## Rollback Rules

- Do not delete developer resources until client production passes.
- Do not revoke an old credential until its replacement is tested.
- If launch verification fails, restore the previous DNS records or point the
  domain to the last known-good deployment.
- Record failures and rollback actions without recording secret values.

## Official References

Recheck these immediately before handoff because provider interfaces change:

- Supabase project transfers:
  <https://supabase.com/docs/guides/platform/project-transfer>
- Netlify project transfers:
  <https://docs.netlify.com/manage/accounts-and-billing/team-management/team-owned-sites/>
- Netlify domain transfers:
  <https://docs.netlify.com/manage/domains/manage-domains/transfer-a-domain/>
- Resend domain claims:
  <https://resend.com/docs/dashboard/domains/claim>
