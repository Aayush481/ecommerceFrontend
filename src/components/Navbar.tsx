'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Menu, X, Globe, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  locale: 'it' | 'en';
  dict: any;
}

export const Navbar: React.FC<NavbarProps> = ({ locale, dict }) => {
  const { cart, wishlist } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const toggleLanguage = () => {
    const newLocale = locale === 'it' ? 'en' : 'it';
    // Replace the locale in the current path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/shop`, label: dict.nav.shop },
    { href: `/${locale}/contact`, label: dict.nav.contact },
    { href: `/${locale}/admin`, label: dict.nav.admin },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#232B28]/10 text-[#232B28] px-4 md:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-[#232B28]/5 rounded-full"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Brand Logo */}
        <Link 
          href={`/${locale}`}
          className="font-serif text-2xl md:text-3xl font-semibold tracking-wide text-[#B35C37] hover:opacity-95 transition-opacity"
        >
          Sita & Seta
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium tracking-wide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href.endsWith('/shop') && pathname.includes('/shop'));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-[#B35C37] ${
                  isActive ? 'text-[#B35C37] border-b-2 border-[#B35C37] pb-1' : 'text-[#232B28]/80'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#232B28]/20 hover:bg-[#232B28]/5 transition-colors cursor-pointer"
            title={locale === 'it' ? 'English' : 'Italiano'}
          >
            <Globe size={13} className="text-[#232B28]/70" />
            <span>{locale === 'it' ? 'EN' : 'IT'}</span>
          </button>

          {/* Wishlist Icon */}
          <Link
            href={`/${locale}/wishlist`}
            className="relative p-2 hover:bg-[#232B28]/5 rounded-full text-[#232B28] transition-colors"
            title={dict.nav.wishlist}
          >
            <Heart size={20} className={wishlistCount > 0 ? 'fill-[#B35C37] text-[#B35C37]' : ''} />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#B35C37] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            href={`/${locale}/cart`}
            className="relative p-2 hover:bg-[#232B28]/5 rounded-full text-[#232B28] transition-colors"
            title={dict.nav.cart}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#B35C37] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[73px] left-0 w-full bg-[#FAF8F5] border-b border-[#232B28]/10 shadow-lg p-5 flex flex-col gap-4 z-40 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans text-base font-semibold py-2 border-b border-[#232B28]/5 text-[#232B28]/85 hover:text-[#B35C37]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
