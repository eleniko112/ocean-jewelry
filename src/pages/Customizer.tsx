import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { TRANSLATIONS } from '../constants';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function Customizer() {
  const { language, addToCart, formatPrice } = useShop();
  const t = TRANSLATIONS[language].customizer;
  
  const [selectedBase, setSelectedBase] = useState<'necklace' | 'ring' | 'bracelet'>('necklace');
  const [selectedCharm, setSelectedCharm] = useState<'shell' | 'pearl' | 'coral'>('pearl');
  const [selectedMaterial, setSelectedMaterial] = useState<'silver' | 'gold' | 'rose'>('silver');

  const getBasePrice = () => {
    const prices = { necklace: 50, ring: 30, bracelet: 25 };
    return prices[selectedBase];
  };

  const getCharmPrice = () => {
    const prices = { shell: 15, pearl: 35, coral: 25 };
    return prices[selectedCharm];
  };

  const getMaterialMultiplier = () => {
    const multipliers = { silver: 1, gold: 2.5, rose: 2.2 };
    return multipliers[selectedMaterial];
  };

  const totalPrice = (getBasePrice() + getCharmPrice()) * getMaterialMultiplier();

  const handleAddToCart = () => {
    // Generate a temporary product for customization
    const customProduct = {
      id: `custom-${Date.now()}`,
      name: `${t.bases[selectedBase]} with ${t.charms[selectedCharm]}`,
      price: totalPrice,
      // In a real app we'd save this to a database
    };
    // For now we just add to cart (simplified)
    addToCart('5', 1); // Mock adding product 5 as a placeholder for now
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-pearl/40 hover:text-pearl transition-all mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase font-bold tracking-widest">{TRANSLATIONS[language].back}</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Preview Area */}
          <div className="relative aspect-square glass-panel border-white/5 rounded-[3rem] overflow-hidden group">
            <div className="absolute inset-0 z-0">
               <div className="w-full h-full" style={{ background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.1) 0%, transparent 70%)' }} />
            </div>
            
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <motion.div
                key={`${selectedBase}-${selectedCharm}-${selectedMaterial}`}
                initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="relative"
              >
                {/* Simplified visual representation */}
                <div className={cn(
                  "w-48 h-48 rounded-full border-4 transition-colors duration-500",
                  selectedMaterial === 'silver' ? "border-pearl/20" : 
                  selectedMaterial === 'gold' ? "border-gold/40" : "border-rose-400/40"
                )} />
                
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Sparkles size={48} className={cn(
                    "transition-colors duration-500",
                    selectedMaterial === 'silver' ? "text-pearl" : 
                    selectedMaterial === 'gold' ? "text-gold" : "text-rose-400"
                  )} strokeWidth={1} />
                </motion.div>
                
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ocean-wave mb-2">{t.selectedStyle}</p>
                  <p className="display text-2xl font-light text-pearl italic uppercase tracking-tighter">
                    {t.materials[selectedMaterial]} {t.bases[selectedBase]}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Controls Area */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="display text-6xl font-light text-pearl italic uppercase tracking-tighter leading-none">{t.title}</h1>
              <p className="text-pearl/40 font-light serif italic text-xl max-w-md">{t.subtitle}</p>
            </div>

            <div className="space-y-10">
              {/* Bases */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-pearl/30 ml-2">{t.base}</label>
                <div className="flex flex-wrap gap-4">
                  {(['necklace', 'ring', 'bracelet'] as const).map(base => (
                    <button
                      key={base}
                      onClick={() => setSelectedBase(base)}
                      className={cn(
                        "px-8 py-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                        selectedBase === base ? "bg-ocean-wave border-ocean-wave text-white shadow-xl" : "border-white/5 text-pearl/40 hover:border-pearl/20"
                      )}
                    >
                      {t.bases[base]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Charms */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-pearl/30 ml-2">{t.charm}</label>
                <div className="flex flex-wrap gap-4">
                  {(['shell', 'pearl', 'coral'] as const).map(charm => (
                    <button
                      key={charm}
                      onClick={() => setSelectedCharm(charm)}
                      className={cn(
                        "px-8 py-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                        selectedCharm === charm ? "bg-ocean-wave border-ocean-wave text-white shadow-xl" : "border-white/5 text-pearl/40 hover:border-pearl/20"
                      )}
                    >
                      {t.charms[charm]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-pearl/30 ml-2">{t.material}</label>
                <div className="flex flex-wrap gap-4">
                  {(['silver', 'gold', 'rose'] as const).map(mat => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(mat)}
                      className={cn(
                        "px-8 py-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                        selectedMaterial === mat ? "bg-ocean-wave border-ocean-wave text-white shadow-xl" : "border-white/5 text-pearl/40 hover:border-pearl/20"
                      )}
                    >
                      {t.materials[mat]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/20 mb-2">{t.totalEstimated}</span>
                <span className="serif text-4xl font-light text-pearl">{formatPrice(totalPrice)}</span>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="h-20 px-12 bg-pearl text-ocean-deep font-bold uppercase tracking-widest text-[10px] rounded-[2rem] shadow-2xl hover:bg-ocean-wave hover:text-white transition-all flex items-center gap-4 group"
              >
                <ShoppingBag size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                {t.addToBag}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
