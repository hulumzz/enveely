# Enveely product UI refresh, 10 October 2026

## Delivered

The platform uses pearl, slate blue, and navy. Invitation designs retain their individual palettes. The landing heading starts near the header, with two clear actions: choose a design or order through WhatsApp. The foreground phone renders Mayura Pearl; Amora Garden, Elysian Ivory, and Pusaka Kencana appear behind it. Frame scaling supports centered cover cropping to prevent device gutters. The keepsake photo has a mat and caption, and the second photo composition pairs a portrait with a real invitation section.

Product copy focuses on event details, map access, guest responses, editing, and the service process. Repeated eyebrow labels, decorative badges, emoji controls, and sentence dash separators were removed from the updated product surfaces. Price labels on specific designs use the shared variant catalog. Navigation anchors now reach their sections. Reveal transitions combine position, scale, and opacity; the hero pieces move at different speeds while visible. Reduced motion disables those effects.

The authenticated workspace has a left sidebar, overview statistics, collections, invitations, payments, profile, and guest management. Login, creation, checkout, and the editor use the same product palette without the landing composition. Mobile editing separates **Edit isi** and **Lihat hasil**. The form uses normal document scrolling, and the preview has its own scroll region. Mobile form inputs use 16px text to avoid focus zoom. Private proof previews release object URLs when replaced or left.

The footer shows **Enveely by Nalaro Digital**, `enveely@nalaro.digital`, and `085771298582`. WhatsApp links use `6285771298582` and the default message `hai kak, aku mau pesan undangan digital...`. The floating shortcut stays off the authenticated workspace and public invitations; workspace assistance remains in the sidebar.

## Admin and real data

- `/admin`: actual payment totals, review queues, invitation counts, trends, and operational recommendations based on explicit rules.
- `/admin/payments`: merchant reference checks, durable activation retry, private proof viewing, filters, and paginated history.
- `/admin/analytics`: opt-in page visits, daily sessions, template previews, product events, WhatsApp clicks, and JSON export.
- `/admin/reviews`: moderate account reviews or add an authentic review from an external order with its owner's permission.

Every admin API verifies the Firebase identity, verified email, and server allowlist. UI visibility does not grant access. Revenue includes approved transactions' unique codes; package sales exclude those codes. Refunds and unfinished activation are excluded. Active packages count distinct invitations, so renewals do not inflate that metric. Reporting days follow Asia/Jakarta. Firestore aggregation failures display unavailable values, not zero.

The user confirmed the **100+ invitations** milestone. This includes orders handled outside the platform and is shown separately from database counts. No historical analytics or customer reviews were fabricated. The review section displays an invitation to submit a review until authentic approved reviews exist. With enough approved reviews, the horizontal strip moves and pauses on hover or focus; reduced motion permits manual scrolling.

Analytics are off without explicit consent and respect Do Not Track and Global Privacy Control. Admin and public invitation pages are excluded from product tracking. Internal events contain no names, email, invitation content, full URL, or referrer. Deduplication uses daily session/event hashes; network hashes support rate limits. Event markers retain 7 days, sessions 31 days, and aggregates 400 days. Existing Firebase Analytics follows consent. The privacy page describes analytics and review publication.

## Production changes

Migration `0004_insights_reviews.sql` adds analytics aggregates, deduplication markers, daily sessions, and customer reviews. It was applied to production before deployment and registered in `d1_migrations`. Retention runs through the existing scheduled maintenance endpoint. Turnstile now accepts both `enveely.pages.dev` and `enveely.nalaro.digital`. The sitemap and social metadata use the custom domain.

## Generated hero asset

Mode: built-in image generation. Asset: `public/images/hero-romance-v3.webp`, 1672 × 941, 57,046 bytes. It is a decorative background, not a customer testimonial or a user invitation photo. WebP compression preserves the generated image; CSS adds soft blur and a light overlay for readable product text.

Prompt: “Natural editorial wedding photograph, Indonesian couple gently touching foreheads in a softly lit garden, wide 16:9, small subjects upper middle, calm negative space left/lower/right, dominant soft diffusion and shallow focus, recognizable couple with soft facial details, pearl white/blue-grey/navy and subtle warm highlights, low contrast, no text/logo/watermark/graphic invitations.”

## Verification and limits

The automated release suite passed: invitation rendering/layout regression checks, payment and guest fault injection, Firestore security rules, frontend build, Pages Functions compilation, and runtime dependency audit with zero vulnerabilities. Additional tests cover admin access, Jakarta boundaries, approved revenue, renewal counts, Firestore outages, opt-in analytics, replay deduplication, atomic rollback, review ownership/consent/moderation/withdrawal, and pagination beyond 100 records. Thumbnail tests verify cover geometry; live-status tests verify free expiry, design matching, and renewal behavior.

Browser visual QA was unavailable in this environment. The Sites skill explicitly says: “If `$control-browser` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” No browser screenshots, measured Core Web Vitals, real Google sign-in, or real payment acceptance are claimed. Direct live HTTP checks were also blocked by the network environment. Deployment status and custom-domain configuration are checked through Cloudflare.

Pre-existing external readiness items remain separate from this UI release: Firebase backup billing/restore verification, GitHub Actions account billing restrictions, and a real merchant acceptance run. The existing Pages release gate remains enabled.
