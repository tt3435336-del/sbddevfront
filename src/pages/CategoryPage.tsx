import { useEffect, useState } from "react";
import { useProduits } from "@/hooks/useProduits";
import CatalogPagination from "@/components/CatalogPagination";
import ProductCard from "@/components/ProductCard";

const categorieMap: Record<string, string> = {
  casques: "Casques anti-heurt",
  gilets: "Gilets haute visibilité",
  chaussures: "Chaussures de sécurité",
  matelas: "Matelas gonflables",
};
const PRODUCTS_PER_PAGE = 12;
const productsGridClass = "grid grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fill,minmax(220px,260px))] sm:justify-start";

const CategoryPage = ({ slug }: { slug: string }) => {
  const categorie = categorieMap[slug] || slug;
  const { data: produits, isLoading } = useProduits(categorie);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [categorie]);

  const totalProducts = produits?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = produits?.slice(startIndex, startIndex + PRODUCTS_PER_PAGE) || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-[1880px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10">
      <div className="mb-6 flex flex-col gap-3 lg:mb-8">
        <h1 className="text-2xl font-bold sm:text-4xl">{categorie}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <p>
            {totalProducts} produit{totalProducts > 1 ? "s" : ""}
          </p>
          {totalProducts > 0 && totalPages > 1 && (
            <p>
              Page {safeCurrentPage} sur {totalPages}
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className={productsGridClass}>
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="h-64 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      ) : !produits?.length ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/40 px-6 py-16 text-center text-muted-foreground">
          Aucun produit dans cette catégorie
        </div>
      ) : (
        <>
          <div className={productsGridClass}>
            {paginatedProducts.map((p) => <ProductCard key={p.id} produit={p} />)}
          </div>
          <CatalogPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-8 lg:mt-10"
          />
        </>
      )}
    </div>
  );
};

export default CategoryPage;
