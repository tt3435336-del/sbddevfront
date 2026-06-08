import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, HardHat } from "lucide-react";
import { CONTACT_PHONE_DISPLAY } from "@/lib/contact";

const Footer = () => {
  return (
    <footer className="bg-secondary pt-10 pb-6 text-secondary-foreground">
      <div className="mx-auto w-full max-w-[1880px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HardHat className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">T.B.<span className="text-primary">C</span></span>
            </div>
            <p className="max-w-sm text-sm leading-6 text-secondary-foreground/70">
              Votre partenaire en équipements de protection individuelle au Sénégal.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Catégories</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/casques" className="hover:text-primary transition-colors">Casques anti-heurt</Link></li>
              <li><Link to="/gilets" className="hover:text-primary transition-colors">Gilets haute visibilité</Link></li>
              <li><Link to="/chaussures" className="hover:text-primary transition-colors">Chaussures de sécurité</Link></li>
              <li><Link to="/matelas" className="hover:text-primary transition-colors">Matelas gonflables</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Liens utiles</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/boutique" className="hover:text-primary transition-colors">Boutique</Link></li>
              <li><Link to="/a-propos" className="hover:text-primary transition-colors">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/personnalisation" className="hover:text-primary transition-colors">Personnalisation</Link></li>
              <li><Link to="/admin" className="hover:text-primary transition-colors">Espace admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Contact</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Dakar, Sénégal</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {CONTACT_PHONE_DISPLAY}</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> contact@tbc.sn</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-6 text-center text-xs leading-6 text-secondary-foreground/50 sm:text-sm">
          <p>© {new Date().getFullYear()} T.B.C Sénégal. Tous droits réservés.</p>
          <p className="mt-1">Paiements acceptés : Wave • Orange Money • Free Money • À la livraison</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
