import { Heart, ShoppingBag } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md btn-cta flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="font-display font-bold text-base">
                AffiliateShop
              </span>
            </div>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed max-w-xs">
              Curated Amazon affiliate products across categories you love.
              Every purchase supports us at no extra cost to you.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="font-body font-semibold text-sm uppercase tracking-widest text-primary-foreground/60">
              Quick Links
            </h4>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <span className="text-primary-foreground/70 cursor-default">
                  Home
                </span>
              </li>
              <li>
                <span className="text-primary-foreground/70 cursor-default">
                  All Products
                </span>
              </li>
            </ul>
          </div>

          {/* Disclosure */}
          <div className="space-y-3">
            <h4 className="font-body font-semibold text-sm uppercase tracking-widest text-primary-foreground/60">
              Disclosure
            </h4>
            <p className="font-body text-xs text-primary-foreground/60 leading-relaxed">
              As an Amazon Associate, we earn from qualifying purchases. Prices
              shown are approximate and may vary.
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-primary-foreground/50">
            © {year}. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-primary-foreground/50 hover:text-accent transition-colors flex items-center gap-1"
          >
            Built with <Heart className="w-3 h-3 fill-accent text-accent" />{" "}
            using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
