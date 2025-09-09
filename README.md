The project that uses AI to generate forms.


## Tech Stack 

- Next-auth - authentication
- Shadcn ui - ui library
- Open Al - AI Integration
- Drizzle - Orm
- PostgreSQL - database
- Stripe - payments
- Tanstack - Table
- Typescript - Type Checking
- Plausible - Analytics
- Vercel - Deployment
- Stripe - Payments
- Zod - Schema Validation


## Features

- Authentication ✅
- AI Form Generation ✅
- Form Publish and Submissions ✅
- View your forms ✅
- Admin Panel ✅
- View Results ✅
- Settings & Upgrade Subscription ✅
- Analytics  ✅
- Landing page ✅
- Edit forms ❌ (open to pull requests)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Environment Variables

Create a new .env file and add your keys in the following manner:
```
OPENAI_API_KEY=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
AUTH_SECRET=""
DATABASE_URL=""
NEXT_PUBLIC_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_WEBHOOK_LOCAL_SERCRET=""
PLAUSIBLE_DOMAIN=""
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

