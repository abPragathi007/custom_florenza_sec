import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListFeaturedProducts, useGetSummary, useListReviews } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Paintbrush, Scissors, Truck, Star } from "lucide-react";

// Import generated images
import heroLifestyle from "@/assets/lifestyle1.png";
import heroHoodie from "@/assets/lifestyle2.png";

export default function Home() {
  const { data: featuredProducts, isLoading: loadingProducts } = useListFeaturedProducts();
  const { data: summary } = useGetSummary();
  useListReviews();
  const featuredProductList = Array.isArray(featuredProducts) ? featuredProducts : [];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-secondary/50 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col gap-6"
              >
                <div className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                  <span>New Spring Collection</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                  Designed by <span className="text-primary italic">You</span>,<br />
                  Crafted by Florenza
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
                  Turn your ideas into premium clothing. Choose your style, add your design, and let us handle the rest with boutique quality care.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="rounded-full text-base px-8 h-14 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                    <Link href="/customize">Start Customizing</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full text-base px-8 h-14 border-border hover:bg-secondary transition-all">
                    <Link href="/products">Shop Collection</Link>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-[2rem] shadow-2xl">
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 rounded-[2rem]" />
                  <img 
                    src={heroLifestyle} 
                    alt="Couple wearing custom florenza clothing" 
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Decorative floating card */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-background rounded-2xl p-4 shadow-xl border border-border/50 max-w-[200px]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex text-amber-400">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-xs font-bold">{summary?.averageRating || "4.9"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Over {summary?.happyCustomers || "2,000+"} happy customers worldwide.</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">Why Choose Florenza</h2>
              <p className="text-muted-foreground">We combine premium materials with state-of-the-art customization to deliver clothes you'll love to wear.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/60 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Paintbrush className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-serif">Unlimited Creativity</h3>
                <p className="text-muted-foreground text-sm">Design anything. Upload your artwork, use our fonts, and see a live preview instantly.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/60 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Scissors className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-serif">Premium Materials</h3>
                <p className="text-muted-foreground text-sm">We source only the softest cottons and durable blends for clothing that lasts.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/60 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-serif">Fast Delivery</h3>
                <p className="text-muted-foreground text-sm">Your custom order is produced and shipped quickly, with tracking every step of the way.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">Featured Styles</h2>
                <p className="text-muted-foreground">Our most popular blank canvases, ready for your ideas.</p>
              </div>
              <Button asChild variant="link" className="hidden md:flex text-primary hover:text-primary/80">
                <Link href="/products">View All Collection</Link>
              </Button>
            </div>
            
            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse flex flex-col gap-4">
                    <div className="aspect-[4/5] bg-muted rounded-2xl w-full"></div>
                    <div className="h-5 bg-muted rounded w-2/3"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : featuredProductList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {featuredProductList.slice(0, 4).map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-background/80 px-6 py-12 text-center">
                <h3 className="font-serif text-2xl text-foreground">Featured styles are loading soon</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  The homepage is now protected from invalid product data, and you can still browse the full collection.
                </p>
              </div>
            )}
            
            <div className="mt-10 text-center md:hidden">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/products">View All Collection</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Highlight Section */}
        <section className="py-24 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-primary/5 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative">
              <div className="md:w-1/2 z-10">
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                  For Teams, Brands,<br />and <span className="text-primary italic">Dreamers</span>.
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                  Need a bulk order for your team or launching your own merch? Our design team is ready to help you craft the perfect look.
                </p>
                <ul className="space-y-4 mb-8">
                  {['Bulk discounts available', 'Free design consultation', 'Premium embroidery options'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                  <Link href="/about">Learn About Team Orders</Link>
                </Button>
              </div>
              <div className="md:w-1/2 relative">
                <div className="aspect-square max-w-md mx-auto rounded-full overflow-hidden border-8 border-background shadow-2xl relative z-10">
                  <img src={heroHoodie} alt="Premium Custom Hoodie" className="w-full h-full object-cover" />
                </div>
                {/* Decorative blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-secondary to-primary/20 rounded-full blur-3xl -z-10 opacity-70"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
