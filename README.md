# Namasvi Jewels

Premium, mobile-first e-commerce for **Namasvi Jewels** — *Timeless Beauty. Everyday You.*

Affordable luxury jewellery from Keshavnagar, Mundhwa, Pune. Built with Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, MySQL, and Prisma.

## Stack

- **Frontend:** Next.js 15 App Router, React 19, Tailwind CSS 4, Framer Motion
- **Backend:** Next.js Route Handlers
- **Database:** MySQL + Prisma
- **Auth:** JWT cookies + OTP login
- **Payments:** Razorpay-ready (demo checkout completes when keys are empty)
- **Media:** Remote images (Unsplash / Cloudinary URLs)
- **Analytics:** GA4 when `NEXT_PUBLIC_GA_ID` is set, plus first-party events
- **AI:** Natural-language search, recommendations, shopping assistant (OpenAI optional)

## Quick start

MySQL is configured via `DATABASE_URL` in `.env` (`namasvi_jewels` on the hosted server).

```bash
cp .env.example .env
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin

- URL: `/admin`
- Email: `ivan.p@example.net`
- Password: `Admin@123`

Demo OTP codes are returned in the login UI when `DEMO_MODE=true`.

## Coupons (seeded)

- `NAMASVI10` — 10% off
- `FESTIVE300` — ₹300 off
- `WELCOME150` — ₹150 off
- `REFER500` — referral ₹500 off

## Environment

See `.env.example` for `DATABASE_URL`, JWT, Razorpay, Cloudinary, GA4, and OpenAI keys.

## SEO

Structured data (LocalBusiness + Product), Open Graph, dynamic sitemap, robots.txt, and keyword-focused metadata for:

Artificial Jewellery Pune · Fashion Jewellery Online · Affordable Luxury Jewellery · Bridal Jewellery Collection · Trendy Earrings · Designer Necklaces · Premium Jewellery Store
# namasvi-jewels
