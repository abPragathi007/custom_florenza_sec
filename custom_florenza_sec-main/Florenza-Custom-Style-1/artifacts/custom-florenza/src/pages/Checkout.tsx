import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetCart, useCreateOrder, getGetCartQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CreditCard, Banknote, ShieldCheck, Smartphone } from "lucide-react";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Full name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "10-digit phone number required").max(13),
  address: z.string().min(10, "Full shipping address is required"),
  paymentMethod: z.enum(["upi", "card", "cod"] as const),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const createOrder = useCreateOrder();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      address: "",
      paymentMethod: "upi",
    },
  });

  const cartItems = Array.isArray(cart?.items) ? cart.items : [];
  const cartTotal = cart?.totalPrice ?? 0;

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      setLocation("/cart");
    }
  }, [cartItems.length, cartLoading, setLocation]);

  if (cartLoading) return <div className="min-h-screen bg-background"><Navbar /></div>;
  if (cartItems.length === 0) return null;

  function onSubmit(values: CheckoutForm) {
    createOrder.mutate(
      { data: values },
      {
        onSuccess: (order) => {
          toast({
            title: "Order placed successfully!",
            description: `Order #${order.id} confirmed.`,
          });
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          setLocation("/orders");
        },
        onError: (error) => {
          toast({
            title: "Checkout failed",
            description:
              error instanceof Error
                ? error.message
                : "There was an issue processing your order. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  }

  const gst = Math.round(cartTotal * 0.18);
  const grandTotal = cartTotal + gst;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground">Secure Checkout</h1>
            <p className="text-muted-foreground mt-1">Complete your order — we'll confirm via email & WhatsApp</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
            {/* Form Section */}
            <div className="xl:col-span-7 space-y-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                  {/* Contact Info */}
                  <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 font-serif">Contact Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Priya Sharma" className="bg-muted/30" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="priya@example.com" className="bg-muted/30" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>WhatsApp / Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">+91</span>
                                <Input
                                  type="tel"
                                  placeholder="9876543210"
                                  className="bg-muted/30 pl-12"
                                  maxLength={10}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <p className="text-xs text-muted-foreground">We'll send order updates to this WhatsApp number</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 font-serif">Shipping Address</h2>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder={"Flat 4B, Sunrise Apartments\nMG Road, Koramangala\nBengaluru, Karnataka 560034"}
                              className="min-h-[110px] resize-none bg-muted/30"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Payment */}
                  <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <h2 className="text-xl font-bold font-serif">Payment Method</h2>
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>

                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 gap-4"
                            >
                              {/* UPI */}
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="upi" className="peer sr-only" />
                                </FormControl>
                                <FormLabel className="flex items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer">
                                  <div className="flex items-center gap-3">
                                    <Smartphone className="h-5 w-5 text-foreground/70" />
                                    <div>
                                      <span className="font-medium text-foreground block">UPI Payment</span>
                                      <span className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM</span>
                                    </div>
                                  </div>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Popular</span>
                                </FormLabel>
                              </FormItem>

                              {/* Card */}
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="card" className="peer sr-only" />
                                </FormControl>
                                <FormLabel className="flex items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer">
                                  <div className="flex items-center gap-3">
                                    <CreditCard className="h-5 w-5 text-foreground/70" />
                                    <div>
                                      <span className="font-medium text-foreground block">Credit / Debit Card</span>
                                      <span className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</span>
                                    </div>
                                  </div>
                                </FormLabel>
                              </FormItem>

                              {/* COD */}
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="cod" className="peer sr-only" />
                                </FormControl>
                                <FormLabel className="flex items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer">
                                  <div className="flex items-center gap-3">
                                    <Banknote className="h-5 w-5 text-foreground/70" />
                                    <div>
                                      <span className="font-medium text-foreground block">Cash on Delivery</span>
                                      <span className="text-xs text-muted-foreground">Pay when you receive</span>
                                    </div>
                                  </div>
                                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-medium">+₹50</span>
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-full text-lg font-bold"
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending
                      ? "Placing Order..."
                      : `Place Order — ₹${grandTotal.toLocaleString("en-IN")}`}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="xl:col-span-5">
              <div className="bg-card rounded-[2rem] p-6 md:p-8 border border-border shadow-sm sticky top-24">
                <h3 className="font-serif text-xl font-bold mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 max-h-[360px] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.productImageUrl || ""}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex justify-between">
                          <h4 className="font-semibold text-sm line-clamp-1">{item.productName}</h4>
                          <span className="font-bold text-sm">₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Qty: {item.quantity} • {item.size} • {item.color}
                        </p>
                        {item.customizationNotes && (
                          <p className="text-xs text-primary mt-1 truncate">Custom: {item.customizationNotes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-border text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-primary font-medium">Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-foreground">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="mt-4 bg-primary/5 rounded-xl p-3 border border-primary/10 text-xs text-muted-foreground">
                  You'll receive order confirmation on your email and WhatsApp number.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
