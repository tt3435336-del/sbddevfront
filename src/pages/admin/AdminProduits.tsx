import { useDeleteProduit, useProduits } from "@/hooks/useProduits";
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-card-foreground">Produits ({produits?.length || 0})</h1>
        <Link to="/admin/ajouter-produit">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">+ Ajouter</Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/produit/${p.id}/modifier`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            {deleting === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. Le produit "{p.nom}" sera définitivement supprimé.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-destructive hover:bg-destructive/90">
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProduits;
