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
                Vicenza
              </span>
            </div>
          </Link>
          <p className="font-sans text-[10px] text-[#FAF8F5]/40 text-center md:text-left">
            &copy; {new Date().getFullYear()} Casa dei Regali. All rights reserved. • ciao@casadeiregali.it
          </p>
          <div className="flex items-center gap-4 mt-2 justify-center md:justify-start">
            <a 
              href="https://www.facebook.com/casadairegali" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#FAF8F5]/50 hover:text-[#B35C37] transition-colors duration-300 flex items-center"
              aria-label="Facebook"
            >
              <svg className="w-3.75 h-3.75 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/casadeiregali" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#FAF8F5]/50 hover:text-[#B35C37] transition-colors duration-300 flex items-center"
              aria-label="Instagram"
            >
              <svg className="w-3.75 h-3.75 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a 
              href="https://wa.me/393898373685" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#FAF8F5]/50 hover:text-[#B35C37] transition-colors duration-300 flex items-center"
              aria-label="WhatsApp"
            >
              <svg className="w-3.75 h-3.75 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.988 3.3 1.487 5.366 1.488 5.4 0 9.794-4.393 9.798-9.793.002-2.616-1.015-5.074-2.864-6.925-1.85-1.85-4.307-2.868-6.924-2.869-5.399 0-9.795 4.393-9.799 9.794-.001 2.155.561 4.162 1.63 5.92L2.73 21.28l4.917-1.289zm10.741-6.953c-.3-.15-1.776-.875-2.049-.974-.273-.1-.472-.15-.672.15-.2.3-.772.974-.947 1.173-.174.2-.35.225-.65.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.488-1.777-1.663-2.077-.174-.3-.018-.463.13-.61.134-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.672-1.62-.92-2.206-.24-.58-.51-.5-.672-.51-.156-.008-.336-.01-.516-.01-.18 0-.472.068-.72.336-.247.269-.943.924-.943 2.252s.967 2.61 1.101 2.793c.134.183 1.902 2.906 4.609 4.074.645.278 1.148.445 1.54.57.649.206 1.24.177 1.707.107.521-.078 1.776-.726 2.025-1.426.25-.7.25-1.299.175-1.425-.076-.125-.275-.2-.575-.35z"/>
              </svg>
            </a>
          </div>
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
