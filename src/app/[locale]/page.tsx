import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getDictionary } from '@/dictionaries';
import { ProductCard } from '@/components/ProductCard';
import { TiltCard } from '@/components/TiltCard';
import { FloatingParticles } from '@/components/FloatingParticles';
import { ScrollParallax } from '@/components/ScrollParallax';
import { ScrollReveal, StaggerContainer, StaggerChild, FloatingMesh } from '@/components/MotionWrapper';
import { ClientDressAnimation } from '@/components/ClientDressAnimation';

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
      '/red_dress.jpg'
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
    sku: 'JW-ANK-010',
    price: 29.99,
    category: 'jewelry-anklets',
    materials: ['Sterling Silver', 'Beads'],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 25,
    featured: false,
    it: {
      name: 'Cavigliera Etnica in Argento Ossidato',
      description: 'Elegante cavigliera regolabile con piccoli campanellini tradizionali indiani payal.',
      tags: ['cavigliera', 'argento', 'etnico', 'gioielli']
    },
    en: {
      name: 'Oxidized Silver Ethnic Anklet',
      description: 'Elegant adjustable handcrafted anklet featuring tiny traditional chime bells.',
      tags: ['anklet', 'silver', 'ethnic', 'jewelry']
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
      image: 'https://i.pinimg.com/originals/7e/78/13/7e78132ea4987ccee3ad2261b8470634.jpg',
      badge: 'BEST'
    },
    {
      id: 'onepiece',
      title: dict.categories.onepiece,
      desc: locale === 'it'
        ? 'Eleganti abiti interi che fondono design contemporaneo ed elementi etnici.'
        : 'Elegant one-piece dresses fusing contemporary design and ethnic elements.',
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
      badge: 'NEW'
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
      id: 'summer-dresses',
      title: dict.categories["summer-dresses"] || 'Summer Dresses',
      desc: locale === 'it'
        ? 'Abiti freschi in cotone leggero e lino traspirante stampati a mano.'
        : 'Fresh dresses in lightweight cotton and breathable linen, printed by hand.',
      image: '/red_dress.jpg'
    },
    {
      id: 'jewelry-oxidized',
      title: dict.categories["jewelry-oxidized"] || 'Oxidized Jewelry',
      desc: locale === 'it'
        ? 'Bijoux d\'effetto in argento ossidato, girocolli mandala e orecchini jhumka.'
        : 'Statement antique oxidized silver bijoux, mandala chokers, and jhumka earrings.',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/11/WX/SM/SG/27266304/dual-tone-set-party-wear-390--1000x1000.jpeg',
      badge: 'HOT'
    },
    {
      id: 'jewelry-anklets',
      title: dict.categories["jewelry-anklets"] || 'Anklets',
      desc: locale === 'it'
        ? 'Eleganti cavigliere artigianali impreziosite da perline e campanellini.'
        : 'Elegant handcrafted anklets adorned with delicate beads and charms.',
      image: '/anklets_category.png'
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
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800',
      badge: 'HOT'
    },
    {
      id: 'handbags',
      title: dict.categories.handbags || 'Handbags',
      desc: locale === 'it'
        ? 'Pochette e borse realizzate con tessuti pregiati e ricami tradizionali.'
        : 'Clutches and bags crafted with premium fabrics and traditional embroidery.',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
      badge: 'NEW'
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'Casa dei Regali',
    url: 'https://casadeiregali.it',
    logo: 'https://casadeiregali.it/indo_italian_hero.png',
    description: dict.hero.subtitle,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vicenza',
      addressCountry: 'IT'
    },
    sameAs: [
      'https://www.facebook.com/casadairegali',
      'https://www.instagram.com/casadeiregali'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen overflow-x-hidden w-full">

      {/* 1. Hero Section - Premium 3D Editorial Layout */}
      <section className="relative min-h-[90vh] py-16 flex items-center overflow-hidden border-b border-[#B35C37]/10 bg-[#0A0D0B]">
        {/* Background elements */}
        <FloatingParticles />
        
        {/* Huge Luxury Title Overlay in background with horizontal scroll parallax */}
        <ScrollParallax speed={-0.2} direction="left" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none">
          <div className="text-center font-serif text-[8vw] md:text-[12vw] font-black uppercase text-white/[0.02] tracking-[0.25em] leading-none whitespace-nowrap">
            CASA REGALI
          </div>
        </ScrollParallax>

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          
          {/* Hero Content Column (Left, 6 columns) */}
          <StaggerContainer className="lg:col-span-6 flex flex-col gap-6 text-white text-left">
            <StaggerChild>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase bg-[#B35C37]/15 px-4 py-1.5 rounded-full border border-[#B35C37]/25 w-max">
                {locale === 'it' ? 'Edizione Limitata 2026' : 'Limited 2026 Lookbook'}
              </span>
            </StaggerChild>
            
            <StaggerChild>
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white mt-2 uppercase">
                {locale === 'it' ? (
                  <>
                    Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B35C37] via-[#E5A93B] to-[#D4AF37] italic font-light">Italiano</span>,<br />Anima <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B35C37]">Indiana</span>
                  </>
                ) : (
                  <>
                    Italian <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B35C37] via-[#E5A93B] to-[#D4AF37] italic font-light">Minimalism</span>,<br />Indian <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B35C37]">Soul</span>
                  </>
                )}
              </h1>
            </StaggerChild>
            
            <StaggerChild>
              <p className="font-sans text-xs sm:text-sm lg:text-base text-stone-300/80 leading-relaxed tracking-wide font-light max-w-[500px]">
                {dict.hero.subtitle}
              </p>
            </StaggerChild>
            
            <StaggerChild className="flex flex-wrap items-center gap-6 mt-2">
              <Link
                href={`/${locale}/shop`}
                className="px-8 py-4 bg-gradient-to-r from-[#B35C37] to-[#B35C37]/80 hover:from-[#D4AF37] hover:to-[#E5A93B] text-white hover:text-[#0A0D0B] font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-500 cursor-pointer shadow-lg hover:shadow-[#D4AF37]/25 hover:shadow-2xl active:scale-[0.98]"
              >
                {dict.hero.cta}
              </Link>
              
              <Link
                href={`/${locale}/contact`}
                className="text-xs font-sans font-bold tracking-widest uppercase text-stone-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2 group cursor-pointer"
              >
                <span>{locale === 'it' ? 'Contattaci' : 'Contact Us'}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </StaggerChild>
          </StaggerContainer>
          
          {/* Hero 3D Deck Column (Right, 6 columns) */}
          <div className="lg:col-span-6 flex justify-center items-center relative min-h-[340px] xs:min-h-[460px] sm:min-h-[520px] w-full animate-in fade-in zoom-in-95 duration-1000 delay-150 transform-style-3d">
            
            {/* Golden light orb background helper */}
            <div className="absolute w-72 h-72 rounded-full bg-[#D4AF37]/10 blur-[100px] z-0 animate-pulse pointer-events-none" />

            {/* Tilt container wrapping the cards deck */}
            <div className="w-full max-w-[190px] xs:max-w-[270px] sm:max-w-[340px] md:max-w-[360px] relative z-10 transform-style-3d">
              
              <ScrollParallax speed={-0.08} direction="down">
                <TiltCard className="clay-premium p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 relative overflow-visible hover:border-[#D4AF37]/45 transition-colors">
                  
                  {/* Parallax Layer 1: Varanasi Silk Card */}
                  <div 
                    id="hero-dress-image-container"
                    className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-900 border border-white/5 relative transform-style-3d shadow-lg transition-opacity duration-300"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    <Image
                      src="/red_dress.jpg"
                      alt="Terra Fusion Blazer"
                      fill
                      priority
                      sizes="50vw"
                      className="object-cover transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D0B]/80 via-transparent to-transparent" />
                    <span 
                      className="absolute top-3 left-3 clay-premium-light text-white font-bold text-[8px] sm:text-[9px] tracking-widest uppercase px-2.5 py-0.5 sm:px-3.5 sm:py-1 z-10"
                      style={{ transform: 'translateZ(10px)' }}
                    >
                      Trending Look
                    </span>
                  </div>

                  {/* Parallax Layer 2: Main Text Info */}
                  <div className="flex flex-col text-left transform-style-3d mt-1 sm:mt-2" style={{ transform: 'translateZ(30px)' }}>
                    <span className="text-[8px] sm:text-[10px] font-sans font-bold tracking-widest text-[#B35C37] uppercase">Indo-Western Fusion</span>
                    <h3 className="font-serif text-base sm:text-2xl font-bold text-white mt-0.5 sm:mt-1 leading-tight">Terra Fusion Blazer</h3>
                    <p className="font-sans text-[10px] sm:text-[12px] text-stone-300/80 mt-1 leading-relaxed">Asymmetrical modern Western blazer tailored with handcrafted Zardozi accents.</p>
                    
                    <div 
                      className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 transform-style-3d"
                      style={{ transform: 'translateZ(10px)' }}
                    >
                      <span className="font-serif text-base sm:text-lg font-bold text-[#D4AF37] glow-text-gold">€124.99</span>
                      <Link 
                        href={`/${locale}/shop/IWE-TER-001`} 
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 border border-white/10 hover:bg-[#D4AF37] hover:text-[#0A0D0B] rounded-xl text-[8px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-white transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105"
                      >
                        View Piece <ArrowRight size={8} />
                      </Link>
                    </div>
                  </div>

                  {/* Parallax Layer 3: Overlapping Decorative Jewelry Card (Bottom Left Shift) */}
                  <FloatingMesh duration={7} yRange={15} className="absolute -bottom-6 -left-4 xs:-bottom-10 xs:-left-8 sm:-bottom-12 sm:-left-12 z-20">
                    <ScrollParallax speed={-0.15} direction="up">
                      <div 
                        className="w-20 xs:w-28 sm:w-44 clay-premium p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2 hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
                        style={{ transform: 'translateZ(60px)' }}
                      >
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-stone-900 relative">
                          <Image
                            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400"
                            alt="Teardrop Earrings"
                            fill
                            sizes="20vw"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[7px] sm:text-[8px] font-bold text-[#D4AF37] tracking-wider uppercase font-sans">Boho Jewelry</span>
                          <span className="font-serif text-[9px] sm:text-[11px] font-bold text-white truncate">Teardrop Earrings</span>
                          <span className="font-serif text-[8px] sm:text-[10px] text-[#B35C37] font-semibold mt-0.5">€3.00</span>
                        </div>
                      </div>
                    </ScrollParallax>
                  </FloatingMesh>

                  {/* Parallax Layer 4: Overlapping Decorative Handbag Card (Top Right Shift) */}
                  <FloatingMesh duration={8} yRange={-12} className="absolute -top-6 -right-4 xs:-top-10 xs:-right-8 sm:-top-12 sm:-right-12 z-20">
                    <ScrollParallax speed={0.12} direction="up">
                      <div 
                        className="w-20 xs:w-28 sm:w-44 clay-premium p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2 hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
                        style={{ transform: 'translateZ(50px)' }}
                      >
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-stone-900 relative">
                          <Image
                            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=400"
                            alt="Handbag"
                            fill
                            sizes="20vw"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[7px] sm:text-[8px] font-bold text-[#D4AF37] tracking-wider uppercase font-sans">Accessories</span>
                          <span className="font-serif text-[9px] sm:text-[11px] font-bold text-white truncate">Embroidered Bag</span>
                          <span className="font-serif text-[8px] sm:text-[10px] text-[#B35C37] font-semibold mt-0.5">€45.00</span>
                        </div>
                      </div>
                    </ScrollParallax>
                  </FloatingMesh>

                </TiltCard>
              </ScrollParallax>

            </div>

          </div>

        </div>

      </section>

      {/* 2. Premium Circular Quick Navigation Strip */}
      <section className="bg-[#0A0D0B] border-b border-white/10 py-6 overflow-hidden relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-8 w-full overflow-hidden">
          <StaggerContainer className="flex gap-6 md:gap-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2 px-1 justify-start md:justify-center">
            {categories.map((cat) => (
              <StaggerChild key={cat.id}>
                <Link
                  href={`/${locale}/shop?category=${cat.id}`}
                  className="flex flex-col items-center gap-2 group flex-shrink-0 cursor-pointer active:scale-95 transition-transform duration-150 relative"
                >
                  {/* Dynamic Notification badge */}
                  {(cat as any).badge && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#B35C37] to-[#D4AF37] text-white text-[7px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-full border border-[#0A0D0B] shadow-md z-30 animate-pulse">
                      {(cat as any).badge}
                    </span>
                  )}
                  
                  {/* Conic Gradient border simulation for Instagram-style Ring */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-[#B35C37] via-[#E5A93B] to-[#D4AF37] group-hover:rotate-180 transition-all duration-700 shadow-md">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-[#0A0D0B] p-[1.5px]">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={cat.image}
                          alt={cat.title}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <span className="font-sans text-[10px] md:text-xs font-semibold text-stone-300 group-hover:text-[#D4AF37] transition-colors text-center max-w-[80px] md:max-w-[100px] leading-tight">
                    {cat.title}
                  </span>
                </Link>
              </StaggerChild>
            ))}
          </StaggerContainer>
        </div>
      </section>


      {/* 4. Category Grid Section */}
      <section className="py-20 bg-[#0A0D0B] overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-8 w-full">
          <ScrollReveal className="text-center mb-16 flex flex-col gap-3 relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">{dict.categories.title}</h2>
            <p className="font-sans text-sm md:text-base text-stone-300 max-w-lg mx-auto">{dict.categories.subtitle}</p>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-2"></div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-4 md:gap-8 relative z-10 w-full">
            {categories.map((cat) => (
              <StaggerChild key={cat.id} className="h-60 sm:h-80 lg:h-96" id={`category-card-${cat.id}`}>
                <TiltCard className="group relative h-full clay-premium hover:border-[#D4AF37]/45 transition-colors">
                  <Link
                    href={`/${locale}/shop?category=${cat.id}`}
                    className="block w-full h-full relative overflow-hidden transform-style-3d"
                  >
                    <Image
                      id={`category-card-img-${cat.id}`}
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ 
                        transform: 'translateZ(10px)',
                        transition: 'opacity 0.4s ease-out'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D0B]/95 via-[#0A0D0B]/30 to-transparent z-10" />
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white flex flex-col gap-1 sm:gap-2 z-20 transform-style-3d">
                      <h3 className="font-serif text-sm sm:text-lg lg:text-xl font-bold" style={{ transform: 'translateZ(20px)' }}>{cat.title}</h3>
                      <p className="font-sans text-[10px] sm:text-xs text-white/80 leading-relaxed line-clamp-2" style={{ transform: 'translateZ(15px)' }}>{cat.desc}</p>
                      <span 
                        className="font-sans text-[9px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#D4AF37] group-hover:text-white transition-colors flex items-center gap-1 mt-1 sm:mt-2"
                        style={{ transform: 'translateZ(15px)' }}
                      >
                        {locale === 'it' ? 'Esplora' : 'Explore'} <ArrowRight size={10} className="sm:w-3.5 sm:h-3.5" />
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              </StaggerChild>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 4. Brand Quote Curation */}
      <section className="py-24 bg-[#111614] text-white text-center relative overflow-hidden border-y border-[#B35C37]/15">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/red_dress.jpg"
            alt="Fabric details"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <ScrollReveal className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 flex flex-col items-center gap-6">
          <span className="font-serif italic text-lg text-[#D4AF37] glow-text-gold">Casa dei Regali</span>
          <blockquote className="font-serif text-2xl md:text-3xl font-bold leading-relaxed italic text-[#FAF8F5]">
            {locale === 'it'
              ? '"L\'eleganza non è farsi notare, ma farsi ricordare. Abbiamo unito i colori accesi del sole indiano con le linee fluide e minimaliste della sartoria vicentina."'
              : '"Elegance is not about being noticed, but being remembered. We have merged the bright colors of the Indian sun with the clean, minimalist lines of Vicenza design."'}
          </blockquote>
          <span className="font-sans text-xs tracking-widest uppercase font-semibold text-white/50">
            - Casa dei Regali Design Studio Vicenza
          </span>
        </ScrollReveal>
      </section>

      {/* 5. Featured Products Catalog */}
      <section className="py-20 bg-[#0A0D0B] overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-8 w-full">
          <ScrollReveal className="text-center mb-16 flex flex-col gap-3 relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">{dict.featured.title}</h2>
            <p className="font-sans text-sm md:text-base text-stone-300 max-w-lg mx-auto">{dict.featured.subtitle}</p>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-2"></div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-4 md:gap-8 relative z-10 w-full">
            {products.map((prod: any) => (
              <StaggerChild key={prod.sku}>
                <ProductCard product={prod} locale={locale as 'it' | 'en'} dict={dict} />
              </StaggerChild>
            ))}
          </StaggerContainer>

          <ScrollReveal className="text-center mt-12 relative z-10">
            <Link
              href={`/${locale}/shop`}
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white hover:bg-white hover:text-[#0A0D0B] text-white font-sans font-bold text-sm tracking-wider uppercase rounded-xl transition-all cursor-pointer"
            >
              <span>{locale === 'it' ? 'Vedi Tutto il Catalogo' : 'View Full Catalog'}</span>
              <ArrowRight size={14} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* 3D Dress scroll animation overlay */}
      <ClientDressAnimation />

    </div>
    </>
  );
}

