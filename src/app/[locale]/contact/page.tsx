'use client';

import React, { use, useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { getDictionary } from '@/dictionaries';

import { getApiUrl } from '@/utils/api';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default function ContactPage({ params }: ContactPageProps) {
  const { locale: rawLocale } = use(params);
  const locale = rawLocale as 'it' | 'en';
  const [dict, setDict] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    getDictionary(locale).then(setDict);
  }, [locale]);

  if (!dict) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    setStatus('loading');
    try {
      const res = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#232B28]">{dict.contact.title}</h1>
        <p className="font-sans text-sm md:text-base text-[#232B28]/60 leading-relaxed">
          {dict.contact.subtitle}
        </p>
        <div className="w-16 h-1 bg-[#B35C37] mx-auto mt-2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mt-6">
        
        {/* Info panel */}
        <div className="flex flex-col gap-8 bg-white border border-[#232B28]/10 rounded-2xl p-6 md:p-8 shadow-2xs">
          <h2 className="font-serif text-2xl font-bold text-[#232B28]">
            {locale === 'it' ? 'Casa dei Regali Showroom' : 'Casa dei Regali Showroom'}
          </h2>
          <p className="font-sans text-sm text-[#232B28]/70 leading-relaxed">
            {locale === 'it' 
              ? 'Vieni a trovarci nel cuore del quadrilatero della moda a Milano. Potrai toccare con mano le nostre collezioni in seta di Varanasi e cotone Khadi artigianale.'
              : 'Visit us in the heart of Milan fashion district. Experience the premium Varanasi silk and handspun Khadi cotton collections in person.'
            }
          </p>

          <ul className="flex flex-col gap-5 font-sans text-sm text-[#232B28]/80">
            <li className="flex gap-3 items-start">
              <div className="p-2.5 bg-[#B35C37]/10 rounded-lg text-[#B35C37] flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#232B28]">{locale === 'it' ? 'Indirizzo' : 'Address'}</span>
                <span className="text-[#232B28]/75 mt-0.5">Milano, Via della Seta 42, 20121, Italia</span>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <div className="p-2.5 bg-[#B35C37]/10 rounded-lg text-[#B35C37] flex-shrink-0">
                <Phone size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#232B28]">{locale === 'it' ? 'Telefono' : 'Phone'}</span>
                <span className="text-[#232B28]/75 mt-0.5">+39 02 1234567</span>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <div className="p-2.5 bg-[#B35C37]/10 rounded-lg text-[#B35C37] flex-shrink-0">
                <Mail size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#232B28]">Email</span>
                <span className="text-[#232B28]/75 mt-0.5"><a href="mailto:aayush6b12@gmail.com" className="hover:underline">aayush6b12@gmail.com</a></span>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <div className="p-2.5 bg-[#B35C37]/10 rounded-lg text-[#B35C37] flex-shrink-0 flex items-center justify-center">
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#232B28]">Facebook</span>
                <span className="text-[#232B28]/75 mt-0.5">
                  <a href="https://www.facebook.com/casadairegali" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    casa dai regali
                  </a>
                </span>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <div className="p-2.5 bg-[#B35C37]/10 rounded-lg text-[#B35C37] flex-shrink-0 flex items-center justify-center">
                <svg className="w-[18px] h-[18px] fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#232B28]">Instagram</span>
                <span className="text-[#232B28]/75 mt-0.5">
                  <a href="https://www.instagram.com/casadeiregali" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    @casadeiregali
                  </a>
                </span>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <div className="p-2.5 bg-[#B35C37]/10 rounded-lg text-[#B35C37] flex-shrink-0 flex items-center justify-center">
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.988 3.3 1.487 5.366 1.488 5.4 0 9.794-4.393 9.798-9.793.002-2.616-1.015-5.074-2.864-6.925-1.85-1.85-4.307-2.868-6.924-2.869-5.399 0-9.795 4.393-9.799 9.794-.001 2.155.561 4.162 1.63 5.92L2.73 21.28l4.917-1.289zm10.741-6.953c-.3-.15-1.776-.875-2.049-.974-.273-.1-.472-.15-.672.15-.2.3-.772.974-.947 1.173-.174.2-.35.225-.65.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.488-1.777-1.663-2.077-.174-.3-.018-.463.13-.61.134-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.672-1.62-.92-2.206-.24-.58-.51-.5-.672-.51-.156-.008-.336-.01-.516-.01-.18 0-.472.068-.72.336-.247.269-.943.924-.943 2.252s.967 2.61 1.101 2.793c.134.183 1.902 2.906 4.609 4.074.645.278 1.148.445 1.54.57.649.206 1.24.177 1.707.107.521-.078 1.776-.726 2.025-1.426.25-.7.25-1.299.175-1.425-.076-.125-.275-.2-.575-.35z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#232B28]">WhatsApp</span>
                <span className="text-[#232B28]/75 mt-0.5">
                  <a href="https://wa.me/393898373685" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    +39 389 837 3685
                  </a>
                </span>
              </div>
            </li>
          </ul>

          {/* Opening hours */}
          <div className="border-t border-[#232B28]/10 pt-6 mt-2">
            <h4 className="font-serif font-bold text-[#232B28]">
              {locale === 'it' ? 'Orari di Apertura' : 'Showroom Opening Hours'}
            </h4>
            <div className="grid grid-cols-2 gap-4 font-sans text-xs text-[#232B28]/70 mt-3">
              <div>
                <span className="font-semibold text-[#232B28] block">{locale === 'it' ? 'Lunedì - Venerdì' : 'Monday - Friday'}</span>
                <span>10:00 - 19:00</span>
              </div>
              <div>
                <span className="font-semibold text-[#232B28] block">{locale === 'it' ? 'Sabato' : 'Saturday'}</span>
                <span>10:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form panel */}
        <form onSubmit={handleSubmit} className="bg-white border border-[#232B28]/10 rounded-2xl p-6 md:p-8 shadow-2xs flex flex-col gap-6">
          <h2 className="font-serif text-2xl font-bold text-[#232B28]">
            {locale === 'it' ? 'Invia un messaggio' : 'Send a Message'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans text-sm">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="font-semibold text-[#232B28]/75">{dict.contact.name}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-[#232B28]/15 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B35C37] transition-colors"
                placeholder={locale === 'it' ? 'Il tuo nome' : 'Your name'}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-semibold text-[#232B28]/75">{dict.contact.email}</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="border border-[#232B28]/15 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B35C37] transition-colors"
                placeholder="email@esempio.com"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5 font-sans text-sm">
            <label htmlFor="subject" className="font-semibold text-[#232B28]/75">{dict.contact.subject}</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="border border-[#232B28]/15 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B35C37] transition-colors"
              placeholder={locale === 'it' ? 'Qual è l\'oggetto del messaggio?' : 'What is the subject of the message?'}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5 font-sans text-sm">
            <label htmlFor="message" className="font-semibold text-[#232B28]/75">{dict.contact.message}</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              className="border border-[#232B28]/15 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B35C37] transition-colors resize-none"
              placeholder={locale === 'it' ? 'Scrivi qui la tua richiesta...' : 'Write your request details here...'}
            />
          </div>

          {/* Status logs */}
          {status === 'success' && (
            <div className="border border-[#2ECC71]/20 bg-[#2ECC71]/5 text-[#2ECC71] rounded-xl p-4 flex items-center gap-3 text-xs font-semibold">
              <CheckCircle2 size={16} className="flex-shrink-0" />
              <span>{dict.contact.success}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl p-4 flex items-center gap-3 text-xs font-semibold">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{dict.contact.error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex items-center justify-center gap-2 py-3.5 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Send size={15} />
            <span>{dict.contact.send}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
