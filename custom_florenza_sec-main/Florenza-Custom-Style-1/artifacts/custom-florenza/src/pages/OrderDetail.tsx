import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetOrder } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, Clock, Truck, Home, MessageCircle, Copy, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function OrderDetail() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: order, isLoading } = useGetOrder(Number(id), {
    query: { enabled: !!id } as any,
  });

  if (isLoading) {
    return <div className="min-h-screen bg-background"><Navbar /></div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Button asChild><Link href="/orders">Back to Orders</Link></Button>
        </main>
      </div>
    );
  }

  const statuses = ["pending", "processing", "shipped", "delivered"];
  const currentIndex = statuses.indexOf(order.status);
  const statusBadgeClass =
    order.status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : order.status === "processing"
        ? "bg-blue-100 text-blue-700"
        : order.status === "shipped"
          ? "bg-purple-100 text-purple-700"
          : "bg-green-100 text-green-700";
  const trackingNumber = `FLZ-${order.id}-${(order.id * 1234 + 5678) % 90000 + 10000}`;

  // Build WhatsApp message
  const itemsSummary = (Array.isArray(order.items) ? order.items : [])
    .map((item: { productName: string; quantity: number; size: string; color: string }) =>
      `• ${item.productName} (${item.size}/${item.color}) ×${item.quantity}`
    )
    .join("\n");

  const whatsappMsg = encodeURIComponent(
    `*Custom Florenza — Order Confirmed!*\n\n` +
    `Hi ${order.customerName}, your order *#${order.id}* has been placed successfully.\n\n` +
    `*Items:*\n${itemsSummary}\n\n` +
    `*Total:* ₹${order.totalPrice.toLocaleString("en-IN")}\n` +
    `*Payment:* ${order.paymentMethod.toUpperCase()}\n` +
    `*Tracking ID:* ${trackingNumber}\n\n` +
    `Shipping to: ${order.address}\n\n` +
    `We'll update you when your order ships. Thank you for choosing Custom Florenza!`
  );

  const whatsappPhone = order.customerPhone
    ? `91${order.customerPhone.replace(/^\+91/, "").replace(/\D/g, "")}`
    : "";
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${whatsappMsg}`
    : `https://wa.me/?text=${whatsappMsg}`;

  const copyOrderDetails = () => {
    const text = `Order #${order.id} | Custom Florenza\nTracking: ${trackingNumber}\nTotal: ₹${order.totalPrice.toLocaleString("en-IN")}\nStatus: ${order.status.toUpperCase()}`;
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied!", description: "Order details copied to clipboard." });
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 bg-muted/20 pb-12">
        {/* Header */}
        <div className="bg-background border-b border-border py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link href="/orders" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-foreground">Order #{order.id}</h1>
                <p className="text-muted-foreground mt-1">
                  Placed on {format(new Date(order.createdAt), "dd MMM yyyy, h:mm a")}
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={copyOrderDetails}
                >
                  <Copy className="h-4 w-4" /> Copy Details
                </Button>
                <Button
                  size="sm"
                  className="rounded-full gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white"
                  onClick={() => window.open(whatsappUrl, "_blank")}
                >
                  <MessageCircle className="h-4 w-4" /> Share on WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl mt-8 space-y-8">

          {/* Order Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-8 shadow-sm"
          >
            <h3 className="font-serif text-xl font-bold mb-8">Track Your Order</h3>

            <div className="relative">
              <div className="hidden sm:block absolute top-5 left-8 right-8 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-700"
                  style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-0">
                {[
                  { id: "pending", icon: Clock, label: "Order Placed", sub: "Confirmed" },
                  { id: "processing", icon: Package, label: "Processing", sub: "Being prepared" },
                  { id: "shipped", icon: Truck, label: "Shipped", sub: "On the way" },
                  { id: "delivered", icon: Home, label: "Delivered", sub: "Enjoy!" },
                ].map((step, idx) => {
                  const isCompleted = idx <= currentIndex;
                  const isCurrent = idx === currentIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.id} className="relative flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3 z-10">
                      {idx !== 3 && (
                        <div className="sm:hidden absolute left-5 top-12 bottom-[-24px] w-0.5 bg-muted" />
                      )}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "bg-background border-muted text-muted-foreground"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground hidden sm:block">{step.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking Number */}
            <div className="mt-8 bg-primary/5 rounded-xl p-4 border border-primary/20 flex gap-3 items-center text-sm">
              <Truck className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">Tracking Number</p>
                <p className="text-muted-foreground font-mono text-xs mt-0.5">{trackingNumber}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusBadgeClass}`}>{order.status}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Items */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-3xl p-8 shadow-sm"
            >
              <h3 className="font-serif text-xl font-bold mb-6">
                Items ({Array.isArray(order.items) ? order.items.length : 0})
              </h3>
              <div className="space-y-5">
                {(Array.isArray(order.items) ? order.items : []).map((item: {
                  id: number;
                  productName: string;
                  productImageUrl: string;
                  quantity: number;
                  size: string;
                  color: string;
                  unitPrice: number;
                  customizationNotes?: string;
                }) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.productImageUrl || ""}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{item.productName}</h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.size} • {item.color} • ×{item.quantity}
                      </p>
                      {item.customizationNotes && (
                        <p className="text-xs text-primary/80 mb-1 italic">"{item.customizationNotes}"</p>
                      )}
                      <p className="font-semibold text-sm">₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </motion.div>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-3xl p-8 shadow-sm h-fit space-y-6"
            >
              <h3 className="font-serif text-xl font-bold">Order Details</h3>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Customer</p>
                <p className="font-medium text-foreground">{order.customerName}</p>
                <p className="text-muted-foreground text-sm">{order.customerEmail}</p>
                {order.customerPhone && (
                  <p className="text-muted-foreground text-sm">+91 {order.customerPhone}</p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Shipping Address</p>
                <p className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">{order.address}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Payment Method</p>
                <p className="text-foreground font-medium">
                  {order.paymentMethod === "upi" ? "UPI (Google Pay / PhonePe)" :
                   order.paymentMethod === "card" ? "Credit / Debit Card" :
                   "Cash on Delivery"}
                </p>
              </div>

              {/* WhatsApp Share */}
              <div className="bg-[#25D366]/8 border border-[#25D366]/20 rounded-xl p-4">
                <p className="text-sm font-semibold text-foreground mb-2">Share Order via WhatsApp</p>
                <p className="text-xs text-muted-foreground mb-3">Send your order confirmation directly to yourself or a friend.</p>
                <Button
                  size="sm"
                  className="w-full rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-2"
                  onClick={() => window.open(whatsappUrl, "_blank")}
                >
                  <MessageCircle className="h-4 w-4" /> Send via WhatsApp
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
