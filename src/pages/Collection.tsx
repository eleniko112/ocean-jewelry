import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext';
import { TRANSLATIONS } from '../constants';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import { Search, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Category, Product } from '../types';

export default function Collection() {
  const { products, language, currency } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const t = TRANSLATIONS[language];

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>(
    (searchParams.get('category') as any) || 'all'
  );
  const [sortBy, setSortBy] = useState<'newest' | 'priceLow' | 'priceHigh'>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
        const matchesSearch = 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'priceLow') return a.price - b.price;
        if (sortBy === 'priceHigh') return b.price - a.price;
        // For 'newest', we assume the current order is newest to oldest, 
        // to implement properly we'd need a date field, but for now we'll just return items as is
        // Or we could reverse if we assume INITIAL_PRODUCTS are oldest first
        return 0;
      });
  }, [products, activeCategory, searchQuery, priceRange, sortBy]);

  const categories = Object.entries(t.categories);

  return (
    <div className="min-h-screen pb-32 bg-ocean-deep">
      {/* Header */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-24 text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-pulse-slow" 
             style={{ background: 'radial-gradient(circle, var(--color-ocean-wave) 0%, transparent 70%)', filter: 'blur(100px)' }} 
           />
        </div>
        <div className="max-w-7xl mx-auto px-12 relative z-10 space-y-8">
          <span className="badge-gold">{t.fullCatalog}</span>
          <h1 className="display text-6xl md:text-8xl font-light text-pearl italic tracking-tighter uppercase">{t.collection}</h1>
          <p className="max-w-2xl mx-auto text-pearl/40 serif italic font-light leading-relaxed">
            {t.collectionSubtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-20">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block space-y-16 h-fit sticky top-40">
          {/* Categories */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30 border-b border-black/5 pb-4">{t.categoriesLabel}</h3>
            <div className="flex flex-col gap-4">
              {categories.map(([key, label]) => (
                <button 
                  key={key}
                  onClick={() => setActiveCategory(key as any)}
                  className={cn(
                    "text-left group transition-all serif italic text-lg",
                    activeCategory === key 
                      ? "text-ocean-wave font-bold" 
                      : "text-pearl/40 hover:text-pearl"
                  )}
                >
                  <span className="relative">
                    {label}
                    <motion.div 
                      initial={false}
                      animate={{ width: activeCategory === key ? '100%' : '0%' }}
                      className="absolute -bottom-1 left-0 h-[1px] bg-ocean-wave"
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-black/5 pb-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">{t.priceRange}</h3>
              <button 
                onClick={() => setPriceRange([0, 1000])}
                className="text-[8px] uppercase tracking-widest text-ocean-wave hover:opacity-100 opacity-40 transition-opacity"
              >
                {t.reset}
              </button>
            </div>
            <div className="space-y-6">
              <input 
                type="range" 
                min="0" 
                max="1000" 
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-ocean-wave bg-black/5 rounded-none h-[1px] appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-baseline">
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase tracking-widest text-pearl/20 mb-1">{t.min}</span>
                  <span className="serif italic text-pearl/40">0 {currency}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] uppercase tracking-widest text-pearl/20 mb-1">{t.max}</span>
                  <span className="serif italic text-ocean-wave text-lg">{priceRange[1]} {currency}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="space-y-12">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-8 justify-between items-center border-b border-black/5 pb-10">
            <div className="relative w-full md:w-96 group">
              <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-pearl/20 group-focus-within:text-ocean-wave transition-colors" />
              <input 
                type="text" 
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-transparent border-none outline-none text-pearl placeholder:text-pearl/20 serif font-light italic text-lg"
              />
            </div>

            <div className="flex items-center gap-12">
              <div className="flex items-center gap-4">
                 {[
                   { id: 'newest', label: t.sort.newest },
                   { id: 'priceLow', label: t.sort.priceLow },
                   { id: 'priceHigh', label: t.sort.priceHigh }
                 ].map(s => (
                   <button 
                     key={s.id}
                     onClick={() => setSortBy(s.id as any)}
                     className={cn(
                       "text-[10px] uppercase tracking-widest transition-all",
                       sortBy === s.id ? "text-ocean-wave font-bold" : "text-pearl/40 hover:text-pearl"
                     )}
                   >
                     {s.label}
                   </button>
                 ))}
              </div>
              <div className="text-[10px] uppercase tracking-widest opacity-20 hidden md:block">
                {filteredProducts.length} {t.results}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-8">
              <div className="w-32 h-32 glass-panel border-black/5 flex items-center justify-center">
                <Search size={40} className="text-pearl/10" strokeWidth={1} />
              </div>
              <div className="space-y-4">
                <h3 className="serif text-3xl font-light italic">{t.noItemsFound}</h3>
                <p className="text-pearl/40 serif italic">{t.tryFilters}</p>
              </div>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setPriceRange([0, 1000]);
                }}
                className="text-ocean-wave font-bold uppercase tracking-widest text-[10px] hover:opacity-60 transition-all border-b border-ocean-wave/20 pb-1"
              >
                {t.clearFilters}
              </button>
            </div>
          )}
        </div>
      </div>

      <QuickView 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />

      {/* Recently Viewed */}
      <RecentlyViewed />
    </div>
  );
}

function RecentlyViewed() {
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
