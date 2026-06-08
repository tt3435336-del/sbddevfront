import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";

import ClientLayout from "@/components/ClientLayout";
import AdminGuestRoute from "@/components/admin/AdminGuestRoute";
import AdminRoute from "@/components/admin/AdminRoute";
import Index from "./pages/Index";
import Boutique from "./pages/Boutique";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Panier from "./pages/Panier";
import Personnalisation from "./pages/Personnalisation";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AjouterProduit from "./pages/admin/AjouterProduit";
import AdminProduits from "./pages/admin/AdminProduits";
import ModifierProduit from "./pages/admin/ModifierProduit";
import AdminCommandes from "./pages/admin/AdminCommandes";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminPersonnalisations from "./pages/admin/AdminPersonnalisations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Client routes */}
              <Route element={<ClientLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/boutique" element={<Boutique />} />
                <Route path="/casques" element={<CategoryPage slug="casques" />} />
                <Route path="/gilets" element={<CategoryPage slug="gilets" />} />
                <Route path="/chaussures" element={<CategoryPage slug="chaussures" />} />
                <Route path="/matelas" element={<CategoryPage slug="matelas" />} />
                <Route path="/produit/:id" element={<ProductDetail />} />
                <Route path="/panier" element={<Panier />} />
                <Route path="/personnalisation" element={<Personnalisation />} />
                <Route path="/a-propos" element={<APropos />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Admin routes */}
              <Route
                path="/admin/login"
                element={
                  <AdminGuestRoute>
                    <AdminLogin />
                  </AdminGuestRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="ajouter-produit" element={<AjouterProduit />} />
                <Route path="produits" element={<AdminProduits />} />
                <Route path="produit/:id/modifier" element={<ModifierProduit />} />
                <Route path="commandes" element={<AdminCommandes />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="personnalisations" element={<AdminPersonnalisations />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
