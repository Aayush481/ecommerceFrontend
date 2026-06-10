'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { getDictionary } from '@/dictionaries';

import { getApiUrl, formatImageUrl } from '@/utils/api';

interface CartPageProps {
  params: Promise<{ locale: string }>;
}

export default function CartPage({ params }: CartPageProps) {
  const { locale: rawLocale } = use(params);
  const locale = rawLocale as 'it' | 'en';
  const [dict, setDict] = useState<any>(null);
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore();
  
  // Checkout states
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Load dictionary client-side since this is a 'use client' page
  React.useEffect(() => {
    getDictionary(locale).then(setDict);
  }, [locale]);

  if (!dict) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping for Italy
  const total = subtotal + shipping;

  const handleProceedToCheckout = () => {
    setShowCheckoutForm(true);
    setCheckoutError('');
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail) return;

    setCheckoutLoading(true);
    setCheckoutError('');

    try {
      const res = await fetch(getApiUrl('/api/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerEmail,
          items: cart,
          total: total,
        }),
      });

      if (res.ok) {
        setCheckoutComplete(true);
        clearCart();
      } else {
        const errData = await res.json().catch(() => ({}));
        setCheckoutError(
          errData.message || 
          (locale === 'it' 
            ? 'Si è verificato un errore durante l\'invio dell\'ordine.' 
            : 'An error occurred while submitting your order.')
        );
      }
    } catch (err) {
      console.error(err);
      setCheckoutError(
        locale === 'it' 
          ? 'Errore di connessione. Verifica che il server sia attivo e riprova.' 
          : 'Connection error. Make sure the server is running and try again.'
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (checkoutComplete) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
        <div className="p-4 bg-[#2ECC71]/15 rounded-full text-[#2ECC71]">
          <CheckCircle size={48} />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#232B28]">
          {locale === 'it' ? 'Ordine Inviato Con Successo!' : 'Order Dispatched Successfully!'}
        </h1>
        <p className="font-sans text-sm text-[#232B28]/70 leading-relaxed">
          {locale === 'it'
            ? 'La richiesta d\'ordine è stata trasmessa. Una notifica di riepilogo è stata inviata a aayush6b12@gmail.com e al tuo indirizzo email.'
            : 'Your order request has been dispatched. A summary notification has been sent to aayush6b12@gmail.com and to your email address.'}
        </p>
        <Link
          href={`/${locale}/shop`}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-sans font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer"
        >
          <span>{locale === 'it' ? 'Continua lo Shopping' : 'Continue Shopping'}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#232B28] mb-10">{dict.cart_page.title}</h1>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex items-center gap-4 p-4 bg-white border border-[#232B28]/10 rounded-xl shadow-2xs"
              >
                <div className="relative w-20 h-24 overflow-hidden rounded-lg bg-stone-100 flex-shrink-0">
                  <Image src={formatImageUrl(item.image)} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex-grow flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#232B28]">{item.name}</h3>
                    <p className="font-sans text-xs text-[#232B28]/60 mt-1">
                      Size: <span className="font-bold text-[#232B28]">{item.size}</span> | SKU: {item.sku}
                    </p>
                    <span className="font-serif text-sm font-bold text-[#B35C37] block mt-2">
                      €{item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity and Remove actions */}
                  <div className="flex items-center gap-6 justify-between md:justify-end">
                    <div className="flex items-center border border-[#232B28]/15 rounded-lg overflow-hidden bg-[#FAF8F5]">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-[#232B28]/5 text-[#232B28] transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 font-sans text-xs font-bold text-[#232B28]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-[#232B28]/5 text-[#232B28] transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                      title={dict.cart_page.remove}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Card */}
          <div className="border border-[#232B28]/10 bg-white rounded-2xl p-6 shadow-2xs h-fit flex flex-col gap-6">
            <h2 className="font-serif text-xl font-bold text-[#232B28] border-b border-[#232B28]/5 pb-3">
              {dict.cart_page.summary}
            </h2>

            <div className="flex flex-col gap-3 font-sans text-sm">
              <div className="flex items-center justify-between text-[#232B28]/70">
                <span>{dict.cart_page.subtotal}</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[#232B28]/70">
                <span>{dict.cart_page.shipping}</span>
                <span className="text-[#2ECC71] font-bold uppercase text-xs">{dict.cart_page.shipping_free}</span>
              </div>
              <div className="flex items-center justify-between text-[#232B28] font-bold text-base border-t border-[#232B28]/5 pt-3 mt-1 text-[#232B28]">
                <span>{dict.cart_page.total}</span>
                <span className="text-[#B35C37]">€{total.toFixed(2)}</span>
              </div>
            </div>

            {!showCheckoutForm ? (
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                {dict.cart_page.checkout}
              </button>
            ) : (
              <form onSubmit={handleConfirmOrder} className="flex flex-col gap-4 border-t border-[#232B28]/10 pt-4 mt-1">
                <div className="flex flex-col gap-1.5 font-sans text-sm">
                  <label htmlFor="customerEmail" className="font-semibold text-[#232B28]/75">
                    {locale === 'it' ? 'La tua Email per la notifica' : 'Your Email for notification'}
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@esempio.com"
                    className="border border-[#232B28]/15 rounded-lg px-3 py-2 focus:outline-none focus:border-[#B35C37] transition-colors text-sm"
                  />
                </div>

                {checkoutError && (
                  <div className="text-red-600 font-sans text-xs bg-red-50 border border-red-200 rounded-lg p-2.5">
                    {checkoutError}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={checkoutLoading}
                    className="w-full py-3.5 bg-[#B35C37] hover:bg-[#B35C37]/90 disabled:opacity-50 text-white font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    {checkoutLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : null}
                    <span>{locale === 'it' ? 'Invia Ordine' : 'Place Order'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCheckoutForm(false)}
                    className="w-full py-2.5 bg-transparent border border-[#232B28]/15 hover:bg-[#232B28]/5 text-[#232B28] font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    {locale === 'it' ? 'Indietro' : 'Back'}
                  </button>
                </div>
              </form>
            )}

            <span className="font-sans text-[10px] text-[#232B28]/50 italic leading-normal text-center bg-[#232B28]/5 p-3 rounded-lg border border-[#232B28]/5">
              {dict.cart_page.checkout_note}
            </span>
          </div>

        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-[#232B28]/10 rounded-xl flex flex-col items-center gap-4">
          <ShoppingBag size={40} className="text-[#232B28]/35" />
          <p className="font-serif text-lg text-[#232B28]/70">{dict.cart_page.empty}</p>
          <Link
            href={`/${locale}/shop`}
            className="inline-block px-8 py-3 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-sans font-bold text-xs tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
          >
            {dict.cart_page.empty_cta}
          </Link>
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
