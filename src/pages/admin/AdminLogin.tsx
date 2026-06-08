import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HardHat, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Erreur de connexion", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <HardHat className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold text-secondary-foreground">
            T.B.<span className="text-primary">C</span>
          </span>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
          <h1 className="text-xl font-bold text-center mb-6 text-card-foreground">Espace Admin</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted"
            />
            <Input
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted"
            />
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
