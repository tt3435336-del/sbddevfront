import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export interface DemandePersonnalisation {
  id: string;
  entreprise: string;
  telephone: string;
  details: string | null;
  logo_url: string | null;
  statut: string;
  created_at: string;
  updated_at: string;
}

export interface NouvelleDemandePersonnalisation {
  entreprise: string;
  telephone: string;
  details?: string;
  logo_url?: string;
}

export const useDemandesPersonnalisation = () => {
  return useQuery({
    queryKey: ["demandes_personnalisation"],
    queryFn: async () => {
      const response = await apiRequest<DemandePersonnalisation[]>("/api/admin/personnalisations", {
        auth: true,
      });
      return response.data;
    },
  });
};

export const useEnvoyerDemandePersonnalisation = () => {
  return useMutation({
    mutationFn: async (demande: NouvelleDemandePersonnalisation) => {
      await apiRequest("/api/personnalisations", {
        method: "POST",
        body: JSON.stringify(demande),
      });
    },
  });
};

export const useUpdateStatutDemande = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: string }) => {
      await apiRequest(`/api/admin/personnalisations/${id}/statut`, {
        method: "PATCH",
        body: JSON.stringify({ statut }),
        auth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demandes_personnalisation"] });
    },
  });
};
