import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const reviews = await db
    .select()
    .from(reviewsTable)
    .orderBy(desc(reviewsTable.createdAt));

  res.json(
    reviews.map((r) => ({
      ...r,
      avatarUrl: r.avatarUrl ?? undefined,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

export default router;
