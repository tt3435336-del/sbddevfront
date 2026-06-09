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
    <div className="min-h-screen min-w-0 bg-secondary dark">
      <nav className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-4 lg:h-16 lg:px-6">
          <Link to="/admin/dashboard" className="flex min-w-0 items-center gap-2">
          <HardHat className="h-6 w-6 text-primary" />
            <span className="truncate font-bold text-card-foreground">
              Admin <span className="text-primary">Panel</span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-card-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <span className="hidden max-w-52 truncate text-sm text-muted-foreground 2xl:block">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
              <span className="sr-only">Se déconnecter</span>
          </Button>
          </div>
        </div>
      </nav>

      <div className="sticky top-14 z-30 border-b border-border bg-card xl:hidden lg:top-16">
        <div className="mx-auto flex w-full max-w-[1600px] gap-1 overflow-x-auto px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1600px] min-w-0 p-3 sm:p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
