import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, HardHat, UserRoundCog } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { NavLink } from "@/components/NavLink";

const navigationItems = [
  { label: "Casques", path: "/casques" },
  { label: "Gilets", path: "/gilets" },
  { label: "Chaussures", path: "/chaussures" },
  { label: "Matelas", path: "/matelas" },
  { label: "Boutique", path: "/boutique" },
];

const Navbar = () => {
  const { itemCount, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/boutique?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/15 bg-[#171717]/95 shadow-lg backdrop-blur">
      <div className="mx-auto max-w-[1880px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex h-16 items-center justify-between gap-3 lg:h-[74px] lg:gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <HardHat className="h-7 w-7 text-primary lg:h-8 lg:w-8" />
            <span className="text-xl font-bold text-primary-foreground lg:text-2xl">
              T.B.<span className="text-primary">C</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center justify-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 max-w-sm rounded-full border-white/10 bg-secondary-foreground/8 pl-10 text-sm text-secondary-foreground placeholder:text-secondary-foreground/50 lg:max-w-md xl:max-w-lg"
              />
            </div>
          </form>

          <div className="hidden xl:flex items-center gap-1 2xl:gap-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="rounded-full border border-transparent px-3 py-2.5 text-sm font-semibold tracking-[0.01em] text-white transition-colors hover:border-white/15 hover:bg-white/10 hover:text-primary 2xl:px-4 2xl:text-base"
                activeClassName="border-primary/40 bg-primary/15 text-primary"
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/admin"
              className="hidden items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-sm font-semibold text-white transition-colors hover:border-primary/60 hover:bg-primary/15 hover:text-primary sm:flex lg:px-3.5 lg:py-2.5"
              aria-label="Accéder à l’espace admin"
            >
              <UserRoundCog className="h-5 w-5" />
              <span className="hidden xl:inline">Admin</span>
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="relative rounded-full p-2 text-white transition-colors hover:bg-white/10 hover:text-primary lg:p-2.5"
              aria-label="Ouvrir le panier"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className="rounded-full p-2 text-white transition-colors hover:bg-white/10 xl:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/10 py-4 xl:hidden">
            <form onSubmit={handleSearch} className="flex">
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 rounded-full border-white/10 bg-secondary-foreground/8 text-secondary-foreground placeholder:text-secondary-foreground/50"
              />
            </form>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-base font-semibold text-white transition-colors hover:border-primary/50 hover:text-primary"
                  activeClassName="border-primary/50 bg-primary/15 text-primary"
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/a-propos"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-base font-semibold text-white transition-colors hover:border-primary/50 hover:text-primary"
                activeClassName="border-primary/50 bg-primary/15 text-primary"
              >
                À propos
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-base font-semibold text-white transition-colors hover:border-primary/50 hover:text-primary"
                activeClassName="border-primary/50 bg-primary/15 text-primary"
              >
                Contact
              </NavLink>
              <NavLink
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-primary/20"
                activeClassName="border-primary bg-primary/20 text-primary"
              >
                <UserRoundCog className="h-5 w-5" />
                Espace admin
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
