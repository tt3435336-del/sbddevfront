import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useCreerCommande } from "@/hooks/useCommandes";
import { CONTACT_WHATSAPP_NUMBER } from "@/lib/contact";
import { resolveProductImage } from "@/lib/productImages";

const modePaiementMap: Record<string, string> = {
  wave: "Wave Money",
  orange_money: "Orange Money",
  free_money: "Free Money",
  paiement_livraison: "Paiement à la livraison",
};

const Panier = () => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [quartier, setQuartier] = useState("");
  const [paiement, setPaiement] = useState("");
  const creerCommande = useCreerCommande();

  const handleCommander = async () => {
    if (!nom || !telephone || !adresse || !paiement) {
      toast({ title: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }

    try {
      // Sauvegarder la commande en base de données
      await creerCommande.mutateAsync({
        nom_complet: nom,
        telephone,
        adresse,
        quartier: quartier || undefined,
        mode_paiement: paiement,
        total,
        items: items.map((item) => ({
          produit_id: item.id,
          nom_produit: item.nom,
          prix_unitaire: item.prix,
          quantite: item.quantite,
          couleur: item.couleur,
          pointure: item.pointure,
        })),
      });

      // Envoyer aussi via WhatsApp
      const details = items.map((i) => `• ${i.nom} x${i.quantite} — ${(i.prix * i.quantite).toLocaleString()} FCFA`).join("\n");
      const msg = encodeURIComponent(
        `🛒 Nouvelle commande\n\n👤 ${nom}\n📱 ${telephone}\n📍 ${adresse}${quartier ? `, ${quartier}` : ""}\n💳 ${modePaiementMap[paiement] || paiement}\n\n📦 Produits :\n${details}\n\n💰 Total : ${total.toLocaleString()} FCFA`
      );
      window.open(`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${msg}`, "_blank");

      clearCart();
      toast({ title: "Commande passée avec succès !", description: "Vous recevrez une confirmation bientôt." });
      setNom(""); setTelephone(""); setAdresse(""); setQuartier(""); setPaiement("");
    } catch {
      toast({ title: "Erreur", description: "Impossible de passer la commande. Réessayez.", variant: "destructive" });
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <Link to="/boutique">
          <Button className="rounded-xl bg-primary hover:bg-primary/90">Découvrir nos produits</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Mon <span className="text-primary">Panier</span></h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={`${item.id}-${item.couleur}-${item.pointure}-${idx}`} className="flex gap-3 rounded-xl border border-border bg-card p-3 sm:gap-4 sm:p-4">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted p-1.5 sm:h-24 sm:w-24">
                <img src={resolveProductImage(item.image_url)} alt={item.nom} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 font-semibold">{item.nom}</h3>
                {item.couleur && <p className="text-xs text-muted-foreground">Couleur : {item.couleur}</p>}
                {item.pointure && <p className="text-xs text-muted-foreground">Pointure : {item.pointure}</p>}
                <p className="text-primary font-bold">{item.prix.toLocaleString()} FCFA</p>
                <div className="mt-2 flex items-center gap-2 sm:gap-3">
                  <button onClick={() => updateQuantity(item.id, item.quantite - 1)} className="grid h-8 w-8 place-items-center rounded border border-border hover:bg-muted"><Minus className="h-3 w-3" /></button>
                  <span className="font-semibold">{item.quantite}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantite + 1)} className="grid h-8 w-8 place-items-center rounded border border-border hover:bg-muted"><Plus className="h-3 w-3" /></button>
                  <button onClick={() => removeItem(item.id)} className="ml-auto grid h-8 w-8 place-items-center rounded text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order form */}
        <div className="h-fit space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold mb-2">Informations de livraison</h2>
          <Input className="h-11 rounded-xl" placeholder="Nom complet *" value={nom} onChange={(e) => setNom(e.target.value)} />
          <Input className="h-11 rounded-xl" placeholder="Téléphone *" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
          <Input className="h-11 rounded-xl" placeholder="Adresse *" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
          <Input className="h-11 rounded-xl" placeholder="Quartier" value={quartier} onChange={(e) => setQuartier(e.target.value)} />
          <Select value={paiement} onValueChange={setPaiement}>
            <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Mode de paiement *" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="wave">Wave Money</SelectItem>
              <SelectItem value="orange_money">Orange Money</SelectItem>
              <SelectItem value="free_money">Free Money</SelectItem>
              <SelectItem value="paiement_livraison">Paiement à la livraison</SelectItem>
            </SelectContent>
          </Select>

          <div className="border-t border-border pt-4">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total</span>
              <span className="text-primary">{total.toLocaleString()} FCFA</span>
            </div>
            <Button
              onClick={handleCommander}
              disabled={creerCommande.isPending}
              className="h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {creerCommande.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Passer la commande
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panier;
