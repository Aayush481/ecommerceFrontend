'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag, ArrowLeft, Ruler, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';
import { formatImageUrl } from '../utils/api';

interface ProductDetailClientProps {
  product: {
    _id?: string;
    sku: string;
    price: number;
    category: string;
    materials: string[];
    sizes: string[];
    images: string[];
    stock: number;
    it: { name: string; description: string; tags: string[] };
    en: { name: string; description: string; tags: string[] };
  };
  locale: 'it' | 'en';
  dict: any;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product, locale, dict }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'One Size');
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const id = product._id || product.sku;
  const details = locale === 'it' ? product.it : product.en;
  const isWishlisted = isInWishlist(id);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        sku: product.sku,
        name: details.name,
        price: product.price,
        image: product.images[0],
      });
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id,
      sku: product.sku,
      name: details.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
    });
  };

  const handleWhatsAppBuyNow = () => {
    const productUrl = typeof window !== 'undefined' ? window.location.href : '';
    const message = locale === 'it'
      ? `Ciao Casa dei Regali! Vorrei acquistare ora: ${details.name} (SKU: ${product.sku}, Taglia: ${selectedSize}) al prezzo di €${product.price.toFixed(2)}.${productUrl ? ` Link del prodotto: ${productUrl}` : ''}`
      : `Hello Casa dei Regali! I would like to buy now: ${details.name} (SKU: ${product.sku}, Size: ${selectedSize}) for €${product.price.toFixed(2)}.${productUrl ? ` Product Link: ${productUrl}` : ''}`;
    
    const whatsappUrl = `https://wa.me/393898373685?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const sizeChartData = [
    { in: 'S', it: '40', chest: '88 - 92 cm' },
    { in: 'M', it: '42', chest: '92 - 96 cm' },
    { in: 'L', it: '44', chest: '96 - 100 cm' },
    { in: 'XL', it: '46', chest: '100 - 104 cm' },
    { in: 'XXL', it: '48', chest: '104 - 108 cm' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Back button */}
      <div>
        <Link
          href={`/${locale}/shop`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#232B28]/60 hover:text-[#B35C37] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{locale === 'it' ? 'Torna al catalogo' : 'Back to shop'}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Gallery Column */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-stone-100 border border-[#232B28]/5">
            <Image
              src={formatImageUrl(activeImage)}
              alt={details.name}
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Thumbnail rows */}
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-24 overflow-hidden rounded-lg bg-stone-100 border cursor-pointer ${
                    activeImage === img ? 'border-[#B35C37] border-2 shadow-xs' : 'border-[#232B28]/10'
                  }`}
                >
                  <Image
                    src={formatImageUrl(img)}
                    alt={`${details.name} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 border-b border-[#232B28]/10 pb-5">
            <span className="font-sans text-xs font-semibold text-[#B35C37] uppercase tracking-widest bg-[#B35C37]/5 self-start px-3 py-1 rounded-full border border-[#B35C37]/10">
              {(dict.categories as any)[product.category] || product.category}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#232B28] leading-tight mt-1">
              {details.name}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="font-serif text-2xl md:text-3xl font-extrabold text-[#B35C37]">
                €{product.price.toFixed(2)}
              </span>
              <span className="text-xs text-[#232B28]/50 font-medium">
                {dict.product.sku}: {product.sku}
              </span>
            </div>
          </div>

          {/* Product description */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-lg font-bold text-[#232B28]">{locale === 'it' ? 'Descrizione' : 'Description'}</h3>
            <p className="font-sans text-sm text-[#232B28]/80 leading-relaxed">
              {details.description}
            </p>
          </div>

          {/* Materials */}
          <div className="flex flex-col gap-2.5">
            <span className="font-serif text-sm font-bold text-[#232B28]">{dict.product.materials_label}:</span>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {product.materials.map((mat, idx) => (
                <span key={idx} className="bg-[#232B28]/5 border border-[#232B28]/10 px-3 py-1.5 rounded-md text-[#232B28]/80">
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Size selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-bold text-[#232B28]">{dict.product.sizes_label}:</span>
                {product.category !== 'jewelry' && (
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#B35C37] hover:text-[#B35C37]/80 transition-colors cursor-pointer"
                  >
                    <Ruler size={13} />
                    <span>{dict.product.size_guide}</span>
                  </button>
                )}
              </div>

              {/* Sizes buttons */}
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2.5 border rounded-lg text-xs font-bold tracking-wider font-sans transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#232B28] text-white border-[#232B28] shadow-xs'
                        : 'bg-white border-[#232B28]/15 hover:bg-stone-50 text-[#232B28]/80'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizing Chart Guide */}
          {showSizeGuide && product.category !== 'jewelry' && (
            <div className="border border-[#B35C37]/20 bg-[#B35C37]/5 rounded-xl p-5 flex flex-col gap-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 border-b border-[#B35C37]/15 pb-2">
                <Ruler size={16} className="text-[#B35C37]" />
                <h4 className="font-serif text-sm font-bold text-[#232B28]">{dict.product.size_chart_title}</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-[#232B28]/10 text-[#232B28]/60 font-semibold uppercase tracking-wider">
                      <th className="py-2">{dict.product.size_chart_in}</th>
                      <th className="py-2">{dict.product.size_chart_it}</th>
                      <th className="py-2">{dict.product.size_chart_chest}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChartData.map((row) => (
                      <tr key={row.in} className="border-b border-[#232B28]/5 text-[#232B28]/85 font-medium">
                        <td className="py-2.5 font-bold">{row.in}</td>
                        <td className="py-2.5">{row.it}</td>
                        <td className="py-2.5">{row.chest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="font-sans text-[10px] text-[#232B28]/60 italic leading-normal">
                {locale === 'it' 
                  ? '* Nota: I nostri capi sono realizzati con un taglio morbido. Se preferisci una vestibilità più asciutta, consigliamo di ordinare una taglia in meno.'
                  : '* Note: Our clothing features a relaxed fit. If you prefer a tighter silhouette, we recommend sizing down.'
                }
              </p>
            </div>
          )}

          {/* Availability and warning info */}
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#232B28]/60">
            <AlertCircle size={15} />
            <span>
              {dict.product.stock}:{' '}
              {product.stock > 0 ? (
                <span className="text-[#2ECC71] font-bold">{dict.product.in_stock} ({product.stock})</span>
              ) : (
                <span className="text-red-500 font-bold">{dict.product.out_of_stock}</span>
              )}
            </span>
          </div>

          {/* Action Call buttons */}
          <div className="flex flex-col gap-3.5 mt-4 border-t border-[#232B28]/10 pt-6">
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-grow flex items-center justify-center gap-2 py-4 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-sans font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                <span>{dict.shop.add_to_cart}</span>
              </button>

              <button
                onClick={handleWishlistToggle}
                className="p-4 bg-white border border-[#232B28]/15 rounded-xl hover:bg-stone-50 text-[#232B28] hover:text-[#B35C37] transition-all cursor-pointer"
                title={dict.shop.add_to_wishlist}
              >
                <Heart size={18} className={isWishlisted ? 'fill-[#B35C37] text-[#B35C37]' : ''} />
              </button>
            </div>

            <button
              onClick={handleWhatsAppBuyNow}
              disabled={product.stock <= 0}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-sans font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.988 3.3 1.487 5.366 1.488 5.4 0 9.794-4.393 9.798-9.793.002-2.616-1.015-5.074-2.864-6.925-1.85-1.85-4.307-2.868-6.924-2.869-5.399 0-9.795 4.393-9.799 9.794-.001 2.155.561 4.162 1.63 5.92L2.73 21.28l4.917-1.289zm10.741-6.953c-.3-.15-1.776-.875-2.049-.974-.273-.1-.472-.15-.672.15-.2.3-.772.974-.947 1.173-.174.2-.35.225-.65.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.488-1.777-1.663-2.077-.174-.3-.018-.463.13-.61.134-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.672-1.62-.92-2.206-.24-.58-.51-.5-.672-.51-.156-.008-.336-.01-.516-.01-.18 0-.472.068-.72.336-.247.269-.943.924-.943 2.252s.967 2.61 1.101 2.793c.134.183 1.902 2.906 4.609 4.074.645.278 1.148.445 1.54.57.649.206 1.24.177 1.707.107.521-.078 1.776-.726 2.025-1.426.25-.7.25-1.299.175-1.425-.076-.125-.275-.2-.575-.35z"/>
              </svg>
              <span>{locale === 'it' ? 'Acquista Ora (WhatsApp)' : 'Buy Now (WhatsApp)'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
