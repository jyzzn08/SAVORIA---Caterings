import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock, User, Phone, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { UserRole, UserProfile, UserAccount, ActiveView } from '../../types';

interface LoginPageProps {
  registeredUsers: UserAccount[];
  onLoginSuccess: (user: UserProfile, targetView?: ActiveView) => void;
  onRegisterUser: (newUser: UserAccount) => void;
  onNavigateBack: () => void;
  sheetsConnected: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  registeredUsers,
  onLoginSuccess,
  onRegisterUser,
  onNavigateBack,
}) => {
  const [tabMode, setTabMode] = useState<'signin' | 'register'>('signin');
  const [role, setRole] = useState<UserRole>('customer');
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  // Sign In Form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1-Click Demo Quick Access
  const handleQuickDemo = (demoRole: UserRole) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (demoRole === 'admin') {
        const adminUser = registeredUsers.find((u) => u.role === 'admin') || {
          id: 'usr-admin',
          name: 'Chef Hendra (Operations Head)',
          email: 'admin.kitchen@savoria-catering.com',
          phone: '+62 811-2233-4455',
          role: 'admin' as UserRole,
          companyOrEvent: 'Savoria Central Kitchen',
          createdAt: '01 Jan 2026',
          status: 'active' as const,
        };
        onLoginSuccess(adminUser, 'admin');
      } else {
        const customerUser = registeredUsers.find((u) => u.role === 'customer') || {
          id: 'usr-customer',
          name: 'Alexander Santoso',
          email: 'alexander@corporate.id',
          phone: '+62 812-8899-7721',
          role: 'customer' as UserRole,
          companyOrEvent: 'PT Astra Tech Group',
          createdAt: '01 Okt 2026',
          status: 'active' as const,
        };
        onLoginSuccess(customerUser, 'home');
      }
    }, 350);
  };

  // Sign In Handler
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signInEmail.trim()) {
      setErrorMessage('Silakan masukkan email Anda.');
      return;
    }
    if (!signInPassword) {
      setErrorMessage('Silakan masukkan kata sandi.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Find user in registered list
      const matched = registeredUsers.find(
        (u) => u.email.toLowerCase() === signInEmail.trim().toLowerCase()
      );

      if (matched) {
        onLoginSuccess(matched, matched.role === 'admin' ? 'admin' : 'home');
      } else {
        // Derive clean name from email
        const derivedName = signInEmail.split('@')[0]
          .replace(/[._]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

        const newUser: UserAccount = {
          id: `usr-${Date.now()}`,
          name: derivedName,
          email: signInEmail.trim().toLowerCase(),
          phone: '+62 812-8899-7721',
          role: role,
          createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'active',
        };

        onRegisterUser(newUser);
        onLoginSuccess(newUser, role === 'admin' ? 'admin' : 'home');
      }
    }, 400);
  };

  // Register Handler
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim()) {
      setErrorMessage('Silakan isi nama lengkap Anda.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('Silakan isi alamat email.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        phone: regPhone.trim() || '+62 812-8899-7721',
        role: role,
        password: regPassword,
        createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'active',
      };

      onRegisterUser(newUser);
      setIsSubmitting(false);
      onLoginSuccess(newUser, newUser.role === 'admin' ? 'admin' : 'home');
    }, 450);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 bg-[#FAF9F6]">
      
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-stone-200"
      >
        {/* Back Link */}
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <span className="text-3xl font-serif font-bold text-stone-900 tracking-tight block">
            Savoria
          </span>
          <h2 className="text-lg font-semibold text-stone-900 mt-2">
            {tabMode === 'signin' ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
          </h2>
        </div>

        {/* Tab Switcher (Masuk vs Daftar) */}
        <div className="p-1 bg-stone-100 rounded-xl grid grid-cols-2 gap-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setTabMode('signin');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tabMode === 'signin'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setTabMode('register');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tabMode === 'register'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Daftar
          </button>
        </div>

        {/* Role Selector: Pelanggan vs Admin */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
          <span className="text-xs text-stone-500">Peran Akun:</span>
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                role === 'customer'
                  ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Pelanggan
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                role === 'admin'
                  ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Admin Dapur
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {errorMessage}
          </div>
        )}

        {/* SIGN IN FORM */}
        {tabMode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50 hover:bg-stone-50/80 focus:bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-stone-700">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => alert('Tautan pemulihan kata sandi telah dikirim ke email Anda.')}
                  className="text-[11px] text-amber-900 hover:underline cursor-pointer"
                >
                  Lupa sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-stone-50 hover:bg-stone-50/80 focus:bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {tabMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50 focus:bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50 focus:bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="0812..."
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50 focus:bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-stone-50 focus:bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer disabled:opacity-50 mt-1"
            >
              {isSubmitting ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </form>
        )}

        {/* Quiet 1-Click Demo Shortcut */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>Akses cepat demo:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="text-stone-600 hover:text-amber-900 underline font-medium cursor-pointer"
            >
              Klien Demo
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="text-stone-600 hover:text-amber-900 underline font-medium cursor-pointer"
            >
              Admin Demo
            </button>
          </div>
        </div>

      </motion.div>

    </div>
  );
};
