'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatImageUrl } from '../utils/api';

export interface ProductCardProps {
  product: {
    _id?: string;
    sku: string;
    price: number;
    category: string;
    materials: string[];
    sizes: string[];
    images: string[];
    featured?: boolean;
    it: { name: string; description: string; tags: string[] };
    en: { name: string; description: string; tags: string[] };
  };
  locale: 'it' | 'en';
  dict: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, locale, dict }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();

  const id = product._id || product.sku;
  const details = locale === 'it' ? product.it : product.en;
  const isWishlisted = isInWishlist(id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to the first size or 'One Size'
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size';
    addToCart({
      id,
      sku: product.sku,
      name: details.name,
      price: product.price,
      image: product.images[0],
      size: defaultSize,
    });
  };

  const categoryLabel = (dict.categories as any)[product.category] || product.category;

  return (
    <div className="group relative bg-[#FAF8F5] border border-[#232B28]/10 rounded-xl overflow-hidden card-hover flex flex-col justify-between h-full">
      {/* Product Image Panel */}
      <Link href={`/${locale}/shop/${product.sku}`} className="block relative aspect-3/4 overflow-hidden bg-stone-100">
        <Image
          src={formatImageUrl(product.images[0])}
          alt={details.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-[#FAF8F5]/90 backdrop-blur-xs text-[#232B28] font-sans font-semibold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs border border-[#232B28]/5">
          {categoryLabel}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-[#FAF8F5]/90 backdrop-blur-xs hover:bg-white rounded-full shadow-xs text-[#232B28] hover:text-[#B35C37] transition-all duration-300 border border-[#232B28]/5 cursor-pointer"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} className={`transition-colors duration-300 ${isWishlisted ? 'fill-[#B35C37] text-[#B35C37]' : 'text-[#232B28]'}`} />
        </button>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div className="mb-3">
          <span className="text-[11px] font-medium text-[#232B28]/60 tracking-wider font-sans uppercase">
            {product.materials.join(' • ')}
          </span>
          <Link href={`/${locale}/shop/${product.sku}`}>
            <h3 className="font-serif text-[16px] font-bold text-[#232B28] hover:text-[#B35C37] transition-colors leading-tight mt-1 line-clamp-2">
              {details.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#232B28]/5">
          <span className="font-serif font-bold text-lg text-[#B35C37]">
            €{product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCartClick}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-sans font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
          >
            <ShoppingCart size={13} />
            <span>{dict.shop.add_to_cart}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
