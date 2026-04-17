import { db, productsTable, reviewsTable } from "@workspace/db";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const products = [
  {
    name: "Classic Essential Tee",
    description: "Soft combed cotton t-shirt with a clean regular fit for daily wear.",
    basePrice: "699",
    customizationPrice: "250",
    category: "tshirt",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    colors: ["White", "Black", "Navy", "Grey", "Beige"],
    sizes,
    isFeatured: true,
    inStock: true,
  },
  {
    name: "Oversized Street Tee",
    description: "Dropped-shoulder oversized t-shirt built for premium street style.",
    basePrice: "899",
    customizationPrice: "300",
    category: "tshirt",
    imageUrl:
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1200&q=80",
    colors: ["White", "Black", "Navy", "Grey"],
    sizes,
    isFeatured: false,
    inStock: true,
  },
  {
    name: "Premium Zip Hoodie",
    description: "Heavyweight brushed fleece hoodie with a smooth zip and cozy interior.",
    basePrice: "1599",
    customizationPrice: "350",
    category: "hoodie",
    imageUrl:
      "https://images.unsplash.com/photo-1618354691321-e851c56960d1?auto=format&fit=crop&w=1200&q=80",
    colors: ["Black", "Navy", "Grey", "Beige"],
    sizes,
    isFeatured: true,
    inStock: true,
  },
  {
    name: "Minimal Pullover Hoodie",
    description: "Relaxed-fit pullover hoodie with durable cuffs and premium stitching.",
    basePrice: "1499",
    customizationPrice: "320",
    category: "hoodie",
    imageUrl:
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80",
    colors: ["White", "Black", "Grey"],
    sizes,
    isFeatured: false,
    inStock: true,
  },
  {
    name: "Oxford Smart Shirt",
    description: "Tailored oxford shirt with breathable weave for smart casual looks.",
    basePrice: "1299",
    customizationPrice: "300",
    category: "shirt",
    imageUrl:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=80",
    colors: ["White", "Navy", "Beige"],
    sizes,
    isFeatured: true,
    inStock: true,
  },
  {
    name: "Linen Summer Shirt",
    description: "Lightweight linen blend shirt designed for warm weather comfort.",
    basePrice: "1199",
    customizationPrice: "280",
    category: "shirt",
    imageUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
    colors: ["White", "Grey", "Beige"],
    sizes,
    isFeatured: false,
    inStock: true,
  },
  {
    name: "Signature Graphic Tee",
    description: "Premium jersey t-shirt optimized for high-quality front and back prints.",
    basePrice: "799",
    customizationPrice: "280",
    category: "tshirt",
    imageUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80",
    colors: ["White", "Black", "Navy"],
    sizes,
    isFeatured: false,
    inStock: true,
  },
  {
    name: "Urban Heavy Hoodie",
    description: "Thick premium hoodie with structured shoulders and oversized pockets.",
    basePrice: "1999",
    customizationPrice: "400",
    category: "hoodie",
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
    colors: ["Black", "Navy", "Grey", "Beige"],
    sizes,
    isFeatured: true,
    inStock: true,
  },
  {
    name: "Flannel Check Shirt",
    description: "Soft brushed flannel shirt with classic checks and a modern fit.",
    basePrice: "1399",
    customizationPrice: "320",
    category: "shirt",
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
    colors: ["Black", "Navy", "Grey"],
    sizes,
    isFeatured: false,
    inStock: true,
  },
];

const reviews = [
  {
    customerName: "Aarav Mehta",
    rating: 5,
    comment: "Amazing fabric quality and perfect fit. Custom print looked exactly as requested.",
    productName: "Classic Essential Tee",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    customerName: "Diya Sharma",
    rating: 5,
    comment: "Loved the hoodie finish. Delivery was quick and packaging felt premium.",
    productName: "Premium Zip Hoodie",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    customerName: "Rohan Nair",
    rating: 4,
    comment: "Great customization support. The shirt quality is excellent for the price.",
    productName: "Oxford Smart Shirt",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    customerName: "Sana Kapoor",
    rating: 5,
    comment: "The oversized tee style is exactly what I wanted. Colors are really rich.",
    productName: "Oversized Street Tee",
    avatarUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
  },
  {
    customerName: "Vikram Joshi",
    rating: 5,
    comment: "Best custom clothing purchase so far. Stitching and print durability are top-notch.",
    productName: "Urban Heavy Hoodie",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  },
  {
    customerName: "Nisha Verma",
    rating: 4,
    comment: "Very comfortable linen shirt and good support from the team.",
    productName: "Linen Summer Shirt",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
];

async function seed() {
  await db.delete(reviewsTable);
  await db.delete(productsTable);

  await db.insert(productsTable).values(products);
  await db.insert(reviewsTable).values(reviews);
}

seed()
  .then(() => {
    console.log("Seed completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
