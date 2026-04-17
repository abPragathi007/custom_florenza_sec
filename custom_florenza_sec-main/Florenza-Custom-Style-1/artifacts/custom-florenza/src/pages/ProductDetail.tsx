import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetProduct, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useParams, Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Paintbrush, ShoppingBag, Truck, ArrowRight, Check } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: product, isLoading } = useGetProduct(Number(id), { 
    query: { enabled: !!id } as any 
  });
  
  const addToCartMutation = useAddToCart();
  const productColors = Array.isArray(product?.colors) ? product.colors : [];
  const productSizes = Array.isArray(product?.sizes) ? product.sizes : [];

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-[4/5] bg-muted rounded-3xl"></div>
            <div className="space-y-6">
              <div className="h-10 bg-muted rounded w-2/3"></div>
              <div className="h-6 bg-muted rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <Link href="/products">Back to Collection</Link>
          </Button>
        </main>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "You must choose a size and color before adding to cart.",
        variant: "destructive"
      });
      return;
    }

    addToCartMutation.mutate(
      {
        data: {
          productId: product.id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        }
      },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`
          });
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        }
      }
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Images */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-[2rem] bg-muted/30">
              <img 
                src={product.imageUrl || `https://ui-avatars.com/api/?name=${product.name}&background=fde2e4&color=c9184a&size=512`} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-2">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">{product.category}</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">{product.name}</h1>
            <p className="text-2xl font-medium text-foreground mb-6">₹{product.basePrice.toLocaleString('en-IN')}</p>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-6 mb-10">
              {/* Color Selection */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-sm text-foreground">Color</span>
                  <span className="text-xs text-muted-foreground capitalize">{selectedColor || "Select"}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {productColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? 'border-primary scale-110' : 'border-transparent hover:scale-110'} shadow-sm`}
                      style={{ backgroundColor: color }}
                      title={color}
                      aria-label={`Select ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-sm text-foreground">Size</span>
                  <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-medium text-sm transition-all border ${
                        selectedSize === size 
                          ? 'bg-foreground text-background border-foreground' 
                          : 'bg-transparent text-foreground border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button 
                onClick={handleAddToCart} 
                disabled={addToCartMutation.isPending || !product.inStock}
                className="flex-1 h-14 rounded-full text-base font-semibold"
                size="lg"
              >
                {addToCartMutation.isPending ? "Adding..." : !product.inStock ? "Out of Stock" : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" /> Add Blank to Cart
                  </>
                )}
              </Button>
              <Button 
                variant="secondary"
                className="flex-1 h-14 rounded-full text-base font-semibold border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                size="lg"
                onClick={() => {
                  if (!selectedSize || !selectedColor) {
                    toast({
                      title: "Please select options",
                      description: "Choose a size and color before designing.",
                      variant: "destructive"
                    });
                    return;
                  }
                  // Navigate to customize with params
                  setLocation(`/customize?product=${product.id}&size=${selectedSize}&color=${selectedColor}`);
                }}
              >
                <Paintbrush className="mr-2 h-5 w-5" /> Customize Design
              </Button>
            </div>

            {/* Info accordions */}
            <div className="space-y-4 border-t border-border pt-8">
              <div className="flex gap-4 items-start">
                <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Free Shipping</h4>
                  <p className="text-sm text-muted-foreground">On all orders over $100. Standard delivery 3-5 business days.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Quality Guarantee</h4>
                  <p className="text-sm text-muted-foreground">Premium materials designed to last. 30-day return policy on blank items.</p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
