'use client';

import React, { use, useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Mail, FormInput, ListFilter, AlertTriangle, 
  Eye, UploadCloud, Loader2, X, ShoppingBag, DollarSign, UserCheck, 
  Settings, Key, Shield, User, FileText, CheckCircle2, Truck, RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { getDictionary } from '@/dictionaries';
import { getApiUrl, apiFetch } from '@/utils/api';

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
        const res = await apiFetch('/api/upload', {
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
                <div key={idx} className="relative w-20 h-24 rounded-lg overflow-hidden border border-[#232B28]/10 bg-white group shadow-xs">
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
  
  const [activeTab, setActiveTab] = useState<'products' | 'inquiries' | 'orders' | 'profile'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState('');

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState<any>({
    email: 'aayush6b12@gmail.com',
    name: 'Aayush Soni',
    bio: 'Senior Web Designer & Owner of Sita & Seta / Casa dei Regali',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  });

  // Edit Forms state
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingCredentials, setEditingCredentials] = useState(false);
  const [profileFormData, setProfileFormData] = useState({ name: '', bio: '', avatar: '' });
  const [credentialsFormData, setCredentialsFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [avatarUploading, setAvatarUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await apiFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfileFormData(prev => ({ ...prev, avatar: data.url }));
      } else {
        alert('Failed to upload avatar image');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed. Backend offline?');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Authorization State
  const [authorized, setAuthorized] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Password Recovery State
  const [loginMode, setLoginMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // Listen to resetToken on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('resetToken');
      if (token) {
        setResetToken(token);
        setLoginMode('reset');
      }
    }
  }, []);

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
    const checkAuth = async () => {
      try {
        const res = await apiFetch('/api/admin/profile');
        if (res.ok) {
          setAuthorized(true);
        }
      } catch {
        setAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });

      if (res.ok) {
        setAuthorized(true);
        setAuthError('');
        fetchData();
      } else {
        let errMsg = locale === 'it' ? 'Credenziali non valide' : 'Invalid email or password';
        try {
          const err = await res.json();
          if (err && err.message) errMsg = err.message;
        } catch {
          errMsg = `${locale === 'it' ? 'Errore del server' : 'Server error'} (${res.status})`;
        }
        setAuthError(errMsg);
      }
    } catch (err) {
      console.error('[AdminLogin] Backend login error:', err);
      setAuthError(locale === 'it' ? 'Connessione al server non riuscita' : 'Unable to connect to the server');
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotSuccess('');
    setForgotError('');
    try {
      const res = await apiFetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, locale }),
      });
      
      let data: any = {};
      let isJson = true;
      try {
        data = await res.json();
      } catch {
        isJson = false;
      }

      if (res.ok && isJson && data.success) {
        setForgotSuccess(data.message);
      } else {
        const fallbackMsg = locale === 'it' ? 'Si è verificato un errore.' : 'An error occurred.';
        setForgotError(data.message || (isJson ? fallbackMsg : `${locale === 'it' ? 'Errore del server' : 'Server error'} (${res.status})`));
      }
    } catch (err) {
      console.error(err);
      setForgotError(locale === 'it' ? 'Errore di connessione al server.' : 'Server connection error.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setResetError(locale === 'it' ? 'Le password non coincidono.' : 'Passwords do not match.');
      return;
    }
    setResetLoading(true);
    setResetSuccess('');
    setResetError('');
    try {
      const res = await apiFetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      });
      
      let data: any = {};
      let isJson = true;
      try {
        data = await res.json();
      } catch {
        isJson = false;
      }

      if (res.ok && isJson && data.success) {
        setResetSuccess(locale === 'it' ? 'Password reimpostata con successo! Reindirizzamento al login...' : 'Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          // Clear query parameters
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('resetToken');
            window.history.replaceState({}, '', url.toString());
          }
          setLoginMode('login');
          setNewPassword('');
          setConfirmNewPassword('');
          setResetSuccess('');
          setAuthEmail(forgotEmail || authEmail); // prefill email
        }, 3000);
      } else {
        const fallbackMsg = locale === 'it' ? 'Si è verificato un errore.' : 'An error occurred.';
        setResetError(data.message || (isJson ? fallbackMsg : `${locale === 'it' ? 'Errore del server' : 'Server error'} (${res.status})`));
      }
    } catch (err) {
      console.error(err);
      setResetError(locale === 'it' ? 'Errore di connessione al server.' : 'Server connection error.');
    } finally {
      setResetLoading(false);
    }
  };


  useEffect(() => {
    getDictionary(locale).then(setDict);
    if (authorized) {
      fetchData();
    }
  }, [locale, authorized]);

  const fetchData = async () => {
    setLoading(true);
    setErrorNotice('');
    try {
      // Fetch Products
      const prodRes = await apiFetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      } else {
        throw new Error('Failed to fetch products');
      }

      // Fetch Inquiries
      const inqRes = await apiFetch('/api/inquiries');
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData);
      }

      // Fetch Orders
      const ordRes = await apiFetch('/api/orders');
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData);
      }

      // Fetch Admin Profile
      const profRes = await apiFetch('/api/admin/profile');
      if (profRes.ok) {
        const profData = await profRes.json();
        setAdminProfile(profData);
        setProfileFormData({
          name: profData.name,
          bio: profData.bio,
          avatar: profData.avatar
        });
        setCredentialsFormData(prev => ({ ...prev, email: profData.email }));
      }
    } catch (err) {

      console.warn('[AdminDashboard] Express backend unreachable. Operating in read-only fallback mode.');
      setErrorNotice('Express backend not responding. Dynamic databases are simulated.');
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
          email: 'customer@vicenza.it',
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
      setOrders([
        {
          _id: 'ord-692a-3b5f',
          email: 'customer@vicenza.it',
          items: [
            { id: 'prod-001', sku: 'KUR-VAR-001', name: 'Varanasi Silk Ethnic Kurti', price: 89.99, size: 'M', quantity: 1, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800' }
          ],
          total: 89.99,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryPrefix = (cat: string): string => {
    switch (cat) {
      case 'kurtis': return 'KUR';
      case 'onepiece': return 'OP';
      case 'summer-dresses': return 'SD';
      case 'indo-western': return 'IW';
      case 'jewelry-oxidized': return 'JW-OXD';
      case 'jewelry-anklets': return 'JW-ANK';
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
        res = await apiFetch(`/api/products/${editingProduct.sku}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedPayload)
        });
      } else {
        res = await apiFetch('/api/products', {
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
      const res = await apiFetch(`/api/products/${sku}`, {
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


  // Update order status call
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.warn('[AdminOrder] Backend offline. Simulating status update.');
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  // Delete/Archive order
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(locale === 'it' ? 'Vuoi davvero cancellare questo ordine?' : 'Are you sure you want to delete this order?')) return;
    try {
      const res = await apiFetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete order');
      }
    } catch (err) {
      console.warn('[AdminOrder] Backend offline. Simulating order deletion.');
      setOrders(prev => prev.filter(o => o._id !== orderId));
    }
  };

  // Update profile handler
  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileFormData)
      });
      if (res.ok) {
        const updated = await res.json();
        setAdminProfile(updated);
        setEditingProfile(false);
      } else {
        alert('Failed to update profile');
      }
    } catch (err) {
      console.warn('[AdminProfile] Backend offline. Simulating local profile change.');
      setAdminProfile((prev: any) => ({ ...prev, ...profileFormData }));
      setEditingProfile(false);
    }
  };

  // Update security credentials handler
  const handleUpdateCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credentialsFormData.password !== credentialsFormData.confirmPassword) {
      alert(locale === 'it' ? 'Le password non coincidono!' : 'Passwords do not match!');
      return;
    }

    try {
      const res = await apiFetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentialsFormData.email,
          password: credentialsFormData.password
        })
      });
      if (res.ok) {
        alert(locale === 'it' ? 'Credenziali aggiornate con successo! Esegui di nuovo il login.' : 'Credentials updated successfully! Please login again.');
        sessionStorage.removeItem('admin_authorized');
        setAuthorized(false);
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (err) {
      console.warn('[AdminCredentials] Backend offline. Simulating credentials change.');
      alert('Simulated credential changes successfully. Log out requested.');
      setAdminProfile((prev: any) => ({ ...prev, email: credentialsFormData.email }));
      sessionStorage.removeItem('admin_authorized');
      setAuthorized(false);
    }
  };


  // Helper Stats Calculation
  const totalRevenue = orders.reduce((acc, o) => o.status === 'delivered' || o.status === 'shipped' || o.status === 'processing' || o.status === 'pending' ? acc + o.total : acc, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;

  if (!dict) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>;

  if (!authorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#FAF8F5] relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-10 left-[10%] bg-[#B35C37]/10 blob-glowing"></div>
        <div className="absolute bottom-10 right-[10%] bg-[#D4AF37]/10 blob-glowing" style={{ animationDelay: '-4s' }}></div>        <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-[#232B28]/10 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col gap-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2 mb-2 hover:scale-105 transition-transform">
              <svg className="w-8 h-8 text-[#B35C37] animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="4" y="9" width="16" height="11" rx="1" />
                <path d="M12 9V20" />
                <path d="M4 13H20" />
                <path d="M12 9C12 6.5 10 5 8.5 6.5S10 9 12 9z" />
                <path d="M12 9C12 6.5 14 5 15.5 6.5S14 9 12 9z" />
              </svg>
              <div className="flex flex-col text-left">
                <span className="font-serif text-base font-bold tracking-[0.15em] uppercase text-[#232B28]">
                  Casa dei Regali
                </span>
                <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-[#B35C37] mt-1 font-semibold leading-none">
                  Vicenza
                </span>
              </div>
            </div>

            {loginMode === 'login' && (
              <>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#232B28] mt-2">
                  {locale === 'it' ? 'Portale Amministratore' : 'Admin Portal Access'}
                </h2>
                <p className="font-sans text-xs text-[#232B28]/60 max-w-[300px]">
                  {locale === 'it' ? 'Inserisci le credenziali proprietario per gestire ordini e catalogo.' : 'Enter owner credentials to manage catalog and customer orders.'}
                </p>
              </>
            )}

            {loginMode === 'forgot' && (
              <>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#232B28] mt-2">
                  {locale === 'it' ? 'Recupero Password' : 'Password Recovery'}
                </h2>
                <p className="font-sans text-xs text-[#232B28]/60 max-w-[300px]">
                  {locale === 'it' ? 'Inserisci la tua email per ricevere un link di ripristino sicuro.' : 'Enter your email to receive a secure password recovery link.'}
                </p>
              </>
            )}

            {loginMode === 'reset' && (
              <>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#232B28] mt-2">
                  {locale === 'it' ? 'Reimposta Password' : 'Reset Password'}
                </h2>
                <p className="font-sans text-xs text-[#232B28]/60 max-w-[300px]">
                  {locale === 'it' ? 'Inserisci una nuova password sicura per il tuo account.' : 'Enter a secure new password for your administrator account.'}
                </p>
              </>
            )}
          </div>

          {loginMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 font-sans text-xs">
              {authError && (
                <div className="border border-red-200 bg-red-50 text-red-700 font-semibold rounded-xl p-3.5 text-center animate-shake">
                  {authError}
                </div>
              )}
              
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#232B28]/70 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="border border-[#232B28]/15 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#B35C37] transition-all text-xs"
                  placeholder="admin@casadeiregali.it"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#232B28]/70 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => setLoginMode('forgot')}
                    className="text-stone-500 hover:text-[#B35C37] font-semibold transition-colors cursor-pointer text-[10px] uppercase tracking-wider focus:outline-none"
                  >
                    {locale === 'it' ? 'Dimenticata?' : 'Forgot?'}
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="border border-[#232B28]/15 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#B35C37] transition-all text-xs"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3.5 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-bold font-sans tracking-wider text-xs uppercase rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                {locale === 'it' ? 'Accedi' : 'Login'}
              </button>
            </form>
          )}

          {loginMode === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-4 font-sans text-xs">
              {forgotError && (
                <div className="border border-red-200 bg-red-50 text-red-700 font-semibold rounded-xl p-3.5 text-center animate-shake">
                  {forgotError}
                </div>
              )}
              {forgotSuccess && (
                <div className="border border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold rounded-xl p-3.5 text-center">
                  {forgotSuccess}
                </div>
              )}
              
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#232B28]/70 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="border border-[#232B28]/15 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#B35C37] transition-all text-xs"
                  placeholder="admin@casadeiregali.it"
                />
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full mt-3 py-3.5 bg-[#B35C37] hover:bg-[#B35C37]/90 disabled:bg-[#B35C37]/50 text-white font-bold font-sans tracking-wider text-xs uppercase rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {forgotLoading && <Loader2 className="animate-spin" size={14} />}
                {locale === 'it' ? 'Invia Link di Recupero' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => { setLoginMode('login'); setForgotSuccess(''); setForgotError(''); }}
                className="flex items-center justify-center gap-1.5 text-stone-500 hover:text-[#B35C37] font-bold font-sans text-[10px] uppercase tracking-wider mx-auto mt-2 transition-colors cursor-pointer"
              >
                <ArrowLeft size={10} />
                {locale === 'it' ? 'Torna al Login' : 'Back to Login'}
              </button>
            </form>
          )}

          {loginMode === 'reset' && (
            <form onSubmit={handleResetPasswordSubmit} className="flex flex-col gap-4 font-sans text-xs">
              {resetError && (
                <div className="border border-red-200 bg-red-50 text-red-700 font-semibold rounded-xl p-3.5 text-center animate-shake">
                  {resetError}
                </div>
              )}
              {resetSuccess && (
                <div className="border border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold rounded-xl p-3.5 text-center">
                  {resetSuccess}
                </div>
              )}
              
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#232B28]/70 uppercase tracking-wider">
                  {locale === 'it' ? 'Nuova Password' : 'New Password'}
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-[#232B28]/15 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#B35C37] transition-all text-xs"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#232B28]/70 uppercase tracking-wider">
                  {locale === 'it' ? 'Conferma Nuova Password' : 'Confirm New Password'}
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="border border-[#232B28]/15 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#B35C37] transition-all text-xs"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full mt-3 py-3.5 bg-[#B35C37] hover:bg-[#B35C37]/90 disabled:bg-[#B35C37]/50 text-white font-bold font-sans tracking-wider text-xs uppercase rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {resetLoading && <Loader2 className="animate-spin" size={14} />}
                {locale === 'it' ? 'Reimposta Password' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10 relative">
      {/* Decorative radial gradients for luxury portal vibe */}
      <div className="absolute top-0 right-0 bg-[#B35C37]/5 blob-glowing opacity-60"></div>
      <div className="absolute bottom-20 left-0 bg-[#D4AF37]/5 blob-glowing opacity-40" style={{ animationDelay: '-5s' }}></div>

      {/* Header Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <span className="text-[10px] font-bold text-[#B35C37] tracking-[0.25em] uppercase">Control Dashboard</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#232B28] mt-1">{dict.admin.title}</h1>
          <p className="font-sans text-xs md:text-sm text-[#232B28]/60 mt-1">{dict.admin.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'products' && !showForm && (
            <button
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
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
            className="px-5 py-3 border border-red-200 hover:bg-red-50 text-red-500 font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Backend Alert Warning */}
      {errorNotice && (
        <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex items-center gap-3 text-amber-800 text-xs font-semibold shadow-xs relative z-10 animate-pulse">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Metrics Row Section */}
      {!showForm && (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
          {/* Card 1: Total Revenue */}
          <div className="bg-white border border-[#232B28]/10 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-row items-center gap-3 sm:gap-4 hover:border-[#B35C37]/20 transition-all">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <DollarSign size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#232B28]/50 uppercase tracking-wider">{locale === 'it' ? 'Fatturato Totale' : 'Total Revenue'}</span>
              <span className="font-serif text-base sm:text-lg md:text-2xl font-bold text-[#232B28] mt-0.5">€{totalRevenue.toFixed(2)}</span>
            </div>
          </div>

          {/* Card 2: Orders Count */}
          <div className="bg-white border border-[#232B28]/10 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-row items-center gap-3 sm:gap-4 hover:border-[#B35C37]/20 transition-all">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <ShoppingBag size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#232B28]/50 uppercase tracking-wider">{locale === 'it' ? 'Ordini Attivi' : 'Active Orders'}</span>
              <span className="font-serif text-base sm:text-lg md:text-2xl font-bold text-[#232B28] mt-0.5">{activeOrdersCount} {locale === 'it' ? 'In Corso' : 'Pending'}</span>
            </div>
          </div>

          {/* Card 3: Products Count */}
          <div className="bg-white border border-[#232B28]/10 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-row items-center gap-3 sm:gap-4 hover:border-[#B35C37]/20 transition-all">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <FileText size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#232B28]/50 uppercase tracking-wider">{locale === 'it' ? 'Catalogo Prodotti' : 'Catalog Products'}</span>
              <span className="font-serif text-base sm:text-lg md:text-2xl font-bold text-[#232B28] mt-0.5">{products.length} {locale === 'it' ? 'Articoli' : 'Items'}</span>
            </div>
          </div>

          {/* Card 4: Inquiries */}
          <div className="bg-white border border-[#232B28]/10 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-row items-center gap-3 sm:gap-4 hover:border-[#B35C37]/20 transition-all">
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
              <Mail size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#232B28]/50 uppercase tracking-wider">{locale === 'it' ? 'Richieste Clienti' : 'Total Inquiries'}</span>
              <span className="font-serif text-base sm:text-lg md:text-2xl font-bold text-[#232B28] mt-0.5">{inquiries.length} {locale === 'it' ? 'Messaggi' : 'Inbox'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Switcher Navigation */}
      <div className="flex border-b border-[#232B28]/10 gap-6 md:gap-8 font-sans text-xs font-bold uppercase tracking-wider overflow-x-auto [&::-webkit-scrollbar]:hidden relative z-10">
        <button
          onClick={() => { setActiveTab('products'); setShowForm(false); }}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'products' ? 'border-[#B35C37] text-[#B35C37]' : 'border-transparent text-[#232B28]/60 hover:text-[#232B28]'
          }`}
        >
          <FileText size={14} />
          <span>{dict.admin.tab_products}</span>
        </button>

        <button
          onClick={() => { setActiveTab('orders'); setShowForm(false); }}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'orders' ? 'border-[#B35C37] text-[#B35C37]' : 'border-transparent text-[#232B28]/60 hover:text-[#232B28]'
          }`}
        >
          <ShoppingBag size={14} />
          <span>{locale === 'it' ? 'Gestione Ordini' : 'Manage Orders'}</span>
        </button>

        <button
          onClick={() => { setActiveTab('inquiries'); setShowForm(false); }}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'inquiries' ? 'border-[#B35C37] text-[#B35C37]' : 'border-transparent text-[#232B28]/60 hover:text-[#232B28]'
          }`}
        >
          <Mail size={14} />
          <span>{dict.admin.tab_inquiries}</span>
        </button>

        <button
          onClick={() => { setActiveTab('profile'); setShowForm(false); }}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'profile' ? 'border-[#B35C37] text-[#B35C37]' : 'border-transparent text-[#232B28]/60 hover:text-[#232B28]'
          }`}
        >
          <User size={14} />
          <span>{locale === 'it' ? 'Profilo e Impostazioni' : 'Profile & Settings'}</span>
        </button>
      </div>

      {/* Main Tab View Rendering */}
      {loading ? (
        <div className="text-center py-24 font-sans text-sm text-[#232B28]/60 flex flex-col items-center gap-3 relative z-10">
          <Loader2 className="animate-spin text-[#B35C37]" size={28} />
          <span>Loading Dashboard Data...</span>
        </div>
      ) : showForm ? (
        
        /* ADD / EDIT FORM & PREVIEW PANEL */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
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
                  <option value="kurtis">{dict.categories.kurtis}</option>
                  <option value="onepiece">{dict.categories.onepiece}</option>
                  <option value="summer-dresses">{(dict.categories as any)["summer-dresses"] || "Summer Dresses"}</option>
                  <option value="indo-western">{(dict.categories as any)["indo-western"] || "Indo-Western"}</option>
                  <option value="jewelry-oxidized">{(dict.categories as any)["jewelry-oxidized"] || "Oxidized Jewelry"}</option>
                  <option value="jewelry-anklets">{(dict.categories as any)["jewelry-anklets"] || "Anklets"}</option>
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

          {/* Live Preview Card (Right Column) */}
          <div className="lg:col-span-1 lg:sticky lg:top-28 flex flex-col gap-6">
            <div className="bg-white border border-[#232B28]/10 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
              <h3 className="font-serif text-base font-bold text-[#232B28] border-b border-[#232B28]/5 pb-2">
                {locale === 'it' ? 'Anteprima in Tempo Reale' : 'Real-time Live Preview'}
              </h3>
              
              <div className="bg-[#FAF8F5] border border-[#232B28]/10 rounded-xl overflow-hidden flex flex-col h-full shadow-2xs">
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
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-[#FAF8F5]/90 backdrop-blur-xs text-[#232B28] font-sans font-semibold text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs border border-[#232B28]/5">
                    {(dict.categories as any)[formData.category] || formData.category}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div className="mb-3">
                    <span className="text-[10px] font-medium text-[#232B28]/60 tracking-wider font-sans uppercase">
                      {formData.materials.split(',').filter(Boolean).join(' • ')}
                    </span>
                    <h4 className="font-serif text-[15px] font-bold text-[#232B28] leading-tight mt-1 line-clamp-2">
                      {(locale === 'it' ? formData.it_name : formData.en_name) || 'Product Name'}
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
          </div>
        </div>
      ) : activeTab === 'products' ? (
        
        /* PRODUCTS LIST TAB */
        <div className="overflow-x-auto border border-[#232B28]/10 rounded-2xl bg-white shadow-xs relative z-10">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#232B28]/10 text-[#232B28]/60 font-semibold uppercase tracking-wider text-xs">
                <th className="p-4 min-w-[100px]">SKU</th>
                <th className="p-4 min-w-[200px]">{locale === 'it' ? 'Nome' : 'Name'}</th>
                <th className="p-4 min-w-[120px]">{dict.admin.category}</th>
                <th className="p-4 min-w-[80px]">{dict.admin.price}</th>
                <th className="p-4 min-w-[80px]">{dict.admin.stock}</th>
                <th className="p-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => {
                const name = locale === 'it' ? prod.it.name : prod.en.name;
                return (
                  <tr key={prod.sku} className="border-b border-[#232B28]/5 hover:bg-stone-50/50 transition-colors">
                    <td className="p-4 font-bold text-[#232B28] whitespace-nowrap">{prod.sku}</td>
                    <td className="p-4 font-serif font-bold text-base text-[#232B28] min-w-[200px]">{name}</td>
                    <td className="p-4 capitalize whitespace-nowrap">{(dict.categories as any)[prod.category] || prod.category}</td>
                    <td className="p-4 font-bold text-[#B35C37] whitespace-nowrap">€{prod.price.toFixed(2)}</td>
                    <td className="p-4 font-medium whitespace-nowrap">{prod.stock}</td>
                    <td className="p-4 text-right flex justify-end gap-2 whitespace-nowrap min-w-[100px]">
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
      ) : activeTab === 'orders' ? (
        
        /* ORDERS MANAGEMENT DASHBOARD TAB */
        <div className="flex flex-col gap-6 relative z-10">
          {orders.length > 0 ? (
            <div className="flex flex-col gap-6">
              {orders.map((ord) => (
                <div 
                  key={ord._id}
                  className="bg-white border border-[#232B28]/10 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row gap-6 justify-between items-start hover:border-[#B35C37]/15 transition-all"
                >
                  {/* Customer Information & Summary */}
                  <div className="flex flex-col gap-2 min-w-[240px]">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base text-[#232B28]">Order #{ord._id.substring(ord._id.length - 8)}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        ord.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        ord.status === 'processing' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        ord.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        ord.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#232B28]/40 font-medium">Placed on: {new Date(ord.createdAt).toLocaleString()}</span>
                    
                    <div className="flex flex-col gap-1 mt-2 text-xs font-sans text-[#232B28]/85">
                      <p><span className="font-bold">Email:</span> {ord.email}</p>
                      <p className="font-bold text-[#B35C37] mt-1 text-sm">Total: €{ord.total.toFixed(2)}</p>
                    </div>

                    {/* Order Action Controllers */}
                    <div className="flex items-center gap-3 mt-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                        className="bg-[#FAF8F5] border border-[#232B28]/15 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#232B28]/80 focus:outline-none focus:border-[#B35C37] cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => handleDeleteOrder(ord._id)}
                        className="p-2 border border-red-100 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Order"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Items Breakdown list */}
                  <div className="flex-grow flex flex-col gap-3 w-full lg:max-w-2xl border-t lg:border-t-0 lg:border-l border-[#232B28]/10 pt-4 lg:pt-0 lg:pl-6">
                    <span className="text-[10px] font-bold text-[#232B28]/40 uppercase tracking-wider">{locale === 'it' ? 'Articoli Ordinati' : 'Items Ordered'}</span>
                    <div className="flex flex-col gap-2.5">
                      {ord.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-center bg-[#FAF8F5]/60 p-2.5 rounded-xl border border-[#232B28]/5">
                          <div className="relative w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 border border-[#232B28]/5">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow font-sans text-xs">
                            <h4 className="font-serif font-bold text-[#232B28] leading-tight line-clamp-1">{item.name}</h4>
                            <p className="text-[10px] text-[#232B28]/50 mt-0.5">Size: <span className="font-bold text-[#232B28]">{item.size}</span> | SKU: {item.sku}</p>
                            <p className="text-[10px] text-[#B35C37] font-semibold mt-1">€{item.price.toFixed(2)} x {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-[#232B28]/10 rounded-xl font-serif text-lg text-[#232B28]/60">
              {locale === 'it' ? 'Nessun ordine trovato nel database.' : 'No orders found in database.'}
            </div>
          )}
        </div>
      ) : activeTab === 'inquiries' ? (
        
        /* CUSTOMER INQUIRIES TAB */
        <div className="flex flex-col gap-6 relative z-10">
          {inquiries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inquiries.map((inq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#232B28]/10 rounded-2xl p-5 shadow-xs flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between border-b border-[#232B28]/5 pb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      inq.type === 'newsletter' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-orange-50 text-orange-600 border-orange-200'
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
      ) : (
        
        /* OWNER SETTINGS TAB */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10 font-sans">
          {/* Profile Card Summary Panel */}
          <div className="lg:col-span-1 bg-white border border-[#232B28]/10 rounded-3xl p-6 shadow-xs flex flex-col items-center gap-5 hover:border-[#B35C37]/15 transition-all text-center">
            <span className="text-[10px] font-bold text-[#B35C37] tracking-widest uppercase mb-1">Owner Card</span>
            
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#B35C37]/20 shadow-lg">
              <img 
                src={adminProfile.avatar} 
                alt={adminProfile.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <h3 className="font-serif text-xl font-bold text-[#232B28]">{adminProfile.name}</h3>
              <p className="text-[11px] text-[#B35C37] font-semibold uppercase tracking-wider">Owner / Administrator</p>
              <p className="text-xs text-[#232B28]/50 mt-1">{adminProfile.email}</p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#232B28]/5 rounded-2xl p-4 text-xs text-[#232B28]/80 leading-relaxed italic mt-2">
              "{adminProfile.bio}"
            </div>

            <div className="flex flex-col gap-2 w-full mt-4">
              <button
                onClick={() => { setEditingProfile(true); setEditingCredentials(false); }}
                className="w-full py-2.5 bg-[#FAF8F5] border border-[#232B28]/15 hover:bg-stone-50 text-[#232B28] font-bold text-xs uppercase rounded-xl tracking-wider cursor-pointer transition-colors"
              >
                Edit Profile Info
              </button>
              <button
                onClick={() => { setEditingCredentials(true); setEditingProfile(false); }}
                className="w-full py-2.5 bg-[#FAF8F5] border border-[#232B28]/15 hover:bg-stone-50 text-[#B35C37] font-bold text-xs uppercase rounded-xl tracking-wider cursor-pointer transition-colors"
              >
                Change Credentials
              </button>
            </div>
          </div>

          {/* Edit Details Block */}
          <div className="lg:col-span-2">
            {editingProfile ? (
              <form onSubmit={handleUpdateProfileSubmit} className="bg-white border border-[#232B28]/10 rounded-3xl p-6 md:p-8 flex flex-col gap-5 shadow-xs animate-fade-in">
                <div className="flex items-center gap-2 border-b border-[#232B28]/10 pb-3">
                  <User className="text-[#B35C37]" size={20} />
                  <h2 className="font-serif text-xl font-bold text-[#232B28]">{locale === 'it' ? 'Modifica Dati Profilo' : 'Edit Profile Information'}</h2>
                </div>

                <div className="flex flex-col gap-1.5 text-sm">
                  <label className="font-bold text-[#232B28]/70">{locale === 'it' ? 'Nome Proprietario' : 'Owner Name'}</label>
                  <input
                    type="text"
                    required
                    value={profileFormData.name}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="border border-[#232B28]/15 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#B35C37] text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-sm">
                  <label className="font-bold text-[#232B28]/70">Bio / Description</label>
                  <textarea
                    required
                    rows={4}
                    value={profileFormData.bio}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="border border-[#232B28]/15 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#B35C37] text-xs resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-sm">
                  <label className="font-bold text-[#232B28]/70">Avatar Image</label>
                  <div className="flex gap-3 items-center">
                    {profileFormData.avatar && (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#232B28]/15 flex-shrink-0 bg-stone-50 shadow-xs">
                        <img src={profileFormData.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-grow flex flex-col sm:flex-row gap-2 sm:items-center w-full">
                      <input
                        type="text"
                        required
                        value={profileFormData.avatar}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, avatar: e.target.value }))}
                        placeholder="Image URL or upload a file"
                        className="flex-grow border border-[#232B28]/15 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#B35C37] text-xs font-mono w-full"
                      />
                      <label className="flex-shrink-0 px-4 py-2.5 bg-[#FAF8F5] border border-[#232B28]/15 hover:bg-stone-50 text-[#B35C37] font-bold text-xs uppercase rounded-xl tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto">
                        <UploadCloud size={14} />
                        <span>{avatarUploading ? "..." : "Upload"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={avatarUploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-[#232B28]/10 pt-5 mt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    className="px-5 py-2.5 border border-[#232B28]/15 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-bold text-xs uppercase rounded-xl tracking-wider cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : editingCredentials ? (
              <form onSubmit={handleUpdateCredentialsSubmit} className="bg-white border border-[#232B28]/10 rounded-3xl p-6 md:p-8 flex flex-col gap-5 shadow-xs animate-fade-in">
                <div className="flex items-center gap-2 border-b border-[#232B28]/10 pb-3">
                  <Key className="text-[#B35C37]" size={20} />
                  <h2 className="font-serif text-xl font-bold text-[#232B28]">{locale === 'it' ? 'Cambia Credenziali di Accesso' : 'Change Login Credentials'}</h2>
                </div>

                <div className="flex flex-col gap-1.5 text-sm">
                  <label className="font-bold text-[#232B28]/70">Login Email Address</label>
                  <input
                    type="email"
                    required
                    value={credentialsFormData.email}
                    onChange={(e) => setCredentialsFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="border border-[#232B28]/15 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#B35C37] text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-sm">
                  <label className="font-bold text-[#232B28]/70">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={credentialsFormData.password}
                    onChange={(e) => setCredentialsFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="border border-[#232B28]/15 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#B35C37] text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-sm">
                  <label className="font-bold text-[#232B28]/70">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={credentialsFormData.confirmPassword}
                    onChange={(e) => setCredentialsFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="border border-[#232B28]/15 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#B35C37] text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-[#232B28]/10 pt-5 mt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCredentials(false)}
                    className="px-5 py-2.5 border border-[#232B28]/15 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-bold text-xs uppercase rounded-xl tracking-wider cursor-pointer transition-colors"
                  >
                    Update Credentials
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white border border-[#232B28]/10 rounded-3xl p-6 md:p-8 flex flex-col gap-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-[#232B28]/10 pb-3">
                  <Shield className="text-[#B35C37]" size={20} />
                  <h2 className="font-serif text-xl font-bold text-[#232B28]">Security & Management</h2>
                </div>
                <p className="text-xs text-[#232B28]/70 leading-relaxed">
                  Welcome to the security settings portal. Here you can edit the visible owner metadata displayed in the administration panels or reset login details.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 bg-[#FAF8F5] border border-[#232B28]/5 rounded-2xl flex flex-col gap-1.5">
                    <span className="font-serif font-bold text-sm text-[#232B28]">Database Health</span>
                    <p className="text-[11px] text-[#232B28]/60">Checking system connection: MongoDB is connected when running live. Working with fallback JSON databases for offline environment.</p>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] border border-[#232B28]/5 rounded-2xl flex flex-col gap-1.5">
                    <span className="font-serif font-bold text-sm text-[#232B28]">Active Administration</span>
                    <p className="text-[11px] text-[#232B28]/60">Current logged in admin email is <span className="font-bold text-[#B35C37]">{adminProfile.email}</span>. Click Change Credentials on the card to modify.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
export const dynamic = 'force-dynamic';
