import { useCommandes, useUpdateStatutCommande } from "@/hooks/useCommandes";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const statuts = [
  { value: "en_attente", label: "En attente", color: "bg-orange-100 text-orange-700" },
  { value: "confirmee", label: "Confirmée", color: "bg-blue-100 text-blue-700" },
  { value: "en_cours", label: "En cours", color: "bg-yellow-100 text-yellow-700" },
  { value: "livree", label: "Livrée", color: "bg-green-100 text-green-700" },
  { value: "annulee", label: "Annulée", color: "bg-red-100 text-red-700" },
];

const modePaiementLabels: Record<string, string> = {
  wave: "Wave",
  orange_money: "Orange Money",
  free_money: "Free Money",
  paiement_livraison: "Paiement à la livraison",
};

const AdminCommandes = () => {
  const { data: commandes, isLoading } = useCommandes();
  const updateStatut = useUpdateStatutCommande();

  const handleStatutChange = async (id: string, statut: string) => {
    try {
      await updateStatut.mutateAsync({ id, statut });
      toast({ title: "Statut mis à jour" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le statut", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-card-foreground sm:mb-6 sm:text-2xl">Commandes ({commandes?.length || 0})</h1>

      {!commandes?.length ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
          Aucune commande pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {commandes.map((cmd) => (
            <div key={cmd.id} className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <h3 className="font-bold text-card-foreground">{cmd.nom_complet}</h3>
                  <p className="break-words text-sm text-muted-foreground">{cmd.telephone}</p>
                  <p className="text-xs text-muted-foreground">{new Date(cmd.created_at).toLocaleString("fr-FR")}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
                  <p className="whitespace-nowrap text-lg font-bold text-primary">{cmd.total.toLocaleString()} FCFA</p>
                  <Select value={cmd.statut} onValueChange={(val) => handleStatutChange(cmd.id, val)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuts.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1 break-words text-sm text-muted-foreground">
                <p><strong>Adresse :</strong> {cmd.adresse}{cmd.quartier ? `, ${cmd.quartier}` : ""}</p>
                <p><strong>Paiement :</strong> {modePaiementLabels[cmd.mode_paiement] || cmd.mode_paiement}</p>
                {cmd.notes && <p><strong>Notes :</strong> {cmd.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCommandes;
