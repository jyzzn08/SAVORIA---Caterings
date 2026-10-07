import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.1); // PPN 10%
  const total = subtotal + tax;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-800" />
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Keranjang Pesanan ({items.length})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List or Empty State */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                    <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <h4 className="text-base font-semibold text-stone-800">
                    Keranjang Masih Kosong
                  </h4>
                  <p className="mt-1 text-xs text-stone-500 max-w-xs">
                    Pilih paket catering lezat kami untuk memulai penyusunan jamuan istimewa Anda.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Mulai Jelajahi Menu
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const itemSubtotal = item.product.price * item.quantity;

                  return (
                    <div
                      key={item.product.id}
                      className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex gap-3 relative group"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-18 h-18 rounded-xl object-cover shrink-0 bg-stone-200"
                      />

                      {/* Info & Quantity */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-stone-400 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                              title="Hapus menu"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-[11px] text-stone-500 block">
                            {formatCurrency(item.product.price)} /{item.product.unit.replace('per ', '')}
                          </span>

                          {item.notes && (
                            <p className="text-[11px] text-amber-800 bg-amber-50 rounded px-1.5 py-0.5 mt-1 line-clamp-1 italic">
                              "{item.notes}"
                            </p>
                          )}
                        </div>

                        {/* Controls & Subtotal */}
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-200/70">
                          <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden text-xs">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -5)}
                              className="px-2 py-1 hover:bg-stone-100 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3 text-stone-600" />
                            </button>
                            <span className="px-2 font-mono tabular-nums font-semibold text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 5)}
                              className="px-2 py-1 hover:bg-stone-100 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-stone-600" />
                            </button>
                          </div>

                          <span className="text-xs font-bold font-mono tabular-nums text-stone-900">
                            {formatCurrency(itemSubtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Checkout Footer (Only when items exist) */}
            {items.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-stone-200 bg-stone-50 space-y-3">
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal Menu</span>
                    <span className="font-mono tabular-nums text-stone-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pajak Restoran (PB1 / PPN 10%)</span>
                    <span className="font-mono tabular-nums text-stone-900">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                    <span>Estimasi Total</span>
                    <span className="font-mono tabular-nums text-amber-900">{formatCurrency(total)}</span>
                  </div>
                </div>

                <button
                  onClick={onProceedCheckout}
                  className="w-full py-3.5 px-4 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Lanjutkan ke Pemesanan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-stone-400 text-center">
                  Pembayaran DP & konfirmasi teknis diverifikasi oleh Customer Concierge
                </p>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
