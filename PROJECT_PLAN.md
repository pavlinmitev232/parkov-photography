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
- Owner-managed settings include contacts, social links, hero/about/logo assets, bilingual copy, SEO, global site notifications, and section visibility.
- Hero statistics are owner-editable and animate from zero to their configured values when they enter the viewport.
- Normal local development stores uploads in `public/uploads`; staging uses
  persistent Supabase Storage through server-only owner routes.
- Supabase staging is healthy in Frankfurt (`eu-central-1`), all committed
  migrations are applied, and portfolio/site asset Storage smoke tests passed.
- Netlify staging is connected to the private GitHub repository at
  `https://parkov-photography-staging.netlify.app`; the first Git-backed
  production-context deploy from `main` is live.
- Supabase Auth is active on local development and Netlify staging. The owner
  account uses `pavlinmitev121977@gmail.com`, public sign-up is disabled, and
  access requires trusted `app_metadata.role = "owner"`.
- The password-recovery redirect was corrected in commit `067242c`: Supabase's
  default Site URL now points to staging, and the app uses an exact allowlisted
  callback URL without an extra query string.
- The recovery callback supports cross-device `token_hash` recovery links and
  was verified on staging with a temporary owner user.
- Inquiry notifications use Resend when configured, with inquiry-ID
  idempotency, valid customer `replyTo`, and optional SMTP fallback.
- A Resend sandbox notification was delivered successfully to the verified
  developer account email.
- Inquiry validation, honeypot, rate limiting, database persistence, owner display, and status updates have been tested.
- Inquiry contact fields follow the selected method: email requires email, while phone, Viber, and WhatsApp require a phone number on both client and server.
- Existing portfolio items can be edited, including titles, category, metadata, visibility, featured state, and image replacement.
- Native browser confirm dialogs have been replaced in owner booking deletion with an in-app confirmation dialog.
- Stale development and placeholder notes were replaced with owner- and client-facing copy.
- The last completed verification passed `npm run lint`, `npm run build`, desktop/mobile Browser checks, reversible API smoke tests, Supabase Storage upload/replacement/deletion checks, public route/image checks, and public secret-exposure checks.
- Client-owned production setup is in progress as of July 2, 2026:
  Nikolay's GitHub fork is connected to Nikolay's Netlify project
  `parkov-photography` (`e86f8fa3-3730-4be0-a8dd-df6249eac3ca`), live at
  `https://parkov-photography.netlify.app`.
- Client-owned Supabase production project `parkov-photography`
  (`ulpfrrgromitahoqmggg`) is live in Central EU (Frankfurt),
  `eu-central-1`. All committed Prisma migrations are applied, public Storage
  buckets `portfolio` and `site-assets` exist, and the owner Auth user
  `nikolayparkov06@gmail.com` has trusted `app_metadata.role = "owner"`.
- Client production secrets and the generated owner temporary password are
  stored only in ignored `.env.owner.local`. Do not copy values into chat or
  tracked files.
- GitHub Actions keepalive workflows now ping the public staging and production
  `/bg` pages every 3 days to keep both Supabase projects active.
- `parkovvisuals.com` and `www.parkovvisuals.com` are added to the owner
  Netlify site. Namecheap authoritative DNS points root to Netlify
  (`A @ -> 75.2.60.5`) and `www` to
  `parkov-photography.netlify.app`; Netlify SSL was still pending during the
  last check, and one local resolver still had a stale Vercel `www` cache.
- Owner portfolio creation now supports selecting up to 20 images at once.
  Files are staged in the browser, uploaded through the existing validated
  image endpoint with a concurrency limit of four, and saved as separate
  portfolio records in one database transaction. Uploaded files are cleaned up
  when a partial upload or batch save fails.
- Bulgarian and English portfolio titles are optional. If only one language is
  filled, public pages use it as the fallback in both locales; if both are
  empty, public cards omit the heading and retain accessible category-based
  image/dialog labels.
- Owner portfolio uploads now optimize files larger than 1.5 MB in the browser:
  the longest edge is capped at 2560 px and the result is encoded as quality
  `0.86` WebP when that produces a smaller file. Small files and any image the
  browser cannot optimize are uploaded unchanged. The owner UI reports batch
  progress, and desktop portfolio cards use bounded `144 x 128` thumbnails
  instead of stretching images to the row height; mobile cards remain wide.
- August 7 production homepage regression diagnosed and fixed locally: all 65
  production portfolio rows and Storage objects were healthy, but the homepage
  wrapped the entire 8,286 px gallery in a Framer Motion `whileInView` animation
  requiring 20% visibility. That threshold could never fit inside the browser
  viewport, leaving the parent section permanently at `opacity: 0`. The fix in
  `src/app/[locale]/page.tsx` makes the gallery container a normal `section`;
  individual photo animations remain. Verified against the read-only production
  dataset on local port 3001: 65 cards rendered, parent opacity was `1`, visible
  images loaded, no broken images or browser errors. `npm run lint` and
  `npm run build` pass. Verify the Netlify production deploy and live homepage
  after the main-branch push.
- August 7 cold-load performance investigation: Netlify edge hits measured
  about `0.2-0.5s`, and an expired/stale ISR request measured about `0.7s`, so
  the reported 6-7 second delay was not primarily database or ISR latency. A
  mobile Lighthouse run against production scored 64 with `3.8s` FCP, `12.2s`
  LCP, and about `4.4 MB` transferred. The homepage bypassed Next/Netlify image
  resizing; Chrome's lazy-load distance pulled three roughly 1 MB portfolio
  images into the initial load before the gallery was reached. The local fix
  enables responsive optimization for homepage cards and site hero/about/logo
  imagery, adds card-aware `sizes`, and keeps the hero text visible while its
  entrance movement runs. Against the real 65-photo dataset, the equivalent
  local production Lighthouse run scored 87 with `0.9s` FCP, `4.1s` LCP, and
  about `1.1 MB` transferred. All 65 cards retained their animations, used
  optimized image URLs, and showed no broken images or browser errors. Lint and
  the production-data build pass. The performance fix targets upstream `main`;
  the Netlify production site still requires the client fork to sync that commit.
- August 8 privacy/GDPR transparency update: added bilingual `/bg/privacy` and
  `/en/privacy` pages based on the inquiry system's actual data flow, including
  the collected fields, legal bases, processors, international transfers,
  retention criteria, visitor rights, cookies/local storage, and CPDP contact.
  The homepage footer and inquiry form now link to the policy. The public site
  has no analytics or advertising-cookie implementation, so no consent banner
  was added. The controller's displayed brand comes from the owner-managed
  site settings, while privacy requests use the dedicated contact address
  `parkovvisualsparkov@gmail.com`; no telephone number is published on the
  policy page. The owner should have the wording legally reviewed and confirm
  that the displayed identity is sufficient for their registered business
  form. The public wording uses recipient categories
  (database/storage, hosting/security, and transactional email) rather than
  naming individual technology vendors, keeping the notice accurate if a
  provider changes while still describing who can receive inquiry data.

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

1. Recheck `parkovvisuals.com` and `www.parkovvisuals.com` DNS/HTTPS. Proceed
   only after Netlify SSL is active and both domains serve Netlify, not Vercel.
   July 2 follow-up: authoritative Namecheap DNS has the intended Netlify
   records, but the local/default resolver still returns old Vercel records,
   `https://parkovvisuals.com` serves the old Vercel "My Google AI Studio App",
   and `https://www.parkovvisuals.com` still fails TLS.
   July 3 follow-up: HTTPS is active. The live Let's Encrypt certificate covers
   both `parkovvisuals.com` and `www.parkovvisuals.com`, and BG/EN pages return
   `200` from Netlify over HTTPS.
2. Update Supabase Auth production Site URL and redirect allowlist from the
   temporary Netlify subdomain to the final domain:
   `https://parkovvisuals.com` and
   `https://parkovvisuals.com/api/owner-auth-callback`. Keep the Netlify
   subdomain redirect temporarily during the transition if needed.
3. Update Netlify/app public URL variables if the project adds one later, then
   trigger a cloud deploy and test owner login on the final domain.
4. Configure owner-owned Resend for `parkovvisuals.com`, preferably a sending
   subdomain such as `send.parkovvisuals.com`, add DNS records, create the
   sending key, update Netlify, redeploy, and test inquiry notifications.
5. Run production QA on the final domain: public BG/EN pages, owner login,
   uploads/replacements/deletions, inquiry create/display/status, password
   reset, and browser secret-exposure checks.
6. After the owner accepts production, remove/revoke temporary developer access,
   stale tokens, unused Vercel domain attachment if desired, and legacy owner
   auth variables/code only after the Supabase Auth cutover is fully accepted.

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
- [x] Multi-image portfolio creation and optional bilingual titles added
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
- [x] Optimize uploaded photography for web delivery
- [x] Create client-owned Supabase production project
      `parkov-photography` (`ulpfrrgromitahoqmggg`) in Frankfurt.
- [x] Apply all committed Prisma migrations to the client-owned database.
- [x] Create client-owned public Storage buckets `portfolio` and `site-assets`.
- [x] Configure client production Supabase env vars in Nikolay's Netlify site
      using the same new-key model as staging: `sb_publishable...` for browser
      Auth and `sb_secret...` for server-side privileged calls.
- [x] Create owner Auth user `nikolayparkov06@gmail.com` and set trusted
      `app_metadata.role = "owner"`.
- [x] Configure Supabase Auth Site URL and callback for the temporary Netlify
      production URL.
- [ ] Switch Supabase Auth Site URL/callback to `parkovvisuals.com` after
      Netlify SSL is active.

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
- [x] Confirm owner uploads persist after a fresh deployment
- [x] Create client-owned Netlify project `parkov-photography`
      (`e86f8fa3-3730-4be0-a8dd-df6249eac3ca`) in Nikolay's team.
- [x] Connect Nikolay's GitHub fork `nikolayparkov06/parkov-photography`.
- [x] Configure owner Supabase variables and cloud deploy from the fork.
- [x] Confirm public BG/EN routes and owner login route return `200` on
      `https://parkov-photography.netlify.app`.
- [x] Add `parkovvisuals.com` and `www.parkovvisuals.com` to the Netlify site.
- [x] Update Namecheap authoritative DNS for Netlify:
      `A @ -> 75.2.60.5` and
      `CNAME www -> parkov-photography.netlify.app`.
- [x] Add scheduled GitHub Actions keepalive pings for staging and production.
- [ ] Wait for all resolvers to stop serving the old Vercel `www` record.
- [x] Confirm Netlify SSL certificate issuance for root and `www`.

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
- [x] Test token-hash recovery links and password update on staging with a
      temporary owner user.
- [ ] Test real owner password-reset email delivery after the Supabase reset
      email template is switched to the token-hash callback link.
- [x] Test valid local owner login, logout, unauthorized
      owner APIs, and the explicit legacy fallback.
- [ ] Remove `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`, the custom session
      implementation, and its cookie after the Supabase Auth cutover passes.

### Staging Verification

- [x] Test owner login and logout
- [x] Test portfolio, category, service, pricing, settings, testimonial, and FAQ management
- [x] Test Supabase image upload, display, replacement, and deletion
- [x] Test inquiry creation, database storage, notification delivery, and status updates
- [x] Test Bulgarian and English routes
- [x] Test light and dark themes
- [x] Test desktop and mobile layouts
- [x] Run accessibility and keyboard checks
- [x] Run performance and image-delivery checks
- [x] Confirm production secrets are not exposed to the browser or repository

Compact staging pass on June 25, 2026:

- Bulgarian and English home/gallery routes loaded successfully.
- Light/dark switching and mobile navigation worked, with no horizontal mobile
  overflow or browser console errors observed.
- The deployed owner login correctly rejected the local legacy fallback
  credentials. Protected CRUD and Storage checks still require a valid
  Supabase owner session.
- No inquiry was submitted during this pass, avoiding a permanent test record
  and notification while owner access was unavailable for cleanup.
- Obvious test portfolio content remains visible and should be replaced during
  the approved-content stage.

Full deployed staging pass on June 26, 2026:

- Owner login and protected owner routes passed on Netlify staging.
- Portfolio categories/items, services, pricing packages, testimonials, FAQs,
  settings, and booking deletion were tested with temporary records and cleaned.
- Owner-controlled global site notifications were verified in English and
  Bulgarian, then reverted to disabled.
- Booking deletion uses the custom in-app confirmation dialog; no native browser
  dialog appeared.
- Supabase Storage portfolio upload, display, replacement cleanup, item deletion
  cleanup, site-asset upload, and unauthenticated upload rejection passed.
- Public inquiry creation, owner display, status update, and database cleanup
  passed. This also exercises the configured owner notification path.
- English/Bulgarian home and gallery routes returned `200`, had localized
  `<html lang>`, rendered images, and had no leftover staging banner.
- Light/dark theme switching worked in the browser with no native dialog.
- Mobile browser checks at `390x844` found no horizontal overflow or console
  errors on home/gallery in both languages.
- Basic accessibility checks found no missing image `alt` attributes, unnamed
  SSR buttons, or unnamed SSR links on the checked public routes.
- Public HTML and the first client JS bundles did not expose configured secret
  names or secret values.
- Unsplash placeholder image delivery was fixed by skipping Next image
  optimization only for Unsplash URLs; Supabase/owner uploads remain normal.

Password-recovery update on June 26, 2026:

- The app-side recovery callback now accepts
  `/api/owner-auth-callback?token_hash=...&type=recovery`, verifies it with
  Supabase, sets the recovery session cookie, and hands off to the clean
  `/bg/parkov-owner-portal-7f3a/update-password` URL.
- Local and deployed staging tests passed with a temporary owner user: callback
  session creation, password update, old password rejection, new password login,
  and temporary user deletion.
- The remaining manual Supabase dashboard step is to update the Reset Password
  email template to link directly to the app callback with `{{ .TokenHash }}`.

## Stage 9: Owner Workflow Expansion

Add the following operational features before the final production handoff:

### Public Location and Social Presentation

- [x] Keep the existing bilingual public location summary editable.
- [x] Add an editable bilingual street/studio address and a separate map search
      location so the public wording does not have to expose a private address.
- [x] Add an owner-controlled map visibility toggle and render the map without
      requiring a paid maps API key.
- [x] Replace footer social text-only controls with recognizable Instagram,
      Facebook, and TikTok-style icons while preserving accessible labels.

### Inquiry Reply Workflow

- [x] Add a clear reply-by-email action to inquiries that have a valid email.
- [x] Offer reusable localized templates for availability, more-information,
      quotation, unavailable-date, and booking-confirmation replies.
- [x] Open the owner's normal mail application with recipient, subject, and
      selected template prefilled; do not claim that the portal sent or tracked
      the message.
- [x] Keep full in-portal email delivery and conversation history as an optional
      later phase if operational use proves it is needed.

### Booking Calendar

- [x] Add a protected booking record linked optionally to its source inquiry.
- [x] Store client, service, start/end time, venue/address, private notes, and
      tentative/confirmed/completed/cancelled status.
- [x] Let the owner create a booking from an inquiry without retyping known
      client details.
- [x] Add protected owner API routes for booking creation, updates, and removal.
- [x] Add a calendar/agenda owner page showing upcoming work by date and status.
- [x] Keep inquiries and bookings separate: an inquiry is a request; a booking
      is scheduled work.
- [x] Add indexes for booking date, status, and inquiry linkage.
- [x] Verify unauthenticated callers cannot reach the booking page or mutate
      booking data; local POST/PATCH/DELETE checks returned `401`.

Implementation note on June 25, 2026:

- The production build, TypeScript checks, lint, Prisma schema validation, and
  public browser smoke test pass.
- The booking migration was applied successfully to both the local Docker
  database and Supabase staging.
- Local authenticated create/update/calendar/delete testing passed through the
  explicit legacy rollback mode, and its temporary booking was removed.
- The staging-connected production build passes.
- Supabase staging login with the current owner email passed the trusted
  `app_metadata` owner-role check. Booking create, status update, calendar
  display, and delete all passed, and the temporary staging record was removed.

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
- Public maps use an editable search location and a privacy-conscious display
  toggle rather than requiring precise coordinates or a paid maps integration.
- Initial inquiry replies use prefilled `mailto:` actions; the portal does not
  become an email inbox unless later usage justifies message storage and inbound
  email handling.
- Calendar entries are separate booking records with optional inquiry links.
- Production will initially use Netlify, Supabase, and Resend free tiers.
- Production migrations must use committed migrations with `prisma migrate deploy`, never `prisma migrate dev`.
- Real owner content will be entered through the deployed staging owner portal.
- Automatic insertion of built-in content into empty tables is controlled by
  server-only `SEED_DEFAULT_CONTENT`; it defaults to `false` for clean databases.
- Initial staging resources belong to the developer for fast validation.
- Final production resources and credentials must be client-owned.
- Every production credential must be recreated or rotated under client control.

## Open Questions

- Use `parkovvisuals.com` for the public site. Resend should use a dedicated
  sending subdomain such as `send.parkovvisuals.com` unless the owner chooses
  a different email strategy.
- Should pricing be public, hidden, or "starting from" style?
- Does the owner need blog/news management after launch?

## Next Recommended Work

1. Wait for `parkovvisuals.com` / `www.parkovvisuals.com` DNS and Netlify SSL
   to finish, then set the final domain as the production auth/canonical target.
   July 2 follow-up: do not switch Supabase yet; the domain still resolves to
   old Vercel records on the local/default resolver and HTTPS is not clean.
2. Configure owner-owned Resend for `send.parkovvisuals.com`, update Netlify
   email variables, redeploy, and test inquiry notification delivery.
3. Enter approved Parkov content through the owner portal and rerun final
   production QA on the real domain.
4. Test owner password reset using the final domain and token-hash callback.
5. Remove or revoke temporary developer access, stale Vercel attachments, old
   tokens, and legacy owner auth variables/code only after the owner accepts
   production.

## Verification Update: August 5, 2026

- `npm run lint` passes.
- `npx tsc --noEmit` passes.
- `npm run build:staging` passes and includes the protected
  `/api/portfolio-items/batch` route.
- Plain `npm run build` compiled and passed TypeScript, but local static data
  generation could not complete because Docker Desktop/local PostgreSQL was not
  running (`ECONNREFUSED`). `npm run db:up` also could not start because the
  Docker Desktop Linux engine was unavailable.
- Browser automation verified owner login and loaded the production-configured
  portfolio page without submitting data. It caught and prompted correction of
  misplaced optional-title translation keys. A final repeat was not completed
  because the live portfolio database read became intermittent/hung; no client
  portfolio records or Storage objects were created, changed, or removed.
- Follow-up upload-performance verification passed `npm run lint`,
  `npx tsc --noEmit`, and `npm run build:staging`. A headless-Chrome optimizer
  smoke test reduced a synthetic noisy `6,804,534`-byte JPEG to a
  `2,747,670`-byte, `2560 x 1760` WebP (about 60% smaller). This is a deliberately
  hard-to-compress test image; normal photographs are expected to vary.

### Next Chat Start Here

1. Read `AGENTS.md`, this handoff section, and the relevant Next.js 16 docs.
2. Start Docker Desktop and run `npm run db:up` before a plain local build or
   local database-backed browser test.
3. In the owner portfolio page, verify selecting/removing multiple previews and
   perform one reversible two-image save/delete smoke test in an approved
   environment.
4. Run `npm run lint` and `npm run build:staging` after follow-up changes.
