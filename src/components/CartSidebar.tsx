import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { resolveProductImage } from "@/lib/productImages";

const CartSidebar = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col p-4 sm:p-6">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold">Panier ({itemCount})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Votre panier est vide</p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-border pb-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted p-1.5">
                    <img src={resolveProductImage(item.image_url)} alt={item.nom} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.nom}</p>
                    <p className="text-sm text-primary font-semibold">
                      {item.prix.toLocaleString()} FCFA
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantite - 1)} className="grid h-8 w-8 place-items-center rounded border border-border hover:bg-muted">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantite}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantite + 1)} className="grid h-8 w-8 place-items-center rounded border border-border hover:bg-muted">
                        <Plus className="h-3 w-3" />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto grid h-8 w-8 place-items-center rounded text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{total.toLocaleString()} FCFA</span>
              </div>
              <Link to="/panier" onClick={() => setIsOpen(false)}>
                <Button className="h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                  Voir le panier
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
