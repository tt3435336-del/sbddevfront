export const CATEGORY_PRODUCT_IMAGES: Record<string, string[]> = {
  "Casques anti-heurt": [
    "/catalog/helmet-01.svg",
    "/catalog/helmet-02.svg",
  ],
  "Gilets haute visibilité": [
    "/catalog/vest-01.svg",
    "/catalog/vest-02.svg",
  ],
  "Chaussures de sécurité": [
    "/catalog/shoe-01.svg",
    "/catalog/shoe-02.svg",
  ],
  "Matelas gonflables": [
    "/catalog/mattress-01.svg",
    "/catalog/mattress-02.svg",
  ],
};

const DEFAULT_PRODUCT_IMAGE = CATEGORY_PRODUCT_IMAGES["Casques anti-heurt"][0];
const LEGACY_CATALOG_IMAGE_IDS = [
  "34965713",
  "15200454",
  "33630754",
  "9733798",
  "27771755",
  "30229920",
  "30229930",
  "30156647",
  "12955466",
  "5269467",
  "5269905",
];

const isLegacyCatalogImage = (imageUrl?: string | null) =>
  !!imageUrl && LEGACY_CATALOG_IMAGE_IDS.some((photoId) => imageUrl.includes(`/${photoId}/`));

export const isPlaceholderProductImage = (imageUrl?: string | null) =>
  !imageUrl || imageUrl.trim() === "" || imageUrl.includes("placeholder.svg");

export const getFallbackProductImage = (categorie?: string) =>
  (categorie ? CATEGORY_PRODUCT_IMAGES[categorie]?.[0] : undefined) || DEFAULT_PRODUCT_IMAGE;

export const resolveProductImage = (imageUrl?: string | null, categorie?: string) =>
  isPlaceholderProductImage(imageUrl) || isLegacyCatalogImage(imageUrl)
    ? getFallbackProductImage(categorie)
    : imageUrl;

export const getResolvedProductImages = (
  imageUrls?: string[] | null,
  imageUrl?: string | null,
  categorie?: string,
) => {
  const candidates = imageUrls?.length ? imageUrls : imageUrl ? [imageUrl] : [];
  const resolvedImages = candidates
    .map((candidate) => resolveProductImage(candidate, categorie))
    .filter((candidate): candidate is string => Boolean(candidate));
  const uniqueImages = Array.from(new Set(resolvedImages));

  return uniqueImages.length > 0 ? uniqueImages : [getFallbackProductImage(categorie)];
};

export const getPrimaryProductImage = (
  imageUrls?: string[] | null,
  imageUrl?: string | null,
  categorie?: string,
) => getResolvedProductImages(imageUrls, imageUrl, categorie)[0];
