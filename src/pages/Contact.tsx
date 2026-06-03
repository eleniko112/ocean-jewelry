import React, { useState } from 'react';
import { useShop } from '../contexts/ShopContext';
import { TRANSLATIONS } from '../constants';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Contact() {
  const { cart, products, currency, language, clearCart } = useShop();
  const t = TRANSLATIONS[language];
  
  const [formData, setFormData] = useState({ name: '', address: '', email: '', phone: '', message: '' });
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [isOrdered, setIsOrdered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter((item): item is (typeof products[0] & { quantity: number }) => item !== null);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert(t.checkoutPage.cartEmpty);
    
    setIsLoading(true);
    // Simulate API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsOrdered(true);
    setIsLoading(false);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isOrdered) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-40 text-center space-y-12 bg-ocean-deep">
         <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-pearl text-ocean-deep rounded-full flex items-center justify-center mx-auto shadow-2xl"
         >
           <CheckCircle2 size={64} strokeWidth={1} />
         </motion.div>
         <div className="space-y-6">
           <h2 className="display text-5xl md:text-7xl font-light uppercase tracking-tighter italic text-pearl">{t.checkoutPage.orderSuccess}</h2>
           <p className="text-xl text-pearl/40 serif italic font-light max-w-lg mx-auto">
             {t.checkoutPage.orderSuccessSub}
           </p>
         </div>
         <button 
           onClick={() => setIsOrdered(false)}
           className="bg-pearl text-ocean-deep font-bold px-12 py-5 shadow-2xl hover:bg-ocean-wave hover:text-white transition-all uppercase tracking-[0.2em] text-xs"
         >
           {t.checkoutPage.backToHome}
         </button>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-ocean-deep">
      {/* Header */}
      <div className="bg-ocean-deep py-32 relative overflow-hidden mb-12 border-b border-black/5">
        <div className="absolute inset-x-0 bottom-0 top-0 opacity-5">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-pulse-slow" 
             style={{ background: 'radial-gradient(circle, var(--color-ocean-wave) 0%, transparent 70%)', filter: 'blur(100px)' }} 
           />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-6">
          <h1 className="display text-6xl md:text-8xl font-light uppercase tracking-tighter italic text-pearl">{t.checkout}</h1>
          <p className="max-w-2xl mx-auto text-pearl/40 serif italic font-light">
            {t.checkoutPage.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-16">
        {/* Form Container */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-8 glass-panel border-black/5 flex items-center gap-6 shadow-sm">
                <div className="w-12 h-12 bg-black/5 border border-black/10 rounded-full flex items-center justify-center text-ocean-wave">
                  <Phone size={20} strokeWidth={1} />
                </div>
                <div>
                   <h3 className="text-[10px] font-bold uppercase tracking-widest text-pearl/30">{t.checkoutPage.callUs}</h3>
                   <p className="serif text-pearl italic font-light">+995 555 12 34 56</p>
                </div>
             </div>
             <div className="p-8 glass-panel border-black/5 flex items-center gap-6 shadow-sm">
                <div className="w-12 h-12 bg-black/5 border border-black/10 rounded-full flex items-center justify-center text-ocean-wave">
                  <Mail size={20} strokeWidth={1} />
                </div>
                <div>
                   <h3 className="text-[10px] font-bold uppercase tracking-widest text-pearl/30">{t.checkoutPage.writeUs}</h3>
                   <p className="serif text-pearl italic font-light">order@oceanjewelry.ge</p>
                </div>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-panel p-12 border border-black/5 shadow-2xl space-y-12">
            <h2 className="display text-3xl font-light uppercase tracking-tighter italic text-pearl">{t.checkoutPage.infoTitle}</h2>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setContactMethod('email')}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-all pb-1 border-b",
                  contactMethod === 'email' ? "text-ocean-wave border-ocean-wave" : "text-pearl/20 border-transparent"
                )}
              >
                {t.auth.email}
              </button>
              <button 
                type="button"
                onClick={() => setContactMethod('phone')}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-all pb-1 border-b",
                  contactMethod === 'phone' ? "text-ocean-wave border-ocean-wave" : "text-pearl/20 border-transparent"
                )}
              >
                {t.auth.phone}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-pearl/30 ml-2">{t.checkoutPage.fullName}</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-black/5 border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-ocean-wave transition-all text-pearl serif italic"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-pearl/30 ml-2">
                  {contactMethod === 'email' ? t.auth.email : t.auth.phone}
                </label>
                <input 
                  required
                  type={contactMethod === 'email' ? 'email' : 'tel'}
                  className="w-full bg-black/5 border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-ocean-wave transition-all text-pearl serif italic"
                  value={contactMethod === 'email' ? formData.email : formData.phone}
                  onChange={e => setFormData({...formData, [contactMethod === 'email' ? 'email' : 'phone']: e.target.value})}
                  placeholder={contactMethod === 'email' ? 'email@example.com' : '+995 ••• •• •• ••'}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-pearl/30 ml-2">{t.checkoutPage.address}</label>
              <input 
                required
                type="text" 
                className="w-full bg-black/5 border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-ocean-wave transition-all text-pearl serif italic font-bold"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-pearl/30 ml-2">{t.checkoutPage.comment}</label>
              <textarea 
                rows={4}
                className="w-full bg-black/5 border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-ocean-wave transition-all resize-none text-pearl serif italic"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button 
              disabled={isLoading || cart.length === 0}
              className="w-full h-16 bg-pearl text-ocean-deep disabled:bg-pearl/10 disabled:text-pearl/20 font-bold flex items-center justify-center gap-4 transition-all shadow-xl hover:bg-ocean-wave hover:text-white uppercase tracking-[0.2em] text-xs"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-ocean-deep/30 border-t-ocean-deep rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} strokeWidth={1.5} />
                  {t.checkoutPage.placeOrder}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <aside className="space-y-8 h-fit sticky top-32">
          <div className="glass-panel p-10 border border-black/5 shadow-xl space-y-10">
            <h2 className="display text-2xl font-light uppercase tracking-tighter italic text-pearl border-b border-black/5 pb-6">{t.checkoutPage.summary}</h2>
            
            <div className="max-h-[400px] overflow-y-auto space-y-8 pr-2 scrollbar-none">
              {cartItems.length > 0 ? cartItems.map(item => (
                <div key={item.id} className="flex gap-6 group">
                  <div className="w-16 h-20 bg-black/5 border border-black/5 overflow-hidden">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="serif text-pearl italic font-light text-sm line-clamp-1">{item.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-pearl/20 mt-1">{item.quantity} {t.pcs}</p>
                    <p className="serif text-ocean-wave text-sm mt-1">{item.price * item.quantity} {currency}</p>
                  </div>
                </div>
              )) : (
                <p className="text-pearl/20 text-center py-6 serif italic">{t.emptyCart}</p>
              )}
            </div>

            <div className="pt-8 border-t border-black/5 space-y-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-pearl/30 text-[10px] uppercase tracking-widest">{t.total}</span>
                <span className="serif text-pearl">{total} {currency}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-pearl/30 text-[10px] uppercase tracking-widest">{t.checkoutPage.delivery}</span>
                <span className="text-ocean-wave serif italic">{t.checkoutPage.freeDelivery}</span>
              </div>
              <div className="flex justify-between items-center pt-8 border-t border-black/5">
                <span className="display text-xl font-light uppercase tracking-tighter italic text-pearl/40">{t.total}</span>
                <span className="serif text-4xl font-light text-pearl">{total} {currency}</span>
              </div>
            </div>
          </div>

          <div className="p-10 glass-panel border border-black/5 shadow-2xl space-y-6">
            <div className="flex gap-6">
               <MapPin className="text-ocean-wave flex-shrink-0" size={24} strokeWidth={1} />
               <p className="text-sm text-pearl/50 leading-relaxed serif italic">
                  <strong>{t.checkoutPage.showroomTitle}</strong> <br />
                  {t.checkoutPage.showroomInfo}
               </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
