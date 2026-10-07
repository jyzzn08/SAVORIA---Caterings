import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, Clock, Utensils, Truck, CreditCard, Sparkles, X } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (notif: NotificationItem) => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'production':
        return <Utensils className="w-4 h-4 text-purple-600" />;
      case 'delivery':
        return <Truck className="w-4 h-4 text-indigo-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'order':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-stone-600" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 md:absolute md:inset-auto md:top-20 md:right-8 md:z-50">
        
        {/* Mobile Backdrop */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs md:hidden"
        />

        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-0 inset-x-0 md:static md:w-96 bg-white rounded-t-3xl md:rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-850" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Pusat Notifikasi
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-amber-800 text-white font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount} baru
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-[11px] text-amber-800 hover:text-amber-950 font-medium cursor-pointer"
                >
                  Tandai Dibaca
                </button>
              )}
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100 p-1">
            {notifications.length === 0 ? (
              <div className="py-12 px-6 text-center text-xs text-stone-500 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-sm">Belum Ada Notifikasi</h4>
                <p className="text-[11px] text-stone-500 mt-1 max-w-[220px] leading-relaxed">
                  Pemberitahuan progres dapur katering, pembayaran, dan armada akan muncul di sini.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNotificationClick(item)}
                  className={`p-3.5 flex gap-3 items-start transition-colors cursor-pointer rounded-xl ${
                    item.read ? 'hover:bg-stone-50' : 'bg-amber-50/40 hover:bg-amber-50/80'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-stone-100 shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-stone-900">
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 text-center border-t border-stone-100 bg-stone-50/50">
            <span className="text-[11px] text-stone-400">
              Notifikasi diperbarui otomatis dari sistem dapur & armada
            </span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
