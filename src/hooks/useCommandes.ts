import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export interface CommandeItem {
  produit_id: string;
  nom_produit: string;
  prix_unitaire: number;
  quantite: number;
  couleur?: string;
  pointure?: string;
}

export interface NouvelleCommande {
  nom_complet: string;
  telephone: string;
  adresse: string;
  quartier?: string;
  mode_paiement: string;
  total: number;
  notes?: string;
  items: CommandeItem[];
}

export interface Commande {
  id: string;
  nom_complet: string;
  telephone: string;
  adresse: string;
  quartier: string | null;
  mode_paiement: string;
  statut: string;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useCommandes = () => {
  return useQuery({
    queryKey: ["commandes"],
    queryFn: async () => {
      const response = await apiRequest<Commande[]>("/api/admin/commandes", { auth: true });
      return response.data;
    },
  });
};

export const useCommande = (id: string) => {
  return useQuery({
    queryKey: ["commande", id],
    queryFn: async () => {
      const response = await apiRequest<Commande & { items: CommandeItem[] }>(`/api/admin/commandes/${id}`, {
        auth: true,
      });
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreerCommande = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commande: NouvelleCommande) => {
      const response = await apiRequest<Commande>("/api/commandes", {
        method: "POST",
        body: JSON.stringify(commande),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
    },
  });
};

export const useUpdateStatutCommande = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: string }) => {
      await apiRequest(`/api/admin/commandes/${id}/statut`, {
        method: "PATCH",
        body: JSON.stringify({ statut }),
        auth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
    },
  });
};
