import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProduits } from "@/hooks/useProduits";
import ProductCard from "@/components/ProductCard";
import CatalogPagination from "@/components/CatalogPagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/productOptions";

const categoriesList = ["Toutes", ...PRODUCT_CATEGORIES];
const PRODUCTS_PER_PAGE = 12;
const productsGridClass = "grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,260px))] sm:justify-start sm:gap-5";

const Boutique = () => {
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get("q") || "";
  const { data: produits, isLoading } = useProduits();
  const [categorie, setCategorie] = useState("Toutes");
  const [search, setSearch] = useState(querySearch);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSearch(querySearch);
  }, [querySearch]);

  const filtered = produits?.filter((p) => {
    const matchCat = categorie === "Toutes" || p.categorie === categorie;
    const matchSearch = !search || p.nom.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }) || [];

  useEffect(() => {
    setCurrentPage(1);
  }, [categorie, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-[1880px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10">
      <div className="mb-6 flex flex-col gap-3 lg:mb-8">
        <h1 className="text-2xl font-bold sm:text-4xl">Notre <span className="text-primary">Boutique</span></h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <p>
            {filtered.length} produit{filtered.length > 1 ? "s" : ""} trouve{filtered.length > 1 ? "s" : ""}
          </p>
          {filtered.length > 0 && totalPages > 1 && (
            <p>
              Page {safeCurrentPage} sur {totalPages}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px] xl:mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-xl pl-10"
          />
        </div>
        <Select value={categorie} onValueChange={setCategorie}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categoriesList.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className={productsGridClass}>
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="h-64 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/40 px-6 py-16 text-center text-muted-foreground">
          Aucun produit trouvé
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

export default Boutique;
