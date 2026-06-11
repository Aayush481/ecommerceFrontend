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
    <footer className="bg-[#232B28] text-[#FAF8F5]/90 py-10 border-t border-[#FAF8F5]/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Logo & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-3">
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
            <div className="flex flex-col text-left">
              <span className="font-serif text-sm md:text-base font-bold tracking-[0.15em] uppercase text-[#FAF8F5] group-hover:text-[#B35C37] transition-colors duration-300 leading-none">
                Casa dei Regali
              </span>
              <span className="font-sans text-[7px] md:text-[8px] tracking-[0.3em] uppercase text-[#B35C37] mt-1.5 font-semibold leading-none">
                Milano
              </span>
            </div>
          </Link>
          <p className="font-sans text-[10px] text-[#FAF8F5]/40 text-center md:text-left">
            &copy; {new Date().getFullYear()} Casa dei Regali. All rights reserved. • ciao@casadeiregali.it
          </p>
        </div>

        {/* Right Side: Minimalist Newsletter Signup */}
        <div className="flex flex-col items-center md:items-end gap-2 w-full max-w-sm">
          <span className="font-serif text-xs font-semibold text-[#B35C37] uppercase tracking-wider">
            {dict.newsletter.title}
          </span>
          <form onSubmit={handleSubscribe} className="w-full flex flex-col gap-1">
            <div className="relative">
              <input
                type="email"
                placeholder={dict.newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                className="w-full bg-[#FAF8F5]/5 border border-[#FAF8F5]/25 rounded-lg px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#B35C37] transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-1 top-1 bottom-1 px-3 bg-[#B35C37] text-white rounded-md flex items-center justify-center hover:bg-[#B35C37]/90 transition-colors disabled:opacity-50 cursor-pointer"
                aria-label={dict.newsletter.subscribe}
              >
                <Send size={12} />
              </button>
            </div>
            
            {status === 'success' && (
              <div className="flex items-center gap-1.5 text-[#2ECC71] text-[10px] font-medium mt-1">
                <CheckCircle2 size={11} />
                <span>{dict.newsletter.success}</span>
              </div>
            )}
            {status === 'error' && (
              <span className="text-red-400 text-[10px] font-medium mt-1">{dict.newsletter.error}</span>
            )}
          </form>
        </div>

      </div>
    </footer>
  );
};
