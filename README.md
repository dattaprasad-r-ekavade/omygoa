# OmyGoa

A from-scratch rebuild of the Goa city guide and local business directory. This repository is the public foundation: the Next.js app, the D1 data model, demo content, and the Cloudflare Workers deploy path. It is not a copy of the previous site's source, and it does not contain data from the old production database.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS and shadcn-style components on Radix
- Lucide icons, Sonner toasts
- Self-hosted Poppins (Latin, Latin Extended, Devanagari) and Inter
- Cloudflare Workers via `@opennextjs/cloudflare`
- D1 + Drizzle, R2 for media and for the OpenNext incremental cache
- Better Auth (email + password, Google OAuth, phone OTP)
- Razorpay checkout and webhook stubs
- Mapbox, loaded only in the browser

## Local development

```bash
npm install
cp .env.example .env.local
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run db:seed
npm run dev
```

`next dev` uses the local D1 and R2 bindings from Wrangler (`initOpenNextCloudflareForDev` in `next.config.ts`). The app listens on [http://localhost:3000](http://localhost:3000).

Demo accounts, all with password `GoaDemo!2026`:

| Email | Role | Phone |
| --- | --- | --- |
| admin@example.com | admin | +91 90000 00001 |
| owner@example.com | owner | +91 90000 00002 |
| manager@example.com | manager | +91 90000 00003 |
| customer@example.com | customer | +91 90000 00004 |
| lila@example.com | owner | +91 90000 00005 |

With `SMS_PROVIDER=console` and `SMS_DEV_ECHO=true`, a phone OTP is printed in the server log and shown on the login form. Turn `SMS_DEV_ECHO` off before any public deploy.

Google sign-in appears on the login screen and stays inactive until `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.

## Workers preview

```bash
npm run preview
```

That builds the OpenNext worker and serves it with Wrangler, usually on [http://localhost:8787](http://localhost:8787). Seed the local D1 first (`npm run db:seed`). The same local database is used by `next dev` and by `wrangler dev`.

`npm run preview` warns while the Next.js build starts, because Wrangler looks for the `DOQueueHandler` class before OpenNext has injected it. The finished worker exports that class. A `wrangler deploy --dry-run` of this app reported about 2.7 MiB gzipped, under the Workers Paid 10 MiB compressed limit.

## Database

Schema: `lib/db/schema.ts`. SQL migrations: `drizzle/migrations`.

```bash
npm run db:generate      # after editing the schema
npm run db:migrate:local
npm run db:seed          # invented businesses, events, posts, plans
```

`scripts/seed.ts` writes `scripts/seed.generated.sql` (gitignored) and applies it with Wrangler. Re-running the seed replaces the demo rows.

Create the remote databases yourself when you are ready. These commands are documented only; they are not run by this repository:

```bash
npx wrangler d1 create omygoa
npx wrangler d1 create omygoa-cache
npx wrangler r2 bucket create omygoa-media
npx wrangler r2 bucket create omygoa-cache
```

Put the printed D1 ids into `wrangler.jsonc` (`DB` and `NEXT_TAG_CACHE_D1`). Then:

```bash
npm run db:migrate:remote
npm run db:seed:remote
```

`MEDIA` is the R2 bucket for future listing uploads. The OpenNext incremental cache uses `NEXT_INC_CACHE_R2_BUCKET`. Tag revalidation uses `NEXT_TAG_CACHE_D1`. Time-based revalidation is queued on the `DOQueueHandler` Durable Object. Workers KV is the other incremental-cache option in the OpenNext docs; this app uses R2 because it is the recommended store.

## Deploy

Do not deploy from this repository until the placeholder database ids in `wrangler.jsonc` are replaced and secrets are set.

```bash
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put RAZORPAY_KEY_SECRET
npx wrangler secret put RAZORPAY_WEBHOOK_SECRET
```

Non-secret vars (`BETTER_AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, `GOOGLE_CLIENT_ID`, `SMS_PROVIDER`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`) can live in the Worker settings or in `wrangler.jsonc` `vars`. Set `SMS_DEV_ECHO` only for a private preview.

Manual deploy, after the resources exist:

```bash
npm run deploy
```

### GitHub → Workers Builds

1. In the Cloudflare dashboard, open **Workers & Pages** → **Create** → **Import a repository** (Workers Builds, not the older Pages wizard).
2. Choose this GitHub repository and the production branch `main`.
3. Build command: `npx opennextjs-cloudflare build`
4. Deploy command: `npx wrangler deploy`
5. Enable builds for non-production branches so pull requests get preview URLs.
6. Set the root directory to the repository root and the Node.js version to 22.
7. Add the same secrets and vars as above to the production environment, and a separate set for preview if preview should not share production D1.
8. The first deploy fails until `database_id` values in `wrangler.jsonc` match databases in the account. Bindings are read from that file; you do not recreate them in the dashboard.

`npm run upload` builds and uploads a version without promoting it, which is useful for a manual preview.

## Auth and roles

Better Auth stores users in D1. Roles are `admin`, `manager`, `owner`, and `customer`. New signups become customers. An admin can open `/admin`, `/owner`, `/manager`, and `/dashboard`. A manager can open `/manager`. An owner can open `/owner` and the customer dashboard. Everyone else stays on `/dashboard`.

Signed-in routes send `noindex` and are disallowed in `app/robots.ts`.

Phone OTP goes through `lib/sms.ts`. The console provider is the default. A later SMS vendor is a new `SmsProvider` in that file.

## Payments and maps

`POST /api/checkout` creates a Razorpay order when `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set, and a stub order otherwise. The response is shown as a toast. No card form is loaded yet.

`POST /api/webhooks/razorpay` returns 501 until `RAZORPAY_WEBHOOK_SECRET` is set. With the secret, it checks the `x-razorpay-signature` HMAC and marks a matching billing row paid on `payment.captured` or `order.paid`.

Business and event pages render a Mapbox map only when `NEXT_PUBLIC_MAPBOX_TOKEN` is present. The map component is client-only and is not part of the server render.

## Languages

English and Hindi. The header switcher sets the `omy_locale` cookie. Copy for each route is loaded with a dynamic `import()` of that locale and namespace (`lib/i18n`), so a page does not import every locale file.

## What this pass includes

- Public pages: home, explore (search and filters), business, events, jobs, rentals, preloved, pet adoption, services, blog, list-your-business, login, signup, privacy
- Unique title, description, canonical URL, and OG image per public page
- `app/sitemap.ts` and `app/robots.ts`
- Admin list screens, with create / edit / delete for businesses and events, and a small settings form
- Owner business, listing edit, leads, reviews, and billing
- Manager overview plus read-only businesses, listings, and events
- Customer saved listings, posts, enquiries, and profile

## Still to build

- [ ] Real SMS provider (MSG91 or similar) and production OTP rate limits
- [ ] Google OAuth verified against a live client
- [ ] Razorpay Checkout.js, coupons applied at payment, and receipt emails
- [ ] R2 image upload for listings, events, and avatars
- [ ] Owner self-serve registration, instead of admin-created businesses
- [ ] Review moderation actions (approve / reject) and owner replies
- [ ] Customer post composer for jobs, rentals, preloved, and pets
- [ ] Event creation and QR management for owners, including paid publication
- [ ] Ad campaign purchase flow and admin approve / pause
- [ ] Manager approve / reject without using the admin account
- [ ] Blog editor, coupons CRUD, user role management, certificates, popups, page-view analytics
- [ ] Saved community posts, job applications, and job profile
- [ ] Account deletion and a data export
- [ ] Replace the placeholder D1 ids and deploy
