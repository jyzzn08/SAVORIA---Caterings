import React from 'react';
import { ShoppingBag, Bell, User, Shield, LogOut } from 'lucide-react';
import { ActiveView, UserProfile } from '../../types';

interface HeaderProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  cartCount: number;
  unreadNotificationCount: number;
  onOpenCart: () => void;
  onToggleNotifications: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  cartCount,
  unreadNotificationCount,
  onOpenCart,
  onToggleNotifications,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single Brand Wordmark in Display Face */}
        <button
          onClick={() => onNavigate('home')}
          className="text-2xl font-serif font-bold tracking-tight text-stone-900 hover:text-amber-900 transition-colors cursor-pointer text-left"
        >
          Savoria
        </button>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors cursor-pointer hover:text-stone-950 ${
              activeView === 'home' || activeView === 'welcome'
                ? 'text-amber-900 font-semibold'
                : 'text-stone-600'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onNavigate('products')}
            className={`transition-colors cursor-pointer hover:text-stone-950 ${
              activeView === 'products'
                ? 'text-amber-900 font-semibold'
                : 'text-stone-600'
            }`}
          >
            Katalog Menu
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className={`transition-colors cursor-pointer hover:text-stone-950 ${
              activeView === 'orders'
                ? 'text-amber-900 font-semibold'
                : 'text-stone-600'
            }`}
          >
            Pesanan Saya
          </button>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:text-stone-950 ${
                activeView === 'admin'
                  ? 'text-amber-900 font-semibold'
                  : 'text-stone-600'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-700" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions (Notifications, Cart, Auth) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Button with Badge */}
          <button
            onClick={onToggleNotifications}
            aria-label="Notifikasi"
            className="relative p-2.5 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-800 text-[10px] font-bold text-white tabular-nums ring-2 ring-stone-50">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Cart Button with Count */}
          <button
            onClick={onOpenCart}
            aria-label="Keranjang Belanja"
            className="relative p-2.5 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white tabular-nums ring-2 ring-stone-50">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile / Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-stone-200 ml-1">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-stone-900 truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-stone-500 capitalize">
                  {currentUser.role === 'admin' ? 'Administrator' : 'Customer'}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Keluar"
                className="p-2 rounded-full text-stone-500 hover:text-rose-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide text-stone-900 bg-stone-200/80 hover:bg-stone-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
