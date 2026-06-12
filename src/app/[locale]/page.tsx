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
      desc: locale === 'it'
        ? 'Tuniche etniche tradizionali in seta fine e ricami indiani fatti a mano.'
        : 'Traditional ethnic tunics in fine silk and hand-made Indian embroidery.',
      image: 'https://i.pinimg.com/originals/7e/78/13/7e78132ea4987ccee3ad2261b8470634.jpg'
    },
    {
      id: 'onepiece',
      title: dict.categories.onepiece,
      desc: locale === 'it'
        ? 'Eleganti abiti interi che fondono design contemporaneo ed elementi etnici.'
        : 'Elegant one-piece dresses fusing contemporary design and ethnic elements.',
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'summer-dresses',
      title: dict.categories["summer-dresses"] || 'Summer Dresses',
      desc: locale === 'it'
        ? 'Abiti freschi in cotone leggero e lino traspirante stampati a mano.'
        : 'Fresh dresses in lightweight cotton and breathable linen, printed by hand.',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'indo-western',
      title: dict.categories["indo-western"] || 'Indo-Western Wear',
      desc: locale === 'it'
        ? 'Tagli e silhouette asimmetrici moderni ispirati alla moda fusion orientale.'
        : 'Asymmetrical modern cuts and silhouettes inspired by Eastern fusion fashion.',
      image: 'https://i.pinimg.com/736x/9f/24/cb/9f24cb58beb1a2db9a45ff85f88c45a2.jpg'
    },
    {
      id: 'ethnic-indian',
      title: dict.categories["ethnic-indian"] || 'Ethnic & Indian',
      desc: locale === 'it'
        ? 'Capi tradizionali indiani d\'effetto per cerimonie ed occasioni speciali.'
        : 'Statement traditional Indian wear for ceremonies and special occasions.',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'jewelry-oxidized',
      title: dict.categories["jewelry-oxidized"] || 'Oxidized Jewelry',
      desc: locale === 'it'
        ? 'Bijoux d\'effetto in argento ossidato, girocolli mandala e orecchini jhumka.'
        : 'Statement antique oxidized silver bijoux, mandala chokers, and jhumka earrings.',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/11/WX/SM/SG/27266304/dual-tone-set-party-wear-390--1000x1000.jpeg'
    },
    {
      id: 'jewelry-modern',
      title: dict.categories["jewelry-modern"] || 'Modern Jewelry',
      desc: locale === 'it'
        ? 'Anelli, ciondoli e gioielli dal design contemporaneo e minimalista.'
        : 'Contemporary and minimalist design rings, pendants, and accessories.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'jewelry-handcuffs',
      title: dict.categories["jewelry-handcuffs"] || 'Handcuffs',
      desc: locale === 'it'
        ? 'Bracciali rigidi e tradizionali bangles indiani finemente decorati.'
        : 'Cuff bracelets and finely decorated traditional Indian bangles.',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'jewelry-bracelets',
      title: dict.categories["jewelry-bracelets"] || 'Bracelets',
      desc: locale === 'it'
        ? 'Braccialetti eleganti in argento, perline e pietre dure naturali.'
        : 'Elegant bracelets made of silver, beads, and natural semi-precious stones.',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'jewelry-necklace',
      title: dict.categories["jewelry-necklace"] || 'Necklaces',
      desc: locale === 'it'
        ? 'Collane d\'effetto, ciondoli decorati e collier fatti a mano.'
        : 'Statement necklaces, detailed pendants, and handcrafted colliers.',
      image: 'https://i.pinimg.com/originals/70/67/fd/7067fda96c5cc9dc302e53c5a0246d72.jpg'
    },
    {
      id: 'jewelry-earrings',
      title: dict.categories["jewelry-earrings"] || 'Earrings',
      desc: locale === 'it'
        ? 'Orecchini pendenti tradizionali Jhumka e orecchini a perno moderni.'
        : 'Traditional hanging Jhumka earrings and modern stud earrings.',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'handbags',
      title: dict.categories.handbags || 'Handbags',
      desc: locale === 'it'
        ? 'Pochette e borse realizzate con tessuti pregiati e ricami tradizionali.'
        : 'Clutches and bags crafted with premium fabrics and traditional embroidery.',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'handcraft-material',
      title: dict.categories["handcraft-material"] || 'Handcraft Material',
      desc: locale === 'it'
        ? 'Tessuti biologici in cotone Khadi filato a mano e matasse di seta indiana.'
        : 'Organic handspun Khadi cotton fabrics and premium Varanasi silk skeins.',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. Hero Section - Premium Indo-Italian Editorial Split Layout */}
      <section className="relative min-h-[85vh] py-12 lg:py-20 flex items-center bg-gradient-to-br from-[#F6F3EE] via-[#FAF8F5] to-[#EFEAE2] overflow-hidden border-b border-[#B35C37]/10">
        {/* Decorative soft texture overlays */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(179,92,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(179,92,55,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          <div className="absolute -top-[30%] -right-[10%] w-[600px] h-[600px] bg-[#B35C37]/5 rounded-full filter blur-[120px]"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-[#E5A93B]/5 rounded-full filter blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-between">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8 text-left">
              {/* Luxury Badge Tag */}
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-[#B35C37]/40"></span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#B35C37] font-sans">
                  {locale === 'it' ? 'CASA DEI REGALI • VI' : 'CASA DEI REGALI • MILAN / VARANASI'}
                </span>
              </div>

              {/* Headline - Playfair Display serif font */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#232B28] leading-[1.15] font-light tracking-wide">
                {locale === 'it' ? (
                  <>
                    L&apos;Eleganza <span className="font-serif italic text-[#B35C37] font-normal">Etnica</span>,
                    <br />Il Minimalismo <span className="font-serif italic text-[#B35C37] font-normal">Italiano</span>
                  </>
                ) : (
                  <>
                    Ethnic <span className="font-serif italic text-[#B35C37] font-normal">Elegance</span>,
                    <br />Italian <span className="font-serif italic text-[#B35C37] font-normal">Minimalism</span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="font-sans text-sm md:text-base text-[#232B28]/80 max-w-lg leading-relaxed font-light">
                {dict.hero.subtitle}
              </p>

              {/* Premium Call to Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
                <Link
                  href={`/${locale}/shop`}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 bg-[#B35C37] hover:bg-[#9E4B28] text-white font-sans font-semibold text-xs tracking-widest uppercase rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[1px] cursor-pointer group"
                >
                  <span>{dict.hero.cta}</span>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="https://wa.me/393898373685"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 border border-[#232B28]/20 hover:border-[#232B28] text-[#232B28] font-sans font-semibold text-xs tracking-widest uppercase rounded-lg transition-all duration-300 hover:bg-[#232B28]/5 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.988 3.3 1.487 5.366 1.488 5.4 0 9.794-4.393 9.798-9.793.002-2.616-1.015-5.074-2.864-6.925-1.85-1.85-4.307-2.868-6.924-2.869-5.399 0-9.795 4.393-9.799 9.794-.001 2.155.561 4.162 1.63 5.92L2.73 21.28l4.917-1.289zm10.741-6.953c-.3-.15-1.776-.875-2.049-.974-.273-.1-.472-.15-.672.15-.2.3-.772.974-.947 1.173-.174.2-.35.225-.65.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.488-1.777-1.663-2.077-.174-.3-.018-.463.13-.61.134-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.672-1.62-.92-2.206-.24-.58-.51-.5-.672-.51-.156-.008-.336-.01-.516-.01-.18 0-.472.068-.72.336-.247.269-.943.924-.943 2.252s.967 2.61 1.101 2.793c.134.183 1.902 2.906 4.609 4.074.645.278 1.148.445 1.54.57.649.206 1.24.177 1.707.107.521-.078 1.776-.726 2.025-1.426.25-.7.25-1.299.175-1.425-.076-.125-.275-.2-.575-.35z" />
                  </svg>
                  <span>{locale === 'it' ? 'Chiedi su WhatsApp' : 'WhatsApp Inquiry'}</span>
                </a>
              </div>

              {/* Fine Jewelry Floating Accent Card */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white/50 backdrop-blur-sm border border-[#B35C37]/10 max-w-sm mt-4 shadow-xs hover:shadow-md transition-all duration-300">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-[#B35C37]/10 bg-white">
                  <Image
                    src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=200"
                    alt="Luxury Jhumka Earring Accent"
                    fill
                    sizes="48px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-serif italic text-xs text-[#B35C37] tracking-wider uppercase">
                    {locale === 'it' ? 'Gioielleria Artigianale' : 'Handcrafted Jewelry'}
                  </p>
                  <p className="font-sans text-[11px] text-[#232B28]/70 leading-normal mt-0.5">
                    {locale === 'it'
                      ? 'Orecchini Jhumka in filigrana d\'oro e argento ossidato antico.'
                      : 'Traditional Jhumka earrings in gold filigree and antique oxidized silver.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Campaign Image Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group bg-[#FAF8F5]">
                {/* Dual Editorial Frame Borders */}
                <div className="absolute inset-2 border border-[#B35C37]/20 rounded-xl z-20 pointer-events-none group-hover:inset-3 transition-all duration-500"></div>
                <div className="absolute inset-3.5 border border-white/20 rounded-lg z-20 pointer-events-none group-hover:inset-4.5 transition-all duration-500"></div>

                <Image
                  src="/indo_italian_hero.png"
                  alt="Casa dei Regali - Indo-Italian Fusion Campaign"
                  fill
                  priority
                  unoptimized
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#232B28]/30 via-transparent to-transparent z-10"></div>
              </div>
              <span className="font-serif italic text-[10px] text-[#232B28]/50 mt-3.5 tracking-[0.2em] uppercase">
                {locale === 'it' ? 'Collezione Seta & Oro • Milano / Jaipur' : 'Silk & Gold Collection • Milan / Jaipur'}
              </span>
            </div>

          </div>

          {/* Social Links Ribbon bar */}
          <div className="w-full mt-12 lg:mt-16 pt-6 border-t border-[#232B28]/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[#232B28]/40">
              <span>{locale === 'it' ? 'I Nostri Canali Diretti:' : 'Our Direct Channels:'}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
              <a
                href="https://www.facebook.com/casadairegali"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#232B28]/60 hover:text-[#B35C37] transition-all duration-300 font-sans text-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
                <span className="font-medium">casa dai regali</span>
              </a>

              <a
                href="https://www.instagram.com/casadeiregali"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#232B28]/60 hover:text-[#B35C37] transition-all duration-300 font-sans text-xs"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                </svg>
                <span className="font-medium">@casadeiregali</span>
              </a>

              <a
                href="https://wa.me/393898373685"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#232B28]/60 hover:text-[#B35C37] transition-all duration-300 font-sans text-xs"
              >
                <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.988 3.3 1.487 5.366 1.488 5.4 0 9.794-4.393 9.798-9.793.002-2.616-1.015-5.074-2.864-6.925-1.85-1.85-4.307-2.868-6.924-2.869-5.399 0-9.795 4.393-9.799 9.794-.001 2.155.561 4.162 1.63 5.92L2.73 21.28l4.917-1.289zm10.741-6.953c-.3-.15-1.776-.875-2.049-.974-.273-.1-.472-.15-.672.15-.2.3-.772.974-.947 1.173-.174.2-.35.225-.65.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.488-1.777-1.663-2.077-.174-.3-.018-.463.13-.61.134-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.672-1.62-.92-2.206-.24-.58-.51-.5-.672-.51-.156-.008-.336-.01-.516-.01-.18 0-.472.068-.72.336-.247.269-.943.924-.943 2.252s.967 2.61 1.101 2.793c.134.183 1.902 2.906 4.609 4.074.645.278 1.148.445 1.54.57.649.206 1.24.177 1.707.107.521-.078 1.776-.726 2.025-1.426.25-.7.25-1.299.175-1.425-.076-.125-.275-.2-.575-.35z" />
                </svg>
                <span className="font-medium">+39 389 837 3685</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Premium Circular Quick Navigation Strip */}
      <section className="bg-[#FAF8F5] border-b border-[#232B28]/10 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-6 md:gap-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2 px-1 justify-start md:justify-center">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/shop?category=${cat.id}`}
                className="flex flex-col items-center gap-2 group flex-shrink-0 cursor-pointer"
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[#232B28]/10 group-hover:border-[#B35C37] transition-all duration-300 shadow-xs p-0.5 bg-white">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
                <span className="font-sans text-[10px] md:text-xs font-semibold text-[#232B28]/80 group-hover:text-[#B35C37] transition-colors text-center max-w-[80px] md:max-w-[100px] leading-tight">
                  {cat.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Curation Highlights */}
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

      {/* 4. Category Grid Section */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16 flex flex-col gap-3">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#232B28]">{dict.categories.title}</h2>
            <p className="font-sans text-sm md:text-base text-[#232B28]/70 max-w-lg mx-auto">{dict.categories.subtitle}</p>
            <div className="w-16 h-1 bg-[#B35C37] mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/shop?category=${cat.id}`}
                className="group relative h-60 sm:h-80 lg:h-96 rounded-2xl overflow-hidden card-hover block shadow-xs border border-[#232B28]/5"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#232B28]/95 via-[#232B28]/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white flex flex-col gap-1 sm:gap-2">
                  <h3 className="font-serif text-sm sm:text-lg lg:text-xl font-bold">{cat.title}</h3>
                  <p className="font-sans text-[10px] sm:text-xs text-white/80 leading-relaxed line-clamp-2">{cat.desc}</p>
                  <span className="font-sans text-[9px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#B35C37] group-hover:text-white transition-colors flex items-center gap-1 mt-1 sm:mt-2">
                    {locale === 'it' ? 'Esplora' : 'Explore'} <ArrowRight size={10} className="sm:w-3.5 sm:h-3.5" />
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
          <span className="font-serif italic text-lg text-[#B35C37]">Casa dei Regali</span>
          <blockquote className="font-serif text-2xl md:text-3xl font-bold leading-relaxed italic text-[#FAF8F5]">
            {locale === 'it'
              ? '"L\'eleganza non è farsi notare, ma farsi ricordare. Abbiamo unito i colori accesi del sole indiano con le linee fluide e minimaliste della sartoria milanese."'
              : '"Elegance is not about being noticed, but being remembered. We have merged the bright colors of the Indian sun with the clean, minimalist lines of Milanese design."'}
          </blockquote>
          <span className="font-sans text-xs tracking-widest uppercase font-semibold text-white/50">
            - Casa dei Regali Design Studio Milano
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

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
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
