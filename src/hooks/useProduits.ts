import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export interface Produit {
  id: string;
  nom: string;
  prix: number;
  categorie: string;
  couleurs: string;
  description: string;
  badge: string;
  image_url: string;
  image_urls: string[];
  date_ajout: string;
  updated_at: string;
}

export interface ProduitPayload {
  nom: string;
  prix: number;
  categorie: string;
  couleurs?: string | string[];
  description?: string;
  badge?: string;
  image_url?: string;
  image_urls?: string[];
}

export const useProduits = (categorie?: string) => {
  return useQuery({
    queryKey: ["produits", categorie],
    queryFn: async () => {
      const search = categorie ? `?categorie=${encodeURIComponent(categorie)}` : "";
      const response = await apiRequest<Produit[]>(`/api/produits${search}`);
      return response.data;
    },
  });
};

export const useProduit = (id: string) => {
  return useQuery({
    queryKey: ["produit", id],
    queryFn: async () => {
      const response = await apiRequest<Produit>(`/api/produits/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ProduitPayload) => {
      const response = await apiRequest<Produit>("/api/admin/produits", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produits"] });
    },
  });
};

export const useUpdateProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<ProduitPayload> }) => {
      const response = await apiRequest<Produit>(`/api/admin/produits/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        auth: true,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["produits"] });
      queryClient.invalidateQueries({ queryKey: ["produit", variables.id] });
    },
  });
};

export const useDeleteProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/admin/produits/${id}`, {
        method: "DELETE",
        auth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produits"] });
    },
  });
};
