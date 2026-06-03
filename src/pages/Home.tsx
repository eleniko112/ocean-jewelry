import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, RotateCcw, Droplets } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { TRANSLATIONS } from '../constants';
import ProductCard from '../components/ProductCard';
import WaveSection from '../components/WaveSection';
import QuickView from '../components/QuickView';
import { useState } from 'react';
import { Product } from '../types';

export default function Home() {
  const { products, language, currency } = useShop();
  const t = TRANSLATIONS[language];
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const featuredProducts = products.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="bg-ocean-deep">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 bg-ocean-deep">
        {/* Glow Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] animate-pulse-slow opacity-5" 
            style={{ background: 'radial-gradient(circle, var(--color-ocean-wave) 0%, transparent 70%)', filter: 'blur(100px)' }} 
          />
        </div>

        <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="md:col-span-7 space-y-8"
          >
            <span className="badge-gold">{t.heroBadge}</span>
            <h1 className="display text-6xl md:text-8xl font-light text-pearl leading-tight tracking-tighter uppercase">
              {t.heroTitle}<br/>
              <span className="text-ocean-wave italic">{t.heroTitleHighlight}</span>
            </h1>
            <p className="text-xl text-pearl/50 serif font-light italic max-w-lg leading-relaxed">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-12 pt-8">
              <Link 
                to="/collection" 
                className="px-12 py-5 bg-pearl text-ocean-deep font-bold uppercase tracking-[0.2em] text-xs hover:bg-ocean-wave hover:text-white transition-all shadow-xl"
              >
                {t.collection}
              </Link>
              <div className="flex flex-col">
                 <span className="text-4xl serif font-light text-pearl">1,240 ₾</span>
                 <span className="text-sm opacity-20 line-through text-pearl">1,550 ₾</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="md:col-span-5 hidden lg:block relative h-[600px]"
          >
            <div className="absolute inset-0 glass-panel opacity-40 -rotate-3 translate-x-4 border-white/5" />
            <div className="absolute inset-0 glass-panel border-white/10 overflow-hidden">
               <img 
                 src="/src/assets/images/starfish_shell_earrings_1780467669639.png" 
                 className="w-full h-full object-cover mix-blend-luminosity brightness-110 contrast-125 hover:mix-blend-normal transition-all duration-1000"
                 referrerPolicy="no-referrer"
               />
            </div>
            <div className="absolute bottom-12 -left-12 glass-panel p-8 min-w-[280px] shadow-2xl z-20">
               <div className="star-rating text-gold flex gap-1 mb-2">
                 {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
               </div>
               <p className="text-xs uppercase tracking-widest opacity-40 mb-1">{t.featuredDesign}</p>
               <h3 className="serif text-xl">{t.featuredProductName}</h3>
            </div>
          </motion.div>
        </div>
      </section>

      <WaveSection />

      {/* Featured Grid */}
      <section className="py-40 px-12 relative bg-ocean-deep">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20 border-b border-pearl/5 pb-12">
            <h2 className="display text-5xl font-light text-pearl italic tracking-tighter">{t.bestSellers}</h2>
            <Link to="/collection" className="text-[10px] uppercase tracking-[0.3em] text-pearl/40 hover:text-ocean-wave transition-colors font-bold">
              {t.viewAll} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-32">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modern Grid layout for collections */}
      <section className="py-20 px-12">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
            <Link to="/collection?category=necklace" className="md:col-span-8 group relative h-[500px] rounded-3xl overflow-hidden glass-panel border-pearl/5">
               <img src="/src/assets/images/ocean_treasure_necklace_1780468061961.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep to-transparent opacity-60" />
               <div className="absolute bottom-12 left-12">
                  <h3 className="display text-4xl text-pearl mb-4 italic tracking-widest uppercase">{t.categories.necklace}</h3>
                  <span className="text-[10px] uppercase tracking-[0.5em] text-ocean-wave font-bold">{t.discoverMore}</span>
               </div>
            </Link>
            <Link to="/collection?category=ring" className="md:col-span-4 group relative h-[500px] rounded-3xl overflow-hidden glass-panel border-pearl/5">
               <img src="/src/assets/images/ocean_sea_life_stacked_rings_1780468810230.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep to-transparent opacity-60" />
               <div className="absolute bottom-12 left-12">
                  <h3 className="display text-3xl text-pearl mb-4 italic tracking-widest uppercase">{t.categories.ring}</h3>
                  <span className="text-[10px] uppercase tracking-[0.5em] text-ocean-wave font-bold">{t.discoverMore}</span>
               </div>
            </Link>
         </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="max-w-7xl mx-auto px-12 py-32">
        <div className="relative h-[600px] rounded-[3rem] overflow-hidden flex items-center justify-center text-center p-12 glass-panel border-white/5">
          <img 
            src="/src/assets/images/atlantis_crystal_tiara_1780467686297.png" 
            alt="Ocean" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" 
            referrerPolicy="no-referrer" 
          />
          <div className="relative z-10 max-w-2xl space-y-12">
            <h2 className="display text-5xl md:text-7xl font-light text-pearl italic tracking-tighter uppercase">{t.clubTitle}</h2>
            <p className="text-pearl/50 serif italic text-lg leading-relaxed">{t.clubSubtitle}</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t.emailPlaceholder}
                className="flex-1 bg-pearl/5 border border-pearl/10 rounded-2xl px-6 py-4 text-pearl outline-none focus:border-ocean-wave transition-all serif font-light italic placeholder:text-pearl/20"
              />
              <button className="bg-pearl text-ocean-deep px-10 py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-ocean-wave hover:text-white transition-all">
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewedProducts />

      <QuickView 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </div>
  );
}

function RecentlyViewedProducts() {
  const { recentlyViewed = [], products, language } = useShop();
  const t = TRANSLATIONS[language];
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (recentlyViewed.length === 0) return null;

  const viewedProducts = recentlyViewed
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => !!p);

  return (
    <section className="py-40 bg-black/5">
      <div className="max-w-7xl mx-auto px-12 space-y-20">
        <div className="flex justify-between items-end border-b border-black/5 pb-12">
          <h2 className="display text-4xl font-light text-pearl italic uppercase tracking-tighter">{t.recentlyViewed}</h2>
          <Link to="/collection" className="text-[10px] uppercase tracking-[0.3em] text-pearl/40 hover:text-ocean-wave transition-colors font-bold">
            {t.allProducts} &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {viewedProducts.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onQuickView={setQuickViewProduct} 
            />
          ))}
        </div>
      </div>
      <QuickView 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </section>
  );
}
