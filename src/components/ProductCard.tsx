'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { formatImageUrl } from '../utils/api';
import { TiltCard } from './TiltCard';

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
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, user, openAuthModal } = useStore();

  const id = product._id || product.sku;
  const primaryDetails = locale === 'it' ? product.it : product.en;
  const secondaryDetails = locale === 'it' ? product.en : product.it;
  const details = {
    name: primaryDetails?.name || secondaryDetails?.name || '',
    description: primaryDetails?.description || secondaryDetails?.description || '',
    tags: primaryDetails?.tags || secondaryDetails?.tags || []
  };
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
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size';
    
    const action = () => {
      addToCart({
        id,
        sku: product.sku,
        name: details.name,
        price: product.price,
        image: product.images[0],
        size: defaultSize,
      });
    };

    if (!user) {
      openAuthModal(action);
    } else {
      action();
    }
  };

  const categoryLabel = (dict.categories as any)[product.category] || product.category;

  return (
    <TiltCard className="group relative bg-black border-white/10 flex flex-col justify-between h-full hover:border-[#D4AF37]/35 shadow-xs transition-colors duration-500">
      {/* Product Image Panel */}
      <Link href={`/${locale}/shop/${product.sku}`} className="block relative aspect-3/4 overflow-hidden bg-stone-900 transform-style-3d">
        <Image
          src={formatImageUrl(product.images[0])}
          alt={details.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ transform: 'translateZ(15px)' }}
        />

        {/* Category Badge */}
        <span 
          className="absolute top-3 left-3 bg-[#0A0D0B]/90 backdrop-blur-md text-[#D4AF37] font-sans font-semibold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md border border-[#D4AF37]/20 z-10"
          style={{ transform: 'translateZ(20px)' }}
        >
          {categoryLabel}
        </span>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-[#0A0D0B]/85 backdrop-blur-md hover:bg-white rounded-full shadow-md text-[#FAF8F5] hover:text-[#B35C37] transition-all duration-300 border border-white/5 cursor-pointer z-10"
          style={{ transform: 'translateZ(20px)' }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} className={`transition-colors duration-300 ${isWishlisted ? 'fill-[#B35C37] text-[#B35C37]' : 'text-[#FAF8F5]'}`} />
        </motion.button>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-grow justify-between transform-style-3d">
        <div className="mb-3" style={{ transform: 'translateZ(10px)' }}>
          <span className="text-[11px] font-medium text-stone-300/60 tracking-wider font-sans uppercase">
            {product.materials.join(' • ')}
          </span>
          <Link href={`/${locale}/shop/${product.sku}`}>
            <h3 className="font-serif text-[16px] font-bold text-[#FAF8F5] hover:text-[#D4AF37] transition-colors leading-tight mt-1 line-clamp-2">
              {details.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5" style={{ transform: 'translateZ(15px)' }}>
          <span className="font-serif font-bold text-lg text-[#D4AF37] glow-text-gold">
            €{product.price.toFixed(2)}
          </span>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleAddToCartClick}
            className="p-2.5 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white rounded-full transition-all duration-300 cursor-pointer shadow-md"
            title={dict.shop.add_to_cart}
            aria-label={dict.shop.add_to_cart}
          >
            <ShoppingCart size={18} />
          </motion.button>
        </div>
      </div>
    </TiltCard>
  );
};
