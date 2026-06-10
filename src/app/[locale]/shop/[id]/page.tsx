import React from 'react';
import { getDictionary } from '@/dictionaries';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import type { Metadata } from 'next';

import { getApiUrl } from '@/utils/api';

const localMockProducts = [
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

async function fetchProduct(id: string) {
  try {
    const res = await fetch(getApiUrl(`/api/products/${id}`), {
      next: { revalidate: 0 }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[DetailPage] Express server offline. Sourcing product from local mock list.');
  }

  // Fallback lookups
  return localMockProducts.find(p => p.sku === id) || null;
}

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await fetchProduct(id);
  if (!product) {
    return { title: 'Product Not Found | Sita & Seta' };
  }

  const details = locale === 'it' ? product.it : product.en;
  return {
    title: `${details.name} | Sita & Seta`,
    description: details.description.substring(0, 160),
    openGraph: {
      title: `${details.name} | Sita & Seta`,
      description: details.description,
      images: [{ url: product.images[0] }],
    }
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, id } = await params;
  const product = await fetchProduct(id);
  const dict = await getDictionary(locale as 'it' | 'en');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold">Product Not Found</h1>
        <p className="font-sans text-sm text-stone-500 mt-2">The product you are looking for does not exist in our catalog.</p>
      </div>
    );
  }

  const details = locale === 'it' ? product.it : product.en;

  // JSON-LD Structured Schema Markup for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    sku: product.sku,
    name: details.name,
    image: product.images,
    description: details.description,
    material: product.materials.join(', '),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `http://localhost:3000/${locale}/shop/${product.sku}`,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
    }
  };

  return (
    <>
      {/* Insert JSON-LD into head for crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ProductDetailClient product={product} locale={locale as 'it' | 'en'} dict={dict} />
    </>
  );
}
export const dynamic = 'force-dynamic';
