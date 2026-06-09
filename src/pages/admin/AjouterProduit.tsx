import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCreateProduit } from "@/hooks/useProduits";
import ProductColorPicker from "@/components/admin/ProductColorPicker";
import ProductPhotoPicker, { ProductPhotoDraft } from "@/components/admin/ProductPhotoPicker";
import { PRODUCT_BADGES, PRODUCT_CATEGORIES } from "@/lib/productOptions";

const AjouterProduit = () => {
  const navigate = useNavigate();
  const createProduit = useCreateProduit();
  const [loading, setLoading] = useState(false);
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [categorie, setCategorie] = useState("");
  const [couleurs, setCouleurs] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("Aucun");
  const [photos, setPhotos] = useState<ProductPhotoDraft[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !categorie) {
      toast({ title: "Nom et catégorie sont obligatoires", variant: "destructive" });
      return;
    }

    if (uploadingPhotos) {
      toast({ title: "Veuillez attendre la fin de l’envoi des photos" });
      return;
    }

    setLoading(true);
    const image_urls = photos.map((photo) => photo.url);

    try {
      await createProduit.mutateAsync({
        nom,
        prix: prix ? parseInt(prix) : 0,
        categorie,
        couleurs,
        description,
        badge,
        image_url: image_urls[0] || "",
        image_urls,
      });

      toast({ title: "Produit ajouté avec succès !" });
      navigate("/admin/produits");
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de créer le produit.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-4 text-xl font-bold text-card-foreground sm:mb-6 sm:text-2xl">Ajouter un produit</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
        <ProductPhotoPicker photos={photos} onChange={setPhotos} onUploadingChange={setUploadingPhotos} />

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">Nom du produit *</label>
          <Input value={nom} onChange={(e) => setNom(e.target.value)} className="bg-muted" />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">Prix (FCFA)</label>
          <Input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} className="bg-muted" />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">Catégorie *</label>
          <Select value={categorie} onValueChange={setCategorie}>
            <SelectTrigger className="bg-muted"><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
            <SelectContent>
              {PRODUCT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <ProductColorPicker value={couleurs} onChange={setCouleurs} />

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-muted" />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">Badge</label>
          <Select value={badge} onValueChange={setBadge}>
            <SelectTrigger className="bg-muted"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRODUCT_BADGES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={loading || uploadingPhotos} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          {loading || uploadingPhotos ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Ajouter le produit
        </Button>
      </form>
    </div>
  );
};

export default AjouterProduit;
