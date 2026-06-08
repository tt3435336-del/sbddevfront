import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduit, useUpdateProduit } from "@/hooks/useProduits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { resolveProductImage } from "@/lib/productImages";
import ProductColorPicker from "@/components/admin/ProductColorPicker";
import ProductPhotoPicker, { ProductPhotoDraft } from "@/components/admin/ProductPhotoPicker";
import { parseProductColors, PRODUCT_BADGES, PRODUCT_CATEGORIES } from "@/lib/productOptions";

const ModifierProduit = () => {
  const { id } = useParams<{ id: string }>();
  const { data: produit, isLoading: loadingProduit } = useProduit(id!);
  const navigate = useNavigate();
  const updateProduit = useUpdateProduit();
  const [loading, setLoading] = useState(false);
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [categorie, setCategorie] = useState("");
  const [couleurs, setCouleurs] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("Aucun");
  const [photos, setPhotos] = useState<ProductPhotoDraft[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  useEffect(() => {
    if (produit) {
      setNom(produit.nom);
      setPrix(produit.prix?.toString() || "");
      setCategorie(produit.categorie);
      setCouleurs(parseProductColors(produit.couleurs));
      setDescription(produit.description || "");
      setBadge(produit.badge || "Aucun");
      setPhotos(
        (produit.image_urls?.length ? produit.image_urls : produit.image_url ? [produit.image_url] : [])
          .filter(Boolean)
          .map((imageUrl, index) => ({
            id: `existing-${produit.id}-${index}`,
            name: `Photo ${index + 1}`,
            url: resolveProductImage(imageUrl, produit.categorie) || imageUrl,
          })),
      );
    }
  }, [produit]);

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
      await updateProduit.mutateAsync({
        id: id!,
        payload: {
          nom,
          prix: prix ? parseInt(prix) : 0,
          categorie,
          couleurs,
          description,
          badge,
          image_url: image_urls[0] || "",
          image_urls,
        },
      });

      toast({ title: "Produit modifié avec succès !" });
      navigate("/admin/produits");
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de modifier le produit.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduit) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-card-foreground mb-6">Modifier le produit</h1>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <ProductPhotoPicker photos={photos} onChange={setPhotos} onUploadingChange={setUploadingPhotos} />

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">Nom *</label>
          <Input value={nom} onChange={(e) => setNom(e.target.value)} className="bg-muted" />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">Prix (FCFA)</label>
          <Input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} className="bg-muted" />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">Catégorie *</label>
          <Select value={categorie} onValueChange={setCategorie}>
            <SelectTrigger className="bg-muted"><SelectValue /></SelectTrigger>
            <SelectContent>{PRODUCT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
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
            <SelectContent>{PRODUCT_BADGES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={loading || uploadingPhotos} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          {loading || uploadingPhotos ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Enregistrer les modifications
        </Button>
      </form>
    </div>
  );
};

export default ModifierProduit;
