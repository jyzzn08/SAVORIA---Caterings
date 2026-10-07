import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingBag, Check, ShieldCheck, Clock, Users, Utensils } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, notes?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(product.minOrder || 1);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const handleIncrement = () => setQuantity((q) => q + (product.category === 'prasmanan' ? 10 : 5));
  const handleDecrement = () => {
    setQuantity((q) => {
      const step = product.category === 'prasmanan' ? 10 : 5;
      const next = q - step;
      return next < product.minOrder ? product.minOrder : next;
    });
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, specialNotes.trim() ? specialNotes.trim() : undefined);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const totalPrice = product.price * quantity;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10 border border-stone-200"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Column 1: Large Food Imagery */}
            <div className="relative aspect-square md:aspect-auto md:h-full bg-stone-100 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent md:hidden" />
              <div className="absolute bottom-4 left-4 text-white text-xs font-medium md:hidden">
                {product.categoryLabel}
              </div>
            </div>

            {/* Column 2: Details & Purchase Options */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                
                {/* Category & Timing Metadata */}
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-amber-900 uppercase tracking-wider">{product.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.preparationTime}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
                  {product.name}
                </h2>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-sm text-stone-500 font-normal">
                    /{product.unit.replace('per ', '')}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {product.fullDescription}
                </p>

                {/* Quick specs */}
                <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-stone-500" />
                    <span>Min. Pemesanan: <strong>{product.minOrder} {product.unit.replace('per ', '')}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-stone-500" />
                    <span>{product.servingRecommendation}</span>
                  </div>
                </div>

                {/* Included Items */}
                <div className="mt-5">
                  <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-800" />
                    <span>Komposisi & Menu Termasuk:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {product.includedItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-800 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Special Request Notes */}
                <div className="mt-5">
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Catatan Khusus (Opsional):
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Contoh: Pisahkan sambal, untuk acara jam 11:30"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

              </div>

              {/* Quantity Selector & Add to Cart Footer */}
              <div className="mt-8 pt-5 border-t border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-stone-500 font-medium">Pilih Jumlah:</span>
                  
                  {/* Counter */}
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={quantity <= product.minOrder}
                      className="p-2 hover:bg-stone-200 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4 text-stone-700" />
                    </button>
                    <span className="px-4 text-sm font-semibold font-mono tabular-nums text-stone-900 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="p-2 hover:bg-stone-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-stone-700" />
                    </button>
                  </div>
                </div>

                {/* Total and CTA */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-stone-400 block">Subtotal</span>
                    <span className="text-lg font-bold font-mono tabular-nums text-stone-900">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={isAdded}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-900 hover:bg-amber-900 text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Berhasil Ditambahkan!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Tambah ke Keranjang</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
