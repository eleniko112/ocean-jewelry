import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './contexts/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Customizer from './pages/Customizer';
import CartSidebar from './components/CartSidebar';
import WishlistSidebar from './components/WishlistSidebar';
import { useState } from 'react';

import AuthModal from './components/AuthModal';
import { useShop } from './contexts/ShopContext';
import WavesBackground from './components/WavesBackground';

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { isAuthModalOpen, setIsAuthModalOpen } = useShop();

  return (
    <Router>
      <div className="min-h-screen bg-ocean-deep text-pearl font-sans selection:bg-ocean-wave/30 selection:text-white relative">
        <WavesBackground />
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)} 
          onOpenWishlist={() => setIsWishlistOpen(true)} 
        />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/customizer" element={<Customizer />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <Footer />

        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </Router>
  );
}
