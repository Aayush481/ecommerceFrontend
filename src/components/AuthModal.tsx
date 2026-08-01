'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locale: 'it' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, locale }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isSignUp) {
      if (!name || !email || !phone || !password || !address) {
        setError(locale === 'it' ? 'Tutti i campi sono obbligatori' : 'All fields are required');
        return;
      }
      
      const registeredStr = localStorage.getItem('sita_seta_registered_users') || '[]';
      const registered = JSON.parse(registeredStr);
      
      if (registered.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        setError(locale === 'it' ? 'Email già registrata' : 'Email already registered');
        return;
      }

      const newUser = { name, email, phone, password, address };
      registered.push(newUser);
      localStorage.setItem('sita_seta_registered_users', JSON.stringify(registered));
      localStorage.setItem('sita_seta_user', JSON.stringify({ name, email, phone, address }));
      
      setSuccess(locale === 'it' ? 'Registrazione completata!' : 'Registration successful!');
      setTimeout(() => {
        onSuccess();
        onClose();
        // Reset
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setAddress('');
        setSuccess('');
      }, 1000);
    } else {
      if (!email || !password) {
        setError(locale === 'it' ? 'Tutti i campi sono obbligatori' : 'All fields are required');
        return;
      }

      const registeredStr = localStorage.getItem('sita_seta_registered_users') || '[]';
      const registered = JSON.parse(registeredStr);
      
      const foundUser = registered.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );



      if (!foundUser) {
        setError(locale === 'it' ? 'Credenziali non valide' : 'Invalid credentials');
        return;
      }

      localStorage.setItem('sita_seta_user', JSON.stringify({ name: foundUser.name, email: foundUser.email, phone: foundUser.phone, address: foundUser.address }));
      setSuccess(locale === 'it' ? 'Accesso riuscito!' : 'Login successful!');
      setTimeout(() => {
        onSuccess();
        onClose();
        setEmail('');
        setPassword('');
        setSuccess('');
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center bg-[#232B28]/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#FAF8F5]/98 backdrop-blur-md border border-[#232B28]/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 animate-in scale-in duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-[#232B28]/5 rounded-full text-[#232B28] transition-colors cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <svg className="w-8 h-8 text-[#B35C37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="4" y="9" width="16" height="11" rx="1" />
            <path d="M12 9V20" />
            <path d="M4 13H20" />
            <path d="M12 9C12 6.5 10 5 8.5 6.5S10 9 12 9z" />
            <path d="M12 9C12 6.5 14 5 15.5 6.5S14 9 12 9z" />
          </svg>
          <h2 className="font-serif text-2xl font-bold text-[#232B28]">
            {isSignUp 
              ? (locale === 'it' ? 'Crea un Account' : 'Create an Account')
              : (locale === 'it' ? 'Accesso Cliente' : 'Customer Login')
            }
          </h2>
          <p className="font-sans text-xs text-[#232B28]/60 max-w-[280px]">
            {locale === 'it' 
              ? 'Accedi per completare acquisti ed aggiungere prodotti al carrello.' 
              : 'Sign in to complete purchases and add items to your cart.'
            }
          </p>
        </div>

        {/* Tabs switcher */}
        <div className="flex bg-[#232B28]/5 rounded-xl p-1 font-sans text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-center transition-all cursor-pointer ${
              !isSignUp ? 'bg-white text-[#B35C37] shadow-xs' : 'text-[#232B28]/50 hover:text-[#232B28]'
            }`}
          >
            {locale === 'it' ? 'Accedi' : 'Log In'}
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-center transition-all cursor-pointer ${
              isSignUp ? 'bg-white text-[#B35C37] shadow-xs' : 'text-[#232B28]/50 hover:text-[#232B28]'
            }`}
          >
            {locale === 'it' ? 'Registrati' : 'Sign Up'}
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="border border-red-200 bg-red-50 text-red-700 text-xs font-semibold rounded-lg p-3 text-center animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg p-3 text-center animate-fade-in">
            {success}
          </div>
        )}

        {/* Form */}        <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4 font-sans text-xs text-[#232B28]/80">
          
          {isSignUp && (
            <div className="flex flex-col gap-1">
              <label htmlFor="auth-signup-name" className="font-bold text-[#232B28]/70 uppercase tracking-wider">
                {locale === 'it' ? 'Nome Completo' : 'Full Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="auth-signup-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Maria Rossi"
                  className="w-full bg-white border border-[#232B28]/15 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#B35C37] text-xs transition-colors"
                />
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#232B28]/45" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="auth-email" className="font-bold text-[#232B28]/70 uppercase tracking-wider">
              {locale === 'it' ? 'Indirizzo Email' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                id="auth-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maria.rossi@email.com"
                className="w-full bg-white border border-[#232B28]/15 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#B35C37] text-xs transition-colors"
              />
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#232B28]/45" />
            </div>
          </div>

          {isSignUp && (
            <div className="flex flex-col gap-1">
              <label htmlFor="auth-signup-phone" className="font-bold text-[#232B28]/70 uppercase tracking-wider">
                {locale === 'it' ? 'Numero di Telefono' : 'Phone Number'}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="auth-signup-phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39 345 678 9123"
                  className="w-full bg-white border border-[#232B28]/15 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#B35C37] text-xs transition-colors"
                />
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#232B28]/45" />
              </div>
            </div>
          )}

          {isSignUp && (
            <div className="flex flex-col gap-1">
              <label htmlFor="auth-signup-address" className="font-bold text-[#232B28]/70 uppercase tracking-wider">
                {locale === 'it' ? 'Indirizzo di Spedizione' : 'Shipping Address'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="auth-signup-address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Via della Seta 15, 36100 Vicenza (VI), Italia"
                  className="w-full bg-white border border-[#232B28]/15 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#B35C37] text-xs transition-colors"
                />
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#232B28]/45" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="auth-password" className="font-bold text-[#232B28]/70 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="auth-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#232B28]/15 rounded-lg pl-9 pr-10 py-2.5 focus:outline-none focus:border-[#B35C37] text-xs transition-colors"
              />
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#232B28]/45" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#232B28]/45 hover:text-[#B35C37] cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full mt-2 py-3.5 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-bold tracking-wider uppercase rounded-xl transition-colors shadow-md cursor-pointer"
          >
            {isSignUp 
              ? (locale === 'it' ? 'Registrati ed Entra' : 'Sign Up & Login')
              : (locale === 'it' ? 'Accedi' : 'Log In')
            }
          </button>
        </form>

      </div>
    </div>
  );
};
