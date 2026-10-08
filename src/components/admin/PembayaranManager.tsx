import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Clock, DollarSign, Download, Eye, FileText, AlertCircle, ShieldCheck } from 'lucide-react';
import { CustomerOrder } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface PembayaranManagerProps {
  orders: CustomerOrder[];
  onUpdatePaymentStatus: (orderId: string, newPaymentStatus: 'unpaid' | 'dp_paid' | 'fully_paid') => void;
}

export const PembayaranManager: React.FC<PembayaranManagerProps> = ({
  orders,
  onUpdatePaymentStatus,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerOrder | null>(null);

  const totalOmzetTagihan = orders.reduce((sum, o) => sum + o.total, 0);
  const totalLunas = orders.filter((o) => o.paymentStatus === 'fully_paid').reduce((sum, o) => sum + o.total, 0);
  const totalDP = orders.filter((o) => o.paymentStatus === 'dp_paid').reduce((sum, o) => sum + o.total * 0.5, 0);
  const totalPending = totalOmzetTagihan - totalLunas - totalDP;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Verifikasi &amp; Rekapitulasi Pembayaran Klien
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Finance &amp; Invoicing
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Kelola status uang muka (DP 50%), pelunasan pesanan, dan verifikasi mutasi rekening catering.
          </p>
        </div>

        <div className="text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl font-medium">
          Total Transaksi: <strong>{orders.length} Invoice Kontrak</strong>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
          <span className="text-[11px] text-stone-500 font-medium block">Total Nilai Kontrak</span>
          <span className="text-xl font-mono font-bold text-stone-900 mt-1 block">
            {formatCurrency(totalOmzetTagihan)}
          </span>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Seluruh pesanan terdaftar</span>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
          <span className="text-[11px] text-emerald-800 font-medium block">Total Dana Lunas Diterima</span>
          <span className="text-xl font-mono font-bold text-emerald-900 mt-1 block">
            {formatCurrency(totalLunas)}
          </span>
          <span className="text-[10px] text-emerald-700 mt-0.5 block">100% Masuk ke Rekening</span>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
          <span className="text-[11px] text-amber-800 font-medium block">Total DP 50% Diterima</span>
          <span className="text-xl font-mono font-bold text-amber-900 mt-1 block">
            {formatCurrency(totalDP)}
          </span>
          <span className="text-[10px] text-amber-700 mt-0.5 block">Uang Muka Kunci Jadwal</span>
        </div>

        <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl">
          <span className="text-[11px] text-rose-800 font-medium block">Sisa Piutang Menunggu</span>
          <span className="text-xl font-mono font-bold text-rose-900 mt-1 block">
            {formatCurrency(totalPending)}
          </span>
          <span className="text-[10px] text-rose-700 mt-0.5 block">Jatuh tempo H-1 acara</span>
        </div>
      </div>

      {/* Invoice List Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-800" />
            <span>Daftar Transaksi &amp; Bukti Tagihan Catering</span>
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 text-[11px]">
              <tr>
                <th className="px-4 py-3 font-semibold">Nomor Invoice</th>
                <th className="px-4 py-3 font-semibold">Klien & Acara</th>
                <th className="px-4 py-3 font-semibold">Metode Pembayaran</th>
                <th className="px-4 py-3 font-semibold">Total Tagihan</th>
                <th className="px-4 py-3 font-semibold">Status Pembayaran</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((ord) => {
                const isPaid = ord.paymentStatus === 'fully_paid';
                const isDP = ord.paymentStatus === 'dp_paid';

                return (
                  <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-amber-900">
                      {ord.orderNumber}
                      <span className="text-[10px] text-stone-400 font-normal block">{ord.createdAt}</span>
                    </td>

                    <td className="px-4 py-3">
                      <strong className="text-stone-900 block">{ord.contactName}</strong>
                      <span className="text-[11px] text-stone-500">{ord.eventTitle} ({ord.guestCount} pax)</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {ord.paymentMethod || 'Transfer BCA Virtual Account'}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-stone-900">
                      {formatCurrency(ord.total)}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : isDP
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isPaid ? 'Lunas (100%)' : isDP ? 'DP 50% Diterima' : 'Menunggu Pembayaran'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(ord)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium cursor-pointer"
                          title="Lihat Rincian Invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {!isPaid && (
                          <button
                            onClick={() => onUpdatePaymentStatus(ord.id, isDP ? 'fully_paid' : 'dp_paid')}
                            className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                          >
                            {isDP ? 'Verifikasi Pelunasan' : 'Catat DP 50%'}
                          </button>
                        )}

                        {isPaid && (
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Terverifikasi</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="font-mono text-xs font-bold text-amber-900">{selectedInvoice.orderNumber}</span>
                <h3 className="text-base font-serif font-bold text-stone-900">Kwitansi &amp; Rincian Transaksi</h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Nama Pemesan:</span>
                <span className="font-semibold text-stone-800">{selectedInvoice.contactName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Acara:</span>
                <span className="font-semibold text-stone-800">{selectedInvoice.eventTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Tanggal Acara:</span>
                <span className="font-semibold text-stone-800">{formatDate(selectedInvoice.eventDate)} ({selectedInvoice.eventTime})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Subtotal Makanan:</span>
                <span className="font-mono font-semibold text-stone-800">{formatCurrency(selectedInvoice.subtotal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Biaya Logistik &amp; Kru:</span>
                <span className="font-mono font-semibold text-stone-800">{formatCurrency(selectedInvoice.deliveryFee + selectedInvoice.serviceFee)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-stone-200 text-sm">
                <span className="font-bold text-stone-900">Total Pembayaran:</span>
                <span className="font-mono font-bold text-amber-900">{formatCurrency(selectedInvoice.total)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
