import { useProduits } from "@/hooks/useProduits";
import { useCommandes } from "@/hooks/useCommandes";
import { useContacts } from "@/hooks/useContacts";
import { useDemandesPersonnalisation } from "@/hooks/usePersonnalisation";
import { Package, ShoppingCart, TrendingUp, MessageSquare, ClipboardList, Palette } from "lucide-react";

const AdminDashboard = () => {
  const { data: produits } = useProduits();
  const { data: commandes } = useCommandes();
  const { data: contacts } = useContacts();
  const { data: demandes } = useDemandesPersonnalisation();

  const count = produits?.length || 0;
  const commandesEnAttente = commandes?.filter((c) => c.statut === "en_attente").length || 0;
  const messagesNonLus = contacts?.filter((c) => !c.lu).length || 0;
  const demandesNouvelles = demandes?.filter((d) => d.statut === "nouvelle").length || 0;

  const categories = produits?.reduce((acc, p) => {
    acc[p.categorie] = (acc[p.categorie] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const totalRevenu = commandes
    ?.filter((c) => c.statut === "livree")
    .reduce((sum, c) => sum + c.total, 0) || 0;

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-card-foreground sm:mb-6 sm:text-2xl">Dashboard</h1>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:mb-8 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg"><Package className="h-6 w-6 text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total produits</p>
              <p className="text-3xl font-bold text-card-foreground">{count}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-lg"><ClipboardList className="h-6 w-6 text-orange-500" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Commandes en attente</p>
              <p className="text-3xl font-bold text-card-foreground">{commandesEnAttente}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg"><MessageSquare className="h-6 w-6 text-blue-500" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Messages non lus</p>
              <p className="text-3xl font-bold text-card-foreground">{messagesNonLus}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg"><Palette className="h-6 w-6 text-purple-500" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Demandes personnalisation</p>
              <p className="text-3xl font-bold text-card-foreground">{demandesNouvelles}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-lg"><TrendingUp className="h-6 w-6 text-accent" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Catégories</p>
              <p className="text-3xl font-bold text-card-foreground">{Object.keys(categories).length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg"><ShoppingCart className="h-6 w-6 text-green-500" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Revenu (livrées)</p>
              <p className="text-3xl font-bold text-card-foreground">{totalRevenu.toLocaleString()} FCFA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dernières commandes */}
      {commandes && commandes.length > 0 && (
        <div className="mb-6 rounded-xl border border-border bg-card p-4 sm:p-6">
          <h2 className="text-lg font-bold text-card-foreground mb-4">Dernières commandes</h2>
          <div className="space-y-3">
            {commandes.slice(0, 5).map((cmd) => (
              <div key={cmd.id} className="flex flex-col gap-2 border-b border-border pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:pb-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{cmd.nom_complet}</p>
                  <p className="break-words text-xs text-muted-foreground">{cmd.telephone} — {new Date(cmd.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                  <p className="text-sm font-bold text-primary">{cmd.total.toLocaleString()} FCFA</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    cmd.statut === "en_attente" ? "bg-orange-100 text-orange-700" :
                    cmd.statut === "confirmee" ? "bg-blue-100 text-blue-700" :
                    cmd.statut === "en_cours" ? "bg-yellow-100 text-yellow-700" :
                    cmd.statut === "livree" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {cmd.statut.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-bold text-card-foreground mb-4">Par catégorie</h2>
        <div className="space-y-3">
          {Object.entries(categories).map(([cat, count]) => (
            <div key={cat} className="flex items-start justify-between gap-4">
              <span className="min-w-0 break-words text-sm text-muted-foreground">{cat}</span>
              <span className="text-sm font-bold text-card-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
