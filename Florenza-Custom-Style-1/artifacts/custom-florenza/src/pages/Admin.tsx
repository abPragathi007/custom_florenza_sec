import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  basePrice: z.coerce.number().min(1),
  customizationPrice: z.coerce.number().min(0),
  category: z.enum(["tshirt", "hoodie", "shirt"]),
  imageUrl: z.string().url(),
  colors: z.string().min(2),
  sizes: z.string().min(2),
});

type ProductForm = z.infer<typeof productSchema>;

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${url}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export default function Admin() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const productForm = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 999,
      customizationPrice: 299,
      category: "tshirt",
      imageUrl: "",
      colors: "White,Black,Navy",
      sizes: "S,M,L,XL",
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => jsonFetch<{ totalOrders: number; totalRevenue: number; happyCustomers: number; averageRating: number }>("/stats"),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => jsonFetch<Array<{ id: number; name: string; category: string; basePrice: number; inStock: boolean }>>("/products"),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => jsonFetch<Array<{ id: number; customerName: string; totalPrice: number; status: string; createdAt: string }>>("/orders?scope=all"),
  });

  const addProduct = useMutation({
    mutationFn: (data: ProductForm) =>
      jsonFetch("/products", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          colors: data.colors.split(",").map((v) => v.trim()),
          sizes: data.sizes.split(",").map((v) => v.trim()),
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product added" });
      productForm.reset();
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: number) => jsonFetch(`/products/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const editProduct = useMutation({
    mutationFn: ({ id, name, basePrice }: { id: number; name: string; basePrice: number }) =>
      jsonFetch(`/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name, basePrice }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "pending" | "processing" | "shipped" | "delivered" }) =>
      jsonFetch(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const statuses = useMemo(() => ["pending", "processing", "shipped", "delivered"] as const, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-10">
        <h1 className="font-serif text-3xl font-bold mb-6">Admin Panel</h1>
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border">Orders: {stats?.totalOrders ?? 0}</div>
            <div className="p-4 rounded-xl border">Revenue: ₹{(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}</div>
            <div className="p-4 rounded-xl border">Customers: {stats?.happyCustomers ?? 0}</div>
            <div className="p-4 rounded-xl border">Avg Rating: {stats?.averageRating ?? 4.9}</div>
          </TabsContent>
          <TabsContent value="products">
            <form onSubmit={productForm.handleSubmit((values) => addProduct.mutate(values))} className="grid md:grid-cols-2 gap-3 mb-6">
              <Input placeholder="Name" {...productForm.register("name")} />
              <Input placeholder="Image URL" {...productForm.register("imageUrl")} />
              <Input placeholder="Base Price" type="number" {...productForm.register("basePrice")} />
              <Input placeholder="Customization Price" type="number" {...productForm.register("customizationPrice")} />
              <Input placeholder="Category (tshirt/hoodie/shirt)" {...productForm.register("category")} />
              <Input placeholder="Colors comma separated" {...productForm.register("colors")} />
              <Input placeholder="Sizes comma separated" {...productForm.register("sizes")} />
              <Input placeholder="Description" className="md:col-span-2" {...productForm.register("description")} />
              <Button type="submit" className="md:col-span-2">Add Product</Button>
            </form>
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="border rounded-lg p-3 flex items-center justify-between">
                  <div>{p.name} • {p.category} • ₹{p.basePrice}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const nextName = window.prompt("Product name", p.name) || p.name;
                        const nextPrice = Number(window.prompt("Base price", String(p.basePrice)) || p.basePrice);
                        editProduct.mutate({ id: p.id, name: nextName, basePrice: nextPrice });
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteProduct.mutate(p.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="orders" className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="border rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>#{o.id} • {o.customerName} • ₹{o.totalPrice.toLocaleString("en-IN")} • {new Date(o.createdAt).toLocaleDateString()}</div>
                <div className="flex gap-2">
                  {statuses.map((s) => (
                    <Button key={s} variant={o.status === s ? "default" : "outline"} size="sm" onClick={() => updateStatus.mutate({ id: o.id, status: s })}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
