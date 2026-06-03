import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../contexts/ShopContext';
import { TRANSLATIONS } from '../constants';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart = [], products, removeFromCart, updateQuantity, language, formatPrice } = useShop();
  const t = TRANSLATIONS[language];

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter((item): item is (typeof products[0] & { quantity: number }) => item !== null);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
              <h2 className="display text-2xl font-light italic tracking-tighter text-pearl">{t.cart}</h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-pearl/40">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-pearl/20 text-center space-y-6">
                  <div className="w-32 h-32 rounded-full border border-dashed border-black/10 flex items-center justify-center">
                    <ShoppingCart size={48} strokeWidth={1} className="opacity-20 text-pearl" />
                  </div>
                  <p className="serif italic text-xl font-light text-pearl/40">{t.emptyCart}</p>
                  <button 
                    onClick={onClose}
                    className="text-ocean-wave font-bold uppercase tracking-[0.2em] text-[10px]"
                  >
                    {t.collection}
                  </button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-20 h-24 bg-black/5 overflow-hidden border border-black/5 flex-shrink-0">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <Link to={`/product/${item.id}`} onClick={onClose} className="serif text-lg font-light text-pearl italic hover:text-ocean-wave transition-colors line-clamp-1">{item.name}</Link>
                        <button onClick={() => removeFromCart(item.id)} className="text-pearl/20 hover:text-rose-500 transition-colors">
                          <Trash2 size={16} strokeWidth={1} />
                        </button>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-pearl/20 mb-auto">{item.category}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 bg-black/5 px-3 py-1 border border-black/10">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-pearl/40 hover:text-pearl transition-colors"
                          >
                            <Minus size={12} strokeWidth={1} />
                          </button>
                          <span className="text-[10px] font-bold w-4 text-center text-pearl">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-pearl/40 hover:text-pearl transition-colors"
                          >
                            <Plus size={12} strokeWidth={1} />
                          </button>
                        </div>
                        <span className="serif text-pearl">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-8 border-t border-black/5 space-y-8 bg-black/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-pearl/30">{t.total}</span>
                  <span className="serif text-3xl font-light text-pearl">{formatPrice(total)}</span>
                </div>
                <Link 
                  to="/contact" 
                  onClick={onClose}
                  className="w-full bg-pearl text-ocean-deep font-bold py-5 flex items-center justify-center shadow-xl hover:bg-ocean-wave hover:text-white transition-all uppercase tracking-[0.2em] text-[10px]"
                >
                  {t.checkout}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
