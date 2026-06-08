import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type CatalogPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis-start" | "ellipsis-end"> = [1];
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 3) {
    endPage = 4;
  }

  if (currentPage >= totalPages - 2) {
    startPage = totalPages - 3;
  }

  if (startPage > 2) {
    pages.push("ellipsis-start");
  }

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page);
  }

  if (endPage < totalPages - 1) {
    pages.push("ellipsis-end");
  }

  pages.push(totalPages);

  return pages;
};

const CatalogPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: CatalogPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);
  const canGoToPrevious = currentPage > 1;
  const canGoToNext = currentPage < totalPages;

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) {
      return;
    }

    onPageChange(page);
  };

  return (
    <Pagination className={cn("pt-4", className)}>
      <PaginationContent className="flex-wrap justify-center gap-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (canGoToPrevious) {
                handlePageChange(currentPage - 1);
              }
            }}
            className={cn(
              "rounded-full border border-border bg-card px-4 text-sm",
              !canGoToPrevious && "pointer-events-none opacity-40",
            )}
          />
        </PaginationItem>

        {visiblePages.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {typeof page === "number" ? (
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(event) => {
                  event.preventDefault();
                  handlePageChange(page);
                }}
                className={cn(
                  "h-10 min-w-10 rounded-full border border-border bg-card px-3 text-sm",
                  page === currentPage && "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                )}
              >
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis className="h-10 w-10 rounded-full border border-transparent" />
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (canGoToNext) {
                handlePageChange(currentPage + 1);
              }
            }}
            className={cn(
              "rounded-full border border-border bg-card px-4 text-sm",
              !canGoToNext && "pointer-events-none opacity-40",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CatalogPagination;
