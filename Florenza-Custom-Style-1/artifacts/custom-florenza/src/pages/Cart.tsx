import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetCart, useRemoveFromCart, useUpdateCartItem, getGetCartQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { data: cart, isLoading, isError, refetch } = useGetCart();
  const removeMutation = useRemoveFromCart();
  const updateMutation = useUpdateCartItem();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const cartItems = Array.isArray(cart?.items) ? cart.items : [];
  const cartTotal = cart?.totalPrice ?? 0;
  const totalItems = cart?.totalItems ?? 0;

  const handleRemove = (id: number) => {
    removeMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({ title: "Item removed from cart" });
        }
      }
    );
  };

  const handleQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    updateMutation.mutate(
      { id, data: { quantity } },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() }),
      },
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-foreground">Your Shopping Bag</h1>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-muted rounded-2xl w-full"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">We couldn't load your cart.</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-border max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-serif font-medium text-foreground mb-3">Your bag is empty</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Looks like you haven't added any custom designs to your bag yet.</p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              {cartItems.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 sm:gap-6 bg-card border border-border p-4 sm:p-6 rounded-2xl relative"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={item.productImageUrl || `https://ui-avatars.com/api/?name=${item.productName}&background=fde2e4&color=c9184a`} 
                      alt={item.productName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1 pr-8">{item.productName}</h3>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        disabled={removeMutation.isPending}
                        className="absolute top-6 right-6 text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground/80">Size:</span> {item.size}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground/80">Color:</span> 
                        <div className="w-4 h-4 rounded-full border border-border inline-block" style={{backgroundColor: item.color}}></div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground/80">Qty:</span>
                        <div className="inline-flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleQuantity(item.id, item.quantity - 1)}>-</Button>
                          <span>{item.quantity}</span>
                          <Button size="sm" variant="outline" onClick={() => handleQuantity(item.id, item.quantity + 1)}>+</Button>
                        </div>
                      </div>
                    </div>
                    
                    {item.customizationNotes && (
                      <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-xs text-foreground/80 mb-4 line-clamp-2">
                        <span className="font-medium text-primary">Design Note:</span> {item.customizationNotes}
                      </div>
                    )}
                    
                    <div className="mt-auto font-bold text-lg">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-secondary/30 rounded-[2rem] p-8 sticky top-24 border border-border/50">
                <h3 className="font-serif text-xl font-bold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-primary">Free</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border mb-8 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                
                <Button asChild className="w-full h-14 rounded-full text-base font-semibold group">
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Taxes calculated at checkout.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
