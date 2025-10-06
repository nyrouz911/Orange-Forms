# 🧡 Orange Forms

**Orange Forms** is a web platform developed within **Orange Innovation Europe** to streamline the collection, management, and analysis of feedback related to **Generative AI (GenAI)** tools for image and video generation.  
It enables Orange teams across Europe to evaluate AI tools in a standardized, secure, and automated way — supporting innovation decisions and group-wide coordination.

The platform combines **AI-assisted form generation**, **automated deployment**, **GDPR-compliant analytics**, and **scalable hosting**, built entirely on modern web technologies.

---

## 🚀 Tech Stack

| Category | Technology | Description |
|-----------|-------------|-------------|
| **Framework** | [Next.js](https://nextjs.org/) | Full-stack React framework with API routes and SSR |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strongly typed JavaScript for safer development |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team) | Type-safe and declarative database ORM |
| **Database & Auth** | [Supabase](https://supabase.com/) | PostgreSQL backend with built-in authentication |
| **AI Integration** | [Groq API (compound-mini)](https://groq.com) | Generates form structures from natural language prompts |
| **UI Library** | [shadcn/ui](https://ui.shadcn.com) | Accessible and reusable React components |
| **Schema Validation** | [Zod](https://zod.dev) | Runtime schema validation for form data |
| **Data Tables** | [TanStack Table](https://tanstack.com/table) | Data grids and filtering for dashboard views |
| **Payments (Optional)** | [Stripe](https://stripe.com) | Subscription and billing integration |
| **Analytics** | [Plausible](https://plausible.io) | Lightweight, GDPR-compliant website analytics |
| **Deployment** | [Vercel](https://vercel.com) | Cloud hosting optimized for Next.js |
| **CI/CD** | [Jenkins](https://www.jenkins.io/) | Automated build and deployment pipeline |

---

## ✨ Key Features

- 🔐 **Authentication** with Supabase  
- 🤖 **AI Form Generation** using the Groq API (compound-mini model)  
- 📝 **Form Management** (creation, publishing, and submissions)  
- 📊 **Admin Dashboard** with analytics and export options  
- 💳 **Stripe Integration** for optional premium features and subscriptions  
- ⚙️ **Automated CI/CD** pipeline with Jenkins + Vercel deployment  
- 📈 **Analytics** powered by Plausible (fully GDPR-compliant)  
- 🌍 **Multi-country scalability** across European Orange entities  

---

## 🧠 Project Overview

Orange Forms was designed to replace fragmented and manual feedback collection processes with a unified digital solution.  
It enables innovation teams to:
- Generate evaluation forms dynamically (via AI or manually),
- Distribute them to testers through shared links,
- Collect structured feedback in a secure and centralized database,
- Visualize and export insights through an intuitive dashboard.

This project demonstrates how **Generative AI can enhance internal workflows**, not only as a research subject but as a productivity enabler for innovation management.

---

## ⚙️ Project Structure

orange-forms/
├── app/ # Next.js app router and pages
│ ├── (auth)/ # Authentication routes
│ ├── (dashboard)/ # Main admin dashboard
│ └── api/ # API routes (Groq, Stripe, Supabase, etc.)
├── components/ # UI components using shadcn/ui
├── db/ # Drizzle ORM schema and migrations
├── lib/ # Helpers and constants
├── public/ # Static assets
├── scripts/ # CI/CD scripts and Jenkins pipeline
├── .env.example # Environment variable template
└── README.md


---

## 🧩 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/orange-forms.git
cd orange-forms
```
### 2. Install dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Run the development server
```bash
npm run dev
```
Then open http://localhost:3000 to view the app in your browser.

---

## 🧰 Continuous Integration / Deployment - Jenkins CI/CD Pipeline

The CI/CD pipeline automates:

🔧 Installing dependencies and linting

🧩 Type-checking and running tests

🏗️ Building the production-ready Next.js app

🚀 Deploying automatically to Vercel

📬 Sending email notifications on success/failure

Each build starts with a clean workspace and a fresh pull from GitHub to ensure reproducibility.

---

## Vercel Hosting

Vercel handles global deployment and scaling automatically.
Every successful Jenkins build triggers a webhook deployment on Vercel, ensuring near real-time updates for testers and admins.

---

## 📊 Analytics

Plausible Analytics provides lightweight, privacy-friendly insights, such as:

Number of testers participating in campaigns

Form submission and completion rates

Regional engagement metrics

All analytics comply with GDPR and do not use cookies or track personal identifiers.

---

## 💳 Stripe Integration (Optional)

Stripe enables potential monetization or quota-based access.
It supports:

Secure checkout for subscriptions,

Automatic billing and invoice management,

Real-time webhook synchronization with Supabase.

This integration is modular and can be disabled if not required.

---

## 🧾 License

This project was developed as part of the Orange Innovation Europe GenAI Initiative
All rights reserved © 2025 Orange S.A.
