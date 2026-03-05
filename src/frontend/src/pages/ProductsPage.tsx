import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../backend.d";
import { ProductCard } from "../components/ProductCard";
import {
  useGetCategories,
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

export function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const {
    data: products,
    isLoading: productsLoading,
    isError,
  } = useGetProductsByCategory(activeCategory);

  const displayCategories =
    categories && categories.length > 0 ? categories : MOCK_CATEGORIES;
  const hasRealProducts = products && products.length > 0;
  const displayProducts: Product[] = hasRealProducts ? products : MOCK_PRODUCTS;
  const isMock = !hasRealProducts && !productsLoading && !isError;

  const filtered = search.trim()
    ? displayProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()),
      )
    : displayProducts;

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
            All Products
          </h1>
          <p className="font-body text-muted-foreground text-sm">
            Browse our curated collection of hand-picked Amazon products
          </p>
        </motion.div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="products.search_input"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 font-body text-sm h-10 rounded-lg"
            />
          </div>

          {/* Folder tabs */}
          {!categoriesLoading && (
            <Tabs
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="flex-1"
            >
              <TabsList
                data-ocid="products.folder.tab"
                className="flex-wrap h-auto gap-1 bg-secondary p-1 rounded-xl w-full justify-start"
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
        </div>

        {/* Results count */}
        {!productsLoading && !isError && (
          <p className="font-body text-xs text-muted-foreground mb-5">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            {isMock && " (preview)"}
          </p>
        )}

        {/* Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }, (_, i) => `sk-${i}`).map((k) => (
              <ProductSkeleton key={k} />
            ))}
          </div>
        ) : isError ? (
          <div
            data-ocid="products.error_state"
            className="text-center py-16 space-y-3"
          >
            <p className="font-display text-lg">Something went wrong</p>
            <p className="font-body text-sm text-muted-foreground">
              Failed to load products. Please refresh.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="products.empty_state"
            className="text-center py-20 space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-display text-xl text-foreground">
                No products found
              </p>
              <p className="font-body text-sm text-muted-foreground">
                {search
                  ? "Try a different search term."
                  : "No products in this category yet."}
              </p>
            </div>
          </div>
        ) : (
          <div
            data-ocid="products.grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((product, i) => (
              <div
                key={String(product.id)}
                data-ocid={`products.item.${i + 1}`}
              >
                <ProductCard product={product} index={i} isMock={isMock} />
              </div>
            ))}
          </div>
        )}

        {isMock && !productsLoading && (
          <p className="text-center font-body text-xs text-muted-foreground mt-8">
            * Sample products shown for preview. Real products will appear once
            added by an admin.
          </p>
        )}
      </div>
    </main>
  );
}
