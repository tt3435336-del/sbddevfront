import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useEnvoyerContact } from "@/hooks/useContacts";
import { CONTACT_PHONE_DISPLAY } from "@/lib/contact";

const Contact = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const envoyerContact = useEnvoyerContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !email || !message) {
      toast({ title: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }

    try {
      await envoyerContact.mutateAsync({ nom, email, message });
      toast({ title: "Message envoyé avec succès !", description: "Nous vous répondrons dans les plus brefs délais." });
      setNom(""); setEmail(""); setMessage("");
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer le message. Réessayez.", variant: "destructive" });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Nous <span className="text-primary">contacter</span></h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)] lg:gap-12">
        <div>
          <p className="mb-6 text-sm leading-6 text-muted-foreground sm:text-base">
            N'hésitez pas à nous contacter pour toute question sur nos produits ou pour passer une commande.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /><span>Dakar, Sénégal</span></div>
            <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /><span>{CONTACT_PHONE_DISPLAY}</span></div>
            <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /><span>contact@tbc.sn</span></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
          <Input className="h-11 rounded-xl" placeholder="Votre nom" value={nom} onChange={(e) => setNom(e.target.value)} />
          <Input className="h-11 rounded-xl" placeholder="Votre email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Textarea className="rounded-xl" placeholder="Votre message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
          <Button type="submit" disabled={envoyerContact.isPending} className="h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
            {envoyerContact.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Envoyer le message
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
