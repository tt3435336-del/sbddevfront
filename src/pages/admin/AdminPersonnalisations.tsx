import { useDemandesPersonnalisation, useUpdateStatutDemande } from "@/hooks/usePersonnalisation";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const statuts = [
  { value: "nouvelle", label: "Nouvelle" },
  { value: "en_cours", label: "En cours" },
  { value: "terminee", label: "Terminée" },
  { value: "annulee", label: "Annulée" },
];

const AdminPersonnalisations = () => {
  const { data: demandes, isLoading } = useDemandesPersonnalisation();
  const updateStatut = useUpdateStatutDemande();

  const handleStatutChange = async (id: string, statut: string) => {
    try {
      await updateStatut.mutateAsync({ id, statut });
      toast({ title: "Statut mis à jour" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-card-foreground mb-6">Demandes de personnalisation ({demandes?.length || 0})</h1>

      {!demandes?.length ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
          Aucune demande de personnalisation.
        </div>
      ) : (
        <div className="space-y-4">
          {demandes.map((d) => (
            <div key={d.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-card-foreground">{d.entreprise}</h3>
                  <p className="text-sm text-muted-foreground">{d.telephone}</p>
                  <p className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleString("fr-FR")}</p>
                </div>
                <Select value={d.statut} onValueChange={(val) => handleStatutChange(d.id, val)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuts.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {d.details && <p className="text-sm text-card-foreground mb-2">{d.details}</p>}
              {d.logo_url && (
                <div className="mt-2">
                  <img src={d.logo_url} alt="Logo" className="h-20 w-20 object-contain rounded border border-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPersonnalisations;
