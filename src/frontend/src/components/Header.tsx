import { Menu, ShoppingBag, Store, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface HeaderProps {
  currentPage: "home" | "products" | "admin";
  onNavigate: (page: "home" | "products" | "admin") => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { key: "home" as const, label: "Home", icon: Store },
    { key: "products" as const, label: "Products", icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            aria-label="AffiliateShop Home"
          >
            <div className="w-8 h-8 rounded-lg btn-cta flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
              <ShoppingBag className="w-4 h-4 text-cta-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              Affiliate<span className="text-accent">Shop</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav
            className="hidden sm:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map(({ key, label, icon: Icon }) => (
              <button
                type="button"
                key={key}
                onClick={() => onNavigate(key)}
                data-ocid="header.nav.link"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  currentPage === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden border-t border-border bg-card overflow-hidden"
          >
            <nav className="container px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ key, label, icon: Icon }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => {
                    onNavigate(key);
                    setMobileOpen(false);
                  }}
                  data-ocid="header.nav.link"
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-colors ${
                    currentPage === key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
