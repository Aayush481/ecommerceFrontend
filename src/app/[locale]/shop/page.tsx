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
    images: [
      'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 15,
    featured: true,
    it: {
      name: 'Kurti Etnica in Seta di Varanasi',
      description: 'Questa splendida tunica in pura seta di Varanasi unisce la maestria degli artigiani indiani con un taglio fluido ed elegante, perfetto per le occasioni speciali.',
      tags: ['seta', 'elegante', 'cerimonia', 'kurtis']
    },
    en: {
      name: 'Varanasi Silk Ethnic Kurti',
      description: 'This gorgeous pure Varanasi silk tunic combines Indian artisanal craftsmanship with a fluid, elegant silhouette, perfect for special occasions.',
      tags: ['silk', 'elegant', 'occasion', 'kurtis']
    }
  },
  {
    sku: 'OP-LND-002',
    price: 119.99,
    category: 'onepiece',
    materials: ['Linen', 'Bamboo Viscose'],
    sizes: ['S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 12,
    featured: true,
    it: {
      name: 'Abito Intero Elegante in Lino',
      description: 'Un abito monopezzo moderno e fresco che fonde l\'eleganza del drappeggio indiano con il minimalismo geometrico italiano. Realizzato in lino premium.',
      tags: ['lino', 'onepiece', 'abito', 'elegante']
    },
    en: {
      name: 'Elegant One-Piece Linen Dress',
      description: 'A modern one-piece dress fusing the elegance of Indian drapery with modern Italian geometric minimalism. Made from premium fresh linen.',
      tags: ['linen', 'onepiece', 'dress', 'elegant']
    }
  },
  {
    sku: 'SD-JAI-003',
    price: 64.99,
    category: 'summer-dresses',
    materials: ['Cotton', 'Mulmul'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 22,
    featured: true,
    it: {
      name: 'Vestito Estivo in Cotone di Jaipur',
      description: 'Leggero e traspirante, questo abito estivo in cotone Mulmul presenta tradizionali stampe a blocco fatte a mano da Jaipur.',
      tags: ['cotone', 'stampato', 'estate', 'abito']
    },
    en: {
      name: 'Jaipur Cotton Summer Dress',
      description: 'Lightweight and highly breathable, this summer dress made of Mulmul cotton features traditional hand-block prints from Jaipur.',
      tags: ['cotton', 'printed', 'summer', 'dress']
    }
  },
  {
    sku: 'IW-FUS-004',
    price: 49.99,
    category: 'indo-western',
    materials: ['Khadi Cotton'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 30,
    featured: true,
    it: {
      name: 'Tunica Indo-Western in Cotone Khadi',
      description: 'Perfetta fusione tra linee casual occidentali e filati Khadi tradizionali. Taglio asimmetrico moderno.',
      tags: ['cotone', 'khadi', 'fusion', 'indo-western']
    },
    en: {
      name: 'Indo-Western Khadi Cotton Tunic',
      description: 'A perfect fusion between casual Western lines and traditional handspun Khadi fibers.',
      tags: ['cotton', 'khadi', 'fusion', 'indo-western']
    }
  },
  {
    sku: 'ETH-BAN-009',
    price: 149.99,
    category: 'ethnic-indian',
    materials: ['Banarasi Silk', 'Zari Border'],
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 8,
    featured: true,
    it: {
      name: 'Lehenga Reale in Seta Banarasi',
      description: 'Uno splendido completo Lehenga tradizionale ricavato da autentica seta Banarasi, ornato da ricami in vero filo d\'oro (Zari).',
      tags: ['seta', 'banarasi', 'lehenga', 'etnico']
    },
    en: {
      name: 'Royal Banarasi Lehenga Set',
      description: 'A gorgeous traditional Lehenga set crafted from authentic Banarasi silk, adorned with real gold thread (Zari) borders.',
      tags: ['silk', 'banarasi', 'lehenga', 'ethnic']
    }
  },
  {
    sku: 'JW-OXD-005',
    price: 34.99,
    category: 'jewelry-oxidized',
    materials: ['Oxidized Silver Alloy'],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 50,
    featured: true,
    it: {
      name: 'Girocollo Mandala in Argento Ossido',
      description: 'Girocollo artigianale in argento ossidato con dettagliato motivo Mandala tradizionale.',
      tags: ['argento', 'ossidato', 'collana', 'gioielli']
    },
    en: {
      name: 'Oxidized Silver Mandala Choker',
      description: 'Artisanal oxidized silver choker featuring a traditional Mandala motif.',
      tags: ['silver', 'oxidized', 'necklace', 'jewelry']
    }
  },
  {
    sku: 'JW-MOD-010',
    price: 29.99,
    category: 'jewelry-modern',
    materials: ['Brass', 'Gold Plating'],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 25,
    featured: false,
    it: {
      name: 'Pendente Geometrico Moderno in Ottone',
      description: 'Pendente geometrico contemporaneo in ottone con finitura spazzolata placcata oro. Design minimalista.',
      tags: ['moderno', 'ottone', 'minimalista', 'gioielli']
    },
    en: {
      name: 'Geometric Brass Modern Pendant',
      description: 'Contemporary geometric brass pendant with a brushed gold-plated finish.',
      tags: ['modern', 'brass', 'minimalist', 'jewelry']
    }
  },
  {
    sku: 'JW-HDC-011',
    price: 39.99,
    category: 'jewelry-handcuffs',
    materials: ['Brass', 'Kundan Stones'],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 15,
    featured: false,
    it: {
      name: 'Bracciale Rigido Kundan Handcuff',
      description: 'Bracciale rigido tipo cuff impreziosito da tradizionali pietre Kundan incastonate a mano.',
      tags: ['bracciale', 'rigido', 'kundan', 'gioielli']
    },
    en: {
      name: 'Kundan Cuff Handcuff Bracelet',
      description: 'Traditional Kundan cuff bracelet adorned with hand-set glass stones.',
      tags: ['bracelet', 'cuff', 'kundan', 'jewelry']
    }
  },
  {
    sku: 'JW-BRC-012',
    price: 19.99,
    category: 'jewelry-bracelets',
    materials: ['Sterling Silver', 'Amethyst Beads'],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 35,
    featured: false,
    it: {
      name: 'Bracciale in Perline d\'Argento e Ametista',
      description: 'Braccialetto elastico composto da perline in argento sterling 925 e ametista naturale.',
      tags: ['braccialetto', 'argento', 'ametista', 'gioielli']
    },
    en: {
      name: 'Silver Beaded Amethyst Bracelet',
      description: 'Elastic beaded bracelet made of 925 sterling silver beads and authentic natural amethyst gemstones.',
      tags: ['bracelet', 'silver', 'amethyst', 'jewelry']
    }
  },
  {
    sku: 'JW-NEC-013',
    price: 45.00,
    category: 'jewelry-necklace',
    materials: ['Brass Alloy', 'Red Ruby Stones'],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 20,
    featured: false,
    it: {
      name: 'Collana Etnica Temple Border',
      description: 'Collana d\'ispirazione Temple indiana con incisioni divine e pietre sintetiche color rubino.',
      tags: ['collana', 'temple', 'rubino', 'gioielli']
    },
    en: {
      name: 'Temple Border Heritage Necklace',
      description: 'Indian temple-border style necklace featuring intricate heritage engravings and red ruby-colored glass stones.',
      tags: ['necklace', 'temple', 'ruby', 'jewelry']
    }
  },
  {
    sku: 'JW-JHU-006',
    price: 24.99,
    category: 'jewelry-earrings',
    materials: ['Oxidized Silver', 'Beads'],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 40,
    featured: false,
    it: {
      name: 'Orecchini Jhumka Etnici Pendenti',
      description: 'Orecchini tradizionali a campana in metallo ossidato anticato indiano.',
      tags: ['orecchini', 'jhumka', 'ossidato', 'gioielli']
    },
    en: {
      name: 'Oxidized Ethnic Jhumka Earrings',
      description: 'Traditional bell-shaped earrings in antique-finished oxidized metal.',
      tags: ['earrings', 'jhumka', 'oxidized', 'jewelry']
    }
  },
  {
    sku: 'BAG-JAI-007',
    price: 45.00,
    category: 'handbags',
    materials: ['Organic Cotton Canvas', 'Mirror Embroidery'],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 20,
    featured: true,
    it: {
      name: 'Borsa a Mano Jaipur Ricamata',
      description: 'Borsa a mano colorata e ricamata con piccoli specchi tradizionali di Jaipur.',
      tags: ['borsa', 'ricamo', 'specchi', 'accessori']
    },
    en: {
      name: 'Jaipur Embroidered Handbag',
      description: 'Colorful handbag embellished with traditional mirror embroidery from Jaipur.',
      tags: ['bag', 'embroidery', 'mirror', 'accessories']
    }
  },
  {
    sku: 'MAT-KHA-008',
    price: 15.00,
    category: 'handcraft-material',
    materials: ['100% Handspun Khadi Cotton'],
    sizes: ['1 Meter'],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 100,
    featured: false,
    it: {
      name: 'Tessuto in Cotone Khadi Grezzo (al metro)',
      description: 'Tessuto biologico filato e tessuto a mano in India. Perfetto per sarti e designer.',
      tags: ['tessuto', 'khadi', 'cotone', 'artigianale']
    },
    en: {
      name: 'Raw Khadi Cotton Fabric (per meter)',
      description: 'Organic handspun and handwoven cotton fabric from India.',
      tags: ['fabric', 'khadi', 'cotton', 'handcraft']
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
