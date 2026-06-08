import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export interface Contact {
  id: string;
  nom: string;
  email: string;
  message: string;
  lu: boolean;
  created_at: string;
}

export interface NouveauContact {
  nom: string;
  email: string;
  message: string;
}

export const useContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const response = await apiRequest<Contact[]>("/api/admin/contacts", { auth: true });
      return response.data;
    },
  });
};

export const useEnvoyerContact = () => {
  return useMutation({
    mutationFn: async (contact: NouveauContact) => {
      await apiRequest("/api/contacts", {
        method: "POST",
        body: JSON.stringify(contact),
      });
    },
  });
};

export const useMarquerContactLu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/admin/contacts/${id}/read`, {
        method: "PATCH",
        auth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/admin/contacts/${id}`, {
        method: "DELETE",
        auth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
