import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-32 bg-secondary/50 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight"
            >
              Our Story is <span className="text-primary italic">Your</span> Story
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              We started Custom Florenza with a simple belief: clothing should be a personal canvas, not a mass-produced uniform.
            </motion.p>
          </div>
          {/* Decorative blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] -z-10"></div>
        </section>

        {/* Content */}
        <section className="py-24 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center max-w-6xl mx-auto mb-24">
            <div className="order-2 md:order-1 space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Craftsmanship First</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Before we ever print a design, we obsess over the blank garment. We source organic cottons, sustainable blends, and durable fabrics that feel incredible against the skin. 
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A custom design is only as good as the shirt it lives on. That's why we partner with ethical manufacturers to ensure every piece is built to last.
              </p>
            </div>
            <div className="order-1 md:order-2 aspect-square md:aspect-[4/5] bg-muted/50 rounded-[3rem] overflow-hidden">
              <div className="w-full h-full bg-secondary"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center max-w-6xl mx-auto">
            <div className="aspect-square md:aspect-[4/5] bg-primary/10 rounded-[3rem] overflow-hidden">
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                For Teams & Creators
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Boutique Team Service</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Building a brand? Outfitting a team? Our dedicated design concierge works directly with you for bulk orders. 
              </p>
              <ul className="space-y-3 my-6">
                <li className="flex items-center gap-3 text-foreground font-medium">
                  <div className="w-2 h-2 rounded-full bg-primary"></div> Vectorization and design clean-up
                </li>
                <li className="flex items-center gap-3 text-foreground font-medium">
                  <div className="w-2 h-2 rounded-full bg-primary"></div> Pantone color matching
                </li>
                <li className="flex items-center gap-3 text-foreground font-medium">
                  <div className="w-2 h-2 rounded-full bg-primary"></div> Specialized embroidery digitizing
                </li>
              </ul>
              <Button asChild size="lg" className="rounded-full mt-4">
                <Link href="/contact">Talk to our Team</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
