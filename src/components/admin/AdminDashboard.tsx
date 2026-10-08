import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  ShoppingBag,
  ChefHat,
  Package,
  BookOpen,
  Truck,
  CreditCard,
  FileBarChart,
  Bell,
  Settings,
  FileSpreadsheet,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ChevronRight,
  Plus,
  Send
} from 'lucide-react';
import { AdminModule, CustomerOrder, Product, UserProfile, BahanBaku, Resep, UserAccount, NotificationItem } from '../../types';
import { ADMIN_STATS, UPCOMING_SCHEDULES } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { BahanBakuManager } from './BahanBakuManager';
import { ResepManager } from './ResepManager';
import { GoogleSheetsIntegration } from './GoogleSheetsIntegration';
import { MenuManager } from './MenuManager';
import { ProduksiManager } from './ProduksiManager';
import { PengirimanManager } from './PengirimanManager';
import { PembayaranManager } from './PembayaranManager';
import { LaporanManager } from './LaporanManager';
import { NotifikasiManager } from './NotifikasiManager';
import { PengaturanManager } from './PengaturanManager';

interface AdminDashboardProps {
  orders: CustomerOrder[];
  products: Product[];
  bahanBaku: BahanBaku[];
  resep: Resep[];
  users: UserAccount[];
  currentUser: UserProfile;
  notifications?: NotificationItem[];
  onExitAdmin: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: any) => void;
  onUpdateBahanBakuStok: (id: string, delta: number) => void;
  onAddBahanBaku: (newBahan: BahanBaku) => void;
  onAddProduct?: (newProduct: Product, newResep?: Resep, newBahanBakuItems?: BahanBaku[]) => void;
  onDeleteProduct?: (productId: string) => void;
  onUpdatePaymentStatus?: (orderId: string, newPaymentStatus: 'unpaid' | 'dp_paid' | 'fully_paid') => void;
  onSendBroadcast?: (title: string, message: string, type: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  products,
  bahanBaku,
  resep,
  users,
  currentUser,
  notifications = [],
  onExitAdmin,
  onUpdateOrderStatus,
  onUpdateBahanBakuStok,
  onAddBahanBaku,
  onAddProduct,
  onDeleteProduct,
  onUpdatePaymentStatus,
  onSendBroadcast,
}) => {
  const [activeModule, setActiveModule] = useState<AdminModule>('dashboard');

  const sidebarMenuItems: { id: AdminModule; label: string; icon: React.ReactNode; isSpecial?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'google_sheets', label: 'Google Sheets API', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />, isSpecial: true },
    { id: 'pesanan', label: 'Pesanan', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu Catering', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'resep', label: 'Resep & HPP', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'bahan_baku', label: 'Bahan Baku & Stok', icon: <Package className="w-4 h-4" /> },
    { id: 'produksi', label: 'Jadwal Produksi', icon: <ChefHat className="w-4 h-4" /> },
    { id: 'pelanggan', label: 'Pelanggan', icon: <Users className="w-4 h-4" /> },
    { id: 'pengiriman', label: 'Pengiriman', icon: <Truck className="w-4 h-4" /> },
    { id: 'pembayaran', label: 'Pembayaran', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'laporan', label: 'Laporan', icon: <FileBarChart className="w-4 h-4" /> },
    { id: 'notifikasi', label: 'Notifikasi', icon: <Bell className="w-4 h-4" /> },
    { id: 'pengaturan', label: 'Pengaturan', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleAdvanceStatus = (order: CustomerOrder) => {
    const sequence = ['draft', 'pending_payment', 'processing', 'production', 'ready_to_ship', 'completed'];
    const currIdx = sequence.indexOf(order.status);
    if (currIdx < sequence.length - 1) {
      const nextStatus = sequence[currIdx + 1];
      onUpdateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      
      {/* Modern Admin Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-300 flex flex-col justify-between shrink-0 border-r border-stone-800">
        <div>
          {/* Brand & Admin Badge */}
          <div className="p-6 border-b border-stone-800">
            <span className="text-xl font-serif font-bold text-stone-100 tracking-tight block">
              Savoria
            </span>
            <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider block mt-0.5">
              Catering Management System
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">
              v1.2 · Operasional, Resep &amp; Gudang
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {sidebarMenuItems.map((item) => {
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-600 text-stone-950 font-semibold shadow-xs'
                      : item.isSpecial
                      ? 'text-emerald-300 hover:text-emerald-100 hover:bg-emerald-950/40 bg-emerald-950/20 border border-emerald-900/30'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                  }`}
                >
                  <span className={isActive ? 'text-stone-950' : ''}>{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.isSpecial && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                      Sync
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Switch to Customer Mode */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-700/60 flex items-center justify-center font-bold text-amber-200 text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-semibold text-stone-200 block truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-stone-500 block">
                {currentUser.role === 'admin' ? 'Administrator' : 'Staff'}
              </span>
            </div>
          </div>

          <button
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Customer</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        
        {/* Top Bar inside Admin Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span>Sistem Manajemen</span>
              <span>/</span>
              <span className="capitalize font-semibold text-stone-800">
                {activeModule.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1 capitalize">
              {activeModule === 'dashboard'
                ? 'Overview Operasional Catering'
                : activeModule === 'google_sheets'
                ? 'Integrasi Google Sheets & Apps Script'
                : activeModule === 'bahan_baku'
                ? 'Manajemen Bahan Baku & Stok Gudang'
                : activeModule === 'resep'
                ? 'Katalog Resep & Kalkulator HPP'
                : `Modul ${activeModule.replace('_', ' ')}`}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModule('google_sheets')}
              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Google Sheets Database</span>
            </button>
            <span className="text-xs text-stone-500 bg-white px-3 py-1.5 rounded-lg border border-stone-200">
              Shift Pagi: <strong>Dapur Utama Aktif (12 Koki)</strong>
            </span>
          </div>
        </div>

        {/* GOOGLE SHEETS QUICK NOTIFICATION BANNER (ON DASHBOARD) */}
        {activeModule === 'dashboard' && (
          <div className="mt-6 p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-800 text-white rounded-xl">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  Integrasi Google Sheets Siap Digunakan
                </h4>
                <p className="text-[11px] text-emerald-800">
                  Sinkronkan otomatis pesanan, 16 inventaris bahan baku, dan formula resep masakan langsung ke Spreadsheet Anda.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModule('google_sheets')}
              className="self-start sm:self-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Buka Panduan &amp; Sinkronkan →
            </button>
          </div>
        )}

        {/* MODULE: DASHBOARD (MAIN OVERVIEW) */}
        {activeModule === 'dashboard' && (
          <div className="space-y-8 mt-6">
            
            {/* 5 KPI STATISTIC CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-xs text-stone-500 block font-medium">Total Pesanan</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1 block">
                  {ADMIN_STATS.totalPesanan}
                </span>
                <span className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{ADMIN_STATS.monthlyGrowth} bulan ini</span>
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-xs text-stone-500 block font-medium">Pesanan Hari Ini</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-amber-900 mt-1 block">
                  {ADMIN_STATS.pesananHariIni}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  10 dikirim, 4 disiapkan
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-xs text-stone-500 block font-medium">Sedang Diproses</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-purple-900 mt-1 block">
                  {ADMIN_STATS.sedangDiproses}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Dalam alur produksi
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-xs text-stone-500 block font-medium">Pesanan Selesai</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-emerald-800 mt-1 block">
                  {ADMIN_STATS.pesananSelesai}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Kepuasan {ADMIN_STATS.customerSatisfaction}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 lg:col-span-1 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-xs text-stone-500 block font-medium">Total Pendapatan</span>
                <span className="text-xl font-bold font-mono tabular-nums text-stone-900 mt-1 block">
                  {formatCurrency(ADMIN_STATS.totalPendapatan)}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  YTD Terkonsolidasi
                </span>
              </div>
            </div>

            {/* AREA 1: PESANAN TERBARU (TABLE) */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    Pesanan Terbaru & Antrean Layanan
                  </h3>
                  <p className="text-xs text-stone-500">
                    Klik "Perbarui Status" untuk memajukan pesanan ke tahap operasional berikutnya.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModule('pesanan')}
                  className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
                >
                  Semua Pesanan ({orders.length})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
                    <tr>
                      <th className="px-5 py-3">No. Order</th>
                      <th className="px-5 py-3">Nama Acara & Klien</th>
                      <th className="px-5 py-3">Tanggal Acara</th>
                      <th className="px-5 py-3">Pax</th>
                      <th className="px-5 py-3">Total Nilai</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Aksi Operasional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-medium text-stone-900">
                          {ord.orderNumber}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-stone-900 block">{ord.eventTitle}</span>
                          <span className="text-[11px] text-stone-500">{ord.contactName}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span>{formatDate(ord.eventDate)}</span>
                          <span className="text-[11px] text-stone-400 block">{ord.eventTime}</span>
                        </td>
                        <td className="px-5 py-3.5 font-mono tabular-nums">{ord.guestCount} pax</td>
                        <td className="px-5 py-3.5 font-mono font-semibold tabular-nums text-stone-900">
                          {formatCurrency(ord.total)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold border bg-stone-100 border-stone-200 text-stone-800">
                            {ord.statusLabel}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => handleAdvanceStatus(ord)}
                            className="px-3 py-1.5 bg-stone-900 hover:bg-amber-900 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          >
                            Majukan Alur →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AREA 2: JADWAL CATERING & RINGKASAN PRODUKSI & PENGIRIMAN */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Jadwal Terdekat */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="text-sm font-serif font-bold text-stone-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-800" />
                    <span>Jadwal Catering Terdekat</span>
                  </h3>
                  <span className="text-[11px] text-stone-400">4 Acara</span>
                </div>

                <div className="space-y-3">
                  {UPCOMING_SCHEDULES.map((sch) => (
                    <div key={sch.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-xs">
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-stone-900">{sch.client}</span>
                        <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-medium">
                          {sch.status}
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px] mt-0.5">{sch.event} ({sch.pax} pax)</p>
                      <div className="mt-2 text-[11px] text-stone-400 flex items-center justify-between">
                        <span>{sch.date} · {sch.time}</span>
                        <span>{sch.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ringkasan Produksi */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="text-sm font-serif font-bold text-stone-900 flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-amber-800" />
                    <span>Ringkasan Produksi Dapur</span>
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-semibold">100% On-Track</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                    <div className="flex justify-between font-semibold text-stone-900">
                      <span>Batch Dapur Panas (Hot Kitchen)</span>
                      <span>120 Porsi Rendang</span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-1">Tahap sous-vide & slow simmers bumbu rempah kelapa.</p>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-600 h-full w-4/5" />
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                    <div className="flex justify-between font-semibold text-stone-900">
                      <span>Batch Pastry & Canapés</span>
                      <span>480 Pcs Fresh Tarts</span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-1">Suhu chiller stabil 4°C, persiapan garnishing buah.</p>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-purple-600 h-full w-3/5" />
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                    <div className="flex justify-between font-semibold text-stone-900">
                      <span>Batch Tumpeng Nusantara</span>
                      <span>35 Paket Mahligai</span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-1">Penataan garnis sayuran ukir selesai 100%.</p>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-600 h-full w-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ringkasan Pengiriman */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="text-sm font-serif font-bold text-stone-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-800" />
                    <span>Ringkasan Pengiriman & Armada</span>
                  </h3>
                  <span className="text-[11px] text-stone-400">4 Van Dingin</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                    <div className="flex justify-between font-semibold text-stone-900">
                      <span>Armada Chiller #01 (B 9482 SVR)</span>
                      <span className="text-emerald-700">Dalam Perjalanan</span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">Tujuan: Menara Astra Sudirman · ETA 10:45 WIB</p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                    <div className="flex justify-between font-semibold text-stone-900">
                      <span>Armada Chiller #02 (B 9120 SVR)</span>
                      <span className="text-amber-700">Loading di Dapur</span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">Tujuan: BSD City Magnolia · Standby 14:00 WIB</p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                    <div className="flex justify-between font-semibold text-stone-900">
                      <span>Armada Banquet Crew #03</span>
                      <span className="text-stone-600">Standby Pangkalan</span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">Peralatan prasmanan & linen bersih siap loading</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* MODULE: GOOGLE SHEETS INTEGRATION */}
        {activeModule === 'google_sheets' && (
          <div className="mt-6">
            <GoogleSheetsIntegration
              orders={orders}
              bahanBaku={bahanBaku}
              resep={resep}
              products={products}
              users={users}
            />
          </div>
        )}

        {/* MODULE: BAHAN BAKU */}
        {activeModule === 'bahan_baku' && (
          <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
            <BahanBakuManager
              bahanBakuList={bahanBaku}
              onUpdateStok={onUpdateBahanBakuStok}
              onAddBahanBaku={onAddBahanBaku}
            />
          </div>
        )}

        {/* MODULE: RESEP */}
        {activeModule === 'resep' && (
          <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
            <ResepManager resepList={resep} />
          </div>
        )}

        {/* MODULE: MENU */}
        {activeModule === 'menu' && (
          <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
            <MenuManager
              products={products}
              resepList={resep}
              bahanBakuList={bahanBaku}
              onAddProduct={(newProduct, newResep, newBahanItems) => {
                if (onAddProduct) {
                  onAddProduct(newProduct, newResep, newBahanItems);
                }
              }}
              onDeleteProduct={(id) => {
                if (onDeleteProduct) {
                  onDeleteProduct(id);
                }
              }}
              onOpenResepDetail={() => {
                setActiveModule('resep');
              }}
            />
          </div>
        )}

        {/* MODULE: PESANAN */}
        {activeModule === 'pesanan' && (
          <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Semua Kontrak Pesanan Catering
                </h3>
                <p className="text-xs text-stone-500">
                  Pantau alur status pesanan dari booking draft, produksi dapur, hingga selesai diantar.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                {orders.length} Pesanan
              </span>
            </div>

            <div className="space-y-3">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="p-4 border border-stone-200 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-900">{o.orderNumber}</span>
                      <span className="text-[10px] bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-bold uppercase">
                        {o.statusLabel}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        {o.paymentStatus === 'fully_paid' ? 'Lunas' : o.paymentStatus === 'dp_paid' ? 'DP 50%' : 'Belum Bayar'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900">{o.eventTitle}</h4>
                    <p className="text-xs text-stone-500">
                      Pemesan: <strong className="text-stone-700">{o.contactName}</strong> ({o.contactPhone}) · {formatDate(o.eventDate)} ({o.eventTime}) · {o.guestCount} pax
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-stone-400 block">Total Kontrak:</span>
                      <span className="text-sm font-mono font-bold text-stone-900">{formatCurrency(o.total)}</span>
                    </div>
                    <button
                      onClick={() => handleAdvanceStatus(o)}
                      className="px-3.5 py-2 bg-stone-900 hover:bg-amber-900 text-white text-xs rounded-xl font-semibold transition-colors cursor-pointer"
                    >
                      Majukan Alur Status →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE: PELANGGAN */}
        {activeModule === 'pelanggan' && (
          <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Data Pelanggan &amp; Klien Terdaftar
                </h3>
                <p className="text-xs text-stone-500">
                  Seluruh akun yang mendaftar di website otomatis tercatat di sini dan tersinkron ke Google Sheets.
                </p>
              </div>
              <span className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-xl font-semibold">
                {users.filter((u) => u.role === 'customer').length} Pelanggan
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {users
                .filter((u) => u.role === 'customer')
                .map((c) => {
                  const customerOrders = orders.filter(
                    (o) =>
                      o.contactName.toLowerCase().includes(c.name.toLowerCase()) ||
                      o.contactPhone === c.phone ||
                      o.customerEmail === c.email
                  );
                  const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);

                  return (
                    <div
                      key={c.id}
                      className="p-4 border border-stone-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{c.name}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-bold uppercase">
                            {c.status}
                          </span>
                        </div>
                        <div className="text-stone-500 text-[11px] mt-0.5 space-x-2">
                          <span>{c.companyOrEvent || 'Klien Catering'}</span>
                          <span>·</span>
                          <span className="text-stone-700 font-medium">{c.email}</span>
                          <span>·</span>
                          <span className="font-mono">{c.phone}</span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="font-mono font-bold text-stone-900 block text-xs">
                          {totalSpent > 0 ? formatCurrency(totalSpent) : 'Belum Ada Transaksi'}
                        </span>
                        <span className="text-stone-500 text-[11px]">
                          {customerOrders.length > 0 ? `${customerOrders.length} Riwayat Pesanan` : `Terdaftar: ${c.createdAt}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* MODULE: PRODUKSI */}
        {activeModule === 'produksi' && (
          <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
            <ProduksiManager
              orders={orders}
              bahanBaku={bahanBaku}
              resepList={resep}
              onUpdateOrderStatus={onUpdateOrderStatus}
            />
          </div>
        )}

        {/* MODULE: PENGIRIMAN */}
        {activeModule === 'pengiriman' && (
          <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
            <PengirimanManager
              orders={orders}
              onUpdateOrderStatus={onUpdateOrderStatus}
            />
          </div>
        )}

        {/* MODULE: PEMBAYARAN */}
        {activeModule === 'pembayaran' && (
          <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
            <PembayaranManager
              orders={orders}
              onUpdatePaymentStatus={(orderId, status) => {
                if (onUpdatePaymentStatus) {
                  onUpdatePaymentStatus(orderId, status);
                }
              }}
            />
          </div>
        )}

        {/* MODULE: LAPORAN */}
        {activeModule === 'laporan' && (
          <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
            <LaporanManager
              orders={orders}
              products={products}
              resepList={resep}
              bahanBaku={bahanBaku}
              onNavigateToSheets={() => setActiveModule('google_sheets')}
            />
          </div>
        )}

        {/* MODULE: NOTIFIKASI */}
        {activeModule === 'notifikasi' && (
          <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
            <NotifikasiManager
              notifications={notifications}
              onSendBroadcast={onSendBroadcast}
            />
          </div>
        )}

        {/* MODULE: PENGATURAN */}
        {activeModule === 'pengaturan' && (
          <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
            <PengaturanManager
              onNavigateToSheets={() => setActiveModule('google_sheets')}
            />
          </div>
        )}

      </main>

    </div>
  );
};
