# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the Custom Florenza e-commerce website for personalized custom clothing.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, TailwindCSS, Framer Motion, Wouter routing

## Artifacts

### Custom Florenza (`artifacts/custom-florenza`)
- **Type**: React + Vite web app
- **Preview path**: `/`
- **Description**: Full e-commerce website for custom clothing orders
- **Pages**: Home, Products, Product Detail, Customize, How It Works, About, Cart, Checkout, Orders, Order Detail, Contact

### API Server (`artifacts/api-server`)
- **Type**: Express API
- **Preview path**: `/api`
- **Routes**: /products, /cart, /orders, /contacts, /reviews, /stats/summary

## Database Schema

- **products**: Clothing items (T-shirts, hoodies, shirts) with pricing, colors, sizes
- **cart_items**: Session-based shopping cart
- **orders**: Customer orders with status tracking
- **contacts**: Contact form submissions
- **reviews**: Customer reviews and ratings

## Authentication

- **Provider**: Clerk Auth (white-label)
- **Protected routes**: Customize, Cart, Checkout, Orders, Order Detail
- **Public routes**: Home, Products, Product Detail, About, How It Works, Contact
- **Sign-in methods**: Google OAuth + Email/Password
- **Navbar**: Shows user avatar + Sign Out when signed in; Sign In button when signed out

## Contact Details

- **Email**: customflorenza@gmail.com
- **Phone / WhatsApp**: +91 9686195659

## Design

- **Palette**: Soft blush pink, warm white, rose-gold accents
- **Fonts**: Playfair Display (serif/headings), Plus Jakarta Sans (body)
- **Framework**: Framer Motion animations, Lucide icons
- **Logo**: CF monogram (src/assets/logo.png)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
