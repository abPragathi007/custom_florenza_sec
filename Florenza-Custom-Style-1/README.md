# Florenza

## Setup

1. Clone the repository.
2. Copy `.env.example` to `.env` and fill in the values.
3. Install dependencies:
   - `pnpm install`
4. Push database schema with Drizzle:
   - `pnpm --filter @workspace/db run push`
5. Seed sample data:
   - `pnpm --filter @workspace/scripts run seed`
6. Start backend:
   - `pnpm --filter @workspace/api-server run dev`
7. Start frontend:
   - `pnpm --filter @workspace/custom-florenza run dev`

Frontend runs on `http://localhost:5173` and API runs on `http://localhost:3001`.
