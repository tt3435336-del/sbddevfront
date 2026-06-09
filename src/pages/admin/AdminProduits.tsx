import { useDeleteProduit, useProduits } from "@/hooks/useProduits";
import type { Produit } from "@/hooks/useProduits";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { getPrimaryProductImage } from "@/lib/productImages";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProductActionsProps {
  produit: Produit;
  deleting: string | null;
  onDelete: (id: string) => void;
}

const ProductActions = ({ produit, deleting, onDelete }: ProductActionsProps) => (
  <div className="flex items-center justify-end gap-2">
    <Link to={`/admin/produit/${produit.id}/modifier`}>
      <Button size="icon" variant="outline" className="h-9 w-9 text-muted-foreground hover:text-primary">
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Modifier {produit.nom}</span>
      </Button>
    </Link>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-9 w-9 text-muted-foreground hover:text-destructive">
          {deleting === produit.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          <span className="sr-only">Supprimer {produit.nom}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le produit "{produit.nom}" sera définitivement supprimé.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={() => onDelete(produit.id)} className="bg-destructive hover:bg-destructive/90">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);

const AdminProduits = () => {
  const { data: produits, isLoading } = useProduits();
  const deleteProduit = useDeleteProduit();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);

    try {
      await deleteProduit.mutateAsync(id);
      toast({ title: "Produit supprimé" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de supprimer le produit.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-card-foreground sm:text-2xl">Produits ({produits?.length || 0})</h1>
        <Link to="/admin/ajouter-produit">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">+ Ajouter</Button>
        </Link>
      </div>

      {!produits?.length ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Aucun produit pour le moment.
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {produits.map((p) => (
              <article key={p.id} className="rounded-xl border border-border bg-card p-3">
                <div className="flex gap-3">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img src={getPrimaryProductImage(p.image_urls, p.image_url, p.categorie)} alt={p.nom} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-2 font-semibold text-card-foreground">{p.nom}</h2>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{p.categorie}</p>
                    <p className="mt-1 text-sm font-bold text-primary">{p.prix ? `${p.prix.toLocaleString()} FCFA` : "Prix sur demande"}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="min-w-0 truncate text-xs text-muted-foreground">{p.badge || "Aucun badge"}</span>
                  <ProductActions produit={p} deleting={deleting} onDelete={handleDelete} />
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 text-muted-foreground font-medium">Image</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Nom</th>
                <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Catégorie</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Prix</th>
                <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Badge</th>
                <th className="text-right p-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits?.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3">
                    <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                      <img src={getPrimaryProductImage(p.image_urls, p.image_url, p.categorie)} alt={p.nom} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-3 text-card-foreground font-medium">{p.nom}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{p.categorie}</td>
                  <td className="p-3 text-primary font-semibold">{p.prix ? `${p.prix.toLocaleString()} FCFA` : "—"}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{p.badge}</td>
                  <td className="p-3">
                        <ProductActions produit={p} deleting={deleting} onDelete={handleDelete} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default AdminProduits;
