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
      <h1 className="mb-4 flex flex-wrap items-center gap-2 text-xl font-bold text-card-foreground sm:mb-6 sm:text-2xl">
        <span>Messages ({contacts?.length || 0})</span>
        {nonLus > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-sm text-primary-foreground">{nonLus} non lu{nonLus > 1 ? "s" : ""}</span>}
      </h1>

      {!contacts?.length ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
          Aucun message de contact.
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.id} className={`rounded-xl border bg-card p-4 sm:p-5 ${!c.lu ? "border-primary" : "border-border"}`}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {c.lu ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
                    <h3 className="font-bold text-card-foreground">{c.nom}</h3>
                    {!c.lu && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Nouveau</span>}
                  </div>
                  <p className="mb-2 break-all text-sm text-muted-foreground">{c.email}</p>
                  <p className="whitespace-pre-wrap break-words text-sm text-card-foreground">{c.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(c.created_at).toLocaleString("fr-FR")}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
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
