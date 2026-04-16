import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const categoryLabel: Record<string, string> = {
  tshirt: "T-Shirt",
  hoodie: "Hoodie",
  shirt: "Shirt",
  sweatshirt: "Sweatshirt",
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const totalPrice = product.basePrice + product.customizationPrice;
  const productColors = Array.isArray(product.colors) ? product.colors : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/product/${product.id}`}>
        <Card className="group overflow-hidden border-transparent bg-transparent shadow-none hover:shadow-lg transition-all duration-300 cursor-pointer rounded-2xl">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted/30">
            {product.isFeatured && (
              <Badge className="absolute top-3 left-3 z-10 bg-primary/90 hover:bg-primary text-white border-none shadow-sm font-medium px-2 py-1">
                Featured
              </Badge>
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <img
              src={product.imageUrl || `https://ui-avatars.com/api/?name=${product.name}&background=fde2e4&color=c9184a&size=512`}
              alt={product.name}
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </div>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-serif font-medium text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
              <div className="text-right shrink-0">
                <div className="font-semibold text-foreground">₹{product.basePrice.toLocaleString("en-IN")}</div>
                <div className="text-xs text-muted-foreground">+₹{product.customizationPrice.toLocaleString("en-IN")} custom</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {categoryLabel[product.category] || product.category}
            </p>
            <div className="flex gap-1 flex-wrap mt-1">
              {productColors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="text-xs bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full"
                >
                  {color}
                </span>
              ))}
              {productColors.length > 4 && (
                <span className="text-xs bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full">
                  +{productColors.length - 4}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
