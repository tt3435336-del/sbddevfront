import { MessageCircle } from "lucide-react";
import { CONTACT_WHATSAPP_NUMBER } from "@/lib/contact";

const WhatsAppButton = () => {
  return (
    <a
      href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=Bonjour%2C%20je%20souhaite%20avoir%20des%20informations%20sur%20vos%20produits.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 rounded-full bg-[hsl(142,70%,45%)] p-3.5 text-white shadow-lg transition-transform hover:scale-105 hover:bg-[hsl(142,70%,40%)] sm:bottom-6 sm:right-6 sm:p-4"
      aria-label="Contacter via WhatsApp"
    >
      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
    </a>
  );
};

export default WhatsAppButton;
