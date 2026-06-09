import { ChangeEvent, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { uploadProductImage } from "@/lib/uploads";

export interface ProductPhotoDraft {
  id: string;
  name: string;
  url: string;
}

interface ProductPhotoPickerProps {
  photos: ProductPhotoDraft[];
  onChange: (photos: ProductPhotoDraft[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
  label?: string;
}

const MAX_PRODUCT_IMAGES = 8;
const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;

const createPhotoId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const ProductPhotoPicker = ({
  photos,
  onChange,
  onUploadingChange,
  label = "Photos du produit",
}: ProductPhotoPickerProps) => {
  const [uploading, setUploading] = useState(false);

  const updateUploading = (value: boolean) => {
    setUploading(value);
    onUploadingChange?.(value);
  };

  const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const availableSlots = MAX_PRODUCT_IMAGES - photos.length;
    if (availableSlots <= 0) {
      toast({
        title: "Limite atteinte",
        description: `Vous pouvez ajouter ${MAX_PRODUCT_IMAGES} photos au maximum.`,
        variant: "destructive",
      });
      return;
    }

    const acceptedFiles = files.slice(0, availableSlots);
    const oversizedFile = acceptedFiles.find((file) => file.size > MAX_PRODUCT_IMAGE_SIZE);

    if (oversizedFile) {
      toast({
        title: "Fichier trop volumineux",
        description: `La photo "${oversizedFile.name}" dépasse 5 Mo.`,
        variant: "destructive",
      });
      return;
    }

    if (files.length > availableSlots) {
      toast({
        title: "Certaines photos n'ont pas été ajoutées",
        description: `La limite est de ${MAX_PRODUCT_IMAGES} photos par produit.`,
      });
    }

    updateUploading(true);

    try {
      const nextPhotos = await Promise.all(
        acceptedFiles.map(async (file) => ({
          id: createPhotoId(),
          name: file.name,
          url: await uploadProductImage(file),
        })),
      );

      onChange([...photos, ...nextPhotos]);
    } catch (error) {
      toast({
        title: "Erreur upload image",
        description: error instanceof Error ? error.message : "Impossible de lire l'image.",
        variant: "destructive",
      });
    } finally {
      updateUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-card-foreground mb-2">{label}</label>
      <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-border p-3 transition-colors hover:border-primary sm:p-4">
        {uploading
          ? <Loader2 className="h-6 w-6 shrink-0 animate-spin text-primary" />
          : <ImagePlus className="h-6 w-6 shrink-0 text-muted-foreground" />}
        <span className="min-w-0 break-words text-sm text-muted-foreground">
          {uploading
            ? "Envoi des photos vers Cloudinary..."
            : photos.length > 0 ? "Ajouter d'autres photos" : "Choisir une ou plusieurs photos"}
        </span>
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple disabled={uploading} className="hidden" onChange={handleFilesChange} />
      </label>

      {photos.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className="group relative overflow-hidden rounded-lg border border-border bg-muted">
              <img src={photo.url} alt={photo.name} className="aspect-square w-full object-cover" />
              <button
                type="button"
                aria-label={`Retirer la photo ${index + 1}`}
                onClick={() => onChange(photos.filter((item) => item.id !== photo.id))}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground opacity-100 shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground sm:opacity-0 sm:group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-background/90 px-2 py-1 text-xs font-medium text-foreground">
                Photo {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPhotoPicker;
