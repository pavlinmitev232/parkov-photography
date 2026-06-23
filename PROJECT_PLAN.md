# Parkov Photography Website Plan

This file is the shared build tracker for the Parkov photography website. Keep it updated as decisions change and work is completed.

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
- [x] Public gallery reads database portfolio items with mock fallback
- [x] Admin dashboard skeleton added
- [x] Prisma schema draft added
- [x] Environment variable template added
- [x] Lint passes
- [x] Production build passes
- [x] Browser check completed for desktop/mobile first pass
- [x] Public navigation and locale routing QA completed
- [x] Staggered section and card motion polish added

## Stage 1: Foundation

- [x] Create Next.js app
- [x] Install core dependencies
- [x] Add route localization
- [x] Add theme provider
- [x] Add shared design tokens
- [x] Add reusable utility helpers
- [x] Add initial content/data structure
- [x] Add environment variable template
- [ ] Add final README for setup and development

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
- [ ] Manage testimonials
- [ ] Manage FAQ
- [ ] Manage contact/social details
- [x] View client inquiries
- [x] Update inquiry status
- [x] Add image upload/storage

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
- [ ] Test request form backend flow
- [x] Test admin auth
- [x] Test image upload flow
- [ ] Accessibility pass
- [ ] Performance/image optimization pass
- [ ] Deployment setup
- [ ] Production environment variables
- [ ] Final launch QA

## Decisions

- Admin will live in the same app under `/parkov-owner-portal-7f3a` until real auth is added.
- The unique owner portal path is only a friction layer, not real security.
- Bulgarian is the default language.
- Owner management is part of the project, not a later unrelated app.
- Request flow should support form, phone, Viber, WhatsApp, and email.
- First form behavior is demo-only; real backend/email comes in Stage 4.

## Open Questions

- Which database host will be used for production?
- Which email provider should send inquiry notifications?
- Which image storage provider should be used?
- Will Parkov provide real photos before or after the first complete layout?
- Should pricing be public, hidden, or "starting from" style?
- Does the owner need blog/news management, or only portfolio/service/request management?

## Next Recommended Work

1. Inspect the reference site animations more deeply and polish our motion.
2. Replace Unsplash placeholder images with real Parkov photography.
3. Test the request form backend flow end to end.
4. Add owner management for testimonials and FAQ content.
