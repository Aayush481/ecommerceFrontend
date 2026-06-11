'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { getApiUrl } from '@/utils/api';

interface FooterProps {
  locale: 'it' | 'en';
  dict: any;
}

export const Footer: React.FC<FooterProps> = ({ locale, dict }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch(getApiUrl('/api/newsletter'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <footer className="bg-[#232B28] text-[#FAF8F5]/90 pt-16 pb-8 border-t border-[#FAF8F5]/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        <div className="flex flex-col gap-4">
          <Link 
            href={`/${locale}`}
            className="flex items-center gap-2 group cursor-pointer"
          >
            {/* Minimalist bow emblem */}
            <svg className="w-5.5 h-5.5 text-[#B35C37] transition-transform duration-500 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="4" y="9" width="16" height="11" rx="1" />
              <path d="M12 9V20" />
              <path d="M4 13H20" />
              <path d="M12 9C12 6.5 10 5 8.5 6.5S10 9 12 9z" />
              <path d="M12 9C12 6.5 14 5 15.5 6.5S14 9 12 9z" />
            </svg>
            <div className="flex flex-col">
              <span className="font-serif text-sm md:text-base font-bold tracking-[0.15em] uppercase text-[#FAF8F5] group-hover:text-[#B35C37] transition-colors duration-300 leading-none">
                Casa dei Regali
              </span>
              <span className="font-sans text-[7px] md:text-[8px] tracking-[0.3em] uppercase text-[#B35C37] mt-1.5 font-semibold leading-none">
                Milano
              </span>
            </div>
          </Link>
          <p className="font-sans text-sm text-[#FAF8F5]/70 leading-relaxed">
            {locale === 'it' 
              ? 'L\'incontro esclusivo tra la preziosa manifattura tessile indiana e l\'eleganza del design minimale italiano. Un viaggio di stili cucito su misura per te.'
              : 'The exclusive meeting between precious Indian textile craftsmanship and the elegance of Italian minimal design. A tailored stylistic journey.'
            }
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-lg font-semibold text-[#B35C37]">{locale === 'it' ? 'Esplora' : 'Explore'}</h4>
          <ul className="flex flex-col gap-2 font-sans text-sm text-[#FAF8F5]/70">
            <li>
              <Link href={`/${locale}/shop?category=kurtis`} className="hover:text-[#B35C37] transition-colors">
                {dict.categories.kurtis}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/shop?category=onepiece`} className="hover:text-[#B35C37] transition-colors">
                {dict.categories.onepiece}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/shop?category=jewelry-oxidized`} className="hover:text-[#B35C37] transition-colors">
                {dict.categories["jewelry-oxidized"]}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/shop?category=handbags`} className="hover:text-[#B35C37] transition-colors">
                {dict.categories.handbags}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-lg font-semibold text-[#B35C37]">Contact</h4>
          <ul className="flex flex-col gap-3 font-sans text-sm text-[#FAF8F5]/70">
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-[#B35C37]" />
              <span>Milano, Via della Seta 42, Italia</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-[#B35C37]" />
              <span>+39 02 1234567</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-[#B35C37]" />
              <span>ciao@casadeiregali.it</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-lg font-semibold text-[#B35C37]">{dict.newsletter.title}</h4>
          <p className="font-sans text-xs text-[#FAF8F5]/70 leading-relaxed">
            {dict.newsletter.subtitle}
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="email"
                placeholder={dict.newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                className="w-full bg-[#FAF8F5]/5 border border-[#FAF8F5]/25 rounded-lg px-4 py-2.5 pr-12 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#B35C37] transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-1 top-1 bottom-1 px-3 bg-[#B35C37] text-white rounded-md flex items-center justify-center hover:bg-[#B35C37]/90 transition-colors disabled:opacity-50 cursor-pointer"
                aria-label={dict.newsletter.subscribe}
              >
                <Send size={15} />
              </button>
            </div>
            
            {status === 'success' && (
              <div className="flex items-center gap-1.5 text-[#2ECC71] text-xs font-medium">
                <CheckCircle2 size={13} />
                <span>{dict.newsletter.success}</span>
              </div>
            )}
            {status === 'error' && (
              <span className="text-red-400 text-xs font-medium">{dict.newsletter.error}</span>
            )}
          </form>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-[#FAF8F5]/10 pt-8 text-center text-[#FAF8F5]/40 text-xs font-sans tracking-wide">
        <p>&copy; {new Date().getFullYear()} Casa dei Regali. All rights reserved. Created for the Italian fashion connoisseur.</p>
      </div>
    </footer>
  );
};
