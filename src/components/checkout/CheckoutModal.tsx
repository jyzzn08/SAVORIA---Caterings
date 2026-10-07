import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Phone, User, CheckCircle2, CreditCard, Sparkles } from 'lucide-react';
import { CartItem, CustomerOrder, UserProfile } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentUser: UserProfile | null;
  onConfirmOrder: (newOrder: CustomerOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  onConfirmOrder,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.1);
  const deliveryFee = 100000;
  const serviceFee = 150000;
  const total = subtotal + tax + deliveryFee + serviceFee;
  const totalGuests = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [eventTitle, setEventTitle] = useState('Gathering Spesial Keluarga & Kolega');
  const [eventType, setEventType] = useState('Corporate & Family Gathering');
  const [eventDate, setEventDate] = useState('2026-10-25');
  const [eventTime, setEventTime] = useState('11:30 WIB');
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState('Graha Pratama Ballroom Lt. 3, Jl. MT Haryono Kav. 15');
  const [deliveryCity, setDeliveryCity] = useState('Jakarta Selatan');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer BCA (Virtual Account)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      setContactName(currentUser.name);
      setContactPhone(currentUser.phone);
    }
  }, [currentUser, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderNum = `SAV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: CustomerOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        eventTitle,
        eventType,
        eventDate,
        eventTime,
        guestCount: totalGuests,
        status: 'pending_payment',
        statusLabel: 'Menunggu Pembayaran',
        items: cartItems.map((ci) => ({
          product: ci.product,
          quantity: ci.quantity,
          price: ci.product.price,
          notes: ci.notes,
        })),
        subtotal,
        deliveryFee,
        serviceFee,
        tax,
        total,
        deliveryAddress,
        deliveryCity,
        contactName,
        contactPhone,
        customerEmail: currentUser?.email,
        paymentMethod,
        paymentStatus: 'unpaid',
        createdAt: 'Hari ini',
        timeline: [
          {
            status: 'draft',
            label: 'Draft Pesanan',
            timestamp: 'Baru saja',
            isCompleted: true,
            isCurrent: false,
          },
          {
            status: 'pending_payment',
            label: 'Menunggu Pembayaran',
            timestamp: 'Sekarang',
            notes: 'Faktur DP 50% diterbitkan ke email Anda',
            isCompleted: true,
            isCurrent: true,
          },
          {
            status: 'processing',
            label: 'Verifikasi Dapur',
            isCompleted: false,
            isCurrent: false,
          },
          {
            status: 'production',
            label: 'Produksi',
            isCompleted: false,
            isCurrent: false,
          },
          {
            status: 'ready_to_ship',
            label: 'Siap Dikirim',
            isCompleted: false,
            isCurrent: false,
          },
          {
            status: 'completed',
            label: 'Selesai',
            isCompleted: false,
            isCurrent: false,
          },
        ],
      };

      setIsSubmitting(false);
      onConfirmOrder(newOrder);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto z-10 border border-stone-200 p-6 sm:p-8"
        >
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
                Konfirmasi Layanan
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Pemesanan & Jadwal Acara
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            
            {/* Acara & Jadwal */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-800" />
                <span>Detail Acara & Waktu</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nama / Perihal Acara
                </label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Jam Santap / Sajian
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>
              </div>
            </div>

            {/* Alamat Pengiriman */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-800" />
                <span>Lokasi Venue & Pengiriman</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Alamat Lengkap / Nama Gedung & Lantai
                </label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Kota / Wilayah
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nomor WhatsApp / Kontak PIC
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-800" />
                <span>Ketentuan Pembayaran (DP 50%)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'Bank Transfer BCA (Virtual Account)',
                  'Bank Mandiri Corporate VA',
                  'Kartu Kredit Corporate',
                  'Term of Payment / PO Instansi',
                ].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === m
                        ? 'border-amber-800 bg-amber-50/80 font-semibold text-stone-900'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Ringkasan */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal Menu ({cartItems.length} macam)</span>
                <span className="font-mono tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Armada Pendingin & Pengiriman</span>
                <span className="font-mono tabular-nums">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Pajak Restoran PB1 (10%)</span>
                <span className="font-mono tabular-nums">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                <span>Total Pemesanan</span>
                <span className="font-mono tabular-nums text-amber-900">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Membuat Kontrak Pesanan...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Konfirmasi & Buat Pesanan</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
