import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, and, gte, lte } from "drizzle-orm";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
} from "@workspace/api-zod";

const router = Router();
const updateProductBody = CreateProductBody.partial();

router.get("/", async (req, res) => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { category, minPrice, maxPrice } = parsed.data;
  const conditions = [];

  if (category && category !== "all") {
    conditions.push(eq(productsTable.category, category));
  }
  if (minPrice !== undefined) {
    conditions.push(gte(productsTable.basePrice, minPrice.toString()));
  }
  if (maxPrice !== undefined) {
    conditions.push(lte(productsTable.basePrice, maxPrice.toString()));
  }

  const products = conditions.length
    ? await db.select().from(productsTable).where(and(...conditions))
    : await db.select().from(productsTable);

  res.json(
    products.map((p) => ({
      ...p,
      basePrice: Number(p.basePrice),
      customizationPrice: Number(p.customizationPrice),
      createdAt: p.createdAt.toISOString(),
    }))
  );
});

router.post("/", async (req, res) => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [product] = await db
    .insert(productsTable)
    .values({
      ...parsed.data,
      basePrice: String(parsed.data.basePrice),
      customizationPrice: String(parsed.data.customizationPrice),
    })
    .returning();
  res.status(201).json({
    ...product,
    basePrice: Number(product.basePrice),
    customizationPrice: Number(product.customizationPrice),
    createdAt: product.createdAt.toISOString(),
  });
});

router.patch("/:id", async (req, res) => {
  const params = GetProductParams.safeParse({ id: Number(req.params.id) });
  const parsed = updateProductBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [updated] = await db
    .update(productsTable)
    .set({
      ...parsed.data,
      basePrice:
        parsed.data.basePrice !== undefined ? String(parsed.data.basePrice) : undefined,
      customizationPrice:
        parsed.data.customizationPrice !== undefined
          ? String(parsed.data.customizationPrice)
          : undefined,
    })
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json({
    ...updated,
    basePrice: Number(updated.basePrice),
    customizationPrice: Number(updated.customizationPrice),
    createdAt: updated.createdAt.toISOString(),
  });
});

router.delete("/:id", async (req, res) => {
  const params = GetProductParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ success: true });
});

router.get("/featured", async (req, res) => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isFeatured, true))
    .limit(6);

  res.json(
    products.map((p) => ({
      ...p,
      basePrice: Number(p.basePrice),
      customizationPrice: Number(p.customizationPrice),
      createdAt: p.createdAt.toISOString(),
    }))
  );
});

router.get("/:id", async (req, res) => {
  const parsed = GetProductParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsed.data.id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({
    ...product,
    basePrice: Number(product.basePrice),
    customizationPrice: Number(product.customizationPrice),
    createdAt: product.createdAt.toISOString(),
  });
});

export default router;
