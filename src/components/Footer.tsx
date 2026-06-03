import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { TRANSLATIONS } from '../constants';

export default function Footer() {
  const { language } = useShop();
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-ocean-deep border-t border-black/5 py-24 px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-24 opacity-60">
        <div className="space-y-6">
          <h2 className="display text-2xl font-light tracking-widest text-pearl uppercase">
            {t.logoPart1} <span className="text-ocean-wave">{t.logoPart2}</span>
          </h2>
          <p className="max-w-xs text-[10px] uppercase tracking-[0.2em] leading-loose text-pearl">
            {t.footerDesc}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-24">
          <div className="space-y-4">
             <h4 className="text-[10px] font-bold text-pearl uppercase tracking-[0.4em] mb-6">{t.collection}</h4>
             <ul className="space-y-4 text-[10px] uppercase tracking-[0.2em] text-pearl">
               {Object.entries(t.categories).slice(0, 4).map(([key, label]) => (
                 <li key={key}><Link to="/collection" className="hover:text-ocean-wave transition-colors">{label}</Link></li>
               ))}
             </ul>
          </div>

          <div className="space-y-4">
             <h4 className="text-[10px] font-bold text-pearl uppercase tracking-[0.4em] mb-6">{t.help}</h4>
             <ul className="space-y-4 text-[10px] uppercase tracking-[0.2em] text-pearl">
               <li><span className="cursor-pointer hover:text-ocean-wave transition-colors">{t.exchange}</span></li>
               <li><span className="cursor-pointer hover:text-ocean-wave transition-colors">{t.privacy}</span></li>
               <li><span className="cursor-pointer hover:text-ocean-wave transition-colors">{t.shippingLabel}</span></li>
             </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.4em] opacity-40 text-pearl">
        <div>{t.footerPromo}</div>
        <div className="flex gap-12 items-center mt-6 md:mt-0">
          <span>© {new Date().getFullYear()} {t.logoPart1} {t.logoPart2}</span>
          <div className="flex gap-4">
             <Instagram size={14} strokeWidth={1} />
             <Facebook size={14} strokeWidth={1} />
             <Twitter size={14} strokeWidth={1} />
          </div>
        </div>
      </div>
    </footer>
  );
}
