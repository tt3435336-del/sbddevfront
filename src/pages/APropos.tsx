import { ShieldCheck, Truck, Users, Award } from "lucide-react";

const APropos = () => {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">À <span className="text-primary">propos</span></h1>

      <div className="mb-10 max-w-3xl">
        <p className="mb-4 text-base leading-7 text-muted-foreground sm:text-lg">
          T.B.C est votre partenaire de confiance en équipements de protection individuelle (EPI) au Sénégal.
          Basée à Dakar, notre entreprise fournit des équipements de qualité certifiée aux professionnels et entreprises.
        </p>
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">
          Nous proposons une large gamme de casques anti-heurt, gilets haute visibilité, chaussures de sécurité et bien plus.
          Notre service de personnalisation vous permet d'ajouter votre logo sur vos équipements.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: ShieldCheck, title: "Qualité certifiée", desc: "Tous nos produits répondent aux normes CE de sécurité." },
          { icon: Truck, title: "Livraison rapide", desc: "Livraison en 24-48h à Dakar et dans tout le Sénégal." },
          { icon: Users, title: "Service client", desc: "Une équipe disponible via WhatsApp et téléphone." },
          { icon: Award, title: "Personnalisation", desc: "Impression de logo sur gilets et équipements." },
        ].map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 text-center sm:p-6">
            <item.icon className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APropos;
