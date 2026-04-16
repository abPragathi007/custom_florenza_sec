import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ImagePlus, Type, Palette, Shirt, ShoppingBag,
  ChevronRight, ChevronLeft, CheckCircle2, RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useListProducts,
  useAddToCart,
  getGetCartQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

const GARMENT_TYPES = [
  {
    id: "tshirt",
    label: "T-Shirt",
    emoji: "👕",
    desc: "Classic & oversized tees. Great for everyday prints, logos, or graphics.",
    gradient: "from-rose-100 to-pink-100",
  },
  {
    id: "hoodie",
    label: "Hoodie",
    emoji: "🧥",
    desc: "Cozy hoodies — pullover or zip-up. Perfect for teams and streetwear.",
    gradient: "from-purple-100 to-indigo-100",
  },
  {
    id: "shirt",
    label: "Shirt",
    emoji: "👔",
    desc: "Oxford, linen, denim & flannel shirts for a smart custom look.",
    gradient: "from-blue-100 to-sky-100",
  },
  {
    id: "sweatshirt",
    label: "Sweatshirt",
    emoji: "🧣",
    desc: "Crew & quarter-zip sweatshirts. Ideal for college drops and gifting.",
    gradient: "from-amber-100 to-orange-100",
  },
];

const PRESET_COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#1a1a1a" },
  { name: "Blush Pink", hex: "#ffc8d3" },
  { name: "Lavender", hex: "#c4b5fd" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Sage Green", hex: "#9cb89c" },
  { name: "Sky Blue", hex: "#7ec8e3" },
  { name: "Coral", hex: "#ff7f6e" },
  { name: "Cream", hex: "#f5f0e8" },
  { name: "Charcoal", hex: "#36454f" },
];

type Step = "type" | "product" | "design" | "options";
type SupportedCategory = "tshirt" | "hoodie" | "shirt";

export default function Customize() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState<Step>("type");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState("#c9184a");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [designNotes, setDesignNotes] = useState("");
  const [designTab, setDesignTab] = useState<"text" | "image" | "notes">("text");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addToCart = useAddToCart();

  const { data: products, isLoading: productsLoading } = useListProducts({
    category:
      selectedType === "tshirt" || selectedType === "hoodie" || selectedType === "shirt"
        ? (selectedType as SupportedCategory)
        : undefined,
  });

  const productList = Array.isArray(products) ? products : [];
  const selectedProduct = productList.find((p) => p.id === selectedProductId);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product = Number(params.get("product"));
    const size = params.get("size");
    const color = params.get("color");
    if (!Number.isNaN(product) && product > 0) {
      setSelectedProductId(product);
      if (size) setSelectedSize(size);
      if (color) setSelectedColor(color);
      setStep("options");
    }
  }, []);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  function buildCustomizationNotes(): string {
    const parts: string[] = [];
    if (customText) parts.push(`Text: "${customText}" (color: ${textColor})`);
    if (uploadedImage) parts.push("Custom image/logo uploaded");
    if (designNotes) parts.push(`Design notes: ${designNotes}`);
    return parts.join(" | ") || "Standard print";
  }

  function handleAddToCart() {
    if (!selectedProduct) return;
    if (!selectedSize) {
      toast({ title: "Select a size", variant: "destructive" });
      return;
    }
    if (!selectedColor) {
      toast({ title: "Select a color", variant: "destructive" });
      return;
    }

    addToCart.mutate(
      {
        data: {
          productId: selectedProduct.id,
          quantity: 1,
          size: selectedSize,
          color: selectedColor,
          customizationNotes: buildCustomizationNotes(),
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Added to Cart!",
            description: `Your custom ${selectedProduct.name} is in the cart.`,
          });
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          setLocation("/cart");
        },
        onError: () => {
          toast({
            title: "Couldn't add to cart",
            description: "Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  }

  const garmentType = GARMENT_TYPES.find((g) => g.id === selectedType);

  const steps: Step[] = ["type", "product", "design", "options"];
  const stepIndex = steps.indexOf(step);

  function goNext() {
    const next = steps[stepIndex + 1];
    if (next) setStep(next);
  }
  function goPrev() {
    const prev = steps[stepIndex - 1];
    if (prev) setStep(prev);
  }

  const stepLabels = ["Choose Garment", "Pick Style", "Add Design", "Size & Color"];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 bg-muted/20 pb-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/10 to-muted py-14 px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3"
          >
            Design Studio
          </motion.h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Pick your garment, add your design, and we'll craft it with love.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="container mx-auto px-4 max-w-3xl pt-8 pb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute inset-x-0 top-4 h-0.5 bg-muted z-0" />
            {stepLabels.map((label, idx) => {
              const isActive = idx === stepIndex;
              const isDone = idx < stepIndex;
              return (
                <div key={label} className="flex flex-col items-center gap-2 z-10 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                      isActive
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/30"
                        : isDone
                        ? "bg-primary/20 border-primary/30 text-primary"
                        : "bg-background border-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-medium text-center hidden sm:block ${
                      isActive ? "text-primary" : isDone ? "text-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-3xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: Choose Garment Type */}
            {step === "type" && (
              <motion.div
                key="type"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-serif font-bold text-foreground">What would you like to customize?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {GARMENT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id);
                        setSelectedProductId(null);
                        goNext();
                      }}
                      className={`relative p-6 rounded-3xl border-2 text-left transition-all hover:shadow-md group ${
                        selectedType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center text-2xl mb-4`}>
                        {type.emoji}
                      </div>
                      <h3 className="font-serif text-xl font-bold mb-1">{type.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{type.desc}</p>
                      <ChevronRight className="absolute top-6 right-6 text-muted-foreground group-hover:text-primary transition-colors h-5 w-5" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Pick Specific Product */}
            {step === "product" && (
              <motion.div
                key="product"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-bold text-foreground">
                    Choose a {garmentType?.label}
                  </h2>
                  <button
                    onClick={goPrev}
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                </div>

                {productsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse bg-muted rounded-3xl h-48" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {productList.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setSelectedColor("");
                          setSelectedSize("");
                          goNext();
                        }}
                        className={`relative text-left rounded-3xl border-2 overflow-hidden transition-all hover:shadow-md group ${
                          selectedProductId === product.id
                            ? "border-primary"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="aspect-[3/2] overflow-hidden bg-muted/30">
                          <img
                            src={product.imageUrl || ""}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4 bg-card">
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif font-bold text-foreground text-sm line-clamp-1">{product.name}</h3>
                            <span className="text-sm font-semibold text-primary shrink-0 ml-2">₹{product.basePrice.toLocaleString("en-IN")}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {product.colors.length} colors • {product.sizes.length} sizes
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Design */}
            {step === "design" && selectedProduct && (
              <motion.div
                key="design"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-bold text-foreground">Add Your Design</h2>
                  <button
                    onClick={goPrev}
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Preview */}
                  <div className="bg-card border border-border rounded-3xl overflow-hidden aspect-square relative flex items-center justify-center">
                    <img
                      src={selectedProduct.imageUrl || ""}
                      alt={selectedProduct.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                    {customText && (
                      <div
                        className="relative z-10 text-center text-xl font-bold px-4 py-2 rounded-lg max-w-[180px] break-words leading-tight"
                        style={{ color: textColor, textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
                      >
                        {customText}
                      </div>
                    )}
                    {uploadedImage && !customText && (
                      <img
                        src={uploadedImage}
                        alt="Custom design"
                        className="relative z-10 w-32 h-32 object-contain rounded-xl shadow-lg"
                      />
                    )}
                    {!customText && !uploadedImage && (
                      <div className="relative z-10 text-center text-muted-foreground/60 text-sm px-8">
                        <Shirt className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        Your design will appear here
                      </div>
                    )}
                  </div>

                  {/* Design Options */}
                  <div className="space-y-4">
                    {/* Tabs */}
                    <div className="flex gap-2 bg-muted/40 p-1 rounded-xl">
                      {[
                        { id: "text" as const, icon: Type, label: "Text" },
                        { id: "image" as const, icon: ImagePlus, label: "Image" },
                        { id: "notes" as const, icon: Palette, label: "Notes" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setDesignTab(tab.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                            designTab === tab.id
                              ? "bg-background shadow text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <tab.icon className="h-4 w-4" />
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {designTab === "text" && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Custom Text</Label>
                          <Input
                            placeholder="e.g. Team Florenza 2025"
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            maxLength={50}
                            className="bg-muted/30"
                          />
                          <p className="text-xs text-muted-foreground mt-1">{customText.length}/50 characters</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Text Color</Label>
                          <div className="flex flex-wrap gap-2">
                            {["#c9184a", "#1a1a1a", "#FFFFFF", "#1e3a5f", "#7ec8e3", "#ffc8d3", "#9cb89c", "#ff7f6e"].map(
                              (color) => (
                                <button
                                  key={color}
                                  onClick={() => setTextColor(color)}
                                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                                    textColor === color ? "border-primary scale-110 shadow" : "border-border"
                                  }`}
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              )
                            )}
                          </div>
                        </div>
                        {customText && (
                          <button
                            onClick={() => setCustomText("")}
                            className="text-xs text-destructive flex items-center gap-1 hover:underline"
                          >
                            <RotateCcw className="h-3 w-3" /> Clear text
                          </button>
                        )}
                      </div>
                    )}

                    {designTab === "image" && (
                      <div className="space-y-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        {uploadedImage ? (
                          <div className="space-y-3">
                            <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden">
                              <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex gap-3">
                              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-full">Change Image</Button>
                              <Button variant="ghost" size="sm" onClick={() => setUploadedImage(null)} className="rounded-full text-destructive hover:text-destructive">Remove</Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all group"
                          >
                            <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-primary mx-auto mb-3 transition-colors" />
                            <p className="font-medium text-sm text-foreground">Upload your image or logo</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG — max 10MB</p>
                          </button>
                        )}
                        <p className="text-xs text-muted-foreground">For best results, use a high-resolution PNG with a transparent background.</p>
                      </div>
                    )}

                    {designTab === "notes" && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Design Notes for Our Team</Label>
                          <Textarea
                            placeholder="Describe your design vision — colors, placement, style, inspiration. Our team will bring it to life!"
                            value={designNotes}
                            onChange={(e) => setDesignNotes(e.target.value)}
                            className="min-h-[120px] resize-none bg-muted/30"
                          />
                        </div>
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-muted-foreground">
                          Our design team reviews all notes and will contact you before printing. Complex designs may need 1–2 extra business days.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={goPrev} className="rounded-full">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <Button onClick={goNext} className="rounded-full px-6">
                    Next: Size & Color <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Size & Color */}
            {step === "options" && selectedProduct && (
              <motion.div
                key="options"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-bold text-foreground">Size & Color</h2>
                  <button onClick={goPrev} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Summary Card */}
                  <div className="bg-card border border-border rounded-3xl overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img src={selectedProduct.imageUrl || ""} alt={selectedProduct.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif font-bold text-foreground text-lg">{selectedProduct.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Base</p>
                          <p className="font-bold text-xl text-foreground">₹{selectedProduct.basePrice.toLocaleString("en-IN")}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">With customization</p>
                          <p className="font-bold text-xl text-primary">
                            ₹{(selectedProduct.basePrice + selectedProduct.customizationPrice).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      {(customText || uploadedImage || designNotes) && (
                        <div className="mt-3 bg-primary/5 rounded-xl p-3 text-xs text-primary/80 border border-primary/15">
                          <span className="font-semibold">Design: </span>
                          {buildCustomizationNotes()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selectors */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">
                        Size {selectedSize && <span className="text-primary font-bold ml-1">• {selectedSize}</span>}
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                              selectedSize === size
                                ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                                : "border-border bg-card text-foreground hover:border-primary/50"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-3 block">
                        Color {selectedColor && <span className="text-primary font-bold ml-1">• {selectedColor}</span>}
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.colors.map((color) => {
                          const preset = PRESET_COLORS.find((p) => p.name === color);
                          return (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              title={color}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 text-xs font-medium transition-all ${
                                selectedColor === color
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-border bg-card text-foreground hover:border-primary/40"
                              }`}
                            >
                              {preset && (
                                <span
                                  className="w-3 h-3 rounded-full border border-border/50 shrink-0 inline-block"
                                  style={{ backgroundColor: preset.hex }}
                                />
                              )}
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Button
                      onClick={handleAddToCart}
                      disabled={addToCart.isPending || !selectedSize || !selectedColor}
                      className="w-full h-14 rounded-full text-base font-bold gap-2"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      {addToCart.isPending
                        ? "Adding to Cart..."
                        : `Add to Cart — ₹${(selectedProduct.basePrice + selectedProduct.customizationPrice).toLocaleString("en-IN")}`}
                    </Button>

                    {(!selectedSize || !selectedColor) && (
                      <p className="text-xs text-muted-foreground text-center -mt-2">
                        Please select both a size and color to continue.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
