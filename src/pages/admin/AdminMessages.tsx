import { useContacts, useMarquerContactLu, useDeleteContact } from "@/hooks/useContacts";
import { Loader2, Mail, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminMessages = () => {
  const { data: contacts, isLoading } = useContacts();
  const marquerLu = useMarquerContactLu();
  const deleteContact = useDeleteContact();

  const handleMarquerLu = async (id: string) => {
    try {
      await marquerLu.mutateAsync(id);
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact.mutateAsync(id);
      toast({ title: "Message supprimé" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const nonLus = contacts?.filter((c) => !c.lu).length || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-card-foreground mb-6">
        Messages ({contacts?.length || 0})
        {nonLus > 0 && <span className="ml-2 text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{nonLus} non lu{nonLus > 1 ? "s" : ""}</span>}
      </h1>

      {!contacts?.length ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
          Aucun message de contact.
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.id} className={`bg-card border rounded-xl p-5 ${!c.lu ? "border-primary" : "border-border"}`}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {c.lu ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
                    <h3 className="font-bold text-card-foreground">{c.nom}</h3>
                    {!c.lu && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Nouveau</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{c.email}</p>
                  <p className="text-sm text-card-foreground whitespace-pre-wrap">{c.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(c.created_at).toLocaleString("fr-FR")}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!c.lu && (
                    <Button size="sm" variant="outline" onClick={() => handleMarquerLu(c.id)}>
                      Marquer lu
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce message ?</AlertDialogTitle>
                        <AlertDialogDescription>Le message de "{c.nom}" sera définitivement supprimé.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(c.id)} className="bg-destructive hover:bg-destructive/90">
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
