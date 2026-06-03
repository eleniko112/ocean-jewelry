import { X, ShoppingCart, Heart, Star, Plus, Minus, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { useShop } from '../contexts/ShopContext';
import { TRANSLATIONS } from '../constants';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickView({ product, onClose }: QuickViewProps) {
  const { addToCart, toggleWishlist, wishlist, language, formatPrice } = useShop();
  const [quantity, setQuantity] = useState(1);
  const t = TRANSLATIONS[language];

  if (!product) return null;
  const isWishlisted = wishlist.includes(product.id);

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ocean-deep/80 backdrop-blur-md z-[200]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-5xl md:h-[80vh] glass-panel z-[201] overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:flex-row border-black/10"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-pearl/40 hover:text-pearl transition-colors z-[202] bg-ocean-deep/40 backdrop-blur-md rounded-full p-2"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Image section */}
            <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-auto flex-shrink-0 bg-black/5">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover mix-blend-luminosity brightness-110" referrerPolicy="no-referrer" />
            </div>

            {/* Details section */}
            <div className="flex-1 p-8 md:p-12 overflow-visible md:overflow-y-auto space-y-10 flex flex-col">
              <div className="space-y-6">
                <div className="flex gap-6 items-center">
                   <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-ocean-wave">{t.categories[product.category]}</span>
                   <div className="flex items-center gap-1 text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={cn(i < Math.floor(product.rating) ? "fill-current" : "text-pearl/10")} />
                      ))}
                   </div>
                </div>
                <h2 className="display text-4xl font-light text-pearl italic tracking-tighter leading-tight uppercase">{language === 'EN' && product.nameEn ? product.nameEn : product.name}</h2>
                <div className="flex items-baseline gap-6">
                  <span className="text-3xl serif font-light text-pearl">{formatPrice(product.price)}</span>
                  {product.oldPrice && <span className="text-sm text-pearl/20 line-through">{formatPrice(product.oldPrice)}</span>}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/20 border-b border-black/5 pb-2">{t.materials}</h4>
                <div className="flex flex-wrap gap-2">
                  {(language === 'EN' && product.materialsEn ? product.materialsEn : product.materials).map(m => (
                    <span key={m} className="px-3 py-1 bg-black/5 rounded-full text-[10px] serif italic text-pearl/60">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-pearl/40 text-sm leading-relaxed serif font-light italic">{language === 'EN' && product.descriptionEn ? product.descriptionEn : product.description}</p>

              <div className="space-y-8 pt-4 mt-auto">
                {product.stock > 0 && product.stock <= 5 && (
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold">
                    <Activity size={10} strokeWidth={2} className="animate-pulse" />
                    {t.stockLeft.replace('{n}', product.stock.toString())}
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 bg-black/5 px-4 rounded-xl h-14 border border-black/10">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                      className="text-pearl/40 hover:text-pearl transition-colors"
                      disabled={product.stock === 0}
                    >
                      <Minus size={14} strokeWidth={1.5} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center text-pearl">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} 
                      className="text-pearl/40 hover:text-pearl transition-colors"
                      disabled={product.stock === 0 || quantity >= product.stock}
                    >
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  </div>

                  <button 
                    disabled={product.stock === 0}
                    onClick={() => { addToCart(product.id, quantity); onClose(); }}
                    className="flex-1 h-14 bg-pearl text-ocean-deep font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-ocean-wave hover:text-white transition-all shadow-xl disabled:opacity-20"
                  >
                    {product.stock > 0 ? t.addToCart : t.outOfStock}
                  </button>
                  
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className={cn(
                      "w-14 h-14 glass-panel flex items-center justify-center transition-all border-black/10",
                      isWishlisted ? "bg-rose-500 border-none text-white shadow-lg shadow-rose-500/20" : "text-pearl hover:text-rose-500"
                    )}
                  >
                    <Heart size={20} strokeWidth={1.5} className={cn(isWishlisted && "fill-current")} />
                  </button>
                </div>
                
                <Link to={`/product/${product.id}`} onClick={onClose} className="block text-center text-[10px] uppercase font-bold tracking-[0.4em] text-pearl/20 hover:text-ocean-wave transition-colors">
                  {t.quickView} &rarr;
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
