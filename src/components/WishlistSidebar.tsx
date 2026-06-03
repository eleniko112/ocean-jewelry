import { X, Heart, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../contexts/ShopContext';
import { TRANSLATIONS } from '../constants';
import { Link } from 'react-router-dom';

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistSidebar({ isOpen, onClose }: WishlistSidebarProps) {
  const { wishlist = [], products, toggleWishlist, addToCart, language, formatPrice } = useShop();
  const t = TRANSLATIONS[language];

  const wishlistItems = wishlist.map(id => products.find(p => p.id === id)).filter((p): p is typeof products[0] => p !== undefined);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-ocean-deep z-[101] shadow-2xl flex flex-col border-l border-black/5"
          >
            <div className="p-8 border-b border-black/5 flex items-center justify-between">
              <h2 className="display text-2xl font-light italic tracking-tighter text-pearl">{t.wishlist}</h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-pearl/40">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {wishlistItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-pearl/20 text-center space-y-6">
                  <Heart size={48} strokeWidth={1} className="opacity-10 text-pearl" />
                  <p className="serif italic text-xl font-light text-pearl/40">{t.emptyWishlist}</p>
                </div>
              ) : (
                wishlistItems.map(item => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-20 h-24 bg-black/5 overflow-hidden border border-black/5 flex-shrink-0">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <Link to={`/product/${item.id}`} onClick={onClose} className="serif text-lg font-light text-pearl italic hover:text-ocean-wave transition-colors line-clamp-1">{item.name}</Link>
                        <button onClick={() => toggleWishlist(item.id)} className="text-rose-500 hover:scale-110 transition-transform">
                          <Heart size={16} fill="currentColor" />
                        </button>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-pearl/20 mb-auto">{item.category}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="serif text-pearl">{formatPrice(item.price)}</span>
                        <button 
                          onClick={() => {
                            addToCart(item.id);
                            toggleWishlist(item.id);
                          }}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ocean-wave hover:opacity-60 transition-all"
                        >
                          <ShoppingCart size={14} strokeWidth={1.5} />
                          {t.cart}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
