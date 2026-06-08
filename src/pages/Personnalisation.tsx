import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEnvoyerDemandePersonnalisation } from "@/hooks/usePersonnalisation";
import { uploadPersonalizationLogo } from "@/lib/uploads";

const Personnalisation = () => {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [details, setDetails] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const envoyerDemande = useEnvoyerDemandePersonnalisation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !telephone) {
      toast({ title: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }

    setLoading(true);
    let logo_url = "";

    if (logo) {
      if (logo.size > 5 * 1024 * 1024) {
        toast({ title: "Fichier trop volumineux", description: "La taille maximale est de 5 Mo.", variant: "destructive" });
        setLoading(false);
        return;
      }

      try {
        logo_url = await uploadPersonalizationLogo(logo);
      } catch (error) {
        toast({
          title: "Erreur upload logo",
          description: error instanceof Error ? error.message : "Impossible de lire le fichier.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    try {
      await envoyerDemande.mutateAsync({
        entreprise: nom,
        telephone,
        details: details || undefined,
        logo_url: logo_url || undefined,
      });

      toast({ title: "Demande envoyée avec succès !", description: "Nous vous contacterons bientôt." });
      setNom(""); setTelephone(""); setDetails(""); setLogo(null);
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer la demande. Réessayez.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Personnalisation <span className="text-primary">Gilets</span></h1>
      <p className="mb-6 text-sm leading-6 text-muted-foreground sm:text-base">Ajoutez votre logo sur les gilets haute visibilité.</p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
        <Input className="h-11 rounded-xl" placeholder="Nom / Entreprise *" value={nom} onChange={(e) => setNom(e.target.value)} />
        <Input className="h-11 rounded-xl" placeholder="Téléphone *" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
        <Textarea className="rounded-xl" placeholder="Détails (nombre de gilets, couleurs, emplacement logo...)" value={details} onChange={(e) => setDetails(e.target.value)} />

        <div>
          <label className="block text-sm font-medium mb-2">Votre logo</label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border p-4 transition-colors hover:border-primary sm:p-6">
            <Upload className="h-7 w-7 shrink-0 text-muted-foreground sm:h-8 sm:w-8" />
            <div className="min-w-0">
              <p className="text-sm font-medium">{logo ? logo.name : "Cliquez pour uploader votre logo"}</p>
              <p className="text-xs text-muted-foreground">PNG, JPG ou SVG (max 5 Mo)</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
          </label>
        </div>

        <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Envoyer la demande
        </Button>
      </form>
    </div>
  );
};

export default Personnalisation;
