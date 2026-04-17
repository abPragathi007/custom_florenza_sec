import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-primary">Custom Florenza</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Designed by You, Crafted by Florenza. We bring your unique style to life with premium custom clothing.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/products?category=tshirt" className="hover:text-primary transition-colors">T-Shirts</Link></li>
              <li><Link href="/products?category=hoodie" className="hover:text-primary transition-colors">Hoodies</Link></li>
              <li><Link href="/products?category=shirt" className="hover:text-primary transition-colors">Shirts</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Help</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/orders" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><span className="cursor-pointer hover:text-primary transition-colors">FAQ</span></li>
              <li><span className="cursor-pointer hover:text-primary transition-colors">Shipping & Returns</span></li>
              <li><span className="cursor-pointer hover:text-primary transition-colors">Size Guide</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Custom Florenza. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-primary transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-primary transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
