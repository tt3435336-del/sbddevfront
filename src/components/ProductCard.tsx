import { useNavigate } from "react-router-dom";
import type { Produit } from "@/hooks/useProduits";
import { Badge } from "@/components/ui/badge";
import { Images, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { getResolvedProductImages } from "@/lib/productImages";

const badgeColors: Record<string, string> = {
  "Nouveau": "bg-[hsl(142,70%,45%)] text-white",
  "Best seller": "bg-primary text-primary-foreground",
  "Premium": "bg-accent text-accent-foreground",
  "Personnalisable": "bg-[hsl(262,80%,55%)] text-white",
  "Pack": "bg-[hsl(200,80%,50%)] text-white",
  "Pack économique": "bg-[hsl(200,80%,50%)] text-white",
  "Marque Premium": "bg-accent text-accent-foreground",
  "Confort+": "bg-[hsl(340,70%,55%)] text-white",
};

const ProductCard = ({ produit }: { produit: Produit }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const imageUrls = getResolvedProductImages(produit.image_urls, produit.image_url, produit.categorie);
  const imageUrl = imageUrls[0];
  const productPath = `/produit/${produit.id}`;
  const openProduct = () => navigate(productPath);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openProduct}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProduct();
        }
      }}
      className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="block">
        <div className="relative flex h-48 items-center justify-center overflow-hidden bg-muted p-3 sm:h-44 lg:h-48">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={produit.nom}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12" />
            </div>
          )}
          {produit.badge && produit.badge !== "Aucun" && (
            <Badge className={`absolute top-3 left-3 ${badgeColors[produit.badge] || "bg-primary text-primary-foreground"}`}>
              {produit.badge}
            </Badge>
          )}
          {imageUrls.length > 1 && (
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
              <Images className="h-3.5 w-3.5" />
              {imageUrls.length}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-3.5">
        <h3 className="mb-1 line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary sm:text-sm">
          {produit.nom}
        </h3>
        <p className="mb-3 text-xs text-muted-foreground">{produit.categorie}</p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="min-w-0 text-sm font-bold leading-tight text-primary sm:text-base">
            {produit.prix ? `${produit.prix.toLocaleString()} FCFA` : "Prix sur demande"}
          </span>
          <Button
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl bg-primary hover:bg-primary/80 sm:h-8 sm:w-8 sm:rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem({
                id: produit.id,
                nom: produit.nom,
                prix: produit.prix || 0,
                image_url: imageUrl || "",
              });
            }}
          >
            <ShoppingCart className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
