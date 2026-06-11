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

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const updated = [...imageUrls, data.url].join(', ');
        onChange(updated);
      } else {
        alert('Upload failed');
      }
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await uploadFile(file);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadFile(file);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData({
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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#232B28]">{dict.admin.title}</h1>
          <p className="font-sans text-sm text-[#232B28]/60 mt-2">{dict.admin.subtitle}</p>
        </div>

        {activeTab === 'products' && !showForm && (
          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            <span>{dict.admin.add_new}</span>
          </button>
        )}
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
        
        /* ADD / EDIT FORM PANEL */
        <form onSubmit={handleSaveProduct} className="bg-white border border-[#232B28]/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-2xs">
          <h2 className="font-serif text-2xl font-bold text-[#232B28] border-b border-[#232B28]/10 pb-3">
            {editingProduct ? dict.admin.edit_product : dict.admin.add_new}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-sm">
            
            {/* SKU */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#232B28]/80">{dict.admin.sku}</label>
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

            {/* Images Drag-and-Drop Uploader */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <ImageUploader
                images={formData.images}
                onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
                dict={dict}
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
