import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, ChevronRight, MapPin, Calendar, Receipt, FileText, ArrowLeft, Phone, User, X, LogIn, UtensilsCrossed } from 'lucide-react';
import { CustomerOrder, OrderStatus, UserProfile, ActiveView } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface CustomerOrdersPageProps {
  orders: CustomerOrder[];
  currentUser: UserProfile | null;
  onNavigate: (view: ActiveView) => void;
  onBackToProducts: () => void;
}

export const CustomerOrdersPage: React.FC<CustomerOrdersPageProps> = ({
  orders,
  currentUser,
  onNavigate,
  onBackToProducts,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(orders[0] || null);

  useEffect(() => {
    if (orders.length > 0 && (!selectedOrder || !orders.some((o) => o.id === selectedOrder.id))) {
      setSelectedOrder(orders[0]);
    } else if (orders.length === 0) {
      setSelectedOrder(null);
    }
  }, [orders, selectedOrder]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'draft':
        return 'text-stone-600 bg-stone-100 border-stone-300';
      case 'pending_payment':
        return 'text-amber-800 bg-amber-50 border-amber-300';
      case 'processing':
        return 'text-blue-800 bg-blue-50 border-blue-300';
      case 'production':
        return 'text-purple-800 bg-purple-50 border-purple-300';
      case 'ready_to_ship':
        return 'text-indigo-800 bg-indigo-50 border-indigo-300';
      case 'completed':
        return 'text-emerald-800 bg-emerald-50 border-emerald-300';
      default:
        return 'text-stone-600 bg-stone-100 border-stone-300';
    }
  };

  const stepsOrder: { status: OrderStatus; label: string }[] = [
    { status: 'draft', label: 'Draft' },
    { status: 'pending_payment', label: 'Menunggu Pembayaran' },
    { status: 'processing', label: 'Diproses' },
    { status: 'production', label: 'Produksi' },
    { status: 'ready_to_ship', label: 'Siap Dikirim' },
    { status: 'completed', label: 'Selesai' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    return stepsOrder.findIndex((s) => s.status === status);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
            Status Pelayanan Katering
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            Pesanan Saya
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pantau perkembangan pengolahan hidangan, jadwal armada, dan rincian faktur secara real-time.
          </p>
        </div>

        <button
          onClick={onBackToProducts}
          className="self-start sm:self-auto px-5 py-2.5 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-800" />
          <span>Jelajahi Katalog Menu</span>
        </button>
      </div>

      {/* STATE 1: GUEST NOT LOGGED IN */}
      {!currentUser && (
        <div className="my-16 py-16 px-6 bg-white rounded-3xl border border-stone-200/90 shadow-xs text-center max-w-xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center mb-5 ring-8 ring-amber-50/50">
            <User className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Silakan Masuk ke Akun Anda
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Anda belum login, sehingga belum ada riwayat pesanan yang dapat ditampilkan. Masuk ke akun Anda untuk melihat jadwal perjamuan, progres dapur katering, dan faktur resmi.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-7 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>Sign In / Login</span>
            </button>
            <button
              onClick={onBackToProducts}
              className="w-full sm:w-auto px-7 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Lihat Koleksi Menu</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE 2: LOGGED IN BUT NO ORDERS YET */}
      {currentUser && orders.length === 0 && (
        <div className="my-16 py-16 px-6 bg-white rounded-3xl border border-stone-200/90 shadow-xs text-center max-w-xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center mb-5">
            <FileText className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Belum Ada Riwayat Pesanan
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Halo, <strong className="font-semibold text-stone-900">{currentUser.name}</strong>. Anda belum memiliki pesanan katering aktif saat ini. Buka katalog menu kami untuk mulai merancang sajian istimewa perhelatan Anda.
          </p>
          <div className="mt-8">
            <button
              onClick={onBackToProducts}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4 text-stone-950" />
              <span>Mulai Pesan di Katalog Menu</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE 3: LOGGED IN WITH ORDERS */}
      {currentUser && orders.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Left: Orders List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Daftar Acara &amp; Kontrak ({orders.length})
            </h3>

            {orders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/60 border-amber-800/40 shadow-sm ring-1 ring-amber-800/20'
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono font-medium text-stone-500">
                        {order.orderNumber}
                      </span>
                      <h4 className="text-sm font-serif font-bold text-stone-900 mt-0.5 line-clamp-1">
                        {order.eventTitle}
                      </h4>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.statusLabel}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-xs text-stone-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{formatDate(order.eventDate)}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{order.eventTime}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium">
                      {order.guestCount} Undangan
                    </span>
                    <span className="font-mono font-bold text-stone-900">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Tracking & Timeline */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-8 shadow-xs">
                
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
                        {selectedOrder.orderNumber}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.statusLabel}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-2">
                      {selectedOrder.eventTitle}
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Diajukan pada {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-500 block">Total Nilai Kontrak</span>
                    <span className="text-xl font-mono font-bold text-amber-900 block mt-0.5">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                    <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium inline-block mt-1">
                      DP 50% Terverifikasi
                    </span>
                  </div>
                </div>

                {/* 6-Stage Timeline Tracker */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                    Alur Produksi &amp; Logistik (6 Tahap)
                  </h3>

                  <div className="relative">
                    {/* Background Connecting Line */}
                    <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-0.5 bg-stone-200 -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative z-10">
                      {stepsOrder.map((step, index) => {
                        const currentIndex = getStepIndex(selectedOrder.status);
                        const isDone = index < currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                          <div
                            key={step.status}
                            className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                              isCurrent
                                ? 'bg-amber-50/80 border border-amber-800/30'
                                : 'bg-white sm:bg-transparent'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-2 ${
                                isDone
                                  ? 'bg-amber-800 text-white'
                                  : isCurrent
                                  ? 'bg-amber-700 text-white ring-4 ring-amber-100'
                                  : 'bg-stone-200 text-stone-500'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                              ) : (
                                index + 1
                              )}
                            </div>

                            <span
                              className={`text-[11px] font-semibold leading-tight ${
                                isCurrent
                                  ? 'text-amber-900'
                                  : isDone
                                  ? 'text-stone-800'
                                  : 'text-stone-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stage Description Notes */}
                  <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900">
                        Catatan Operasional Tahap Ini:{' '}
                      </span>
                      {selectedOrder.status === 'production' &&
                        'Dapur Savoria sedang mengolah hidangan utama dan packaging bento/chafing dish siap dipanaskan.'}
                      {selectedOrder.status === 'draft' &&
                        'Pesanan masih dalam bentuk draf proposal kebutuhan menu katering.'}
                      {selectedOrder.status === 'pending_payment' &&
                        'Menunggu verifikasi pembayaran uang muka (DP 50%) sebelum belanja bahan segar.'}
                      {selectedOrder.status === 'processing' &&
                        'Bahan baku segar telah dialokasikan dan jadwal koki eksekutif disiapkan.'}
                      {selectedOrder.status === 'ready_to_ship' &&
                        'Hidangan telah dimasukkan ke armada berpendingin/termal dan siap diberangkatkan.'}
                      {selectedOrder.status === 'completed' &&
                        'Pelayanan jamuan katering telah sukses dituntaskan dengan kepuasan pelanggan.'}
                      {!['draft', 'pending_payment', 'processing', 'production', 'ready_to_ship', 'completed'].includes(selectedOrder.status) &&
                        'Tim operasional Savoria sedang mengkoordinasikan pesanan ini sesuai instruksi.'}
                    </div>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                    Rincian Menu yang Dipesan
                  </h3>

                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-stone-900">
                              {item.product.name}
                            </h4>
                            <span className="text-[11px] text-stone-500">
                              {item.quantity} {item.product.unit.replace('per ', '')} × {formatCurrency(item.price)}
                            </span>
                            {item.notes && (
                              <p className="text-[11px] text-amber-800 italic mt-0.5">
                                "{item.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-stone-900 tabular-nums">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Venue Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200 text-xs">
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 space-y-2">
                    <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-800" />
                      <span>Lokasi &amp; Jadwal Acara</span>
                    </span>
                    <p className="text-stone-700 leading-relaxed">
                      {selectedOrder.deliveryAddress}, {selectedOrder.deliveryCity}
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      Hari &amp; Waktu: <strong>{formatDate(selectedOrder.eventDate)} ({selectedOrder.eventTime})</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 space-y-2">
                    <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-amber-800" />
                      <span>Info Pembayaran &amp; Kontak</span>
                    </span>
                    <p className="text-stone-700">
                      Metode: <strong>{selectedOrder.paymentMethod}</strong>
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      PIC: {selectedOrder.contactName} ({selectedOrder.contactPhone})
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 bg-white rounded-3xl border border-stone-200 text-center text-stone-400">
                Pilih pesanan di sebelah kiri untuk melihat detail status &amp; progres.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
