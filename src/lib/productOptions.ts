export const PRODUCT_CATEGORIES = [
  "Casques anti-heurt",
  "Gilets haute visibilité",
  "Chaussures de sécurité",
  "Matelas gonflables",
];

export const PRODUCT_BADGES = [
  "Aucun",
  "Nouveau",
  "Best seller",
  "Premium",
  "Personnalisable",
  "Pack",
  "Pack économique",
  "Marque Premium",
  "Confort+",
];

export const PRODUCT_COLOR_OPTIONS = [
  { label: "Orange", value: "#f97316" },
  { label: "Jaune", value: "#facc15" },
  { label: "Jaune fluo", value: "#d9f99d" },
  { label: "Noir", value: "#171717" },
  { label: "Blanc", value: "#ffffff" },
  { label: "Bleu", value: "#2563eb" },
  { label: "Bleu marine", value: "#1e3a8a" },
  { label: "Rouge", value: "#dc2626" },
  { label: "Gris", value: "#9ca3af" },
  { label: "Gris fonce", value: "#4b5563" },
  { label: "Vert", value: "#16a34a" },
  { label: "Argent", value: "#d1d5db" },
  { label: "Marron", value: "#92400e" },
  { label: "Kaki", value: "#78716c" },
  { label: "Beige", value: "#d6b98c" },
];

const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}){1,2}$/i;

export const parseProductColors = (couleurs?: string | string[] | null) => {
  if (Array.isArray(couleurs)) {
    return couleurs.map((couleur) => couleur.trim()).filter(Boolean);
  }

  return (couleurs || "")
    .split(",")
    .map((couleur) => couleur.trim())
    .filter(Boolean);
};

export const getProductColorOption = (label: string) => {
  const color = label.trim();

  if (HEX_COLOR_PATTERN.test(color)) {
    return { label: color.toUpperCase(), value: color };
  }

  return PRODUCT_COLOR_OPTIONS.find((option) => option.label.toLowerCase() === color.toLowerCase());
};
