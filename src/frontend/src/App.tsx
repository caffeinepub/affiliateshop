import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";

type Page = "home" | "products" | "admin";

function isAdminMode(): boolean {
  const search = window.location.search;
  const hash = window.location.hash;
  return (
    search.includes("admin") ||
    hash === "#admin" ||
    hash.startsWith("#admin?") ||
    hash.startsWith("#admin&")
  );
}

export default function App() {
  const [adminMode] = useState<boolean>(() => isAdminMode());
  const [page, setPage] = useState<Page>("home");

  // Admin panel — hidden route, no header/footer
  if (adminMode) {
    return (
      <>
        <AdminPage />
        <Toaster richColors position="bottom-right" />
      </>
    );
  }

  // Public storefront
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        currentPage={page}
        onNavigate={(p) => {
          if (p === "admin") return; // admin is ?admin only
          setPage(p);
        }}
      />

      <div className="flex-1">
        {page === "home" && (
          <HomePage onNavigateToProducts={() => setPage("products")} />
        )}
        {page === "products" && <ProductsPage />}
      </div>

      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
