import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext';
import { DEMO_REVIEWS, TRANSLATIONS } from '../constants';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Star, ChevronLeft, ChevronRight, Plus, Minus, Share2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, language, addToRecentlyViewed, formatPrice } = useShop();
  const t = TRANSLATIONS[language];

  const product = products.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const isWishlisted = wishlist.includes(id || '');

  // Reviews for this product
  const reviews = DEMO_REVIEWS.filter(r => r.productId === id);

  // Recommendations
  const related = products.filter(p => p.category === product?.category && p.id !== id).slice(0, 4);

  // Recently Viewed Logic
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product.id);
    }
    window.scrollTo(0, 0);
  }, [product?.id, addToRecentlyViewed]);

  if (!product) {
    return (
      <div className="py-40 text-center animate-pulse">
        <h2 className="display text-4xl font-light text-pearl italic">{t.productNotFound}</h2>
        <Link to="/collection" className="text-ocean-wave font-bold mt-4 block uppercase tracking-widest text-xs">{t.collection}</Link>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-40 bg-ocean-deep">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-8 pt-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-pearl/40 hover:text-ocean-wave transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={1} />
          {t.back}
        </button>
      </div>

      {/* Product Main Section */}
      <section className="max-w-7xl mx-auto px-8 pt-24 grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Gallery */}
        <div className="space-y-8">
          <div className="relative aspect-[3/4] bg-black/5 rounded-[3rem] overflow-hidden shadow-2xl group border border-black/5">
             <AnimatePresence mode="wait">
               <motion.img 
                key={activeImage}
                src={product.images[activeImage]} 
                alt={product.name}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover mix-blend-luminosity brightness-110 contrast-110"
                referrerPolicy="no-referrer"
               />
             </AnimatePresence>
             
             {/* Navigation Overlay */}
             <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button 
                  onClick={() => setActiveImage(prev => (prev > 0 ? prev - 1 : product.images.length - 1))}
                  className="w-14 h-14 bg-black/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white pointer-events-auto hover:bg-ocean-wave transition-all border border-white/10"
                >
                  <ChevronLeft size={24} strokeWidth={1} />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => (prev < product.images.length - 1 ? prev + 1 : 0))}
                  className="w-14 h-14 bg-black/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white pointer-events-auto hover:bg-ocean-wave transition-all border border-white/10"
                >
                  <ChevronRight size={24} strokeWidth={1} />
                </button>
             </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-6 overflow-x-auto pb-4 justify-center">
            {product.images.map((img, i) => (
              <button 
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "w-20 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all duration-500",
                  activeImage === i ? "border-ocean-wave scale-110 shadow-2xl shadow-ocean-wave/20" : "border-white/5 opacity-40 hover:opacity-100"
                )}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col py-8 space-y-12">
          <div className="space-y-8">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">
               <span className="text-ocean-wave">{t.categories[product.category]}</span>
               <div className="flex items-center gap-2 bg-black/5 px-4 py-1.5 rounded-full border border-black/10 text-pearl">
                  <Star size={10} className="fill-gold text-gold" />
                  <span>{product.rating}</span>
               </div>
               <span>{reviews.length} {t.reviewsCount}</span>
            </div>

            <h1 className="display text-5xl md:text-8xl font-light text-pearl italic tracking-tighter leading-none uppercase">
              {language === 'EN' && product.nameEn ? product.nameEn : product.name}
            </h1>

            <div className="flex items-baseline gap-8">
              <span className="serif text-4xl font-light text-pearl">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="serif text-2xl text-pearl/10 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/20 border-b border-black/5 pb-4">{t.description}</h3>
              <p className="text-pearl/50 leading-relaxed text-lg serif italic font-light">
                {language === 'EN' && product.descriptionEn ? product.descriptionEn : product.description}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/20 border-b border-black/5 pb-4">{t.materials}</h3>
              <div className="flex flex-wrap gap-4">
                {(language === 'EN' && product.materialsEn ? product.materialsEn : product.materials).map(m => (
                  <span key={m} className="bg-black/5 border border-black/10 text-pearl/70 px-6 py-2 rounded-xl text-xs serif italic">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-12 space-y-8">
              <div className="flex flex-col gap-4">
                {product.stock > 0 && product.stock <= 5 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/5 px-6 py-3 rounded-xl border border-gold/10 w-fit"
                  >
                    <Activity size={12} strokeWidth={2} className="animate-pulse" />
                    {t.stockLeft.replace('{n}', product.stock.toString())}
                  </motion.div>
                )}

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-6 bg-black/5 px-6 rounded-2xl h-16 border border-black/10">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                      className="text-pearl/40 hover:text-pearl transition-colors"
                      disabled={product.stock === 0}
                    >
                      <Minus size={18} strokeWidth={1} />
                    </button>
                    <span className="text-xl font-bold w-8 text-center text-pearl">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} 
                      className="text-pearl/40 hover:text-pearl transition-colors"
                      disabled={product.stock === 0 || quantity >= product.stock}
                    >
                      <Plus size={18} strokeWidth={1} />
                    </button>
                  </div>

                  <button 
                    onClick={() => addToCart(product.id, quantity)}
                    disabled={product.stock === 0}
                    className="flex-1 h-16 bg-pearl text-ocean-deep font-bold uppercase tracking-[0.2em] text-xs hover:bg-ocean-wave hover:text-white transition-all shadow-xl disabled:opacity-20 disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <ShoppingCart size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                      {product.stock > 0 ? t.addToCart : t.outOfStock}
                    </div>
                  </button>

                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center border transition-all",
                      isWishlisted ? "bg-rose-500 text-white border-rose-500" : "border-black/10 hover:border-ocean-wave text-pearl/20 hover:text-ocean-wave"
                    )}
                  >
                    <Heart size={24} strokeWidth={1} className={cn(isWishlisted && "fill-current")} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                 <div className="flex items-center gap-6 p-6 glass-panel border-black/5 bg-white/5 rounded-[2rem] hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-ocean-wave/10 flex items-center justify-center text-ocean-wave">
                      <Truck size={24} strokeWidth={1} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-pearl/30">{t.shipping.title}</span>
                      <span className="text-sm text-pearl font-light serif italic mt-1">{t.shipping.standard}</span>
                      <span className="text-[10px] text-ocean-wave font-bold uppercase mt-1">{t.shipping.free}</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 p-6 glass-panel border-black/5 bg-white/5 rounded-[2rem] hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-ocean-wave/10 flex items-center justify-center text-ocean-wave">
                      <RotateCcw size={24} strokeWidth={1} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-pearl/30">{t.shipping.returns}</span>
                      <span className="text-sm text-pearl font-light serif italic mt-1">{t.easyReturns}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-8 space-y-20">
        <div className="flex justify-between items-end border-b border-black/5 pb-12">
           <h2 className="display text-4xl font-light text-pearl italic uppercase tracking-tighter">{t.reviews} ({reviews.length})</h2>
           <button className="text-[10px] font-bold uppercase tracking-widest text-pearl/40 hover:text-ocean-wave transition-colors">{t.writeReview} &rarr;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {reviews.length > 0 ? reviews.map(review => (
            <div key={review.id} className="p-12 glass-panel border-black/5 space-y-8 hover:bg-pearl/5 transition-colors">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full bg-ocean-wave/10 border border-ocean-wave/20 flex items-center justify-center font-bold text-ocean-wave">
                       {review.user[0]}
                    </div>
                    <div>
                       <h4 className="serif text-lg text-pearl font-light italic">{review.user}</h4>
                       <p className="text-[10px] text-pearl/20 uppercase tracking-widest leading-none mt-1">{review.date}</p>
                    </div>
                 </div>
                 <div className="flex gap-1 text-gold">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} size={12} className={cn(i < review.rating ? "fill-current" : "text-pearl/10")} />
                   ))}
                 </div>
              </div>
              <p className="text-pearl/40 leading-relaxed italic serif font-light">{review.comment}</p>
            </div>
          )) : (
            <p className="text-pearl/20 py-12 serif italic">{t.noReviews}</p>
          )}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-8 space-y-20">
          <div className="text-center">
            <h2 className="display text-4xl font-light text-pearl italic uppercase tracking-tighter">{t.relatedProducts}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
