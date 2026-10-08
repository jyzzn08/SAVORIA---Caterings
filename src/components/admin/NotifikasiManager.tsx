import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, MessageSquare, ShieldAlert, Sparkles, Clock, AlertTriangle, Truck, ChefHat } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotifikasiManagerProps {
  notifications: NotificationItem[];
  onSendBroadcast?: (title: string, message: string, type: NotificationItem['type']) => void;
}

export const NotifikasiManager: React.FC<NotifikasiManagerProps> = ({
  notifications,
  onSendBroadcast,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationItem['type']>('system');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    if (onSendBroadcast) {
      onSendBroadcast(title, message, type);
    }
    setSuccessMsg(true);
    setTitle('');
    setMessage('');
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Pusat Notifikasi &amp; Broadcast Pesan Operasional
            </h3>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Pantau seluruh log aktivitas pemesanan, produksi dapur, serta kirimkan pengumuman broadcast kepada seluruh kru dan pelanggan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Broadcast Form */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
            <Send className="w-4 h-4 text-amber-800" />
            <span>Kirim Broadcast Notifikasi Baru</span>
          </h4>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Broadcast notifikasi berhasil dikirimkan!</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Judul Notifikasi</label>
              <input
                type="text"
                required
                placeholder="Contoh: Menu Baru Tersedia / Pengingat Jadwal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Tipe Pesan</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 cursor-pointer"
              >
                <option value="system">Pemberitahuan Sistem &amp; Umum</option>
                <option value="order">Pembaruan Pesanan</option>
                <option value="production">Instruksi Dapur Produksi</option>
                <option value="delivery">Logistik Pengiriman</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Isi Pesan</label>
              <textarea
                rows={3}
                required
                placeholder="Tuliskan pesan detail yang ingin disampaikan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-semibold cursor-pointer shadow-xs transition-colors"
            >
              Kirimkan Broadcast Sekarang
            </button>
          </form>
        </div>

        {/* Notification Feed List */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-stone-900 flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-800" />
              <span>Riwayat Feed Notifikasi &amp; Log Operasional</span>
            </span>
            <span className="text-xs text-stone-400">{notifications.length} Catatan</span>
          </h4>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">
              Belum ada riwayat notifikasi baru.
            </div>
          ) : (
            <div className="space-y-2.5">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-xl flex items-start gap-3 hover:bg-stone-100/60 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                    {notif.type === 'delivery' ? (
                      <Truck className="w-3.5 h-3.5" />
                    ) : notif.type === 'production' ? (
                      <ChefHat className="w-3.5 h-3.5" />
                    ) : (
                      <Bell className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-stone-900 font-semibold">{notif.title}</strong>
                      <span className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{notif.timestamp}</span>
                      </span>
                    </div>
                    <p className="text-stone-600 mt-0.5 text-[11px] leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
