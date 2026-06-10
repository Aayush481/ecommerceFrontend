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
          <div className="flex gap-4 mt-4 border-t border-[#232B28]/10 pt-6">
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

        </div>

      </div>
    </div>
  );
};
