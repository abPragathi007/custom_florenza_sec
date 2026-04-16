import { Router } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { AddToCartBody, RemoveFromCartParams } from "@workspace/api-zod";
import { requireUserId } from "../middlewares/requireUser";

const router = Router();

router.get("/", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const items = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.userId, userId));

  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );

  res.json({
    items: items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      customizationNotes: item.customizationNotes ?? undefined,
      createdAt: undefined,
    })),
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice,
  });
});

router.post("/", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const parsed = AddToCartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsed.data.productId));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const unitPrice = Number(product.basePrice) + Number(product.customizationPrice);

  const [cartItem] = await db
    .insert(cartItemsTable)
    .values({
      userId,
      productId: parsed.data.productId,
      productName: product.name,
      productImageUrl: product.imageUrl,
      quantity: parsed.data.quantity,
      size: parsed.data.size,
      color: parsed.data.color,
      customizationNotes: parsed.data.customizationNotes,
      unitPrice: String(unitPrice),
    })
    .returning();

  res.status(201).json({
    ...cartItem,
    unitPrice: Number(cartItem.unitPrice),
    customizationNotes: cartItem.customizationNotes ?? undefined,
  });
});

router.patch("/:id", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const parsed = RemoveFromCartParams.safeParse({ id: Number(req.params.id) });
  const quantity = Number(req.body?.quantity);

  if (!parsed.success || !Number.isInteger(quantity) || quantity < 1) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [updated] = await db
    .update(cartItemsTable)
    .set({ quantity })
    .where(and(eq(cartItemsTable.id, parsed.data.id), eq(cartItemsTable.userId, userId)))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }

  res.json({
    ...updated,
    unitPrice: Number(updated.unitPrice),
    customizationNotes: updated.customizationNotes ?? undefined,
  });
});

router.delete("/:id", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const parsed = RemoveFromCartParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db
    .delete(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.id, parsed.data.id),
        eq(cartItemsTable.userId, userId)
      )
    );

  res.json({ success: true });
});

export default router;
