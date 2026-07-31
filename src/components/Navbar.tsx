'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Heart, ShoppingBag, Globe, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  locale: 'it' | 'en';
  dict: any;
}

export const Navbar: React.FC<NavbarProps> = ({ locale, dict }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist, user, logoutUser, openAuthModal } = useStore();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const toggleLanguage = () => {
    const segments = pathname.split('/');
    segments[1] = locale === 'it' ? 'en' : 'it';
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/shop`, label: dict.nav.shop, hasDropdown: true },
    { href: `/${locale}/contact`, label: dict.nav.contact },
    { href: `/${locale}/admin`, label: dict.nav.admin },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-premium-dark border-b border-[#B35C37]/15 text-[#FAF8F5] px-4 md:px-8 py-4 transition-all duration-300 shadow-[0_4px_25px_-12px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-white/5 rounded-full"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Brand Logo */}
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
              Vicenza
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium tracking-wide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href.endsWith('/shop') && pathname.includes('/shop'));
            
            if (link.hasDropdown) {
              return (
                <div
                  key={link.href}
                  className="relative py-2"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`transition-colors hover:text-[#B35C37] flex items-center gap-1 ${
                      isActive ? 'text-[#B35C37]' : 'text-[#FAF8F5]/80'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-[9px] opacity-70 transition-transform duration-300 group-hover:rotate-180">▼</span>
                  </Link>

                  {/* Mega Dropdown Panel */}
                  {dropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[560px] glass-premium-dark border border-[#B35C37]/20 rounded-2xl shadow-2xl p-6 grid grid-cols-3 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Column 1: Apparel */}
                      <div className="flex flex-col gap-3">
                        <span className="font-serif text-xs font-bold text-[#B35C37] tracking-wider uppercase border-b border-white/10 pb-1">
                          {locale === 'it' ? 'Abbigliamento' : 'Apparel'}
                        </span>
                        <div className="flex flex-col gap-2 font-sans text-xs text-[#FAF8F5]/75">
                          <Link href={`/${locale}/shop?category=kurtis`} className="hover:text-[#B35C37] transition-colors">{dict.categories.kurtis}</Link>
                          <Link href={`/${locale}/shop?category=onepiece`} className="hover:text-[#B35C37] transition-colors">{dict.categories.onepiece}</Link>
                          <Link href={`/${locale}/shop?category=summer-dresses`} className="hover:text-[#B35C37] transition-colors">{(dict.categories as any)["summer-dresses"] || "Summer Dresses"}</Link>
                          <Link href={`/${locale}/shop?category=indo-western`} className="hover:text-[#B35C37] transition-colors">{(dict.categories as any)["indo-western"] || "Indo-Western"}</Link>
                        </div>
                      </div>

                      {/* Column 2: Jewelry */}
                      <div className="flex flex-col gap-3">
                        <span className="font-serif text-xs font-bold text-[#B35C37] tracking-wider uppercase border-b border-white/10 pb-1">
                          {locale === 'it' ? 'Gioielli' : 'Jewelry'}
                        </span>
                        <div className="flex flex-col gap-2 font-sans text-xs text-[#FAF8F5]/75">
                          <Link href={`/${locale}/shop?category=jewelry-oxidized`} className="hover:text-[#B35C37] transition-colors">{(dict.categories as any)["jewelry-oxidized"] || "Oxidized Jewelry"}</Link>
                          <Link href={`/${locale}/shop?category=jewelry-anklets`} className="hover:text-[#B35C37] transition-colors">{(dict.categories as any)["jewelry-anklets"] || "Anklets"}</Link>
                          <Link href={`/${locale}/shop?category=jewelry-bracelets`} className="hover:text-[#B35C37] transition-colors">{(dict.categories as any)["jewelry-bracelets"] || "Bracelets"}</Link>
                          <Link href={`/${locale}/shop?category=jewelry-necklace`} className="hover:text-[#B35C37] transition-colors">{(dict.categories as any)["jewelry-necklace"] || "Necklaces"}</Link>
                          <Link href={`/${locale}/shop?category=jewelry-earrings`} className="hover:text-[#B35C37] transition-colors">{(dict.categories as any)["jewelry-earrings"] || "Earrings"}</Link>
                        </div>
                      </div>

                      {/* Column 3: Bags & Accessories */}
                      <div className="flex flex-col gap-3">
                        <span className="font-serif text-xs font-bold text-[#B35C37] tracking-wider uppercase border-b border-white/10 pb-1">
                          {locale === 'it' ? 'Borse & Accessori' : 'Bags & Accessories'}
                        </span>
                        <div className="flex flex-col gap-2 font-sans text-xs text-[#FAF8F5]/75">
                          <Link href={`/${locale}/shop?category=handbags`} className="hover:text-[#B35C37] transition-colors">{dict.categories.handbags}</Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-[#B35C37] ${
                  isActive ? 'text-[#B35C37] border-b-2 border-[#B35C37] pb-1' : 'text-[#FAF8F5]/80'
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/20 hover:bg-white/5 transition-colors cursor-pointer"
            title={locale === 'it' ? 'English' : 'Italiano'}
          >
            <Globe size={13} className="text-[#FAF8F5]/70" />
            <span>{locale === 'it' ? 'EN' : 'IT'}</span>
          </button>

          {/* Wishlist Icon */}
          <Link
            href={`/${locale}/wishlist`}
            className="relative p-2 hover:bg-white/5 rounded-full text-[#FAF8F5] transition-colors"
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
            className="relative p-2 hover:bg-white/5 rounded-full text-[#FAF8F5] transition-colors"
            title={dict.nav.cart}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#B35C37] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2 border-l border-white/10 pl-3 md:pl-5">
              <span className="hidden lg:inline text-xs font-semibold text-[#FAF8F5]/70">
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={logoutUser}
                className="px-3 py-1.5 text-[10px] uppercase font-bold text-red-400 hover:bg-red-950/20 rounded-lg border border-red-500/30 transition-colors cursor-pointer"
                title="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/20 hover:bg-white/5 transition-colors cursor-pointer text-[#FAF8F5]/80 hover:text-[#B35C37]"
            >
              <User size={13} />
              <span className="hidden sm:inline">{locale === 'it' ? 'Accedi' : 'Login'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[73px] left-0 w-full bg-[#0A0D0B] border-b border-white/10 shadow-lg p-5 flex flex-col gap-4 z-40 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            if (link.hasDropdown) {
              return (
                <div key={link.href} className="flex flex-col py-1">
                  <button
                    onClick={() => setMobileShopOpen(!mobileShopOpen)}
                    className="font-sans text-base font-semibold py-2 border-b border-white/5 text-[#FAF8F5]/85 flex items-center justify-between text-left"
                  >
                    <span>{link.label}</span>
                    <span className={`text-xs transition-transform duration-300 ${mobileShopOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {mobileShopOpen && (
                    <div className="pl-4 flex flex-col gap-3.5 py-3 text-sm font-sans text-[#FAF8F5]/70 border-l border-[#B35C37]/30 mt-1">
                      <Link href={`/${locale}/shop`} onClick={() => setMobileMenuOpen(false)} className="font-semibold">{locale === 'it' ? 'Vedi Tutto' : 'View All'}</Link>
                      
                      {/* Subheadings */}
                      <span className="font-serif text-xs font-bold text-[#B35C37] uppercase tracking-wider mt-1">{locale === 'it' ? 'Abbigliamento' : 'Apparel'}</span>
                      <Link href={`/${locale}/shop?category=kurtis`} onClick={() => setMobileMenuOpen(false)} className="pl-2">{dict.categories.kurtis}</Link>
                      <Link href={`/${locale}/shop?category=onepiece`} onClick={() => setMobileMenuOpen(false)} className="pl-2">{dict.categories.onepiece}</Link>
                      <Link href={`/${locale}/shop?category=summer-dresses`} onClick={() => setMobileMenuOpen(false)} className="pl-2">{(dict.categories as any)["summer-dresses"] || "Summer Dresses"}</Link>
                      <Link href={`/${locale}/shop?category=indo-western`} onClick={() => setMobileMenuOpen(false)} className="pl-2">{(dict.categories as any)["indo-western"] || "Indo-Western"}</Link>

                      <span className="font-serif text-xs font-bold text-[#B35C37] uppercase tracking-wider mt-1">{locale === 'it' ? 'Gioielli' : 'Jewelry'}</span>
                      <Link href={`/${locale}/shop?category=jewelry-oxidized`} onClick={() => setMobileMenuOpen(false)} className="pl-2">{(dict.categories as any)["jewelry-oxidized"] || "Oxidized Jewelry"}</Link>
                      <Link href={`/${locale}/shop?category=jewelry-anklets`} onClick={() => setMobileMenuOpen(false)} className="pl-2">{(dict.categories as any)["jewelry-anklets"] || "Anklets"}</Link>
                      <Link href={`/${locale}/shop?category=jewelry-bracelets`} onClick={() => setMobileMenuOpen(false)} className="pl-2">{(dict.categories as any)["jewelry-bracelets"] || "Bracelets"}</Link>
                      <Link href={`/${locale}/shop?category=jewelry-necklace`} onClick={() => setMobileMenuOpen(false)} className="pl-2">{(dict.categories as any)["jewelry-necklace"] || "Necklaces"}</Link>
                      <Link href={`/${locale}/shop?category=jewelry-earrings`} onClick={() => setMobileMenuOpen(false)} className="pl-2">{(dict.categories as any)["jewelry-earrings"] || "Earrings"}</Link>

                      <span className="font-serif text-xs font-bold text-[#B35C37] uppercase tracking-wider mt-1">{locale === 'it' ? 'Borse & Accessori' : 'Bags & Accessories'}</span>
                      <Link href={`/${locale}/shop?category=handbags`} onClick={() => setMobileMenuOpen(false)} className="pl-2">{dict.categories.handbags}</Link>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-base font-semibold py-2 border-b border-white/5 text-[#FAF8F5]/85 hover:text-[#B35C37]"
              >
                {link.label}
              </Link>
            );
          })}

          {user ? (
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10 mt-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#FAF8F5]/85">
                <User size={16} className="text-[#B35C37]" />
                <span>{locale === 'it' ? `Ciao, ${user.name}` : `Hello, ${user.name}`}</span>
              </div>
              <p className="text-[10px] text-[#FAF8F5]/50 italic -mt-1 leading-normal">{user.address}</p>
              <button
                onClick={() => {
                  logoutUser();
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/20 border border-red-500/30 rounded-xl cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-white/10 mt-2">
              <button
                onClick={() => {
                  openAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-white bg-[#B35C37] rounded-xl cursor-pointer"
              >
                {locale === 'it' ? 'Accedi / Registrati' : 'Login / Sign Up'}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
