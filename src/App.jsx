import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Accueil from './pages/Accueil';
import GalerieType from './pages/GalerieType';
import Panier from './pages/Panier';
import Checkout from './pages/Checkout';
import TableauDetail from './pages/TableauDetail';
import Evenements from './pages/Evenements';
import MonParcours from './pages/MonParcours';
import AdminEvents from './pages/AdminEvents';
import AdminOrders from './pages/AdminOrders';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import MesCommandes from './pages/MesCommandes';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import ConditionsGeneralesVente from './pages/ConditionsGeneralesVente';
import PolitiqueCookies from './pages/PolitiqueCookies';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/footer.css';
import AdminArtworks from './pages/AdminArtworks';
import { CartProvider } from './context/CartContext';
import SimpleAnalytics from './services/SimpleAnalytics';
import { useEffect } from 'react';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Initialiser le tracking d'analytics
  useEffect(() => {
    const analytics = new SimpleAnalytics();
    analytics.init();
    
    // Stocker l'instance pour utilisation globale
    window.analytics = analytics;
  }, []);

  // Tracker les changements de route
  useEffect(() => {
    if (window.analytics) {
      window.analytics.trackPageView();
    }
  }, [location]);

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/galerie/:galleryType" element={<GalerieType />} />
        <Route path="/tableau/:id" element={<TableauDetail />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/mes-commandes" element={<MesCommandes />} />
        <Route path="/evenements" element={<Evenements />} />
        <Route path="/mon-parcours" element={<MonParcours />} />
        
        {/* Pages légales */}
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/conditions-generales-vente" element={<ConditionsGeneralesVente />} />
        <Route path="/politique-cookies" element={<PolitiqueCookies />} />
        
        {/* Routes d'administration non protégées */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Routes d'administration protégées */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/artworks" element={
          <ProtectedRoute>
            <AdminArtworks />
          </ProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedRoute>
            <AdminEvents />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        } />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}
