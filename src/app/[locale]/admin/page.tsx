'use client';

import React, { use, useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Mail, FormInput, ListFilter, AlertTriangle, Eye, UploadCloud, Loader2, X } from 'lucide-react';
import { getDictionary } from '@/dictionaries';
import { getApiUrl } from '@/utils/api';

interface ImageUploaderProps {
  images: string;
  onChange: (urls: string) => void;
  dict: any;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange, dict }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showRawInput, setShowRawInput] = useState(false);

  const imageUrls = images.split(',').map(url => url.trim()).filter(Boolean);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    const updatedUrls = [...imageUrls];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch(getApiUrl('/api/upload'), {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          updatedUrls.push(data.url);
        } else {
          alert(`Failed to upload ${file.name}`);
        }
      }
      onChange(updatedUrls.join(', '));
    } catch (err) {
      console.error(err);
      alert('Upload failed. Backend offline?');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFiles(e.dataTransfer.files);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(e.target.files);
    }
  };

  const handleRemove = (urlToRemove: string) => {
    const updated = imageUrls.filter(url => url !== urlToRemove).join(', ');
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="font-bold text-[#232B28]/80">{dict.admin.images}</label>
        <button
          type="button"
          onClick={() => setShowRawInput(!showRawInput)}
          className="text-xs font-semibold text-[#B35C37] hover:underline cursor-pointer"
        >
          {showRawInput ? "Use Drag & Drop" : "Edit Raw URLs"}
        </button>
      </div>

      {showRawInput ? (
        <input
          type="text"
          name="images"
          value={images}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-[#232B28]/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#B35C37]"
          placeholder="Comma-separated image URLs"
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative ${
              dragActive 
                ? 'border-[#B35C37] bg-[#B35C37]/5' 
                : 'border-[#232B28]/15 hover:border-[#B35C37] bg-stone-50/50'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="flex flex-col items-center gap-2 cursor-pointer w-full h-full text-center">
              {uploading ? (
                <Loader2 className="animate-spin text-[#B35C37]" size={32} />
              ) : (
                <UploadCloud className="text-[#232B28]/40 hover:text-[#B35C37] transition-colors" size={32} />
              )}
              <div className="text-sm font-semibold text-[#232B28]/85">
                {uploading ? "Uploading image..." : "Drag & drop file or click to upload"}
              </div>
              <div className="text-xs text-[#232B28]/50">
                Supports JPG, PNG, WEBP up to 5MB
              </div>
            </label>
          </div>

          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative w-20 h-24 rounded-lg overflow-hidden border border-[#232B28]/10 bg-white group shadow-2xs">
                  <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemove(url)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default function AdminPage({ params }: AdminPageProps) {
  const { locale: rawLocale } = use(params);
  const locale = rawLocale as 'it' | 'en';
  const [dict, setDict] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<'products' | 'inquiries'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState('');

  // Authorization State
  const [authorized, setAuthorized] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Form State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    price: 49.99,
    category: 'kurtis',
    materials: '',
    sizes: 'S, M, L, XL',
    images: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800',
    stock: 20,
    featured: false,
    it_name: '',
    it_description: '',
    it_tags: '',
    en_name: '',
    en_description: '',
    en_tags: '',
  });

  useEffect(() => {
    const isAuthed = sessionStorage.getItem('admin_authorized') === 'true';
    if (isAuthed) {
      setAuthorized(true);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail === 'aayush6b12@gmail.com' && authPassword === 'soniKmno4@') {
      sessionStorage.setItem('admin_authorized', 'true');
      setAuthorized(true);
      setAuthError('');
    } else {
      setAuthError(locale === 'it' ? 'Credenziali non valide' : 'Invalid email or password');
    }
  };

  useEffect(() => {
    getDictionary(locale).then(setDict);
    fetchData();
  }, [locale]);

  const fetchData = async () => {
    setLoading(true);
    setErrorNotice('');
    try {
      // Fetch Products
      const prodRes = await fetch(getApiUrl('/api/products'));
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      } else {
        throw new Error('Failed to fetch products');
      }

      // Fetch Inquiries
      const inqRes = await fetch(getApiUrl('/api/inquiries'));
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData);
      }
    } catch (err) {
      console.warn('[AdminDashboard] Express backend unreachable. Operating in read-only fallback mode.');
      setErrorNotice('Express backend not responding. CRUD actions will be simulated.');
      // Local fallback mocks
      setProducts([
        {
          sku: 'KUR-VAR-001',
          price: 89.99,
          category: 'kurtis',
          materials: ['Varanasi Silk'],
          sizes: ['S', 'M', 'L'],
          images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'],
          stock: 15,
          featured: true,
          it: { name: 'Kurti Etnica in Seta di Varanasi', description: 'Pregiata seta di Varanasi.', tags: ['seta'] },
          en: { name: 'Varanasi Silk Ethnic Kurti', description: 'Varanasi silk tunic.', tags: ['silk'] }
        }
      ]);
      setInquiries([
        {
          type: 'contact',
          email: 'customer@milano.it',
          name: 'Francesca Rossi',
          subject: 'Domanda taglie Kurti',
          message: 'Vorrei sapere se la taglia S veste aderente o morbida.',
          createdAt: new Date().toISOString()
        },
        {
          type: 'newsletter',
          email: 'giovanni.moda@roma.it',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryPrefix = (cat: string): string => {
    switch (cat) {
      case 'handcraft-material': return 'MAT';
      case 'kurtis': return 'KUR';
      case 'onepiece': return 'OP';
      case 'summer-dresses': return 'SD';
      case 'indo-western': return 'IW';
      case 'ethnic-indian': return 'ETH';
      case 'jewelry-oxidized': return 'JW-OXD';
      case 'jewelry-modern': return 'JW-MOD';
      case 'jewelry-handcuffs': return 'JW-HDC';
      case 'jewelry-bracelets': return 'JW-BRC';
      case 'jewelry-necklace': return 'JW-NEC';
      case 'jewelry-earrings': return 'JW-EAR';
      case 'handbags': return 'BAG';
      default: return 'PRD';
    }
  };

  const handleRegenerateSku = () => {
    if (editingProduct) return;
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    setFormData(prev => ({
      ...prev,
      sku: `${getCategoryPrefix(prev.category)}-${randomSuffix}`
    }));
  };

  const handleAutofillDemoData = () => {
    const templates = [
      {
        category: 'kurtis',
        price: 69.99,
        materials: 'Pure Varanasi Silk, Gold Brocade',
        sizes: 'S, M, L, XL',
        images: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
        stock: 12,
        featured: true,
        it_name: 'Kurti in Seta Varanasi',
        it_description: 'Un elegante kurti in pura seta di Varanasi, decorato con raffinati ricami dorati (zari). Ideale per eventi speciali e serate eleganti.',
        it_tags: 'seta, kurti, etnico, varanasi',
        en_name: 'Varanasi Silk Kurti',
        en_description: 'An elegant kurti crafted from pure Varanasi silk, featuring exquisite gold brocade (zari) embroidery. Ideal for special occasions and elegant evenings.',
        en_tags: 'silk, kurti, ethnic, varanasi',
      },
      {
        category: 'handbags',
        price: 45.00,
        materials: 'Handloom Cotton, Vegan Leather',
        sizes: 'Unique Size',
        images: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
        stock: 8,
        featured: false,
        it_name: 'Borsa a Tracolla Artigianale',
        it_description: 'Borsa a tracolla ricamata a mano da artigiani locali indiani con tessuti handloom tradizionali e dettagli in similpelle. Interno capiente con chiusura sicura.',
        it_tags: 'borsa, ricamata, cotone, artigianale',
        en_name: 'Handcrafted Embroidered Sling Bag',
        en_description: 'A cross-body bag hand-embroidered by local Indian artisans using traditional handloom cotton and vegan leather details. Spacious interior with secure zip.',
        en_tags: 'bag, embroidered, cotton, handcrafted',
      },
      {
        category: 'jewelry-earrings',
        price: 24.99,
        materials: 'Sterling Silver, Oxidized Finish',
        sizes: 'One Size',
        images: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800',
        stock: 15,
        featured: false,
        it_name: 'Orecchini Jhumka Tradizionali',
        it_description: 'Orecchini pendenti in argento ossidato lavorati a mano con il classico motivo floreale e campanellini tintinnanti. Perfetti per dare un tocco etnico a qualsiasi outfit.',
        it_tags: 'orecchini, argento, jhumka, gioielli',
        en_name: 'Traditional Oxidized Jhumka Earrings',
        en_description: 'Stunning oxidized silver dangling earrings handcrafted with a classic floral motif and tiny chiming bells. Perfect to add a touch of ethnic elegance to any look.',
        en_tags: 'earrings, silver, jhumka, jewelry',
      },
      {
        category: 'onepiece',
        price: 79.99,
        materials: 'Organic Linen, Indigo Dye',
        sizes: 'S, M, L',
        images: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
        stock: 10,
        featured: true,
        it_name: 'Abito Lungo in Lino Tinto in Indaco',
        it_description: 'Elegante abito a pezzo unico in lino biologico, tinto a mano in autentico indaco naturale. Silhouette fluida e tasche laterali per un comfort chic.',
        it_tags: 'abito, lino, indaco, vestito',
        en_name: 'Indigo-Dyed Linen Maxi Dress',
        en_description: 'Elegant one-piece maxi dress in organic linen, hand-dyed with authentic natural indigo. Flowing silhouette and side pockets for chic comfort.',
        en_tags: 'dress, linen, indigo, flowy',
      },
      {
        category: 'jewelry-handcuffs',
        price: 34.99,
        materials: 'Brass, Kundan Stones, Gold Plating',
        sizes: 'Adjustable',
        images: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
        stock: 20,
        featured: false,
        it_name: 'Bracciale Rigido Kundan Placcato Oro',
        it_description: 'Elegante bracciale rigido placcato oro impreziosito da pietre Kundan incastonate e dettagli dipinti a mano sul retro (Meenakari). Design regolabile.',
        it_tags: 'bracciale, kundan, oro, gioielli',
        en_name: 'Gold-Plated Kundan Cuff Bangle',
        en_description: 'Elegant gold-plated open cuff bangle embellished with traditional Kundan stones and hand-painted details on the reverse (Meenakari). Adjustable design.',
        en_tags: 'bracelet, bangle, kundan, gold, jewelry',
      },
      {
        category: 'handcraft-material',
        price: 18.50,
        materials: '100% Khadi Cotton',
        sizes: 'Per Meter',
        images: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
        stock: 50,
        featured: false,
        it_name: 'Tessuto di Cotone Khadi Indiano',
        it_description: 'Tessuto in puro cotone Khadi filato e tessuto a mano. Ideale per la sartoria e progetti creativi. Ecologico e traspirante.',
        it_tags: 'tessuto, cotone, khadi, artigianato',
        en_name: 'Hand-Spun Khadi Cotton Fabric',
        en_description: 'Pure hand-spun and hand-woven Khadi cotton fabric. Ideal for tailored wear and creative sewing projects. Eco-friendly and highly breathable.',
        en_tags: 'fabric, cotton, khadi, material',
      }
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sku = `${getCategoryPrefix(randomTemplate.category)}-${randomSuffix}`;

    setFormData({
      ...randomTemplate,
      sku
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => {
      const nextData = { ...prev, [name]: val };
      if (name === 'category' && !editingProduct) {
        const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        nextData.sku = `${getCategoryPrefix(value)}-${randomSuffix}`;
      }
      return nextData;
    });
  };

  const openAddForm = () => {
    setEditingProduct(null);
    const defaultCat = 'kurtis';
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const autoSku = `${getCategoryPrefix(defaultCat)}-${randomSuffix}`;
    setFormData({
      sku: autoSku,
      price: 49.99,
      category: defaultCat,
      materials: '',
      sizes: 'S, M, L, XL',
      images: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800',
      stock: 20,
      featured: false,
      it_name: '',
      it_description: '',
      it_tags: '',
      en_name: '',
      en_description: '',
      en_tags: '',
    });
    setShowForm(true);
  };

  const openEditForm = (prod: any) => {
    setEditingProduct(prod);
    setFormData({
      sku: prod.sku,
      price: prod.price,
      category: prod.category,
      materials: prod.materials.join(', '),
      sizes: prod.sizes.join(', '),
      images: prod.images.join(', '),
      stock: prod.stock,
      featured: prod.featured || false,
      it_name: prod.it.name,
      it_description: prod.it.description,
      it_tags: prod.it.tags.join(', '),
      en_name: prod.en.name,
      en_description: prod.en.description,
      en_tags: prod.en.tags.join(', '),
    });
    setShowForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedPayload = {
      sku: formData.sku,
      price: Number(formData.price),
      category: formData.category,
      materials: formData.materials.split(',').map(m => m.trim()).filter(Boolean),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      images: formData.images.split(',').map(i => i.trim()).filter(Boolean),
      stock: Number(formData.stock),
      featured: Boolean(formData.featured),
      it: {
        name: formData.it_name,
        description: formData.it_description,
        tags: formData.it_tags.split(',').map(t => t.trim()).filter(Boolean),
      },
      en: {
        name: formData.en_name,
        description: formData.en_description,
        tags: formData.en_tags.split(',').map(t => t.trim()).filter(Boolean),
      }
    };

    try {
      let res;
      if (editingProduct) {
        // Update
        res = await fetch(getApiUrl(`/api/products/${editingProduct.sku}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedPayload)
        });
      } else {
        // Create
        res = await fetch(getApiUrl('/api/products'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedPayload)
        });
      }

      if (res.ok) {
        fetchData();
        setShowForm(false);
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (err) {
      // Offline fallback simulation
      console.warn('[AdminForm] Backend offline. Simulating action locally.');
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.sku === editingProduct.sku ? { ...p, ...formattedPayload } : p));
      } else {
        setProducts(prev => [...prev, { ...formattedPayload, _id: Math.random().toString() }]);
      }
      setShowForm(false);
    }
  };

  const handleDeleteProduct = async (sku: string) => {
    if (!confirm(`Delete product ${sku}?`)) return;

    try {
      const res = await fetch(getApiUrl(`/api/products/${sku}`), {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.warn('[AdminDelete] Backend offline. Simulating delete.');
      setProducts(prev => prev.filter(p => p.sku !== sku));
    }
  };

  if (!dict) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>;

  if (!authorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FAF8F5]">
        <div className="w-full max-w-md bg-white border border-[#232B28]/10 rounded-2xl p-8 shadow-md flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-2 text-center">
            {/* Minimalist logo duplication for branding */}
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6 text-[#B35C37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="4" y="9" width="16" height="11" rx="1" />
                <path d="M12 9V20" />
                <path d="M4 13H20" />
                <path d="M12 9C12 6.5 10 5 8.5 6.5S10 9 12 9z" />
                <path d="M12 9C12 6.5 14 5 15.5 6.5S14 9 12 9z" />
              </svg>
              <div className="flex flex-col text-left">
                <span className="font-serif text-sm font-bold tracking-[0.15em] uppercase text-[#232B28]">
                  Casa dei Regali
                </span>
                <span className="font-sans text-[7px] tracking-[0.3em] uppercase text-[#B35C37] mt-1 font-semibold leading-none">
                  Milano
                </span>
              </div>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#232B28] mt-2">
              {locale === 'it' ? 'Accesso Amministratore' : 'Admin Portal Access'}
            </h2>
            <p className="font-sans text-xs text-[#232B28]/60 max-w-[280px]">
              {locale === 'it' ? 'Inserisci le tue credenziali per accedere al pannello di controllo.' : 'Please enter your credentials to access the management dashboard.'}
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 font-sans text-sm">
            {authError && (
              <div className="border border-red-200 bg-red-50 text-red-700 text-xs font-semibold rounded-lg p-3 text-center">
                {authError}
              </div>
            )}
            
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#232B28]/70">Email</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="border border-[#232B28]/15 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B35C37]"
                placeholder="admin@casadeiregali.it"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#232B28]/70">Password</label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="border border-[#232B28]/15 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B35C37]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-bold font-sans tracking-wider text-xs uppercase rounded-xl transition-colors cursor-pointer"
            >
              {locale === 'it' ? 'Accedi' : 'Login'}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthEmail('aayush@gmail.com');
                setAuthPassword('anjali1234');
              }}
              className="text-xs text-center text-[#B35C37] hover:underline cursor-pointer font-semibold -mt-2"
            >
              {locale === 'it' ? 'Usa credenziali demo' : 'Use Demo Credentials'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#232B28]">{dict.admin.title}</h1>
          <p className="font-sans text-sm text-[#232B28]/60 mt-2">{dict.admin.subtitle}</p>
        </div>

        <div className="flex items-center gap-4">
          {activeTab === 'products' && !showForm && (
            <button
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-sm animate-fade-in"
            >
              <Plus size={16} />
              <span>{dict.admin.add_new}</span>
            </button>
          )}

          <button
            onClick={() => {
              sessionStorage.removeItem('admin_authorized');
              setAuthorized(false);
            }}
            className="px-4 py-3 border border-red-200 hover:bg-red-50 text-red-500 font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Backend Alert Warning */}
      {errorNotice && (
        <div className="border border-amber-300 bg-amber-50 rounded-xl p-4 flex items-center gap-3 text-amber-800 text-xs font-semibold">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#232B28]/10 gap-6 font-sans text-sm font-semibold uppercase tracking-wider">
        <button
          onClick={() => { setActiveTab('products'); setShowForm(false); }}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'products' ? 'border-[#B35C37] text-[#B35C37]' : 'border-transparent text-[#232B28]/60 hover:text-[#232B28]'
          }`}
        >
          {dict.admin.tab_products}
        </button>
        <button
          onClick={() => { setActiveTab('inquiries'); setShowForm(false); }}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'inquiries' ? 'border-[#B35C37] text-[#B35C37]' : 'border-transparent text-[#232B28]/60 hover:text-[#232B28]'
          }`}
        >
          {dict.admin.tab_inquiries}
        </button>
      </div>

      {/* LOADING SCREEN */}
      {loading ? (
        <div className="text-center py-20 font-sans text-sm text-[#232B28]/60">Loading Dashboard Data...</div>
      ) : showForm ? (
        
        /* ADD / EDIT FORM & PREVIEW PANEL */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Form Panel (Left Column, 2/3 width) */}
          <form onSubmit={handleSaveProduct} className="lg:col-span-2 bg-white border border-[#232B28]/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#232B28]/10 pb-3">
              <h2 className="font-serif text-2xl font-bold text-[#232B28]">
                {editingProduct ? dict.admin.edit_product : dict.admin.add_new}
              </h2>
              {!editingProduct && (
                <button
                  type="button"
                  onClick={handleAutofillDemoData}
                  className="px-3 py-1.5 bg-[#FAF8F5] border border-[#B35C37]/35 hover:bg-[#B35C37]/5 text-[#B35C37] font-sans font-bold text-xs tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
                >
                  {locale === 'it' ? 'Autocompila Dati' : 'Autofill Demo'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-sm">
              
              {/* SKU */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#232B28]/80">{dict.admin.sku}</label>
                  {!editingProduct && (
                    <button
                      type="button"
                      onClick={handleRegenerateSku}
                      className="text-xs font-semibold text-[#B35C37] hover:underline cursor-pointer"
                    >
                      Regenerate
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="sku"
                  required
                  disabled={!!editingProduct}
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="border border-[#232B28]/15 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B35C37] disabled:opacity-50"
                />
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#232B28]/80">{dict.admin.price}</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  className="border border-[#232B28]/15 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B35C37]"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#232B28]/80">{dict.admin.category}</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="border border-[#232B28]/15 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-[#B35C37] text-sm"
                >
                  <option value="handcraft-material">{(dict.categories as any)["handcraft-material"] || "Handcraft Material"}</option>
                  <option value="kurtis">{dict.categories.kurtis}</option>
                  <option value="onepiece">{dict.categories.onepiece}</option>
                  <option value="summer-dresses">{(dict.categories as any)["summer-dresses"] || "Summer Dresses"}</option>
                  <option value="indo-western">{(dict.categories as any)["indo-western"] || "Indo-Western"}</option>
                  <option value="ethnic-indian">{(dict.categories as any)["ethnic-indian"] || "Ethnic & Indian"}</option>
                  <option value="jewelry-oxidized">{(dict.categories as any)["jewelry-oxidized"] || "Oxidized Jewelry"}</option>
                  <option value="jewelry-modern">{(dict.categories as any)["jewelry-modern"] || "Modern Jewelry"}</option>
                  <option value="jewelry-handcuffs">{(dict.categories as any)["jewelry-handcuffs"] || "Handcuffs & Bangles"}</option>
                  <option value="jewelry-bracelets">{(dict.categories as any)["jewelry-bracelets"] || "Bracelets"}</option>
                  <option value="jewelry-necklace">{(dict.categories as any)["jewelry-necklace"] || "Necklaces"}</option>
                  <option value="jewelry-earrings">{(dict.categories as any)["jewelry-earrings"] || "Earrings"}</option>
                  <option value="handbags">{dict.categories.handbags}</option>
                </select>
              </div>

              {/* Materials */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#232B28]/80">{dict.admin.materials}</label>
                <input
                  type="text"
                  name="materials"
                  value={formData.materials}
                  onChange={handleInputChange}
                  className="border border-[#232B28]/15 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B35C37]"
                />
              </div>

              {/* Sizes */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#232B28]/80">{dict.admin.sizes}</label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleInputChange}
                  className="border border-[#232B28]/15 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B35C37]"
                />
              </div>

              {/* Stock */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#232B28]/80">{dict.admin.stock}</label>
                <input
                  type="number"
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="border border-[#232B28]/15 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B35C37]"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4.5 h-4.5 rounded-sm border-[#232B28]/25 text-[#B35C37] focus:ring-[#B35C37]"
                />
                <label htmlFor="featured" className="font-bold text-[#232B28]/80 cursor-pointer">
                  {dict.admin.featured}
                </label>
              </div>
              
              {/* Images Drag-and-Drop Uploader */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <ImageUploader
                  images={formData.images}
                  onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
                  dict={dict}
                />
              </div>
              
            </div>

            <hr className="border-[#232B28]/10 my-2" />

            {/* Localized Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans text-sm">
              
              {/* ITALIAN DETAILS */}
              <div className="border border-[#232B28]/10 rounded-xl p-5 bg-[#FAF8F5]/50 flex flex-col gap-4">
                <h3 className="font-serif text-lg font-bold text-[#B35C37] border-b border-[#232B28]/5 pb-2">Italiano</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#232B28]/70">{dict.admin.it_name}</label>
                  <input
                    type="text"
                    name="it_name"
                    required
                    value={formData.it_name}
                    onChange={handleInputChange}
                    className="border border-[#232B28]/15 bg-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#B35C37]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#232B28]/70">{dict.admin.it_desc}</label>
                  <textarea
                    name="it_description"
                    required
                    rows={3}
                    value={formData.it_description}
                    onChange={handleInputChange}
                    className="border border-[#232B28]/15 bg-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#B35C37] resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#232B28]/70">{dict.admin.it_tags}</label>
                  <input
                    type="text"
                    name="it_tags"
                    value={formData.it_tags}
                    onChange={handleInputChange}
                    className="border border-[#232B28]/15 bg-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#B35C37]"
                  />
                </div>
              </div>

              {/* ENGLISH DETAILS */}
              <div className="border border-[#232B28]/10 rounded-xl p-5 bg-[#FAF8F5]/50 flex flex-col gap-4">
                <h3 className="font-serif text-lg font-bold text-[#B35C37] border-b border-[#232B28]/5 pb-2">English</h3>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#232B28]/70">{dict.admin.en_name}</label>
                  <input
                    type="text"
                    name="en_name"
                    required
                    value={formData.en_name}
                    onChange={handleInputChange}
                    className="border border-[#232B28]/15 bg-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#B35C37]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#232B28]/70">{dict.admin.en_desc}</label>
                  <textarea
                    name="en_description"
                    required
                    rows={3}
                    value={formData.en_description}
                    onChange={handleInputChange}
                    className="border border-[#232B28]/15 bg-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#B35C37] resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#232B28]/70">{dict.admin.en_tags}</label>
                  <input
                    type="text"
                    name="en_tags"
                    value={formData.en_tags}
                    onChange={handleInputChange}
                    className="border border-[#232B28]/15 bg-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#B35C37]"
                  />
                </div>
              </div>

            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 border-t border-[#232B28]/10 pt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-[#232B28]/15 rounded-xl text-xs font-bold font-sans tracking-wider uppercase hover:bg-stone-50 cursor-pointer"
              >
                {dict.admin.btn_cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-bold font-sans tracking-wider text-xs uppercase rounded-xl transition-colors cursor-pointer"
              >
                {dict.admin.btn_save}
              </button>
            </div>
          </form>

          {/* Live Preview Card & Options Summary Panel (Right Column, 1/3 width) */}
          <div className="lg:col-span-1 lg:sticky lg:top-28 flex flex-col gap-6">
            
            {/* 1. Live Product Card Mockup */}
            <div className="bg-white border border-[#232B28]/10 rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
              <h3 className="font-serif text-base font-bold text-[#232B28] border-b border-[#232B28]/5 pb-2">
                {locale === 'it' ? 'Anteprima in Tempo Reale' : 'Real-time Live Preview'}
              </h3>
              
              {/* Product Card Container */}
              <div className="bg-[#FAF8F5] border border-[#232B28]/10 rounded-xl overflow-hidden flex flex-col h-full shadow-2xs">
                {/* Image panel */}
                <div className="relative aspect-3/4 overflow-hidden bg-stone-100 flex items-center justify-center">
                  {formData.images.split(',').filter(Boolean)[0] ? (
                    <img 
                      src={formData.images.split(',').filter(Boolean)[0].trim()} 
                      alt="Live Preview Product Image" 
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="text-center p-4 text-[#232B28]/35 font-sans text-xs flex flex-col items-center gap-1">
                      <span className="font-bold">No Image Added</span>
                      <span>URL links or files uploaded will display here</span>
                    </div>
                  )}
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-[#FAF8F5]/90 backdrop-blur-xs text-[#232B28] font-sans font-semibold text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs border border-[#232B28]/5">
                    {(dict.categories as any)[formData.category] || formData.category}
                  </span>
                </div>

                {/* Text details */}
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div className="mb-3">
                    <span className="text-[10px] font-medium text-[#232B28]/60 tracking-wider font-sans uppercase">
                      {formData.materials.split(',').filter(Boolean).join(' • ') || (locale === 'it' ? 'Nessun materiale inserito' : 'No materials entered')}
                    </span>
                    <h4 className="font-serif text-[15px] font-bold text-[#232B28] leading-tight mt-1 line-clamp-2">
                      {(locale === 'it' ? formData.it_name : formData.en_name) || (locale === 'it' ? 'Nome del Prodotto' : 'Product Name')}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#232B28]/5">
                    <span className="font-serif font-bold text-base text-[#B35C37]">
                      €{Number(formData.price || 0).toFixed(2)}
                    </span>
                    <span className="text-[9px] font-sans font-bold uppercase text-[#232B28]/50 border border-[#232B28]/10 px-2 py-0.5 rounded-md">
                      Qty: {formData.stock}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Options Filled Summary Checklist */}
            <div className="bg-white border border-[#232B28]/10 rounded-2xl p-5 shadow-2xs flex flex-col gap-4 font-sans text-xs">
              <h3 className="font-serif text-base font-bold text-[#232B28] border-b border-[#232B28]/5 pb-2">
                {locale === 'it' ? 'Riepilogo Opzioni Compilate' : 'Options Filled Summary'}
              </h3>
              
              <ul className="flex flex-col gap-3 text-[#232B28]/85">
                <li className="flex items-center justify-between">
                  <span className="font-semibold">SKU</span>
                  {formData.sku ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">{formData.sku}</span>
                  ) : (
                    <span className="text-red-500 font-semibold italic">{locale === 'it' ? 'Mancante' : 'Missing'}</span>
                  )}
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">{locale === 'it' ? 'Prezzo' : 'Price'}</span>
                  <span className="font-bold text-emerald-700">€{Number(formData.price || 0).toFixed(2)}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">{locale === 'it' ? 'Categoria' : 'Category'}</span>
                  <span className="font-semibold text-emerald-700 capitalize">{(dict.categories as any)[formData.category] || formData.category}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">{locale === 'it' ? 'Materiali' : 'Materials'}</span>
                  {formData.materials ? (
                    <span className="text-emerald-700 font-medium truncate max-w-[120px]">{formData.materials}</span>
                  ) : (
                    <span className="text-amber-500 font-semibold italic">{locale === 'it' ? 'Vuoto' : 'Empty'}</span>
                  )}
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">{locale === 'it' ? 'Taglie' : 'Sizes'}</span>
                  <span className="font-semibold text-emerald-700">{formData.sizes}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">{locale === 'it' ? 'Immagini' : 'Images'}</span>
                  {formData.images.split(',').filter(Boolean).length > 0 ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {formData.images.split(',').filter(Boolean).length} {locale === 'it' ? 'Aggiunte' : 'Added'}
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold italic">{locale === 'it' ? 'Mancante' : 'Missing'}</span>
                  )}
                </li>
                <li className="flex items-center justify-between border-t border-[#232B28]/5 pt-2 mt-1">
                  <span className="font-semibold">Dettagli in Italiano (IT)</span>
                  {formData.it_name && formData.it_description ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">✓ Compilati</span>
                  ) : (
                    <span className="text-red-500 font-semibold italic">✗ Incompleto</span>
                  )}
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">Details in English (EN)</span>
                  {formData.en_name && formData.en_description ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">✓ Compilati</span>
                  ) : (
                    <span className="text-red-500 font-semibold italic">✗ Incomplete</span>
                  )}
                </li>
              </ul>
            </div>
          </div>

        </div>
      ) : activeTab === 'products' ? (
        
        /* PRODUCTS LIST TAB */
        <div className="overflow-x-auto border border-[#232B28]/10 rounded-2xl bg-white shadow-2xs">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#232B28]/10 text-[#232B28]/60 font-semibold uppercase tracking-wider text-xs">
                <th className="p-4">SKU</th>
                <th className="p-4">{locale === 'it' ? 'Nome' : 'Name'}</th>
                <th className="p-4">{dict.admin.category}</th>
                <th className="p-4">{dict.admin.price}</th>
                <th className="p-4">{dict.admin.stock}</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => {
                const name = locale === 'it' ? prod.it.name : prod.en.name;
                return (
                  <tr key={prod.sku} className="border-b border-[#232B28]/5 hover:bg-stone-50/50 transition-colors">
                    <td className="p-4 font-bold text-[#232B28]">{prod.sku}</td>
                    <td className="p-4 font-serif font-bold text-base text-[#232B28]">{name}</td>
                    <td className="p-4 capitalize">{(dict.categories as any)[prod.category] || prod.category}</td>
                    <td className="p-4 font-bold text-[#B35C37]">€{prod.price.toFixed(2)}</td>
                    <td className="p-4 font-medium">{prod.stock}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(prod)}
                        className="p-2 hover:bg-[#232B28]/5 rounded-lg text-[#232B28]/70 hover:text-[#B35C37] transition-colors cursor-pointer"
                        title={dict.admin.btn_edit}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.sku)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                        title={dict.admin.btn_delete}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        
        /* CUSTOMER INQUIRIES TAB */
        <div className="flex flex-col gap-6">
          {inquiries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {inquiries.map((inq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#232B28]/10 rounded-2xl p-5 shadow-2xs flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between border-b border-[#232B28]/5 pb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      inq.type === 'newsletter' 
                        ? 'bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20'
                        : 'bg-[#B35C37]/10 text-[#B35C37] border-[#B35C37]/20'
                    }`}>
                      {inq.type}
                    </span>
                    <span className="text-[10px] text-[#232B28]/50 font-medium">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="font-sans text-sm">
                    {inq.name && (
                      <p className="font-bold text-[#232B28]">{inq.name}</p>
                    )}
                    <p className="text-[#232B28]/70 flex items-center gap-1.5 mt-1">
                      <Mail size={13} />
                      <span className="font-semibold">{inq.email}</span>
                    </p>
                    {inq.subject && (
                      <p className="text-xs font-bold text-[#232B28] mt-3">Subject: {inq.subject}</p>
                    )}
                    {inq.message && (
                      <div className="bg-[#FAF8F5] border border-[#232B28]/5 rounded-lg p-3 text-xs text-[#232B28]/85 mt-2 italic leading-relaxed">
                        "{inq.message}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-[#232B28]/10 rounded-xl font-serif text-lg text-[#232B28]/60">
              No inquiries or newsletter subscribers found.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
export const dynamic = 'force-dynamic';
