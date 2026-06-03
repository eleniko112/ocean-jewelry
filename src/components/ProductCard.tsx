import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useShop } from '../contexts/ShopContext';
import { TRANSLATIONS } from '../constants';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  key?: string | number;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist, language, formatPrice } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const t = TRANSLATIONS[language];
  const isWishlisted = wishlist.includes(product.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group transition-all duration-500 flex flex-col border-b border-white/10 pb-6 product-card"
    >
      {/* Badges */}
      <div className="absolute top-4 left-0 z-10 flex flex-col gap-2">
        {product.oldPrice && <span className="bg-rose-500 text-white text-[8px] font-bold px-3 py-1.5 tracking-tighter">SALE</span>}
        {product.isNew && <span className="badge-gold">NEW</span>}
        {product.isBestSeller && <span className="badge-gold">BEST</span>}
        {product.isLimited && <span className="badge bg-ocean-wave text-white font-bold">LIMITED</span>}
      </div>

      {/* Image Area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-black/5 rounded-lg mb-6">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className={cn(
              "w-full h-full object-cover transition-transform duration-1000",
              isHovered ? "scale-110" : "scale-100"
            )}
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Quick Actions overlay */}
        <div className={cn(
          "absolute right-4 bottom-4 flex flex-col gap-2 transition-all duration-300",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <button 
             onClick={() => toggleWishlist(product.id)}
             className={cn(
               "w-10 h-10 glass-panel flex items-center justify-center transition-all hover:scale-110 shadow-2xl",
               isWishlisted ? "bg-rose-500 border-none text-white" : "text-pearl hover:text-rose-500"
             )}
          >
            <Heart size={18} strokeWidth={1.5} className={cn(isWishlisted && "fill-current")} />
          </button>
          <button 
            onClick={() => onQuickView?.(product)}
            className="w-10 h-10 glass-panel flex items-center justify-center transition-all hover:scale-110 shadow-2xl text-pearl hover:text-ocean-wave"
          >
            <Eye size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Info Area */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-pearl/40 uppercase tracking-widest">{t.categories[product.category]}</span>
          <div className="flex items-center gap-1">
             {[...Array(5)].map((_, i) => (
               <Star key={i} size={10} className={cn("transition-colors", i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-pearl/10")} />
             ))}
          </div>
        </div>
        
        <div className="flex justify-between items-end gap-4">
          <Link to={`/product/${product.id}`} className="text-sm font-medium hover:text-ocean-wave transition-colors line-clamp-1">
            {language === 'EN' && product.nameEn ? product.nameEn : product.name}
          </Link>
          <div className="flex flex-col items-end">
             {product.oldPrice && (
               <span className="text-[10px] text-pearl/20 line-through">{formatPrice(product.oldPrice)}</span>
             )}
             <span className="text-sm font-bold text-pearl">
               {formatPrice(product.price)}
             </span>
             {product.stock > 0 && product.stock <= 5 && (
                 <span className="text-[8px] font-bold text-gold uppercase mt-1 animate-pulse">
                   {t.stockLeft.replace('{n}', product.stock.toString())}
                 </span>
              )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-6">
           <button 
            onClick={() => onQuickView?.(product)}
            className="text-[10px] uppercase font-bold text-ocean-wave hover:opacity-80 transition-all underline underline-offset-4 decoration-ocean-wave/20"
           >
             {t.quickView}
           </button>
           <button 
             disabled={product.stock === 0}
             onClick={() => addToCart(product.id)}
             className="text-[10px] uppercase font-bold text-pearl/40 hover:text-pearl transition-all"
           >
             + {t.cart}
           </button>
        </div>
      </div>
    </motion.div>
  );
}
