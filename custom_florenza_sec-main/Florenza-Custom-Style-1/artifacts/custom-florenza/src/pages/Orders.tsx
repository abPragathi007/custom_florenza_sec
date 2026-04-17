import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useListOrders } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const { data: orders, isLoading, isError, refetch } = useListOrders();
  const orderList = Array.isArray(orders) ? orders : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-foreground">Order History</h1>
        <p className="text-muted-foreground mb-10">Track, manage, and review your past purchases.</p>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl w-full"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Unable to load your orders right now.</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : orderList.length === 0 ? (
          <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-border max-w-2xl mx-auto">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-serif font-medium mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">You haven't placed any orders with us yet.</p>
            <Button asChild className="rounded-full px-8">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {orderList.map((order) => (
              <Link key={order.id} href={`/order/${order.id}`}>
                <div className="bg-card border border-border hover:border-primary/50 transition-colors p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between cursor-pointer group shadow-sm hover:shadow-md">
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">Order #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')} • {(Array.isArray(order.items) ? order.items.length : 0)} items
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-lg">₹{order.totalPrice.toLocaleString("en-IN")}</p>
                      <Badge variant="outline" className={`mt-1 capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
