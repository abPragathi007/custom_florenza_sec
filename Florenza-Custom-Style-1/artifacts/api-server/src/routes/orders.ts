import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { ordersTable, cartItemsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { CreateOrderBody, GetOrderParams } from "@workspace/api-zod";
import { sendOrderConfirmation } from "../lib/mailer";
import { requireUserId } from "../middlewares/requireUser";
import { z } from "zod";

const router = Router();
const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered"]),
});

function isAdminRequest(req: Parameters<typeof getAuth>[0]) {
  const claims = getAuth(req).sessionClaims as Record<string, unknown> | undefined;
  const email =
    typeof claims?.email === "string"
      ? claims.email.toLowerCase()
      : typeof claims?.["email_address"] === "string"
        ? String(claims["email_address"]).toLowerCase()
        : null;
  const adminEmails = String(process.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  return !!email && adminEmails.includes(email);
}

function formatOrder(order: typeof ordersTable.$inferSelect) {
  return {
    ...order,
    totalPrice: Number(order.totalPrice),
    items: Array.isArray(order.items) ? order.items : [],
    createdAt: order.createdAt.toISOString(),
    customerPhone: order.customerPhone ?? undefined,
  };
}

router.get("/", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const isAdmin = isAdminRequest(req);

  const orders =
    isAdmin && req.query.scope === "all"
      ? await db.select().from(ordersTable).orderBy(ordersTable.createdAt)
      : await db
          .select()
          .from(ordersTable)
          .where(eq(ordersTable.userId, userId))
          .orderBy(ordersTable.createdAt);

  res.json(orders.map(formatOrder));
});

router.post("/", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error.format() });
    return;
  }

  const cartItems = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.userId, userId));

  if (cartItems.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  );

  const orderItems = cartItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    productImageUrl: item.productImageUrl,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    customizationNotes: item.customizationNotes,
    unitPrice: Number(item.unitPrice),
    userId: item.userId,
  }));

  const [order] = await db
    .insert(ordersTable)
    .values({
      userId,
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail,
      customerPhone: parsed.data.customerPhone,
      items: orderItems,
      totalPrice: String(totalPrice),
      status: "pending",
      paymentMethod: parsed.data.paymentMethod,
      address: parsed.data.address,
    })
    .returning();

  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));

  sendOrderConfirmation({
    orderId: order.id,
    customerName: parsed.data.customerName,
    customerEmail: parsed.data.customerEmail,
    customerPhone: parsed.data.customerPhone,
    items: orderItems.map((i) => ({
      productName: i.productName,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
      unitPrice: i.unitPrice,
    })),
    totalPrice,
    paymentMethod: parsed.data.paymentMethod,
    address: parsed.data.address,
  }).catch(() => {});

  res.status(201).json(formatOrder(order));
});

router.get("/:id", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const parsed = GetOrderParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(and(eq(ordersTable.id, parsed.data.id), eq(ordersTable.userId, userId)));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(formatOrder(order));
});

router.patch("/:id/status", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;
  if (!isAdminRequest(req)) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  const orderParams = GetOrderParams.safeParse({ id: Number(req.params.id) });
  const body = updateOrderStatusSchema.safeParse(req.body);

  if (!orderParams.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [updated] = await db
    .update(ordersTable)
    .set({ status: body.data.status })
    .where(eq(ordersTable.id, orderParams.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(formatOrder(updated));
});

export default router;
