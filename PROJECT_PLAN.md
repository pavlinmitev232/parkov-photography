# Parkov Photography Website Plan

This file is the shared build tracker for the Parkov photography website. Keep it updated as decisions change and work is completed.

## New Chat Handoff

Read this section first when continuing in a new Codex chat.

### Workspace And Repository

- Workspace: `C:\Users\halor\Documents\photo parkoy`
- Private GitHub repository: `https://github.com/pavlinmitev232/parkov-photography`
- Branch: `main`
- Local development URL: `http://localhost:3000`
- Local PostgreSQL: Docker container `parkov-postgres` on `localhost:5433`
- Owner portal: `/bg/parkov-owner-portal-7f3a`
- Local owner credentials are configured in `.env`; never copy them into tracked files or chat output.
- Read `AGENTS.md` before coding and consult the relevant Next.js 16 guide under `node_modules/next/dist/docs/`.

### Current Technical State

- Stack: Next.js 16, React 19, TypeScript, Tailwind CSS, next-intl, next-themes, Framer Motion, Prisma 7, PostgreSQL.
- Public site and owner portal are functional.
- Portfolio, categories, services, pricing, settings, testimonials, FAQs, inquiries, and inquiry statuses are database-backed.
- Owner-managed settings include contacts, social links, hero/about/logo assets, bilingual copy, SEO, and section visibility.
- Hero statistics are owner-editable and animate from zero to their configured values when they enter the viewport.
- Normal local development stores uploads in `public/uploads`; staging uses
  persistent Supabase Storage through server-only owner routes.
- Supabase staging is healthy in Frankfurt (`eu-central-1`), all committed
  migrations are applied, and portfolio/site asset Storage smoke tests passed.
- Netlify staging is connected to the private GitHub repository at
  `https://parkov-photography-staging.netlify.app`; the first Git-backed
  production-context deploy from `main` is live.
- Inquiry notifications use Resend when configured, with inquiry-ID
  idempotency, valid customer `replyTo`, and optional SMTP fallback.
- A Resend sandbox notification was delivered successfully to the verified
  developer account email.
- Inquiry validation, honeypot, rate limiting, database persistence, owner display, and status updates have been tested.
- Inquiry contact fields follow the selected method: email requires email, while phone, Viber, and WhatsApp require a phone number on both client and server.
- Existing portfolio items can be edited, including titles, category, metadata, visibility, featured state, and image replacement.
- Stale development and placeholder notes were replaced with owner- and client-facing copy.
- The last completed verification passed `npm run lint`, `npm run build`, desktop/mobile Browser checks, and reversible API smoke tests.

### Production Stack Decision

- Start on free tiers.
- Hosting: Netlify.
- Database and image storage: Supabase.
- Transactional inquiry email: Resend.
- Build and validate staging in dedicated developer-owned provider resources.
- After client approval, transfer or recreate production resources under
  client-owned Supabase, Resend, Netlify, GitHub, domain, and DNS accounts.
- Follow `DEPLOYMENT_AND_HANDOFF.md` and rotate every credential during handoff.
- Real Parkov images, contacts, logo, and approved copy will be entered through the owner portal after staging is deployed.
- Expected initial recurring platform cost: `$0`; domain registration is separate.

### Installed Agent Skills

The following first-party skills were installed under `C:\Users\halor\.codex\skills`:

- `supabase`
- `supabase-postgres-best-practices`
- `resend`
- `email-best-practices`
- `netlify-deploy`
- `netlify-frameworks`
- `netlify-config`

Codex must be restarted before a new chat so these skills are loaded.

### Immediate Next Task

1. Replace the temporary environment-variable owner login with Supabase Auth
   using the implementation plan below.
2. Run owner login, database management, Storage upload/replacement/deletion,
   inquiry persistence, notification delivery, and status-update checks on the
   deployed staging site.
3. Later, add optional automatic customer confirmations and owner-portal custom
   email sending. These are not implemented yet; manual replies currently work
   through the owner inbox because notifications set the customer as `replyTo`.

### User Authorization Boundaries

The user may need to complete or approve:

- Supabase, Resend, and Netlify sign-in or account creation.
- GitHub OAuth authorization for Netlify.
- CAPTCHA or service security prompts.
- API key creation and secure environment-variable destinations.
- Domain ownership verification and DNS changes.

Do not expose secrets in source control, terminal summaries, screenshots, or chat responses.

## Project Direction

- Brand: Parkov
- Primary market: Bulgaria
- Languages: Bulgarian first, English second
- Experience: premium photography portfolio with strong client request flow
- Theme: polished light and dark modes
- Reference: Snapify-style photography website, improved with clearer conversion, better local fit, and owner management

## Current Status

- [x] Next.js project scaffolded
- [x] TypeScript enabled
- [x] Tailwind CSS enabled
- [x] Bulgarian and English route structure added
- [x] Light/dark mode foundation added
- [x] Animation library added
- [x] Public homepage first pass built
- [x] Request/contact form first pass built
- [x] Preferred-contact conditional fields and validation added
- [x] Mobile navigation added
- [x] About, packages, testimonials, FAQ, and footer added
- [x] Portfolio filtering and lightbox added
- [x] Local Docker PostgreSQL added
- [x] Inquiry API saves requests to database
- [x] Admin requests page reads database inquiries
- [x] Owner login added
- [x] Owner portal routes protected by signed session cookie
- [x] Inquiry preferred contact method added
- [x] Inquiry status updates added
- [x] Inquiry email notification utility added
- [x] Basic inquiry spam/rate-limit protection added
- [x] Portfolio item create/delete owner management added
- [x] Local image upload/storage for owner-managed portfolio photos added
- [x] Owner gallery category management added
- [x] Portfolio metadata and homepage visibility added
- [x] Owner services and pricing management added
- [x] Owner brand, contact, social, image, SEO, and copy settings added
- [x] Owner testimonial and FAQ management added
- [x] Public gallery reads database portfolio items with mock fallback
- [x] Admin dashboard skeleton added
- [x] Prisma schema draft added
- [x] Environment variable template added
- [x] Lint passes
- [x] Production build passes
- [x] Browser check completed for desktop/mobile first pass
- [x] Public navigation and locale routing QA completed
- [x] Staggered section and card motion polish added
- [x] Inquiry form and owner status workflow tested end to end
- [x] Editable animated hero statistics added
- [x] About-point stagger, checkmark, and accent reveal animation added
- [x] Existing portfolio item editing and image replacement added
- [x] Gallery lightbox previous/next, keyboard, looping, and mobile swipe navigation added
- [x] Development placeholder copy cleanup completed

## Stage 1: Foundation

- [x] Create Next.js app
- [x] Install core dependencies
- [x] Add route localization
- [x] Add theme provider
- [x] Add shared design tokens
- [x] Add reusable utility helpers
- [x] Add initial content/data structure
- [x] Add environment variable template
- [x] Add final README for setup and development

## Stage 2: Public Website

- [x] Homepage hero
- [x] Header/navigation
- [x] Language switch
- [x] Theme toggle
- [x] Mobile menu
- [x] Portfolio preview
- [x] Services section
- [x] Process section
- [x] Contact/request section
- [x] About section
- [x] Full gallery page
- [x] Portfolio filtering
- [x] Gallery lightbox
- [x] Packages/pricing section
- [x] Testimonials section
- [x] FAQ section
- [x] Footer
- [x] Bulgarian SEO metadata
- [x] English SEO metadata
- [ ] Local Bulgaria-oriented copy polish

## Stage 3: Animation And Visual Polish

- [x] Basic hero/header animation
- [x] Basic scroll reveal animations
- [x] Portfolio hover effects
- [ ] Inspect full reference site animation behavior in Browser
- [x] Improve scroll timing and stagger effects
- [x] Add gallery/lightbox transitions
- [x] Add service card motion polish
- [ ] Add testimonial slider animation
- [ ] Add page/route transition strategy if needed
- [ ] Final light mode visual pass
- [ ] Final dark mode visual pass
- [ ] Mobile animation/performance pass

## Stage 4: Backend

- [x] Prisma schema draft
- [x] Choose local database strategy
- [x] Add PostgreSQL connection setup
- [x] Create first Prisma migration
- [x] Add database client helper
- [x] Add inquiry API route
- [x] Save client requests to database
- [x] Add email notification for new requests
- [x] Add spam/rate-limit protection
- [x] Add server-side validation

## Stage 5: Admin Panel

- [x] Admin route skeleton
- [x] Admin dashboard cards
- [x] Add authentication
- [x] Protect admin routes
- [x] Add owner account setup
- [x] Manage portfolio photos
- [x] Manage gallery categories
- [x] Manage services
- [x] Manage packages/pricing
- [x] Manage testimonials
- [x] Manage FAQ
- [x] Manage contact/social details
- [x] View client inquiries
- [x] Update inquiry status
- [x] Add image upload/storage
- [x] Edit existing portfolio items and replace their images

## Stage 6: Content And Assets

- [ ] Replace mock brand details with real Parkov details
- [ ] Replace mock phone/email/socials
- [ ] Replace Unsplash placeholder images with real photography
- [ ] Confirm service categories
- [ ] Confirm package/pricing strategy
- [ ] Confirm Bulgarian copy
- [ ] Confirm English copy
- [ ] Add logo if available
- [ ] Add favicon/brand icons

## Stage 7: Testing And Launch

- [x] Initial lint check
- [x] Initial production build check
- [x] Initial Browser desktop check
- [x] Initial Browser mobile check
- [x] Test all public navigation links
- [ ] Test both languages fully
- [ ] Test light/dark mode across all sections
- [x] Test request form backend flow
- [x] Test admin auth
- [x] Test image upload flow
- [ ] Accessibility pass
- [ ] Performance/image optimization pass
- [ ] Deployment setup
- [ ] Production environment variables
- [ ] Final launch QA

### Inquiry Form Validation Feedback

The server and client currently require a project message of at least 10
characters, but the UI shows only a generic error. Before launch:

- [x] Add field-specific Bulgarian and English messages for every inquiry field.
- [x] Tell users that the project message must contain at least 10 characters.
- [x] Add a visible helper or character counter so the requirement is known
      before submission.
- [x] Mark invalid fields with `aria-invalid` and connect each error using
      `aria-describedby`.
- [x] Focus or scroll to the first invalid field after a failed submission.
- [x] Preserve the same validation rules on client and server.
- [x] Test short-message feedback and bilingual helper text.
- [ ] Test whitespace-only, missing, and valid messages during full staging QA.

## Stage 8: Free-Tier Production Setup

### Supabase

- [x] Create a free Supabase project in a European region
- [x] Add pooled `DATABASE_URL` for the running application
- [x] Add direct `DIRECT_URL` for migrations
- [x] Configure Prisma to support separate runtime and migration connections
- [x] Apply committed migrations with `prisma migrate deploy`
- [x] Create public storage buckets for portfolio and site assets
- [x] Add least-privilege storage access configuration
- [x] Replace local portfolio uploads with Supabase Storage
- [x] Replace local hero, about, and logo uploads with Supabase Storage
- [x] Delete superseded cloud assets when appropriate
- [x] Validate file type and size before upload
- [ ] Optimize uploaded photography for web delivery

### Resend

- [x] Create a free Resend account
- [x] Add `RESEND_API_KEY`
- [x] Replace or supplement SMTP notifications with Resend
- [x] Configure inquiry recipient and sender variables
- [x] Test inquiry notifications with the Resend test sender
- [ ] Verify the Parkov sending domain before public launch
- [x] Confirm client email is used as the notification `replyTo`
- [ ] Add an optional bilingual customer confirmation email sent directly to the
      customer's validated email address.
- [ ] Give customer confirmations their own inquiry-ID idempotency key so retries
      cannot send duplicate confirmations.
- [ ] Decide whether confirmations should invite replies to a real Parkov inbox
      or omit `replyTo`; `replyTo` is optional for direct customer delivery.

### Netlify

- [x] Create or connect a Netlify account
- [x] Import the private GitHub repository
- [x] Configure the production build command
- [x] Add Prisma generation and migration deployment steps
- [x] Add Supabase, Resend, temporary owner auth, and site environment variables
- [x] Deploy a staging version from `main`
- [x] Confirm basic Next.js routes, proxy/middleware, and image rendering
- [ ] Confirm owner uploads persist after a fresh deployment
- [ ] Configure custom domain and DNS

### Supabase Owner Auth Replacement

The current `ADMIN_EMAIL` / `ADMIN_PASSWORD` login is staging-only. Replace it
before client production:

- [x] Install and pin the current Supabase SSR package required by the official
      Next.js 16 server-side auth guide.
- [x] Add a browser-safe Supabase publishable key for Auth; never expose the
      Supabase secret/service key.
- [x] Add server-side Supabase clients with cookie-based SSR sessions and Proxy
      token refresh.
- [x] Add Supabase email/password sign-in behind `OWNER_AUTH_PROVIDER`.
- [x] Route the existing owner page and API guards through verified Supabase
      users when the provider is `supabase`.
- [x] Keep `OWNER_AUTH_PROVIDER=legacy` as an explicit rollback path until the
      staging cutover is accepted.
- [x] Replace the custom signed session cookie checks on owner pages and APIs
      with server-validated Supabase Auth user checks.
- [x] Restrict owner authorization using trusted `app_metadata`, not editable
      `user_metadata`; only users with the owner role may access owner routes.
- [x] Create the staging owner account administratively with the trusted owner role.
- [x] Add logout, forgot-password, recovery callback, and set-new-password flows.
- [x] Add localhost and staging redirect URLs in Supabase Auth settings.
- [x] Disable public sign-up in the Supabase Auth provider settings.
- [ ] Use the verified Parkov sending domain for password-reset/auth emails,
      either through Supabase custom SMTP or its Resend integration.
- [x] Test invalid login and reject unauthenticated password updates.
- [ ] Test expired sessions, password-reset delivery, and recovery links.
- [x] Test valid local owner login, logout, unauthorized
      owner APIs, and the explicit legacy fallback.
- [ ] Remove `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`, the custom session
      implementation, and its cookie after the Supabase Auth cutover passes.

### Staging Verification

- [x] Test owner login and logout
- [ ] Test portfolio, category, service, pricing, settings, testimonial, and FAQ management
- [ ] Test Supabase image upload, display, replacement, and deletion
- [ ] Test inquiry creation, database storage, notification delivery, and status updates
- [ ] Test Bulgarian and English routes
- [ ] Test light and dark themes
- [ ] Test desktop and mobile layouts
- [ ] Run accessibility and keyboard checks
- [ ] Run performance and image-delivery checks
- [ ] Confirm production secrets are not exposed to the browser or repository

## Decisions

- Admin lives in the same app under `/parkov-owner-portal-7f3a`.
- The current signed owner-session cookie is staging-only and will be replaced
  by Supabase Auth before production.
- The unusual owner path remains only an additional friction layer, never the
  authorization boundary.
- Bulgarian is the default language.
- Owner management is part of the project, not a later unrelated app.
- Request flow should support form, phone, Viber, WhatsApp, and email.
- Inquiry storage and owner status management are complete.
- Production will initially use Netlify, Supabase, and Resend free tiers.
- Production migrations must use committed migrations with `prisma migrate deploy`, never `prisma migrate dev`.
- Real owner content will be entered through the deployed staging owner portal.
- Initial staging resources belong to the developer for fast validation.
- Final production resources and credentials must be client-owned.
- Every production credential must be recreated or rotated under client control.

## Open Questions

- Which Parkov domain will be used for the public site and Resend sender verification?
- Should pricing be public, hidden, or "starting from" style?
- Does the owner need blog/news management after launch?

## Next Recommended Work

1. Implement and verify the Supabase Auth owner-login replacement.
2. Complete the deployed staging verification checklist.
3. Collect approved Parkov content and confirm the final domain.
4. Create or transfer client-owned production resources and perform launch QA.
