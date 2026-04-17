import nodemailer from "nodemailer";
import { logger } from "./logger";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || "noreply@customflorenza.com";

function createTransport() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export interface OrderMailData {
  orderId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{
    productName: string;
    quantity: number;
    size: string;
    color: string;
    unitPrice: number;
  }>;
  totalPrice: number;
  paymentMethod: string;
  address: string;
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function buildOrderHtml(data: OrderMailData): string {
  const itemRows = data.items
    .map(
      (item) => `
      <tr style="border-bottom:1px solid #f5d0d8;">
        <td style="padding:12px 8px;font-size:14px;">${item.productName}</td>
        <td style="padding:12px 8px;font-size:14px;text-align:center;">${item.size} / ${item.color}</td>
        <td style="padding:12px 8px;font-size:14px;text-align:center;">×${item.quantity}</td>
        <td style="padding:12px 8px;font-size:14px;text-align:right;font-weight:600;">${formatCurrency(item.unitPrice * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const paymentLabel =
    data.paymentMethod === "upi"
      ? "UPI (Google Pay / PhonePe / BHIM)"
      : data.paymentMethod === "card"
      ? "Credit / Debit Card"
      : "Cash on Delivery";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#fdf6f7;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(201,24,74,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#e8a0b0,#c9184a);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:28px;letter-spacing:1px;">Custom Florenza</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Designed by You, Crafted by Florenza</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 32px;">
      <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;">Order Confirmed!</h2>
      <p style="margin:0 0 24px;color:#666;font-size:15px;">Hi ${data.customerName}, your order <strong>#${data.orderId}</strong> has been placed successfully.</p>

      <!-- Order Items -->
      <div style="background:#fdf6f7;border-radius:12px;padding:4px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f9e5ea;">
              <th style="padding:12px 8px;font-size:12px;text-align:left;color:#c9184a;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
              <th style="padding:12px 8px;font-size:12px;text-align:center;color:#c9184a;text-transform:uppercase;letter-spacing:0.5px;">Size / Color</th>
              <th style="padding:12px 8px;font-size:12px;text-align:center;color:#c9184a;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
              <th style="padding:12px 8px;font-size:12px;text-align:right;color:#c9184a;text-transform:uppercase;letter-spacing:0.5px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
          <tfoot>
            <tr style="background:#f9e5ea;">
              <td colspan="3" style="padding:14px 8px;font-size:15px;font-weight:700;text-align:right;color:#1a1a1a;">Total</td>
              <td style="padding:14px 8px;font-size:16px;font-weight:700;text-align:right;color:#c9184a;">${formatCurrency(data.totalPrice)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Details Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
        <div style="background:#fdf6f7;border-radius:12px;padding:16px;">
          <p style="margin:0 0 6px;font-size:11px;color:#c9184a;text-transform:uppercase;letter-spacing:0.5px;">Payment Method</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a1a;">${paymentLabel}</p>
        </div>
        <div style="background:#fdf6f7;border-radius:12px;padding:16px;">
          <p style="margin:0 0 6px;font-size:11px;color:#c9184a;text-transform:uppercase;letter-spacing:0.5px;">Shipping To</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a1a;">${data.address.replace(/\n/g, ", ")}</p>
        </div>
      </div>

      <!-- Tracking Note -->
      <div style="background:linear-gradient(135deg,#fef3f5,#fde8ed);border:1px solid #f5c2cc;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#1a1a1a;">Track Your Order</p>
        <p style="margin:0;font-size:13px;color:#666;">Your order ID is <strong>#${data.orderId}</strong>. You can track your order status at any time by visiting My Orders on our website.</p>
        <p style="margin:8px 0 0;font-size:13px;color:#666;">Tracking Number: <strong>FLZ-${data.orderId}-${Math.floor(Math.random() * 90000) + 10000}</strong></p>
      </div>

      <p style="margin:0;font-size:14px;color:#666;line-height:1.6;">Thank you for choosing Custom Florenza! Your custom order is now being prepared with care. We typically process orders within 3–5 business days.</p>
    </div>

    <!-- Footer -->
    <div style="background:#1a1a1a;padding:24px 32px;text-align:center;">
      <p style="margin:0;color:#999;font-size:13px;">Custom Florenza &bull; Designed by You, Crafted by Florenza</p>
      <p style="margin:8px 0 0;color:#666;font-size:12px;">Questions? WhatsApp us or visit our website</p>
    </div>
  </div>
</body>
</html>`;
}

function buildOrderText(data: OrderMailData): string {
  const items = data.items
    .map(
      (i) =>
        `• ${i.productName} (${i.size}/${i.color}) ×${i.quantity} = ₹${(i.unitPrice * i.quantity).toLocaleString("en-IN")}`
    )
    .join("\n");

  return `Order Confirmed - Custom Florenza\n\nHi ${data.customerName},\n\nYour order #${data.orderId} has been placed!\n\nItems:\n${items}\n\nTotal: ₹${data.totalPrice.toLocaleString("en-IN")}\nPayment: ${data.paymentMethod.toUpperCase()}\nShip to: ${data.address}\n\nTracking ID: FLZ-${data.orderId}\n\nThank you for choosing Custom Florenza!`;
}

export async function sendOrderConfirmation(data: OrderMailData): Promise<void> {
  const transport = createTransport();
  if (!transport) {
    logger.info("Email not configured (SMTP_HOST/SMTP_USER/SMTP_PASS not set). Skipping email.");
    return;
  }

  try {
    await transport.sendMail({
      from: `"Custom Florenza" <${SMTP_FROM}>`,
      to: data.customerEmail,
      subject: `Order Confirmed #${data.orderId} - Custom Florenza`,
      text: buildOrderText(data),
      html: buildOrderHtml(data),
    });
    logger.info({ orderId: data.orderId, email: data.customerEmail }, "Order confirmation email sent");
  } catch (err) {
    logger.error({ err, orderId: data.orderId }, "Failed to send order confirmation email");
  }
}
