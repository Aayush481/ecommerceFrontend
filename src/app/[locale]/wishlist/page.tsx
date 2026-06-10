'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { getDictionary } from '@/dictionaries';
import { formatImageUrl } from '@/utils/api';

interface WishlistPageProps {
  params: Promise<{ locale: string }>;
}

export default function WishlistPage({ params }: WishlistPageProps) {
  const { locale: rawLocale } = use(params);
  const locale = rawLocale as 'it' | 'en';
  const [dict, setDict] = useState<any>(null);
  const { wishlist, removeFromWishlist } = useStore();

  // Load dictionary client-side
  React.useEffect(() => {
    getDictionary(locale).then(setDict);
  }, [locale]);

  if (!dict) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#232B28] mb-10">{dict.wishlist_page.title}</h1>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-[#232B28]/10 rounded-xl overflow-hidden shadow-2xs card-hover flex flex-col justify-between"
            >
              {/* Product Image */}
              <Link href={`/${locale}/shop/${item.sku}`} className="block relative aspect-3/4 overflow-hidden bg-stone-100">
                <Image
                  src={formatImageUrl(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </Link>
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="p-2 bg-[#FAF8F5]/90 backdrop-blur-xs hover:bg-white rounded-full shadow-xs text-red-500 hover:text-red-700 transition-colors border border-[#232B28]/5 cursor-pointer"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#232B28] line-clamp-2 leading-tight">
                    {item.name}
                  </h3>
                  <span className="font-serif font-bold text-sm text-[#B35C37] block mt-2">
                    €{item.price.toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#232B28]/5 flex gap-2">
                  <Link
                    href={`/${locale}/shop/${item.sku}`}
                    className="w-full text-center py-2 bg-[#232B28] hover:bg-[#B35C37] text-white font-sans font-bold text-[10px] tracking-wider uppercase rounded-lg transition-colors"
                  >
                    {locale === 'it' ? 'Vedi Dettagli' : 'View Details'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-[#232B28]/10 rounded-xl flex flex-col items-center gap-4">
          <Heart size={40} className="text-[#232B28]/35" />
          <p className="font-serif text-lg text-[#232B28]/70">{dict.wishlist_page.empty}</p>
          <Link
            href={`/${locale}/shop`}
            className="inline-block px-8 py-3 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-sans font-bold text-xs tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
          >
            {dict.wishlist_page.empty_cta}
          </Link>
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
