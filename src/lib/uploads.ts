import { apiRequest } from "@/lib/api";

interface ProductUploadSignature {
  apiKey: string;
  cloudName: string;
  signature: string;
  uploadParams: Record<string, string | number>;
}

interface CloudinaryUploadResponse {
  error?: {
    message?: string;
  };
  secure_url?: string;
}

export const uploadProductImage = async (file: File) => {
  const signatureResponse = await apiRequest<ProductUploadSignature>("/api/admin/uploads/product-signature", {
    method: "POST",
    auth: true,
  });
  const { apiKey, cloudName, signature, uploadParams } = signatureResponse.data;
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  Object.entries(uploadParams).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const payload = await response.json() as CloudinaryUploadResponse;

  if (!response.ok || !payload.secure_url) {
    throw new Error(payload.error?.message || "Impossible d’envoyer l’image.");
  }

  return payload.secure_url;
};

export const uploadPersonalizationLogo = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest<{ url: string }>("/api/uploads/personalization-logo", {
    method: "POST",
    body: formData,
  });

  return response.data.url;
};
