import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, Moon, Sun, Menu, X, Music, Volume2, VolumeX, Globe } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { TRANSLATIONS } from '../constants';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export default function Navbar({ onOpenCart, onOpenWishlist }: NavbarProps) {
  const { 
    language, 
    theme, 
    toggleTheme, 
    currency, 
    setCurrency, 
    setLanguage, 
    cart = [], 
    wishlist = [],
    user,
    setIsAuthModalOpen,
    logout,
    isSoundEnabled,
    setIsSoundEnabled
  } = useShop();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const t = TRANSLATIONS[language];

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.soundjay.com/nature/ocean-wave-1.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.2;
    }
    if (isSoundEnabled) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("User must interact first"));
    }
    setIsSoundEnabled(!isSoundEnabled);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ocean-deep/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-12 h-24 flex items-center justify-between">
        {/* Mobile menu toggle */}
        <button 
          className="lg:hidden p-2 text-pearl/70"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 group text-center lg:text-left">
          <h1 className="display text-xl lg:text-2xl font-light tracking-[0.2em] text-pearl">
            {t.logoPart1} <span className="text-ocean-wave">{t.logoPart2}</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8 ml-8">
          <Link to="/" className="text-[13px] font-medium text-pearl/70 hover:text-ocean-wave transition-colors uppercase tracking-[0.1em]">{t.home}</Link>
          <Link to="/collection" className="text-[13px] font-medium text-pearl/70 hover:text-ocean-wave transition-colors uppercase tracking-[0.1em]">{t.collection}</Link>
          <Link to="/customizer" className="text-[13px] font-medium text-ocean-wave hover:text-pearl transition-colors uppercase tracking-[0.1em] font-bold">{t.customizer.title}</Link>
          <Link to="/contact" className="text-[13px] font-medium text-pearl/70 hover:text-ocean-wave transition-colors uppercase tracking-[0.1em]">{t.contact}</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {/* Currency Switcher */}
          <div className="hidden xl:flex items-center gap-2 text-[10px] uppercase opacity-60 font-bold tracking-widest border-r border-white/10 pr-6">
            <button onClick={() => setCurrency('₾')} className={cn(currency === '₾' && "text-ocean-wave")}>₾</button>
            <span className="opacity-20">/</span>
            <button onClick={() => setCurrency('$')} className={cn(currency === '$' && "text-ocean-wave")}>$</button>
            <span className="opacity-20">/</span>
            <button onClick={() => setCurrency('€')} className={cn(currency === '€' && "text-ocean-wave")}>€</button>
          </div>

          <div className="flex gap-5 items-center">
            <button onClick={toggleMusic} className="p-2 text-pearl/40 hover:text-ocean-wave transition-colors hidden md:block">
              {isSoundEnabled ? <Volume2 size={20} strokeWidth={1.5} className="text-ocean-wave" /> : <VolumeX size={20} strokeWidth={1.5} />}
            </button>

            <button onClick={toggleTheme} className="p-2 text-pearl/40 hover:text-ocean-wave transition-colors hidden md:block">
              {theme === 'light' ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
            </button>

            <button onClick={() => setLanguage(language === 'KA' ? 'EN' : 'KA')} className="flex items-center gap-2 p-2 text-pearl/40 hover:text-ocean-wave transition-colors hidden md:block group">
              <Globe size={18} strokeWidth={1.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:block group-hover:text-ocean-wave">{language}</span>
            </button>

            <button onClick={onOpenWishlist} className="relative group">
              <Heart size={20} strokeWidth={1.5} className={cn("transition-colors", wishlist.length > 0 ? "fill-rose-500 text-rose-500" : "text-pearl hover:text-ocean-wave")} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button onClick={onOpenCart} className="relative flex items-center gap-3 px-4 py-2 glass-panel hover:bg-white/10 transition-colors group">
              <ShoppingCart size={20} strokeWidth={1.5} className="text-pearl group-hover:text-ocean-wave transition-colors" />
              <span className="text-xs font-bold">{cartCount}</span>
            </button>

            {user ? (
              <div className="relative group/user">
                <button className="flex items-center gap-3 p-2 text-ocean-wave font-bold text-[10px] uppercase tracking-widest hover:text-pearl transition-all">
                  <User size={18} strokeWidth={1.5} />
                  <span className="hidden xl:block">{user.displayName || user.email?.split('@')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 glass-panel shadow-2xl p-4 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all">
                  <Link to="/admin" className="block w-full text-left p-3 text-[10px] uppercase tracking-widest text-pearl/60 hover:text-ocean-wave hover:bg-white/5 rounded-xl transition-all font-bold">
                    {t.adminLabel}
                  </Link>
                  <button 
                    onClick={() => logout()}
                    className="block w-full text-left p-3 text-[10px] uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all font-bold"
                  >
                    {t.auth.logout}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="p-2 text-pearl/40 hover:text-ocean-wave transition-colors"
              >
                <User size={18} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-24 left-0 right-0 bg-ocean-deep border-b border-white/5 p-8 flex flex-col gap-8 shadow-2xl z-50 overflow-hidden"
          >
            {/* Mobile Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
               <div className="w-full h-full" style={{ background: 'radial-gradient(circle at top, var(--color-ocean-wave) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            </div>

            <div className="relative z-10 flex flex-col gap-6">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="display text-3xl font-light text-pearl italic tracking-tighter">{t.home}</Link>
              <Link to="/collection" onClick={() => setIsMenuOpen(false)} className="display text-3xl font-light text-pearl italic tracking-tighter">{t.collection}</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="display text-3xl font-light text-pearl italic tracking-tighter">{t.contact}</Link>
              <div className="flex flex-wrap gap-8 pt-8 border-t border-black/5">
                 <button onClick={toggleTheme} className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-[0.2em] text-pearl/40 hover:text-ocean-wave transition-colors">
                   {theme === 'light' ? <Moon size={16} strokeWidth={1.5} /> : <Sun size={16} strokeWidth={1.5} />}
                   {t.theme}: {theme}
                 </button>
                 <button onClick={() => setLanguage(language === 'KA' ? 'EN' : 'KA')} className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-[0.2em] text-pearl/40 hover:text-ocean-wave transition-colors">
                   <Globe size={16} strokeWidth={1.5} />
                   {t.language}: {language}
                 </button>
              </div>
              <div className="flex gap-4 p-2 glass-panel border-white/5 rounded-2xl">
                 {['₾', '$', '€'].map((c) => (
                   <button 
                     key={c}
                     onClick={() => setCurrency(c as any)}
                     className={cn(
                       "flex-1 text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all",
                       currency === c ? "bg-ocean-wave text-white shadow-lg shadow-ocean-wave/20" : "text-pearl/40 hover:text-pearl hover:bg-white/5"
                     )}
                   >
                     {c}
                   </button>
                 ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
