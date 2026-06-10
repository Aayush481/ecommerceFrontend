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
            {locale === 'it' ? 'Sita & Seta Showroom' : 'Sita & Seta Showroom'}
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
