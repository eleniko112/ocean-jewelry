import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { TRANSLATIONS } from '../constants';
import { cn } from '../lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { language, setUser } = useShop();
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const t = TRANSLATIONS[language].auth;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we simulate success
    setUser({
      uid: Math.random().toString(36).substr(2, 9),
      email: authMethod === 'email' ? email : null,
      displayName: isLogin ? 'User' : name
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ocean-deep/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-ocean-deep border border-pearl/5 rounded-[2.5rem] overflow-hidden shadow-2xl p-8 md:p-12"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 text-pearl/20 hover:text-pearl transition-all"
            >
              <X size={20} strokeWidth={1} />
            </button>

            <div className="space-y-10">
              <div className="space-y-4 text-center">
                <h2 className="display text-4xl font-light text-pearl italic uppercase tracking-tighter italic">
                  {isLogin ? t.loginTitle : t.signupTitle}
                </h2>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setAuthMethod('email')}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest transition-all pb-1 border-b",
                      authMethod === 'email' ? "text-ocean-wave border-ocean-wave" : "text-pearl/20 border-transparent"
                    )}
                  >
                    {t.email}
                  </button>
                  <button 
                    onClick={() => setAuthMethod('phone')}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest transition-all pb-1 border-b",
                      authMethod === 'phone' ? "text-ocean-wave border-ocean-wave" : "text-pearl/20 border-transparent"
                    )}
                  >
                    {t.phone}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-pearl/30 mx-4">Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-pearl/20" />
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full bg-black/20 border border-pearl/5 rounded-2xl px-14 py-4 text-pearl outline-none focus:border-ocean-wave transition-all serif italic"
                      />
                    </div>
                  </div>
                )}

                {authMethod === 'email' ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-pearl/30 mx-4">{t.email}</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-pearl/20" />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full bg-black/20 border border-pearl/5 rounded-2xl px-14 py-4 text-pearl outline-none focus:border-ocean-wave transition-all serif italic"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-pearl/30 mx-4">{t.phone}</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-pearl/20" />
                      <input 
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+995 ••• •• •• ••"
                        className="w-full bg-black/20 border border-pearl/5 rounded-2xl px-14 py-4 text-pearl outline-none focus:border-ocean-wave transition-all serif italic"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-pearl/30 mx-4">{t.password}</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-pearl/20" />
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/20 border border-pearl/5 rounded-2xl px-14 py-4 text-pearl outline-none focus:border-ocean-wave transition-all serif italic"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full h-16 bg-pearl text-ocean-deep font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl hover:bg-ocean-wave hover:text-white transition-all flex items-center justify-center gap-3 group"
                >
                  {isLogin ? t.login : t.signup}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[10px] font-bold uppercase tracking-widest text-pearl/40 hover:text-ocean-wave transition-all"
                >
                  {isLogin ? t.noAccount : t.haveAccount}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
