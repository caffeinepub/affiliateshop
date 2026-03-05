import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../backend.d";
import { ProductCard } from "../components/ProductCard";
import {
  useGetCategories,
  useGetFeaturedProducts,
  useGetProducts,
  useGetProductsByCategory,
} from "../hooks/useQueries";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "../lib/mockData";

function ProductSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden border border-border bg-card shadow-card"
      data-ocid="products.loading_state"
    >
      <Skeleton className="aspect-[4/3] w-full skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4 skeleton-shimmer" />
        <Skeleton className="h-3 w-full skeleton-shimmer" />
        <Skeleton className="h-3 w-5/6 skeleton-shimmer" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-8 w-16 skeleton-shimmer" />
          <Skeleton className="h-8 flex-1 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  isMock?: boolean;
  startIndex?: number;
}

function ProductGrid({
  products,
  isLoading,
  isError,
  isMock = false,
  startIndex = 0,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }, (_, i) => `sk-${i}`).map((k) => (
          <ProductSkeleton key={k} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        data-ocid="products.error_state"
        className="text-center py-16 space-y-3"
      >
        <p className="font-display text-lg text-foreground">
          Something went wrong
        </p>
        <p className="font-body text-sm text-muted-foreground">
          Failed to load products. Please refresh.
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div
        data-ocid="products.empty_state"
        className="text-center py-20 space-y-4"
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
          <ShoppingBag className="w-7 h-7 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <p className="font-display text-xl text-foreground">
            No products yet
          </p>
          <p className="font-body text-sm text-muted-foreground">
            Products will appear here once added by an admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid="products.grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {products.map((product, i) => {
        const ocIndex = startIndex + i + 1;
        return (
          <div key={String(product.id)} data-ocid={`products.item.${ocIndex}`}>
            <ProductCard product={product} index={i} isMock={isMock} />
          </div>
        );
      })}
    </div>
  );
}

export function HomePage({
  onNavigateToProducts,
}: { onNavigateToProducts: () => void }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: featuredProducts, isLoading: featuredLoading } =
    useGetFeaturedProducts();
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const {
    data: filteredProducts,
    isLoading: filteredLoading,
    isError: filteredError,
  } = useGetProductsByCategory(activeCategory);

  // Use real data if available, otherwise show mock
  const hasFeatured = featuredProducts && featuredProducts.length > 0;
  const hasProducts = filteredProducts && filteredProducts.length > 0;

  const displayFeatured = hasFeatured
    ? featuredProducts
    : MOCK_PRODUCTS.filter((p) => p.featured);
  const displayProducts = hasProducts ? filteredProducts : MOCK_PRODUCTS;
  const displayCategories =
    categories && categories.length > 0 ? categories : MOCK_CATEGORIES;
  const isMockMode = !hasProducts && !filteredLoading && !filteredError;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section
        data-ocid="hero.section"
        className="relative overflow-hidden hero-noise"
        style={{
          backgroundImage: `url('/assets/generated/hero-bg.dim_1600x800.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "oklch(0.75 0.07 240)",
        }}
      >
        {/* Light blue overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "oklch(0.75 0.07 240 / 0.88)" }}
        />

        <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent rounded-full px-3 py-1 mb-5 text-xs font-body font-semibold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                Curated Amazon Picks
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-5">
                Discover Products{" "}
                <em className="not-italic text-accent">Worth Buying</em>
              </h1>
              <p className="font-body text-base md:text-lg text-foreground/75 leading-relaxed mb-8 max-w-lg">
                Hand-picked Amazon affiliate products across every category.
                Save time, shop smarter, and get the best deals — all in one
                place.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                onClick={onNavigateToProducts}
                className="btn-cta h-11 px-6 font-body text-sm rounded-xl gap-2 border-0"
              >
                Browse All Products
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("featured-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-11 px-6 font-body text-sm rounded-xl border-foreground/30 text-foreground hover:bg-foreground/10 bg-transparent"
              >
                See Featured
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-section" className="bg-secondary py-14">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Featured Picks
              </h2>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Our top-rated recommended products
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={onNavigateToProducts}
              className="font-body text-sm gap-1 text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }, (_, i) => `fsk-${i}`).map((k) => (
                <ProductSkeleton key={k} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayFeatured.slice(0, 3).map((product, i) => (
                <div
                  key={String(product.id)}
                  data-ocid={`products.item.${i + 1}`}
                >
                  <ProductCard
                    product={product}
                    index={i}
                    isMock={!hasFeatured}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Products with category filter */}
      <section className="py-14 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              All Products
            </h2>

            {/* Folder Tabs */}
            {!categoriesLoading && (
              <Tabs
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-full"
              >
                <TabsList
                  data-ocid="products.folder.tab"
                  className="flex-wrap h-auto gap-1 bg-secondary p-1 rounded-xl"
                >
                  <TabsTrigger
                    value="all"
                    className="font-body text-sm rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    All
                  </TabsTrigger>
                  {displayCategories.map((cat) => (
                    <TabsTrigger
                      key={String(cat.id)}
                      value={cat.name}
                      className="font-body text-sm rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </motion.div>

          <ProductGrid
            products={
              isMockMode && activeCategory === "all"
                ? displayProducts
                : (filteredProducts ?? [])
            }
            isLoading={filteredLoading}
            isError={filteredError}
            isMock={isMockMode}
          />

          {isMockMode && (
            <p className="text-center font-body text-xs text-muted-foreground mt-6">
              * Sample products shown for preview. Real products will appear
              once added.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
