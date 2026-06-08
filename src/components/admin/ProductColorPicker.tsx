import { useState } from "react";
import { Check, Palette, Plus, X } from "lucide-react";
import { getProductColorOption, PRODUCT_COLOR_OPTIONS } from "@/lib/productOptions";

interface ProductColorPickerProps {
  value: string[];
  onChange: (colors: string[]) => void;
  label?: string;
}

const ProductColorPicker = ({ value, onChange, label = "Couleur(s) disponible(s)" }: ProductColorPickerProps) => {
  const [customColor, setCustomColor] = useState("#ff6600");

  const toggleColor = (color: string) => {
    onChange(value.includes(color) ? value.filter((item) => item !== color) : [...value, color]);
  };

  const removeColor = (color: string) => {
    onChange(value.filter((item) => item !== color));
  };

  const addCustomColor = () => {
    const color = customColor.toUpperCase();
    const alreadySelected = value.some((item) => item.toLowerCase() === color.toLowerCase());

    if (!alreadySelected) {
      onChange([...value, color]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-card-foreground mb-2">{label}</label>
      <div className="grid gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-[180px_1fr]">
        <div className="space-y-3">
          <label className="relative block h-44 cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-inner">
            <span
              className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg"
              style={{
                background:
                  "conic-gradient(#ff0040, #ff8a00, #fff200, #34ff00, #00ffd5, #0077ff, #7a00ff, #ff00c8, #ff0040)",
              }}
            />
            <span
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,.95) 0 8%, rgba(255,255,255,.22) 9% 36%, rgba(0,0,0,.08) 58%, rgba(0,0,0,.28) 100%)",
              }}
            />
            <span
              className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-card shadow-xl"
              style={{ backgroundColor: customColor }}
            >
              <Palette className="h-5 w-5 text-white drop-shadow" />
            </span>
            <input
              type="color"
              value={customColor}
              onChange={(event) => setCustomColor(event.target.value)}
              aria-label="Choisir une couleur"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>

          <button
            type="button"
            onClick={addCustomColor}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        <div>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
            {PRODUCT_COLOR_OPTIONS.map((color) => {
              const selected = value.includes(color.label);

              return (
                <button
                  key={color.label}
                  type="button"
                  aria-label={color.label}
                  aria-pressed={selected}
                  title={color.label}
                  onClick={() => toggleColor(color.label)}
                  className={`relative h-11 rounded-lg border transition-all ${
                    selected
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/70 hover:ring-2 hover:ring-primary/15"
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  {selected && (
                    <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-card text-primary shadow">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {value.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {value.map((color) => {
                const colorOption = getProductColorOption(color);

                return (
                  <span
                    key={color}
                    className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-card-foreground"
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-border shadow-sm"
                      style={{ backgroundColor: colorOption?.value || "#9ca3af" }}
                    />
                    {colorOption?.label || color}
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      aria-label={`Retirer ${color}`}
                      className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductColorPicker;
