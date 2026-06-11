import React from 'react';
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import { ProductCard } from '@/components/ProductCard';
import { FilterSidebarClient } from '@/components/FilterSidebarClient';

import { getApiUrl } from '@/utils/api';

const materialsList = [
  'Varanasi Silk',
  'Khadi Cotton',
  'Linen',
  'Oxidized Silver Alloy',
  'Oxidized Silver',
  'Beads',
  'Zari Thread'
];

const fallbackCatalog = [
  {
    sku: 'KUR-VAR-001',
    price: 89.99,
    category: 'kurtis',
    materials: ['Varanasi Silk', 'Zari Thread'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'],
    stock: 15,
    featured: true,
    it: {
      name: 'Kurti Etnica in Seta di Varanasi',
      description: 'Questa splendida tunica in pura seta di Varanasi unisce la maestria degli artigiani indiani con un taglio fluido ed elegante, perfetto per le occasioni speciali.',
      tags: ['seta', 'elegante', 'cerimonia']
    },
    en: {
      name: 'Varanasi Silk Ethnic Kurti',
      description: 'This gorgeous pure Varanasi silk tunic combines Indian artisanal craftsmanship with a fluid, elegant silhouette, perfect for special occasions.',
      tags: ['silk', 'elegant', 'occasion']
    }
  },
  {
    sku: 'DW-KHA-002',
    price: 49.99,
    category: 'dailywear',
    materials: ['Khadi Cotton'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800'],
    stock: 30,
    featured: true,
    it: {
      name: 'Tunica Quotidiana in Cotone Khadi',
      description: 'Ideale per le calde giornate estive in Italia, questa tunica traspirante in 100% cotone Khadi filato a mano offre un comfort ineguagliabile.',
      tags: ['cotone', 'khadi', 'comodo']
    },
    en: {
      name: 'Khadi Cotton Daily Tunic',
      description: 'Ideal for hot summer days, this breathable tunic made of 100% handspun Khadi cotton offers unmatched comfort.',
      tags: ['cotton', 'khadi', 'comfortable']
    }
  },
  {
    sku: 'MOD-FUS-003',
    price: 119.99,
    category: 'modern',
    materials: ['Linen'],
    sizes: ['S', 'M', 'L'],
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'],
    stock: 12,
    featured: true,
    it: {
      name: 'Abito Fusion Contemporaneo in Lino',
      description: 'Un design moderno che fonde l\'eleganza del drappeggio indiano con il minimalismo geometrico italiano. Realizzato in fresco lino premium.',
      tags: ['lino', 'fusion', 'minimalista']
    },
    en: {
      name: 'Modern Fusion Linen Dress',
      description: 'A modern design fusing the elegance of Indian drapery with modern Italian geometric minimalism. Made from premium fresh linen.',
      tags: ['linen', 'fusion', 'minimalist']
    }
  },
  {
    sku: 'JW-MAN-004',
    price: 34.99,
    category: 'jewelry',
    materials: ['Oxidized Silver Alloy'],
    sizes: ['One Size'],
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'],
    stock: 50,
    featured: true,
    it: {
      name: 'Collana Ossidata Mandala Choker',
      description: 'Girocollo artigianale in argento ossidato con motivo Mandala tradizionale. Un pezzo d\'effetto che dona un tocco boho-chic.',
      tags: ['argento', 'ossidato', 'collana']
    },
    en: {
      name: 'Oxidized Mandala Choker',
      description: 'Artisanal oxidized silver choker featuring a traditional Mandala motif. A statement piece that adds a boho-chic touch.',
      tags: ['silver', 'oxidized', 'necklace']
    }
  },
  {
    sku: 'JW-JHU-005',
    price: 24.99,
    category: 'jewelry',
    materials: ['Oxidized Silver', 'Beads'],
    sizes: ['One Size'],
    images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800'],
    stock: 40,
    featured: false,
    it: {
      name: 'Orecchini Pendenti Jhumka Ossidati',
      description: 'Orecchini tradizionali a campana in metallo ossidato anticato. Decorati con piccole perline d\'argento e incisioni dettagliate.',
      tags: ['orecchini', 'jhumka', 'ossidato']
    },
    en: {
      name: 'Oxidized Ethnic Jhumka Earrings',
      description: 'Traditional bell-shaped earrings in antique-finished oxidized metal. Adorned with delicate silver beads and detailed engraving.',
      tags: ['earrings', 'jhumka', 'oxidized']
    }
  },
  {
    sku: 'KUR-COT-006',
    price: 64.99,
    category: 'kurtis',
    materials: ['Cotton'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['https://images.unsplash.com/photo-1561414927-6d86591d0c4f?auto=format&fit=crop&q=80&w=800'],
    stock: 22,
    featured: false,
    it: {
      name: 'Kurti Estivo in Cotone Stampato',
      description: 'Leggero e traspirante, questo kurti in cotone Mulmul presenta tradizionali stampe a blocco fatte a mano da Jaipur.',
      tags: ['cotone', 'stampato', 'estate']
    },
    en: {
      name: 'Summer Block-Printed Cotton Kurti',
      description: 'Lightweight and highly breathable, this Mulmul cotton kurti features traditional hand-block prints from Jaipur.',
      tags: ['cotton', 'printed', 'summer']
    }
  }
];

async function fetchProducts(queryParams: string) {
  try {
    const res = await fetch(getApiUrl(`/api/products?${queryParams}`), {
      next: { revalidate: 0 } // dynamic catalog
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[ShopPage] Express server unavailable. Performing local filter fallback.');
  }

  // Parse parameters manually for the local memory fallback
  const paramsObj = new URLSearchParams(queryParams);
  const category = paramsObj.get('category');
  const material = paramsObj.get('material');
  const search = paramsObj.get('search')?.toLowerCase();
  const maxPrice = paramsObj.get('maxPrice');
  const sort = paramsObj.get('sort');

  let filtered = [...fallbackCatalog];

  if (category) filtered = filtered.filter(p => p.category === category);
  if (material) filtered = filtered.filter(p => p.materials.some(m => m.toLowerCase().includes(material.toLowerCase())));
  if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));
  if (search) {
    filtered = filtered.filter(p => 
      p.sku.toLowerCase().includes(search) ||
      p.it.name.toLowerCase().includes(search) ||
      p.en.name.toLowerCase().includes(search) ||
      p.it.description.toLowerCase().includes(search) ||
      p.en.description.toLowerCase().includes(search)
    );
  }

  if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);

  return filtered;
}

interface ShopPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    material?: string;
    maxPrice?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  const { locale } = await params;
  const sParams = await searchParams;
  const dict = await getDictionary(locale as 'it' | 'en');

  // Construct query string for backend API
  const apiQuery = new URLSearchParams();
  if (sParams.category) apiQuery.set('category', sParams.category);
  if (sParams.material) apiQuery.set('material', sParams.material);
  if (sParams.maxPrice) apiQuery.set('maxPrice', sParams.maxPrice);
  if (sParams.search) apiQuery.set('search', sParams.search);
  if (sParams.sort) apiQuery.set('sort', sParams.sort);

  const products = await fetchProducts(apiQuery.toString());

  // Active filters for styling in layout
  const activeCategory = sParams.category || '';
  const activeMaterial = sParams.material || '';
  const activeSort = sParams.sort || 'featured';
  const activePrice = sParams.maxPrice || '150';
  const activeSearch = sParams.search || '';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col gap-3 mb-10">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#232B28]">{dict.shop.title}</h1>
        <p className="font-sans text-sm text-[#232B28]/60 uppercase tracking-widest">
          {locale === 'it' ? 'Curata per il mercato Italiano' : 'Curated for the Italian Taste'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* INTERACTIVE FILTERS SIDEBAR & DRAWER */}
        <FilterSidebarClient
          locale={locale as 'it' | 'en'}
          dict={dict}
          materialsList={materialsList}
        />

        {/* PRODUCTS LIST PANEL */}
        <main className="flex-grow">
          {/* Sorting Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#232B28]/10 pb-5 mb-8">
            <span className="font-sans text-xs text-[#232B28]/60 font-semibold tracking-wider uppercase">
              {products.length} {locale === 'it' ? 'prodotti trovati' : 'products found'}
            </span>

            <div className="hidden lg:flex items-center gap-3">
              <label htmlFor="sort" className="font-sans text-xs font-semibold text-[#232B28]/70 uppercase tracking-wider">
                {dict.shop.sort}:
              </label>
              <div className="flex gap-2 font-sans text-xs font-semibold">
                <Link
                  href={`/${locale}/shop?${new URLSearchParams({ ...sParams, sort: 'featured' })}`}
                  className={`px-3 py-1.5 rounded-md border ${activeSort === 'featured' ? 'bg-[#232B28] text-white border-[#232B28]' : 'bg-white border-[#232B28]/15 hover:bg-stone-50'}`}
                >
                  {dict.shop.sort_featured}
                </Link>
                <Link
                  href={`/${locale}/shop?${new URLSearchParams({ ...sParams, sort: 'price_asc' })}`}
                  className={`px-3 py-1.5 rounded-md border ${activeSort === 'price_asc' ? 'bg-[#232B28] text-white border-[#232B28]' : 'bg-white border-[#232B28]/15 hover:bg-stone-50'}`}
                >
                  € Min-Max
                </Link>
                <Link
                  href={`/${locale}/shop?${new URLSearchParams({ ...sParams, sort: 'price_desc' })}`}
                  className={`px-3 py-1.5 rounded-md border ${activeSort === 'price_desc' ? 'bg-[#232B28] text-white border-[#232B28]' : 'bg-white border-[#232B28]/15 hover:bg-stone-50'}`}
                >
                  € Max-Min
                </Link>
              </div>
            </div>
          </div>

          {/* Grid of Product Cards */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 pb-20 lg:pb-0">
              {products.map((product: any) => (
                <ProductCard key={product.sku} product={product} locale={locale as 'it' | 'en'} dict={dict} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-[#232B28]/10 rounded-xl">
              <p className="font-serif text-lg text-[#232B28]/70 mb-4">{dict.shop.no_products}</p>
              <Link
                href={`/${locale}/shop`}
                className="inline-block px-6 py-2.5 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white text-xs font-sans font-bold tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
              >
                Reset Filters
              </Link>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
