import React, { useState } from 'react';
import { useShop } from '../contexts/ShopContext';
import { Plus, Trash2, Edit3, X, Save, Box, ShoppingBag, TrendingUp, Users, Lock, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category } from '../types';
import { cn } from '../lib/utils';
import { TRANSLATIONS } from '../constants';

export default function Admin() {
  const { products, setProducts, currency, language } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const t = TRANSLATIONS[language];

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const processFiles = async (files: File[]) => {
    const base64Promises = files.map(file => {
      if (!file.type.startsWith('image/')) {
        alert('Only image files (JPEG, PNG, WEBP, SVG) are supported');
        return null;
      }
      if (file.size > 800000) {
        if (!confirm(`The image "${file.name}" is larger than 800KB. Large Base64 images may exceed browser LocalStorage quotas. We recommend compressing it first. Would you like to proceed anyway?`)) {
          return null;
        }
      }
      return convertToBase64(file);
    });

    const results = await Promise.all(base64Promises);
    const validBase64 = results.filter((r): r is string => r !== null);

    if (validBase64.length > 0) {
      setFormData(prev => {
        const currentImages = prev.images ? [...prev.images] : [];
        const filteredCurrent = currentImages.filter(img => img && img.trim() !== '');
        return {
          ...prev,
          images: [...filteredCurrent, ...validBase64]
        };
      });
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files) as File[];
      await processFiles(files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      await processFiles(files);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ocean123') { // admin password
      setIsAuthenticated(true);
      setError('');
    } else {
      setError(t.admin.wrongPassword);
    }
  };

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'necklace',
    price: 0,
    description: '',
    materials: [],
    images: ['https://picsum.photos/seed/new/800/1000'],
    stock: 5,
    keywords: [],
    rating: 5,
    reviewsCount: 0
  });

  const handleDelete = (id: string) => {
    if (confirm(t.admin.deleteConfirm)) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...formData } as Product : p));
    } else {
      const newProduct: Product = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Product;
      setProducts(prev => [newProduct, ...prev]);
    }
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'necklace',
      price: 0,
      description: '',
      materials: [],
      images: ['https://picsum.photos/seed/new/800/1000'],
      stock: 5,
      keywords: [],
      rating: 5,
      reviewsCount: 0
    });
  };

  const startEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsAdding(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8 bg-ocean-deep pt-32 relative">
        {/* Animated Background Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ocean-wave/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md glass-panel p-12 border border-white/5 space-y-10 relative z-10"
        >
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="w-20 h-20 rounded-[2rem] bg-ocean-wave/10 flex items-center justify-center mx-auto text-ocean-wave border border-ocean-wave/20"
            >
              <Lock size={32} strokeWidth={1} />
            </motion.div>
            <div className="space-y-2">
              <h1 className="display text-4xl font-light text-pearl uppercase italic tracking-tighter italic">{t.admin.passwordRequired}</h1>
              <p className="text-pearl/40 serif italic text-sm">{t.admin.enterPassword}</p>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-pearl/30 mx-2">{t.admin.password}</label>
              <input 
                required
                autoFocus
                type="password" 
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-10 py-6 outline-none focus:border-ocean-wave transition-all text-pearl serif italic text-xl tracking-widest"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
              />
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-rose-500 text-[10px] uppercase font-bold tracking-widest text-center mt-4"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              type="submit"
              className="w-full py-6 bg-pearl text-ocean-deep font-bold shadow-2xl hover:bg-ocean-wave hover:text-white transition-all uppercase tracking-[0.2em] text-[11px] rounded-3xl"
            >
              {t.admin.login}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-12 py-32 space-y-16 bg-ocean-deep">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-black/5 pb-10">
        <div className="space-y-4">
          <h1 className="display text-4xl md:text-6xl font-light text-pearl italic uppercase tracking-tighter">{t.admin.manageProducts}</h1>
          <p className="text-pearl/40 serif italic text-sm">{t.admin.adminPanelSubtitle}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-pearl text-ocean-deep font-bold px-10 py-5 shadow-xl hover:bg-ocean-wave hover:text-white transition-all uppercase tracking-[0.2em] text-[10px]"
        >
          <Plus size={18} className="mr-2 inline" />
          {t.admin.addProduct}
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: t.admin.totalProducts, value: products.length, icon: Box, color: 'text-ocean-wave', bg: 'bg-black/5' },
          { label: t.admin.sales, value: '1,250 ₾', icon: TrendingUp, color: 'text-ocean-wave', bg: 'bg-black/5' },
          { label: t.admin.orders, value: '42', icon: ShoppingBag, color: 'text-ocean-wave', bg: 'bg-black/5' },
          { label: t.admin.visitors, value: '3.5k', icon: Users, color: 'text-ocean-wave', bg: 'bg-black/5' }
        ].map((s, i) => (
          <div key={i} className="p-8 glass-panel border-black/5 shadow-sm flex items-center gap-6">
             <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border border-black/10", s.bg, s.color)}>
                <s.icon size={24} strokeWidth={1} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-pearl/30 uppercase tracking-[0.2em]">{s.label}</p>
                <p className="serif text-2xl text-pearl italic font-light">{s.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="glass-panel border-black/5 shadow-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/5">
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">{t.admin.tableProduct}</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">{t.admin.tableCategory}</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">{t.admin.tablePrice}</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">{t.admin.tableStock}</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30 text-right">{t.admin.tableAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {products.map(product => (
                <tr key={product.id} className="group hover:bg-black/5 transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-16 bg-black/5 border border-black/5 overflow-hidden flex-shrink-0">
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover mix-blend-luminosity grayscale" referrerPolicy="no-referrer" />
                      </div>
                      <span className="serif text-pearl italic font-light">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[10px] font-bold text-ocean-wave uppercase tracking-widest">
                       {TRANSLATIONS[language].categories[product.category]}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="serif text-pearl">{product.price} {currency}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className={cn(
                      "serif italic font-light",
                      product.stock === 0 ? "text-rose-500" : "text-pearl/40"
                    )}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => startEdit(product)}
                        className="p-3 bg-black/5 hover:bg-pearl hover:text-ocean-deep transition-all border border-black/10"
                       >
                         <Edit3 size={16} strokeWidth={1.5} />
                       </button>
                       <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-3 bg-black/5 hover:bg-rose-500 hover:text-white transition-all border border-black/10"
                       >
                         <Trash2 size={16} strokeWidth={1.5} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => { setIsAdding(false); setEditingId(null); }}
               className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 50 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 50 }}
               className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl max-h-[90vh] md:max-h-[85vh] bg-ocean-deep z-[101] overflow-hidden flex flex-col shadow-2xl border border-black/10"
            >
               <div className="p-8 border-b border-black/5 flex items-center justify-between">
                  <h2 className="display text-2xl font-light uppercase tracking-tighter italic text-pearl">
                    {editingId ? t.admin.editProduct : t.admin.addNewProduct}
                  </h2>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-2 hover:bg-black/5 rounded-full text-pearl/40 transition-colors">
                    <X size={24} strokeWidth={1} />
                  </button>
               </div>

               <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-12 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">{t.admin.productName}</label>
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-black/5 border border-black/10 px-8 py-5 rounded-2xl outline-none focus:border-ocean-wave serif text-pearl italic font-light"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">{t.admin.productCategory}</label>
                        <select 
                          className="w-full bg-black/5 border border-black/10 px-8 py-5 rounded-2xl outline-none focus:border-ocean-wave serif text-pearl italic font-light appearance-none"
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value as Category})}
                        >
                           <option value="necklace">{TRANSLATIONS[language].categories.necklace}</option>
                           <option value="bracelet">{TRANSLATIONS[language].categories.bracelet}</option>
                           <option value="ring">{TRANSLATIONS[language].categories.ring}</option>
                           <option value="earrings">{TRANSLATIONS[language].categories.earrings}</option>
                        </select>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">{t.admin.productPrice} ({currency})</label>
                        <input 
                          required
                          type="number" 
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                          className="w-full bg-black/5 border border-black/10 px-8 py-5 rounded-2xl outline-none focus:border-ocean-wave serif text-pearl italic font-light"
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">{t.admin.productStock}</label>
                        <input 
                          required
                          type="number" 
                          value={formData.stock}
                          onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                          className="w-full bg-black/5 border border-black/10 px-8 py-5 rounded-2xl outline-none focus:border-ocean-wave serif text-pearl italic font-light"
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">{t.admin.productKeywords}</label>
                    <input 
                      type="text" 
                      value={formData.keywords?.join(', ')}
                      onChange={e => setFormData({...formData, keywords: e.target.value.split(',').map(k => k.trim())})}
                      className="w-full bg-black/5 border border-black/10 px-8 py-5 rounded-2xl outline-none focus:border-ocean-wave serif text-pearl italic font-light"
                      placeholder="shell, pearl, necklace..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">{t.admin.productDescription}</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-black/5 border border-black/10 px-8 py-5 rounded-2xl outline-none focus:border-ocean-wave resize-none serif text-pearl italic font-light"
                    />
                  </div>

                  {/* Product Images (Photo Redacting/Editing & Base64 Converting) */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-pearl/30">
                          {t.admin.productImages}
                        </label>
                        <p className="text-[10px] text-pearl/40 serif italic">
                          Upload files to encode as Base64 (fully safe for Netlify) or provide a remote cloud URL.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const currentImages = formData.images ? [...formData.images] : [];
                          setFormData({
                            ...formData,
                            images: [...currentImages, '']
                          });
                        }}
                        className="text-ocean-wave hover:text-pearl transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-ocean-wave/20 hover:border-pearl/20 px-4 py-2 rounded-xl bg-ocean-wave/5"
                      >
                        <Plus size={14} />
                        {t.admin.addImage}
                      </button>
                    </div>

                    {/* Drag-and-drop / Browse Box */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative group flex flex-col items-center justify-center space-y-3 min-h-[140px]",
                        isDraggingOver 
                          ? "border-ocean-wave bg-ocean-wave/10 text-ocean-wave" 
                          : "border-white/10 bg-black/10 hover:border-ocean-wave/30 hover:bg-black/20"
                      )}
                      onClick={() => document.getElementById('base64-file-upload')?.click()}
                    >
                      <input 
                        type="file"
                        id="base64-file-upload"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Upload size={32} className={cn("stroke-[1.2] transition-transform group-hover:-translate-y-1", isDraggingOver ? "text-ocean-wave" : "text-pearl/40")} />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-pearl/80 uppercase tracking-wider">Drag & drop files here, or <span className="text-ocean-wave group-hover:underline">browse</span></p>
                        <p className="text-[10px] text-pearl/30 serif italic">Supports PNG, JPEG, WEBP, and SVG. Converts instantly to embedded Base64.</p>
                      </div>
                    </div>

                    {/* Image List */}
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      {formData.images && formData.images.map((imgUrl, index) => {
                        const isBase64 = imgUrl && imgUrl.startsWith('data:');
                        const dataSize = imgUrl ? Math.round((imgUrl.length * 3) / 4 / 1024) : 0; // rough estimation in KB
                        
                        return (
                          <div key={index} className="flex flex-col md:flex-row gap-4 items-stretch md:items-center bg-black/25 p-4 border border-white/5 rounded-2xl transition-all hover:bg-black/35">
                            {/* Image preview thumbnail */}
                            <div className="w-20 h-20 bg-black/40 border border-white/5 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative group/preview">
                              {imgUrl ? (
                                <img 
                                  src={imgUrl} 
                                  alt=""
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder/800/1000';
                                  }}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="text-pearl/20 text-[10px] font-mono">No Src</div>
                              )}
                            </div>

                            <div className="flex-1 flex flex-col gap-2">
                              {/* Metadata Badge details */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-pearl/60">
                                  Image #{index + 1}
                                </span>
                                {isBase64 ? (
                                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-ocean-wave/15 text-ocean-wave">
                                    Base64 Encoded (~{dataSize} KB)
                                  </span>
                                ) : imgUrl ? (
                                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-pearl/50">
                                    Web path / Cloud URL
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400">
                                    Empty Container
                                  </span>
                                )}
                              </div>

                              {/* Input field */}
                              <input 
                                type="text"
                                required
                                placeholder="Paste cloud URL or write/convert file path here..."
                                value={imgUrl}
                                onChange={(e) => {
                                  const updated = [...(formData.images || [])];
                                  updated[index] = e.target.value;
                                  setFormData({
                                    ...formData,
                                    images: updated
                                  });
                                }}
                                className="w-full bg-black/20 border border-white/5 px-4 py-2.5 rounded-xl outline-none focus:border-ocean-wave serif text-pearl/80 italic font-light text-xs"
                              />
                            </div>

                            {/* Action Operations */}
                            <div className="flex items-center gap-2 justify-end">
                              {/* Direct file replacement for this specific slot */}
                              <label className="p-3 bg-ocean-wave/10 text-ocean-wave hover:bg-ocean-wave hover:text-white transition-all rounded-xl border border-ocean-wave/20 cursor-pointer flex items-center justify-center h-11 w-11" title="Upload directly to this slot">
                                <Upload size={14} strokeWidth={1.5} />
                                <input 
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      if (file.size > 800000) {
                                        if (!confirm(`The image is larger than 800KB. Large Base64 images might exceed browser LocalStorage limits. Continue?`)) return;
                                      }
                                      const b64 = await convertToBase64(file);
                                      const updated = [...(formData.images || [])];
                                      updated[index] = b64;
                                      setFormData({
                                        ...formData,
                                        images: updated
                                      });
                                    }
                                  }}
                                />
                              </label>

                              {/* Delete slots */}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (formData.images || []).filter((_, i) => i !== index);
                                  setFormData({
                                    ...formData,
                                    images: updated
                                  });
                                }}
                                className="p-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all rounded-xl border border-rose-500/20 h-11 w-11 flex items-center justify-center"
                                title="Delete Image Slot"
                              >
                                <Trash2 size={14} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {(!formData.images || formData.images.length === 0) && (
                        <div className="text-center py-6 text-pearl/30 serif italic text-sm border border-dashed border-white/5 rounded-2xl">
                          No images defined. Drop files above or click "Add Image" to get started.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-12 flex gap-6">
                     <button 
                       type="button"
                       onClick={() => { setIsAdding(false); setEditingId(null); }}
                       className="flex-1 py-6 font-bold bg-black/5 border border-black/10 text-pearl/40 hover:bg-black/10 transition-all uppercase tracking-[0.2em] text-xs"
                     >
                       {t.admin.cancel}
                     </button>
                     <button 
                       type="submit"
                       className="flex-1 py-6 bg-pearl text-ocean-deep font-bold shadow-xl hover:bg-ocean-wave hover:text-white transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
                     >
                       <Save size={18} strokeWidth={1.5} />
                       {t.admin.save}
                     </button>
                  </div>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
