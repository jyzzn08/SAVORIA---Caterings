import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Copy, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Database,
  Layers,
  Send,
  HelpCircle,
  Code
} from 'lucide-react';
import { CustomerOrder, BahanBaku, Resep, Product, UserAccount } from '../../types';
import { GOOGLE_APPS_SCRIPT_CODE, sendDataToGoogleSheets } from '../../utils/googleSheetsSync';

interface GoogleSheetsIntegrationProps {
  orders: CustomerOrder[];
  bahanBaku: BahanBaku[];
  resep: Resep[];
  products: Product[];
  users: UserAccount[];
}

export const GoogleSheetsIntegration: React.FC<GoogleSheetsIntegrationProps> = ({
  orders,
  bahanBaku,
  resep,
  products,
  users,
}) => {
  const [webAppUrl, setWebAppUrl] = useState(() => {
    return localStorage.getItem('savoria_sheets_url') || '';
  });
  const [isCopied, setIsCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  const [activeTabPreview, setActiveTabPreview] = useState<'pesanan' | 'bahan_baku' | 'resep' | 'menu' | 'pengguna'>('pesanan');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveAndSync = async () => {
    if (!webAppUrl.trim()) {
      setSyncStatus({
        type: 'error',
        message: 'Silakan masukkan Web App URL Google Apps Script Anda terlebih dahulu.',
      });
      return;
    }

    localStorage.setItem('savoria_sheets_url', webAppUrl.trim());
    setIsSyncing(true);
    setSyncStatus({ type: 'idle', message: '' });

    const result = await sendDataToGoogleSheets(webAppUrl, {
      action: 'sync_all',
      orders,
      bahanBaku,
      resep,
      products,
      users,
    });

    setIsSyncing(false);
    if (result.success) {
      setSyncStatus({
        type: 'success',
        message: 'Koneksi Sukses! Data Pesanan, Bahan Baku, Resep, Menu, dan Pengguna telah terkirim ke Google Sheets Anda.',
      });
    } else {
      setSyncStatus({
        type: 'error',
        message: result.message,
      });
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 rounded-3xl text-stone-100 border border-emerald-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Integrasi Database Cloud Spreadsheet</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-50">
            Hubungkan ke Google Sheets & Google Apps Script
          </h2>
          <p className="mt-1 text-xs text-stone-300 leading-relaxed">
            Gunakan Google Sheets gratis sebagai database real-time Anda. Setiap pesanan baru dari website, perubahan stok bahan baku, dan formula resep langsung tersinkronkan otomatis!
          </p>
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-xs space-y-1.5 shrink-0">
          <span className="text-emerald-300 font-semibold block">Status Terhubung:</span>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${webAppUrl ? 'bg-emerald-500 animate-pulse' : 'bg-stone-500'}`} />
            <span className="text-stone-200">
              {webAppUrl ? 'URL Web App Tersimpan' : 'Belum Terhubung'}
            </span>
          </div>
          <span className="text-[11px] text-stone-400 block pt-1">
            {orders.length} Pesanan · {bahanBaku.length} Bahan Baku · {resep.length} Resep
          </span>
        </div>
      </div>

      {/* PANDUAN STEP-BY-STEP UNTUK PEMULA */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-850">
              Panduan Praktis Pemula
            </span>
            <h3 className="text-lg font-serif font-bold text-stone-900 mt-0.5">
              5 Langkah Mudah Menghubungkan Google Sheets
            </h3>
          </div>
          <div className="text-xs text-stone-400 hidden sm:block">
            Waktu pengerjaan: ~3 menit
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          {/* Step 1 */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
            <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h4 className="font-bold text-stone-900">Buat Google Sheet</h4>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Buka <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold inline-flex items-center gap-0.5">sheets.new <ExternalLink className="w-2.5 h-2.5" /></a> di browser Anda dan beri judul misal <em>"Database Savoria Catering"</em>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
            <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h4 className="font-bold text-stone-900">Buka Apps Script</h4>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Di menu atas Google Sheets, klik <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>. Tab editor baru akan terbuka.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2">
            <div className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h4 className="font-bold text-amber-950">Salin Kode Script</h4>
            <p className="text-amber-900 leading-relaxed text-[11px]">
              Hapus tulisan di editor Apps Script, lalu klik tombol <em>Salin Kode</em> di bawah dan tempelkan (Paste).
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
            <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h4 className="font-bold text-stone-900">Deploy Web App</h4>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Klik tombol biru <strong>Deploy &gt; New deployment &gt; Web app</strong>. Pilih Who has access: <strong>Anyone</strong>, lalu klik Deploy.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
            <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
              5
            </div>
            <h4 className="font-bold text-emerald-950">Tempel URL Disini</h4>
            <p className="text-emerald-900 leading-relaxed text-[11px]">
              Salin URL Web App yang berakhiran <code>/exec</code>, tempel ke kolom di bawah, lalu klik <em>Kirim &amp; Sinkronkan</em>!
            </p>
          </div>
        </div>
      </div>

      {/* SINKRONISASI & INPUT URL */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <h3 className="text-base font-serif font-bold text-stone-900">
          Konfigurasi Endpoint Web App
        </h3>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-stone-700">
            Google Apps Script Web App URL:
          </label>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <input
              type="url"
              value={webAppUrl}
              onChange={(e) => setWebAppUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
              className="flex-1 px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700"
            />
            <button
              onClick={handleSaveAndSync}
              disabled={isSyncing}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mengirim Data...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim &amp; Sinkronkan Sekarang</span>
                </>
              )}
            </button>
          </div>

          {syncStatus.message && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                syncStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {syncStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              )}
              <span>{syncStatus.message}</span>
            </div>
          )}
        </div>

        {/* READY-TO-COPY CODE SNIPPET */}
        <div className="pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-stone-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                Kode Script Siap Pakai (Code.gs)
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isCopied
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Kode Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Seluruh Kode Script</span>
                </>
              )}
            </button>
          </div>

          <div className="relative rounded-2xl bg-stone-950 p-4 overflow-hidden border border-stone-800">
            <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-56 leading-relaxed">
              {GOOGLE_APPS_SCRIPT_CODE}
            </pre>
          </div>
        </div>

      </div>

      {/* STRUKTUR 4 TAB DATABASE GOOGLE SHEETS */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Visualisasi Struktur Data
          </span>
          <h3 className="text-base font-serif font-bold text-stone-900 mt-0.5">
            5 Tab Otomatis yang Terbentuk di Google Sheets Anda
          </h3>
          <p className="text-xs text-stone-500">
            Script di atas akan secara otomatis memformat baris judul dengan latar belakang abu-abu elegan dan membekukan (freeze) baris header.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
          {(['pesanan', 'bahan_baku', 'resep', 'menu', 'pengguna'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTabPreview(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                activeTabPreview === tab
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Tab "{tab.replace('_', ' ')}"
            </button>
          ))}
        </div>

        {/* Preview Tables */}
        <div className="border border-stone-200 rounded-xl overflow-x-auto text-xs">
          {activeTabPreview === 'pesanan' && (
            <table className="w-full text-left">
              <thead className="bg-stone-100 font-semibold text-stone-700">
                <tr>
                  <th className="p-2.5">No Order</th>
                  <th className="p-2.5">Nama Acara</th>
                  <th className="p-2.5">Klien</th>
                  <th className="p-2.5">Tanggal Acara</th>
                  <th className="p-2.5">Pax</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Total Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50">
                    <td className="p-2.5 font-mono font-medium">{o.orderNumber}</td>
                    <td className="p-2.5 font-medium">{o.eventTitle}</td>
                    <td className="p-2.5">{o.contactName}</td>
                    <td className="p-2.5">{o.eventDate}</td>
                    <td className="p-2.5 font-mono">{o.guestCount} pax</td>
                    <td className="p-2.5 font-semibold text-amber-800">{o.statusLabel}</td>
                    <td className="p-2.5 font-mono">Rp {o.total.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTabPreview === 'bahan_baku' && (
            <table className="w-full text-left">
              <thead className="bg-stone-100 font-semibold text-stone-700">
                <tr>
                  <th className="p-2.5">Kode Bahan</th>
                  <th className="p-2.5">Nama Bahan Baku</th>
                  <th className="p-2.5">Kategori</th>
                  <th className="p-2.5">Stok Fisik</th>
                  <th className="p-2.5">Min. Stok</th>
                  <th className="p-2.5">Harga Beli Satuan</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {bahanBaku.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50">
                    <td className="p-2.5 font-mono font-medium">{b.kodeBahan}</td>
                    <td className="p-2.5 font-medium">{b.nama}</td>
                    <td className="p-2.5">{b.kategori}</td>
                    <td className="p-2.5 font-mono font-bold">{b.stokSaatIni} {b.satuan}</td>
                    <td className="p-2.5 font-mono text-stone-500">{b.stokMinimum} {b.satuan}</td>
                    <td className="p-2.5 font-mono">Rp {b.hargaSatuan.toLocaleString('id-ID')}/{b.satuan}</td>
                    <td className="p-2.5 font-semibold text-emerald-700">{b.status.toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTabPreview === 'resep' && (
            <table className="w-full text-left">
              <thead className="bg-stone-100 font-semibold text-stone-700">
                <tr>
                  <th className="p-2.5">Kode Resep</th>
                  <th className="p-2.5">Nama Menu Resep</th>
                  <th className="p-2.5">Standar Batch</th>
                  <th className="p-2.5">HPP / Porsi</th>
                  <th className="p-2.5">Harga Jual</th>
                  <th className="p-2.5">Gross Margin</th>
                  <th className="p-2.5">Jumlah Bahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {resep.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50">
                    <td className="p-2.5 font-mono font-medium">{r.kodeResep}</td>
                    <td className="p-2.5 font-medium">{r.namaMenu}</td>
                    <td className="p-2.5 font-mono">{r.porsiStandar} {r.satuanPorsi}</td>
                    <td className="p-2.5 font-mono">Rp {r.biayaPerPorsi.toLocaleString('id-ID')}</td>
                    <td className="p-2.5 font-mono font-semibold text-amber-900">Rp {r.hargaJualPerPorsi.toLocaleString('id-ID')}</td>
                    <td className="p-2.5 font-bold text-emerald-700">{r.marginPersen}%</td>
                    <td className="p-2.5 text-stone-500">{r.bahanList.length} macam</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTabPreview === 'menu' && (
            <table className="w-full text-left">
              <thead className="bg-stone-100 font-semibold text-stone-700">
                <tr>
                  <th className="p-2.5">ID Menu</th>
                  <th className="p-2.5">Nama Menu</th>
                  <th className="p-2.5">Kategori</th>
                  <th className="p-2.5">Harga Jual</th>
                  <th className="p-2.5">Satuan</th>
                  <th className="p-2.5">Min. Order</th>
                  <th className="p-2.5">Lead Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="p-2.5 font-mono">{p.id}</td>
                    <td className="p-2.5 font-medium">{p.name}</td>
                    <td className="p-2.5">{p.categoryLabel}</td>
                    <td className="p-2.5 font-mono font-bold">Rp {p.price.toLocaleString('id-ID')}</td>
                    <td className="p-2.5">{p.unit}</td>
                    <td className="p-2.5 font-mono">{p.minOrder}</td>
                    <td className="p-2.5">{p.preparationTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTabPreview === 'pengguna' && (
            <table className="w-full text-left">
              <thead className="bg-stone-100 font-semibold text-stone-700">
                <tr>
                  <th className="p-2.5">ID Pengguna</th>
                  <th className="p-2.5">Nama Lengkap</th>
                  <th className="p-2.5">Email</th>
                  <th className="p-2.5">Role Akun</th>
                  <th className="p-2.5">Nomor WhatsApp</th>
                  <th className="p-2.5">Perusahaan / Acara</th>
                  <th className="p-2.5">Terdaftar</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50">
                    <td className="p-2.5 font-mono text-[11px]">{u.id}</td>
                    <td className="p-2.5 font-bold text-stone-900">{u.name}</td>
                    <td className="p-2.5 text-stone-600">{u.email}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono">{u.phone}</td>
                    <td className="p-2.5 text-stone-500">{u.companyOrEvent || '-'}</td>
                    <td className="p-2.5 text-stone-400">{u.createdAt}</td>
                    <td className="p-2.5 font-semibold text-emerald-700 uppercase text-[11px]">{u.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};
