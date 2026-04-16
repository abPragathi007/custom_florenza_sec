import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetSummary } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { MousePointerClick, Edit3, Shirt, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HowItWorks() {
  const { data: summary } = useGetSummary();

  const steps = [
    {
      icon: <MousePointerClick className="w-8 h-8" />,
      title: "Choose Your Canvas",
      description: "Select from our premium range of blank t-shirts, hoodies, and shirts. All ethically sourced and ultra-soft."
    },
    {
      icon: <Edit3 className="w-8 h-8" />,
      title: "Design or Describe",
      description: "Use our studio to add text and images, or simply describe your vision and let our design team craft it for you."
    },
    {
      icon: <Shirt className="w-8 h-8" />,
      title: "Crafted with Care",
      description: "Our artisans screen print or embroider your design using high-quality inks and threads for lasting vibrancy."
    },
    {
      icon: <PackageCheck className="w-8 h-8" />,
      title: "Delivered to You",
      description: "Your custom piece is beautifully packaged and shipped directly to your door, ready to be worn and loved."
    }
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground">How Florenza Works</h1>
            <p className="text-lg text-muted-foreground">From a spark of imagination to a physical piece of clothing you'll wear for years. The process is simple, but the result is magical.</p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="relative max-w-5xl mx-auto">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-24 left-16 right-16 h-0.5 bg-primary/10 -z-10"></div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="relative flex flex-col items-center text-center group"
                  >
                    <div className="w-16 h-16 rounded-full bg-background border-4 border-secondary flex items-center justify-center text-primary mb-6 shadow-sm group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300">
                      {step.icon}
                    </div>
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center -z-20">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold font-serif mb-3 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-foreground/20">
              <div className="px-4">
                <div className="text-4xl md:text-5xl font-serif font-bold mb-2">{summary?.totalProducts || "50"}+</div>
                <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Premium Blanks</div>
              </div>
              <div className="px-4">
                <div className="text-4xl md:text-5xl font-serif font-bold mb-2">{summary?.happyCustomers || "2,000"}+</div>
                <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Happy Customers</div>
              </div>
              <div className="px-4">
                <div className="text-4xl md:text-5xl font-serif font-bold mb-2">{summary?.totalOrders || "5,000"}+</div>
                <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Items Crafted</div>
              </div>
              <div className="px-4">
                <div className="text-4xl md:text-5xl font-serif font-bold mb-2">{summary?.averageRating || "4.9"}</div>
                <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Ready to create something beautiful?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Start with a blank canvas or talk to our team for custom bulk orders.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 h-14">
              <Link href="/customize">Start Designing</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
