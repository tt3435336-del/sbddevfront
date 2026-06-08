import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Plus, List, LogOut, HardHat, ClipboardList, MessageSquare, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Produits", path: "/admin/produits", icon: List },
  { label: "Ajouter", path: "/admin/ajouter-produit", icon: Plus },
  { label: "Commandes", path: "/admin/commandes", icon: ClipboardList },
  { label: "Messages", path: "/admin/messages", icon: MessageSquare },
  { label: "Perso.", path: "/admin/personnalisations", icon: Palette },
];

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-secondary dark">
      {/* Admin Navbar */}
      <nav className="bg-card border-b border-border px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardHat className="h-6 w-6 text-primary" />
          <span className="font-bold text-card-foreground">Admin <span className="text-primary">Panel</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden lg:block text-sm text-muted-foreground">{user?.email}</span>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hidden md:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-card-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="md:hidden flex border-b border-border bg-card">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex-1 flex items-center justify-center gap-1 py-3 text-xs font-medium ${
              location.pathname === item.path ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>

      <main className="p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
