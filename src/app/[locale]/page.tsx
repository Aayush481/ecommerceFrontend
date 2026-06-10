import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { getDictionary } from '@/dictionaries';
import { ProductCard } from '@/components/ProductCard';

import { getApiUrl } from '@/utils/api';

// Local mock products for zero-setup fallback
const localMockProducts = [
  {
    sku: 'KUR-VAR-001',
    price: 89.99,
    category: 'kurtis',
    materials: ['Varanasi Silk', 'Zari Thread'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 30,
    featured: true,
    it: {
      name: 'Tunica Quotidiana in Cotone Khadi',
      description: 'Ideale per le calde giornate estive in Italia, questa tunica traspirante in 100% cotone Khadi filato a mano offre un comfort ineguagliabile e uno stile casual-chic.',
      tags: ['cotone', 'khadi', 'comodo']
    },
    en: {
      name: 'Khadi Cotton Daily Tunic',
      description: 'Ideal for hot summer days, this breathable tunic made of 100% handspun Khadi cotton offers unmatched comfort and a minimalist casual-chic style.',
      tags: ['cotton', 'khadi', 'comfortable']
    }
  },
  {
    sku: 'MOD-FUS-003',
    price: 119.99,
    category: 'modern',
    materials: ['Linen', 'Bamboo Viscose'],
    sizes: ['S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
    ],
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
  }
];

async function fetchFeaturedProducts() {
  try {
    const res = await fetch(getApiUrl('/api/products'), {
      next: { revalidate: 60 } // cache for 60 seconds
    });
    if (res.ok) {
      const data = await res.json();
      const featured = data.filter((p: any) => p.featured);
      return featured.length > 0 ? featured : data.slice(0, 4);
    }
  } catch (e) {
    console.warn('[LandingPage] Express server unreachable. Using local mock dataset.');
  }
  return localMockProducts;
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as 'it' | 'en');
  const products = await fetchFeaturedProducts();

  const categories = [
    {
      id: 'kurtis',
      title: dict.categories.kurtis,
      desc: dict.categories.kurtis_desc,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'dailywear',
      title: dict.categories.dailywear,
      desc: dict.categories.dailywear_desc,
      image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'modern',
      title: dict.categories.modern,
      desc: dict.categories.modern_desc,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'jewelry',
      title: dict.categories.jewelry,
      desc: dict.categories.jewelry_desc,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative h-[85vh] md:h-[90vh] flex items-center justify-center bg-[#232B28] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1600"
            alt="Sita & Seta Banner"
            fill
            priority
            className="object-cover object-center opacity-40 scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#232B28]/95 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-8 flex flex-col items-center gap-6">
          <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#B35C37] bg-[#B35C37]/10 px-4 py-1.5 rounded-full border border-[#B35C37]/25 animate-fade-in">
            {locale === 'it' ? 'Collezione Italiana' : 'Italian Curated Collection'}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAF8F5] leading-tight">
            {dict.hero.title}
          </h1>
          <p className="font-sans text-base md:text-lg text-[#FAF8F5]/80 max-w-2xl leading-relaxed">
            {dict.hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <Link
              href={`/${locale}/shop`}
              className="flex items-center gap-2 px-8 py-4 bg-[#B35C37] hover:bg-[#B35C37]/95 text-white font-sans font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer group"
            >
              <span>{dict.hero.cta}</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Curation Highlights */}
      <section className="py-12 bg-[#FAF8F5] border-b border-[#232B28]/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-[#B35C37]/10 rounded-full text-[#B35C37]">
              <Sparkles size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#232B28]">
              {locale === 'it' ? 'Manifattura Pregiata' : 'Artisanal Weaving'}
            </h3>
            <p className="font-sans text-sm text-[#232B28]/70 leading-relaxed max-w-xs">
              {locale === 'it'
                ? 'Tessuti in seta e cotone selezionati a mano dai migliori artigiani di Jaipur e Varanasi.'
                : 'Handpicked silk and cotton textiles sourced directly from top master weavers in Jaipur and Varanasi.'}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-[#B35C37]/10 rounded-full text-[#B35C37]">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#232B28]">
              {locale === 'it' ? 'Qualità Certificata' : 'Italian Fit & Quality'}
            </h3>
            <p className="font-sans text-sm text-[#232B28]/70 leading-relaxed max-w-xs">
              {locale === 'it'
                ? 'Tagli e taglie ottimizzati per garantire una vestibilità perfetta secondo gli standard italiani.'
                : 'Cuts and sizes adjusted to ensure a flawless silhouette according to high Italian standards.'}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-[#B35C37]/10 rounded-full text-[#B35C37]">
              <Heart size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#232B28]">
              {locale === 'it' ? 'Ecosostenibile' : 'Sustainable Choice'}
            </h3>
            <p className="font-sans text-sm text-[#232B28]/70 leading-relaxed max-w-xs">
              {locale === 'it'
                ? 'Fibre naturali biologiche stampate con tinte vegetali prive di tossine nocive.'
                : 'Organic natural fibers dyed using pure botanical elements, free of chemical toxins.'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Category Grid Section */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16 flex flex-col gap-3">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#232B28]">{dict.categories.title}</h2>
            <p className="font-sans text-sm md:text-base text-[#232B28]/70 max-w-lg mx-auto">{dict.categories.subtitle}</p>
            <div className="w-16 h-1 bg-[#B35C37] mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/shop?category=${cat.id}`}
                className="group relative h-96 rounded-2xl overflow-hidden card-hover block shadow-xs border border-[#232B28]/5"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#232B28]/90 via-[#232B28]/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col gap-2">
                  <h3 className="font-serif text-xl font-bold">{cat.title}</h3>
                  <p className="font-sans text-xs text-white/80 leading-relaxed line-clamp-2">{cat.desc}</p>
                  <span className="font-sans text-[11px] font-semibold tracking-wider uppercase text-[#B35C37] group-hover:text-white transition-colors flex items-center gap-1 mt-2">
                    {locale === 'it' ? 'Esplora' : 'Explore'} <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brand Quote Curation */}
      <section className="py-24 bg-[#232B28] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1200"
            alt="Fabric details"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 flex flex-col items-center gap-6">
          <span className="font-serif italic text-lg text-[#B35C37]">Moda Sita & Seta</span>
          <blockquote className="font-serif text-2xl md:text-3xl font-bold leading-relaxed italic text-[#FAF8F5]">
            {locale === 'it'
              ? '"L\'eleganza non è farsi notare, ma farsi ricordare. Abbiamo unito i colori accesi del sole indiano con le linee fluide e minimaliste della sartoria milanese."'
              : '"Elegance is not about being noticed, but being remembered. We have merged the bright colors of the Indian sun with the clean, minimalist lines of Milanese design."'}
          </blockquote>
          <span className="font-sans text-xs tracking-widest uppercase font-semibold text-white/50">
            - Sita & Seta Design Studio Milano
          </span>
        </div>
      </section>

      {/* 5. Featured Products Catalog */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16 flex flex-col gap-3">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#232B28]">{dict.featured.title}</h2>
            <p className="font-sans text-sm md:text-base text-[#232B28]/70 max-w-lg mx-auto">{dict.featured.subtitle}</p>
            <div className="w-16 h-1 bg-[#B35C37] mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((prod: any) => (
              <ProductCard key={prod.sku} product={prod} locale={locale as 'it' | 'en'} dict={dict} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href={`/${locale}/shop`}
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#232B28] hover:bg-[#232B28] hover:text-white text-[#232B28] font-sans font-bold text-sm tracking-wider uppercase rounded-xl transition-all cursor-pointer"
            >
              <span>{locale === 'it' ? 'Vedi Tutto il Catalogo' : 'View Full Catalog'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
export const dynamic = 'force-dynamic';
