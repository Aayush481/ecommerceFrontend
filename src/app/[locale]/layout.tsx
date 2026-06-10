import React from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { getDictionary } from '@/dictionaries';
import { StoreProvider } from '@/context/StoreContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as 'it' | 'en');
  return {
    title: {
      default: `Sita & Seta | ${dict.hero.title}`,
      template: '%s | Sita & Seta'
    },
    description: dict.hero.subtitle,
    keywords: locale === 'it' 
      ? ['kurtis etniche', 'abbigliamento indiano', 'gioielli ossidati', 'moda minimalista', 'lino fusion', 'moda italia', 'kurtas cotone'] 
      : ['ethnic kurtis', 'indian wear italy', 'oxidized jewelry', 'minimalist fashion', 'linen fusion dress', 'cotton kurtas'],
    metadataBase: new URL('http://localhost:3000'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'it-IT': '/it',
        'en-US': '/en'
      }
    }
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as 'it' | 'en');

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#FAF8F5] text-[#232B28] font-sans antialiased min-h-screen flex flex-col selection:bg-[#B35C37]/25 selection:text-[#B35C37]">
        <StoreProvider>
          <Navbar locale={locale as 'it' | 'en'} dict={dict} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer locale={locale as 'it' | 'en'} dict={dict} />
        </StoreProvider>
      </body>
    </html>
  );
}
export async function generateStaticParams() {
  return [{ locale: 'it' }, { locale: 'en' }];
}
