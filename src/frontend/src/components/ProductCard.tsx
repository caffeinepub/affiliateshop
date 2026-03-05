import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend.d";

interface ProductCardProps {
  product: Product;
  index?: number;
  isMock?: boolean;
}

export function ProductCard({
  product,
  index = 0,
  isMock = false,
}: ProductCardProps) {
  const handleShopClick = () => {
    if (isMock) return;
    window.open(product.affiliateLink, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
    >
      <Card className="product-card group overflow-hidden border-border bg-card h-full flex flex-col rounded-xl shadow-card">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3] bg-secondary">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "";
                target.style.display = "none";
                target.parentElement!.classList.add("no-image");
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ShoppingCart className="w-12 h-12 opacity-30" />
            </div>
          )}
          {product.featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-accent text-accent-foreground font-body font-semibold text-xs gap-1 py-0.5">
                <Star className="w-3 h-3 fill-current" />
                Featured
              </Badge>
            </div>
          )}
          {product.category && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className="font-body text-xs py-0.5 backdrop-blur-sm bg-card/90"
              >
                {product.category}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex flex-col flex-1 gap-3">
          {/* Title */}
          <h3 className="font-display font-semibold text-sm leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Description */}
          <p className="font-body text-xs text-muted-foreground line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-2 pt-1 mt-auto">
            <span className="price-badge font-body font-bold text-sm px-2.5 py-1 rounded-md">
              {product.price}
            </span>
            <Button
              onClick={handleShopClick}
              disabled={isMock}
              data-ocid="product.card.shop_button"
              className="btn-cta flex-1 text-xs font-body h-8 rounded-lg gap-1.5 border-0"
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              Shop on Amazon
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
