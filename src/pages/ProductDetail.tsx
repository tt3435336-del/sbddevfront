import { useParams } from "react-router-dom";
import { useProduit, useProduits } from "@/hooks/useProduits";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { CONTACT_WHATSAPP_NUMBER } from "@/lib/contact";
import { getResolvedProductImages } from "@/lib/productImages";
import { getProductColorOption, parseProductColors } from "@/lib/productOptions";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: produit, isLoading } = useProduit(id!);
  const { data: allProduits } = useProduits();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [id]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-16"><div className="h-96 bg-card rounded-lg animate-pulse" /></div>;
  }

  if (!produit) {
    return <div className="container mx-auto px-4 py-16 text-center"><p className="text-muted-foreground">Produit introuvable</p></div>;
  }

  const similar = allProduits?.filter((p) => p.categorie === produit.categorie && p.id !== produit.id).slice(0, 3) || [];
  const couleurs = parseProductColors(produit.couleurs);
  const imageUrls = getResolvedProductImages(produit.image_urls, produit.image_url, produit.categorie);
  const imageUrl = imageUrls[Math.min(selectedImageIndex, imageUrls.length - 1)] || imageUrls[0];
  const showImageGallery = () => {
    if (imageUrls.length > 1) {
      document.getElementById("product-gallery")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const whatsappMsg = encodeURIComponent(
    `Bonjour, je suis intéressé par : ${produit.nom}${produit.prix ? ` - ${produit.prix.toLocaleString()} FCFA` : ""}. Quantité : ${quantity}`
  );

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-8">
        <div>
          <button
            type="button"
            onClick={showImageGallery}
            className="flex h-72 w-full items-center justify-center overflow-hidden rounded-xl bg-muted p-4 text-left sm:h-[360px] lg:h-[430px]"
            aria-label={imageUrls.length > 1 ? "Voir les autres images du produit" : produit.nom}
          >
            {imageUrl ? (
              <img src={imageUrl} alt={produit.nom} className="h-full w-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ShoppingCart className="h-20 w-20" />
              </div>
            )}
          </button>

          {imageUrls.length > 1 && (
            <div id="product-gallery" className="mt-4">
              <p className="mb-2 text-sm font-semibold">Autres images</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
                {imageUrls.map((thumbnailUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex h-16 items-center justify-center overflow-hidden rounded-lg border bg-muted p-1.5 transition-all sm:h-24 ${
                      selectedImageIndex === index ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/60"
                    }`}
                  >
                    <img src={thumbnailUrl} alt={`${produit.nom} ${index + 1}`} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0">
          {produit.badge && produit.badge !== "Aucun" && (
            <Badge className="bg-primary text-primary-foreground mb-3">{produit.badge}</Badge>
          )}
          <h1 className="mb-2 text-2xl font-bold leading-tight md:text-3xl">{produit.nom}</h1>
          <p className="text-muted-foreground text-sm mb-4">{produit.categorie}</p>
          <p className="mb-5 text-2xl font-bold text-primary md:text-3xl">
            {produit.prix ? `${produit.prix.toLocaleString()} FCFA` : "Prix sur demande"}
          </p>

          {produit.description && (
            <p className="text-muted-foreground mb-6">{produit.description}</p>
          )}

          {couleurs.length > 0 && (
            <div className="mb-6">
              <p className="font-semibold text-sm mb-2">Couleurs disponibles :</p>
              <div className="flex flex-wrap gap-2">
                {couleurs.map((c) => {
                  const colorOption = getProductColorOption(c);

                  return (
                    <span key={c} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      <span
                        className="h-3 w-3 rounded-full border border-border"
                        style={{ backgroundColor: colorOption?.value || "#9ca3af" }}
                      />
                      {colorOption?.label || c}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold text-sm">Quantité :</span>
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-muted">
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-muted">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-11 flex-1 rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
              onClick={() => addItem({ id: produit.id, nom: produit.nom, prix: produit.prix || 0, image_url: imageUrl || "", quantite: quantity })}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Ajouter au panier
            </Button>
            <a href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="lg" variant="outline" className="h-11 w-full rounded-xl border-[hsl(142,70%,45%)] text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%)] hover:text-white">
                <MessageCircle className="mr-2 h-5 w-5" /> Commander via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Produits <span className="text-primary">similaires</span></h2>
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,260px))] sm:justify-start sm:gap-5">
            {similar.map((p) => <ProductCard key={p.id} produit={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
