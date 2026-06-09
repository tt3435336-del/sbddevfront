import { useRef } from "react";
import { Link } from "react-router-dom";
import { useProduits } from "@/hooks/useProduits";
import ProductCard from "@/components/ProductCard";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const HOME_PRODUCT_LIMIT = 12;

const Index = () => {
  const { data: produits, isLoading } = useProduits();
  const pageRef = useScrollFadeIn();
  const productsRef = useRef<HTMLElement | null>(null);
  const visibleProducts = (produits || []).slice(0, HOME_PRODUCT_LIMIT);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={pageRef}>
      <section className="relative bg-secondary overflow-hidden">
        <div className="mx-auto w-full max-w-[1880px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12 xl:px-10">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="mb-2 text-2xl font-bold leading-tight text-secondary-foreground sm:text-4xl lg:text-5xl">
              Équipements de sécurité
            </h1>
            <p className="mb-4 max-w-2xl text-sm leading-6 text-secondary-foreground/75 sm:text-base">
              Casques, gilets et chaussures livrés à Dakar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={scrollToProducts}
                className="h-10 rounded-xl bg-primary px-4 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Voir les produits <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section ref={productsRef} id="produits" className="scroll-mt-24 bg-muted/30 py-6 scroll-fade-in sm:py-8">
        <div className="mx-auto w-full max-w-[1880px] px-4 sm:px-6 lg:px-8 xl:px-10">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,260px))] sm:justify-start sm:gap-5 xl:gap-6">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="h-64 rounded-xl bg-card animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {visibleProducts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card/60 px-6 py-12 text-center text-sm text-muted-foreground">
                  Aucun produit disponible pour le moment.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,260px))] sm:justify-start sm:gap-5 xl:gap-6">
                    {visibleProducts.map((p) => (
                      <ProductCard key={p.id} produit={p} />
                    ))}
                  </div>
                  {(produits?.length || 0) > visibleProducts.length && (
                    <div className="mt-6">
                      <Link to="/boutique">
                        <Button variant="outline" className="w-full rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground sm:w-auto">
                          Voir plus de produits <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
