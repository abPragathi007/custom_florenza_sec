import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, productsTable, reviewsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

async function getStats() {
  const [productCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(productsTable);

  const [orderCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(ordersTable);

  const [revenue] = await db
    .select({ total: sql<string | null>`sum(${ordersTable.totalPrice})` })
    .from(ordersTable);

  const [customers] = await db
    .select({ count: sql<number>`count(distinct ${ordersTable.customerEmail})` })
    .from(ordersTable);

  const [reviewStats] = await db
    .select({
      count: sql<number>`count(*)`,
      avg: sql<number | null>`avg(rating)`,
    })
    .from(reviewsTable);

  return {
    totalProducts: Number(productCount.count),
    totalOrders: Number(orderCount.count),
    totalRevenue: Number(revenue.total ?? 0),
    totalReviews: Number(reviewStats.count),
    happyCustomers: Number(customers.count),
    averageRating: reviewStats.avg ? Number(Number(reviewStats.avg).toFixed(1)) : 4.9,
  };
}

router.get("/", async (_req, res) => {
  res.json(await getStats());
});

router.get("/summary", async (_req, res) => {
  res.json(await getStats());
});

export default router;
