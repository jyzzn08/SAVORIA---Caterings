import React, { useState } from 'react';
import { FileBarChart, DollarSign, TrendingUp, Download, PieChart, ArrowUpRight, CheckCircle2, FileSpreadsheet, Package, Calculator } from 'lucide-react';
import { CustomerOrder, Product, Resep, BahanBaku } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface LaporanManagerProps {
  orders: CustomerOrder[];
  products: Product[];
  resepList: Resep[];
  bahanBaku: BahanBaku[];
  onNavigateToSheets?: () => void;
}

export const LaporanManager: React.FC<LaporanManagerProps> = ({
  orders,
  products,
  resepList,
  bahanBaku,
  onNavigateToSheets,
}) => {
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'week'>('all');

  // Overall Financial Calculations
  const totalOmzet = orders.reduce((sum, o) => sum + o.total, 0);

  // Compute estimated total modal (HPP) based on items ordered
  let totalModalEstimated = 0;
  orders.forEach((ord) => {
    ord.items.forEach((item) => {
      const p = item.product;
      const matchedResep = resepList.find(
        (r) => r.productId === p.id || r.namaMenu.toLowerCase() === p.name.toLowerCase()
      );
      const modalPerPorsi = p.modalPerPorsi || matchedResep?.biayaPerPorsi || Math.round(p.price * 0.55);
      totalModalEstimated += modalPerPorsi * item.quantity;
    });
  });

  const totalLabaKotor = Math.max(0, totalOmzet - totalModalEstimated);
  const averageMarginPersen = totalOmzet > 0 ? Math.round((totalLabaKotor / totalOmzet) * 100) : 45;
  const averageOrderValue = orders.length > 0 ? Math.round(totalOmzet / orders.length) : 0;

  // Menu profitability analysis
  const menuSalesMap: Record<string, { product: Product; quantitySold: number; totalRevenue: number; modalPerPorsi: number }> = {};

  orders.forEach((ord) => {
    ord.items.forEach((item) => {
      const p = item.product;
      const matchedResep = resepList.find(
        (r) => r.productId === p.id || r.namaMenu.toLowerCase() === p.name.toLowerCase()
      );
      const modal = p.modalPerPorsi || matchedResep?.biayaPerPorsi || Math.round(p.price * 0.55);

      if (!menuSalesMap[p.id]) {
        menuSalesMap[p.id] = {
          product: p,
          quantitySold: item.quantity,
          totalRevenue: item.price * item.quantity,
          modalPerPorsi: modal,
        };
      } else {
        menuSalesMap[p.id].quantitySold += item.quantity;
        menuSalesMap[p.id].totalRevenue += item.price * item.quantity;
      }
    });
  });

  const menuProfitabilityList = Object.values(menuSalesMap);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'No Order,Acara,Tanggal,Pax,Total,Status Bayar,Status Operasional\n';
    orders.forEach((o) => {
      csvContent += `"${o.orderNumber}","${o.eventTitle}","${o.eventDate}",${o.guestCount},${o.total},"${o.paymentStatus}","${o.status}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Catering_Savoria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Laporan Keuangan, Omzet, Modal (HPP) &amp; Laba Rugi
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Real-Time Analytics
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Analisis komprehensif profitabilitas pesanan catering, margin kontribusi per menu, dan kalkulasi modal bahan baku.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToSheets && (
            <button
              onClick={onNavigateToSheets}
              className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
              <span>Sinkron ke Google Sheets</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Laporan (CSV)</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Total Omzet Penjualan</span>
            <DollarSign className="w-4 h-4 text-amber-700" />
          </div>
          <span className="text-2xl font-mono font-bold text-stone-900 mt-2 block">
            {formatCurrency(totalOmzet)}
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block">{orders.length} Kontrak Acara</span>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Estimasi Modal Bahan (HPP)</span>
            <Calculator className="w-4 h-4 text-stone-600" />
          </div>
          <span className="text-2xl font-mono font-bold text-stone-800 mt-2 block">
            {formatCurrency(totalModalEstimated)}
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Modal pokok bahan &amp; dapur</span>
        </div>

        <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
            <span>Estimasi Laba Kotor (Gross Profit)</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-2xl font-mono font-bold text-emerald-900 mt-2 block">
            +{formatCurrency(totalLabaKotor)}
          </span>
          <span className="text-[11px] text-emerald-700 mt-0.5 block font-semibold">
            Margin Rata-rata: {averageMarginPersen}%
          </span>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Rata-rata Nilai Pesanan</span>
            <ArrowUpRight className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-mono font-bold text-stone-900 mt-2 block">
            {formatCurrency(averageOrderValue)}
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Average Order Value (AOV)</span>
        </div>
      </div>

      {/* Menu Profitability Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-800" />
            <span>Analisis Profitabilitas &amp; Margin Kontribusi Menu</span>
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 text-[11px]">
              <tr>
                <th className="px-4 py-3 font-semibold">Menu Makanan</th>
                <th className="px-4 py-3 font-semibold">Harga Jual</th>
                <th className="px-4 py-3 font-semibold">Modal (HPP / Porsi)</th>
                <th className="px-4 py-3 font-semibold">Laba Bersih / Porsi</th>
                <th className="px-4 py-3 font-semibold">Margin %</th>
                <th className="px-4 py-3 font-semibold text-right">Porsi Terjual</th>
                <th className="px-4 py-3 font-semibold text-right">Kontribusi Omzet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {menuProfitabilityList.map((row, idx) => {
                const profitPerPortion = row.product.price - row.modalPerPorsi;
                const marginPercent = Math.round((profitPerPortion / row.product.price) * 100);

                return (
                  <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={row.product.image}
                          alt={row.product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                        />
                        <div>
                          <strong className="text-stone-900 block">{row.product.name}</strong>
                          <span className="text-[10px] text-stone-400">{row.product.categoryLabel}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-stone-900 font-semibold">
                      {formatCurrency(row.product.price)}
                    </td>

                    <td className="px-4 py-3 font-mono text-stone-600">
                      {formatCurrency(row.modalPerPorsi)}
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                      +{formatCurrency(profitPerPortion)}
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {marginPercent}%
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold text-stone-900">
                      {row.quantitySold} porsi
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold text-amber-900">
                      {formatCurrency(row.totalRevenue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
