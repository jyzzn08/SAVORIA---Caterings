import React, { useState } from 'react';
import { BookOpen, ChefHat, Clock, Calculator, ArrowRight, DollarSign, X, CheckCircle2, Sparkles, Scale } from 'lucide-react';
import { Resep } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ResepManagerProps {
  resepList: Resep[];
}

export const ResepManager: React.FC<ResepManagerProps> = ({ resepList }) => {
  const [selectedResep, setSelectedResep] = useState<Resep | null>(null);
  const [scaleTargetPax, setScaleTargetPax] = useState<number>(50);

  const handleOpenDetail = (resep: Resep) => {
    setSelectedResep(resep);
    setScaleTargetPax(resep.porsiStandar);
  };

  const scaleMultiplier = selectedResep ? scaleTargetPax / selectedResep.porsiStandar : 1;
  const scaledTotalCost = selectedResep ? selectedResep.totalBiayaBahan * scaleMultiplier : 0;
  const estimatedRevenue = selectedResep ? selectedResep.hargaJualPerPorsi * scaleTargetPax : 0;
  const estimatedGrossProfit = estimatedRevenue - scaledTotalCost;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h3 className="text-base font-serif font-bold text-stone-900">
            Katalog Resep Standar Catering & Analisis HPP
          </h3>
          <p className="text-xs text-stone-500">
            Formulasi resep teruji koki eksekutif dengan kalkulasi otomatis Harga Pokok Penjualan (HPP) dan margin keuntungan.
          </p>
        </div>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resepList.map((resep) => (
          <div
            key={resep.id}
            onClick={() => handleOpenDetail(resep)}
            className="p-5 bg-white border border-stone-200 rounded-2xl hover:border-amber-800/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span className="font-mono text-[11px] font-semibold text-stone-500">{resep.kodeResep}</span>
                <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium">
                  {resep.kategori}
                </span>
              </div>

              <h4 className="text-sm font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                {resep.namaMenu}
              </h4>

              <div className="mt-3 grid grid-cols-2 gap-2 p-2.5 bg-stone-50 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block">HPP / Porsi:</span>
                  <span className="font-mono font-bold text-stone-900">{formatCurrency(resep.biayaPerPorsi)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Harga Jual:</span>
                  <span className="font-mono font-bold text-amber-900">{formatCurrency(resep.hargaJualPerPorsi)}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{resep.waktuPersiapanMenit} menit masak</span>
                </div>
                <span className="font-semibold text-emerald-700">Margin {resep.marginPersen}%</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <span>{resep.bahanList.length} Bahan baku</span>
              <span className="font-medium text-amber-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Rincian & Kalkulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail & Dynamic Yield Calculator Modal */}
      {selectedResep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-stone-200 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="font-mono font-bold text-amber-900">{selectedResep.kodeResep}</span>
                  <span>·</span>
                  <span>{selectedResep.kategori}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
                  {selectedResep.namaMenu}
                </h3>
              </div>
              <button
                onClick={() => setSelectedResep(null)}
                className="p-2 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DYNAMIC SCALING CALCULATOR BAR */}
            <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-800" />
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    Kalkulator Skala Porsi Acara Dapur
                  </span>
                </div>
                
                {/* Input target pax */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-600 font-medium">Target Masak:</span>
                  <input
                    type="number"
                    min={1}
                    value={scaleTargetPax}
                    onChange={(e) => setScaleTargetPax(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-2 py-1 bg-white border border-amber-300 rounded-lg font-mono font-bold text-sm text-center text-stone-900"
                  />
                  <span className="text-xs text-stone-600 font-semibold">{selectedResep.satuanPorsi}</span>
                </div>
              </div>

              {/* Scaled Cost Outputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-200/60 text-xs">
                <div>
                  <span className="text-stone-500 block text-[11px]">Total Belanja Bahan:</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    {formatCurrency(scaledTotalCost)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Estimasi Omzet Penjualan:</span>
                  <span className="font-mono font-bold text-amber-900 text-sm">
                    {formatCurrency(estimatedRevenue)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Estimasi Gross Profit:</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    {formatCurrency(estimatedGrossProfit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Ingredients Scaled Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center justify-between">
                <span>Rincian Komposisi Bahan (Terskalasi untuk {scaleTargetPax} {selectedResep.satuanPorsi})</span>
                <span className="text-stone-400 font-normal">Faktor Skala: {scaleMultiplier.toFixed(2)}x</span>
              </h4>

              <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
                    <tr>
                      <th className="px-3.5 py-2.5">Bahan Baku</th>
                      <th className="px-3.5 py-2.5 text-center">Takaran Dibutuhkan</th>
                      <th className="px-3.5 py-2.5">Harga Dasar Satuan</th>
                      <th className="px-3.5 py-2.5 text-right">Subtotal Belanja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedResep.bahanList.map((b, idx) => {
                      const scaledQty = b.jumlah * scaleMultiplier;
                      const scaledSubtotal = b.subtotalBiaya * scaleMultiplier;
                      return (
                        <tr key={idx} className="hover:bg-stone-50/50">
                          <td className="px-3.5 py-2.5 font-medium text-stone-900">{b.namaBahan}</td>
                          <td className="px-3.5 py-2.5 text-center font-mono font-bold text-amber-900">
                            {Number(scaledQty.toFixed(2))} {b.satuan}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-stone-600">
                            {formatCurrency(b.biayaPerSatuan)}/{b.satuan}
                          </td>
                          <td className="px-3.5 py-2.5 text-right font-mono font-bold text-stone-900">
                            {formatCurrency(scaledSubtotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cooking Steps */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-amber-800" />
                <span>Instruksi & Prosedur Memasak Dapur Utama</span>
              </h4>

              <ol className="space-y-2 text-xs text-stone-700 list-decimal list-inside bg-stone-50 p-4 rounded-xl border border-stone-200/70">
                {selectedResep.langkahPembuatan.map((step, idx) => (
                  <li key={idx} className="leading-relaxed pl-1">
                    <span className="font-normal">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Chef Tip */}
            <div className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Rahasia Mutu Head Chef:</span>
                <p className="mt-0.5 text-stone-700">{selectedResep.tipsChef}</p>
              </div>
            </div>

            <div className="text-right pt-2 border-t border-stone-200">
              <button
                onClick={() => setSelectedResep(null)}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
