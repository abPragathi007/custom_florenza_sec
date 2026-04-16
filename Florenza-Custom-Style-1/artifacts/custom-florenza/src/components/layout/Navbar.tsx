import { Link } from "wouter";
import { ShoppingBag, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser, useClerk } from "@clerk/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";

export function Navbar() {
  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    return <NavbarGuest />;
  }
  return <NavbarWithAuth />;
}

function NavbarWithAuth() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const { data: cart } = useGetCart({ query: { enabled: isSignedIn } as any });
  const { signOut } = useClerk();

  const cartItemsCount = cart?.totalItems || 0;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Custom Florenza" className="h-10 w-10 object-contain" />
            <span className="font-serif text-xl font-bold tracking-tight text-primary hidden sm:block">Custom Florenza</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Shop</Link>
            <Link href="/customize" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Customize</Link>
            <Link href="/how-it-works" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">How It Works</Link>
            <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Contact</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn && (
            <Link href="/cart" className="relative p-2 text-foreground/80 hover:text-primary transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-primary-foreground bg-primary rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          )}

          <div className="hidden md:flex items-center gap-2">
            {isLoaded && isSignedIn ? (
              <>
                <Link href="/orders" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Orders</Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5 ml-2">
                      {user.imageUrl ? (
                        <img src={user.imageUrl} alt={user.firstName || "User"} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-3 h-3 text-primary" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-foreground">{user.firstName || user.emailAddresses[0]?.emailAddress?.split("@")[0]}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : isLoaded ? (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="rounded-full gap-1.5">
                    <LogIn className="h-4 w-4" /> Sign In
                  </Button>
                </Link>
                <Button asChild variant="default" size="sm" className="rounded-full px-6">
                  <Link href="/customize">Start Design</Link>
                </Button>
              </>
            ) : null}
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-3">
          <Link href="/products" onClick={toggleMobileMenu} className="text-sm font-medium p-2 hover:bg-muted rounded-md">Shop</Link>
          <Link href="/customize" onClick={toggleMobileMenu} className="text-sm font-medium p-2 hover:bg-muted rounded-md">Customize</Link>
          <Link href="/how-it-works" onClick={toggleMobileMenu} className="text-sm font-medium p-2 hover:bg-muted rounded-md">How It Works</Link>
          <Link href="/about" onClick={toggleMobileMenu} className="text-sm font-medium p-2 hover:bg-muted rounded-md">About</Link>
          <Link href="/orders" onClick={toggleMobileMenu} className="text-sm font-medium p-2 hover:bg-muted rounded-md">Orders</Link>
          <Link href="/contact" onClick={toggleMobileMenu} className="text-sm font-medium p-2 hover:bg-muted rounded-md">Contact</Link>
          <div className="pt-2 border-t border-border">
            {isSignedIn ? (
              <Button variant="ghost" className="w-full rounded-full gap-2" onClick={() => { handleSignOut(); toggleMobileMenu(); }}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            ) : (
              <Link href="/sign-in" onClick={toggleMobileMenu}>
                <Button className="w-full rounded-full gap-2">
                  <LogIn className="h-4 w-4" /> Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavbarGuest() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Custom Florenza" className="h-10 w-10 object-contain" />
            <span className="font-serif text-xl font-bold tracking-tight text-primary hidden sm:block">Custom Florenza</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Shop</Link>
            <Link href="/how-it-works" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">How It Works</Link>
            <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Contact</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="default" size="sm" className="rounded-full px-6 hidden md:inline-flex">
            <Link href="/products">Browse Collection</Link>
          </Button>
          <button className="md:hidden p-2 text-foreground" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-3">
          <Link href="/products" onClick={toggleMobileMenu} className="text-sm font-medium p-2 hover:bg-muted rounded-md">Shop</Link>
          <Link href="/how-it-works" onClick={toggleMobileMenu} className="text-sm font-medium p-2 hover:bg-muted rounded-md">How It Works</Link>
          <Link href="/about" onClick={toggleMobileMenu} className="text-sm font-medium p-2 hover:bg-muted rounded-md">About</Link>
          <Link href="/contact" onClick={toggleMobileMenu} className="text-sm font-medium p-2 hover:bg-muted rounded-md">Contact</Link>
        </div>
      )}
    </header>
  );
}
