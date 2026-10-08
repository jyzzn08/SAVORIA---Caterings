import React, { useState } from 'react';
import { Settings, Building2, Phone, Mail, Clock, Save, CheckCircle2, ShieldCheck, FileSpreadsheet, MapPin } from 'lucide-react';

interface PengaturanManagerProps {
  onNavigateToSheets?: () => void;
}

export const PengaturanManager: React.FC<PengaturanManagerProps> = ({
  onNavigateToSheets,
}) => {
  const [cateringName, setCateringName] = useState(() => localStorage.getItem('savoria_brand_name') || 'Savoria Gourmet Catering & Banquet');
  const [kitchenAddress, setKitchenAddress] = useState(() => localStorage.getItem('savoria_kitchen_address') || 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan 12190');
  const [phone, setPhone] = useState(() => localStorage.getItem('savoria_contact_phone') || '+62 811-2233-4455');
  const [email, setEmail] = useState(() => localStorage.getItem('savoria_contact_email') || 'reservasi@savoria-catering.com');
  const [dailyCapacity, setDailyCapacity] = useState(() => Number(localStorage.getItem('savoria_daily_capacity')) || 2500);
  const [minLeadDays, setMinLeadDays] = useState(() => Number(localStorage.getItem('savoria_min_lead_days')) || 1);
  const [bankBCA, setBankBCA] = useState('8001-2938-1920 (PT Savoria Kuliner Prima)');
  const [bankMandiri, setBankMandiri] = useState('137-00-1928374-1 (PT Savoria Kuliner Prima)');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('savoria_brand_name', cateringName);
    localStorage.setItem('savoria_kitchen_address', kitchenAddress);
    localStorage.setItem('savoria_contact_phone', phone);
    localStorage.setItem('savoria_contact_email', email);
    localStorage.setItem('savoria_daily_capacity', String(dailyCapacity));
    localStorage.setItem('savoria_min_lead_days', String(minLeadDays));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const sheetsUrl = localStorage.getItem('savoria_sheets_url');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Pengaturan Profil Catering &amp; Kebijakan Operasional
            </h3>
            <span className="text-xs bg-stone-100 text-stone-800 font-bold px-2.5 py-0.5 rounded-full">
              Sistem Savoria
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Konfigurasi identitas catering, kapasitas dapur sentral harian, rekening perbankan, dan sinkronisasi database.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengaturan catering berhasil diperbarui dan tersimpan aman!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profil Catering */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
            <Building2 className="w-4 h-4 text-amber-800" />
            <span>Identitas Usaha &amp; Central Kitchen</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Nama Usaha Catering</label>
              <input
                type="text"
                value={cateringName}
                onChange={(e) => setCateringName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 font-medium text-stone-900"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Nomor WhatsApp Operasional</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 font-mono text-stone-900"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Email Resmi</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 font-medium text-stone-900"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Alamat Central Kitchen</label>
              <input
                type="text"
                value={kitchenAddress}
                onChange={(e) => setKitchenAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Kebijakan Kapasitas & Pemesanan */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
            <Clock className="w-4 h-4 text-amber-800" />
            <span>Kapasitas Produksi Dapur &amp; Waktu Minimal Pemesanan</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Kapasitas Dapur Maksimal Harian (Pax)
              </label>
              <input
                type="number"
                value={dailyCapacity}
                onChange={(e) => setDailyCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 font-mono font-semibold"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Peringatan otomatis muncul bila total pesanan mendekati kapasitas ini.
              </span>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Minimal Lead Time Pemesanan
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={minLeadDays}
                  onChange={(e) => setMinLeadDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 font-mono font-semibold"
                />
                <span className="text-xs text-stone-500 whitespace-nowrap">Hari (H-{minLeadDays})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rekening Pembayaran */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            <span>Rekening Bank &amp; Rekening Penampung Transfer Klien</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Rekening BCA Virtual Account</label>
              <input
                type="text"
                value={bankBCA}
                onChange={(e) => setBankBCA(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Rekening Bank Mandiri</label>
              <input
                type="text"
                value={bankMandiri}
                onChange={(e) => setBankMandiri(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Google Sheets Status */}
        <div className="p-5 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/40 text-emerald-400 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-stone-900">Integrasi Google Sheets &amp; Apps Script</h5>
              <p className="text-[11px] text-stone-500">
                {sheetsUrl
                  ? 'Status: Terhubung dengan Google Sheets Anda secara real-time.'
                  : 'Status: Belum dihubungkan ke URL Apps Script Web App.'}
              </p>
            </div>
          </div>

          {onNavigateToSheets && (
            <button
              type="button"
              onClick={onNavigateToSheets}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
            >
              Kelola Google Sheets API
            </button>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Pengaturan</span>
          </button>
        </div>

      </form>

    </div>
  );
};
