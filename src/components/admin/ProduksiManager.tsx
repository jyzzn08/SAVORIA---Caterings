import React, { useState } from 'react';
import { ChefHat, Clock, Calendar, CheckCircle2, AlertTriangle, ArrowRight, Package, Utensils, Flame, Sparkles } from 'lucide-react';
import { CustomerOrder, OrderStatus, BahanBaku, Resep } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ProduksiManagerProps {
  orders: CustomerOrder[];
  bahanBaku: BahanBaku[];
  resepList: Resep[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const ProduksiManager: React.FC<ProduksiManagerProps> = ({
  orders,
  bahanBaku,
  resepList,
  onUpdateOrderStatus,
}) => {
  const [filterShift, setFilterShift] = useState<'all' | 'pagi' | 'siang' | 'sore'>('all');

  // Active production orders
  const productionOrders = orders.filter(
    (o) => o.status === 'processing' || o.status === 'production' || o.status === 'ready_to_ship'
  );

  // Compute aggregated ingredient requirements from active orders!
  const ingredientRequirements: Record<string, { nama: string; totalDibutuhkan: number; satuan: string; stokTersedia: number; status: 'aman' | 'menipis' }> = {};

  productionOrders.forEach((ord) => {
    ord.items.forEach((item) => {
      // Find recipe
      const matchedResep = resepList.find(
        (r) => r.productId === item.product.id || r.namaMenu.toLowerCase() === item.product.name.toLowerCase()
      );

      if (matchedResep) {
        matchedResep.bahanList.forEach((b) => {
          const matchedStok = bahanBaku.find((bb) => bb.id === b.bahanId || bb.nama.toLowerCase() === b.namaBahan.toLowerCase());
          const stokCurrent = matchedStok ? matchedStok.stokSaatIni : 50;
          const needed = b.jumlah * (item.quantity / (matchedResep.porsiStandar || 1));

          if (!ingredientRequirements[b.namaBahan]) {
            ingredientRequirements[b.namaBahan] = {
              nama: b.namaBahan,
              totalDibutuhkan: Math.round(needed * 10) / 10,
              satuan: b.satuan,
              stokTersedia: stokCurrent,
              status: stokCurrent >= needed ? 'aman' : 'menipis',
            };
          } else {
            ingredientRequirements[b.namaBahan].totalDibutuhkan += Math.round(needed * 10) / 10;
            if (stokCurrent < ingredientRequirements[b.namaBahan].totalDibutuhkan) {
              ingredientRequirements[b.namaBahan].status = 'menipis';
            }
          }
        });
      }
    });
  });

  const requirementsList = Object.values(ingredientRequirements);

  const totalPaxDapur = productionOrders.reduce((sum, o) => sum + o.guestCount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Jadwal &amp; Operasional Dapur Produksi (Central Kitchen)
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Dapur Aktif
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitoring batch memasak, kontrol kesiapan porsi per acara, dan rekap otomatis kebutuhan bahan baku dapur.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 bg-stone-100 rounded-xl font-medium text-stone-700">
            Total Kapasitas Hari Ini: <strong className="text-stone-900">{totalPaxDapur} Pax</strong>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Batch Sedang Dimasak</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block">
            {productionOrders.filter((o) => o.status === 'production').length} Batch
          </span>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Hot Kitchen &amp; Pastry</span>
        </div>

        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Siap Packing Kontainer</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block">
            {productionOrders.filter((o) => o.status === 'ready_to_ship').length} Batch
          </span>
          <span className="text-[11px] text-stone-500 mt-0.5 block">QC &amp; Suhu Makanan Lolos</span>
        </div>

        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Kebutuhan Bahan Terkalkulasi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block">
            {requirementsList.length} Bahan
          </span>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">Tersinkron dengan Resep Menu</span>
        </div>
      </div>

      {/* SECTION: ACTIVE KITCHEN BATCHES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-amber-800" />
            <span>Antrean Batch Dapur Sesuai Pesanan Masuk</span>
          </h4>
          <span className="text-xs text-stone-400">{productionOrders.length} Pesanan Diproses</span>
        </div>

        {productionOrders.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300">
            <Utensils className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-stone-700">Tidak ada batch masak aktif saat ini.</p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Pesanan pelanggan yang berstatus 'Diproses Dapur' atau 'Sedang Produksi' akan tampil di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {productionOrders.map((ord) => {
              const isCookStage = ord.status === 'production';
              const isReadyStage = ord.status === 'ready_to_ship';

              return (
                <div
                  key={ord.id}
                  className="p-5 bg-white border border-stone-200 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs hover:border-amber-800/30 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-900">{ord.orderNumber}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isReadyStage
                          ? 'bg-purple-100 text-purple-800'
                          : isCookStage
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-800'
                      }`}>
                        {ord.statusLabel}
                      </span>
                      <span className="text-[11px] text-stone-400">· {ord.eventType}</span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900">{ord.eventTitle}</h4>
                    <p className="text-xs text-stone-500">
                      Klien: <strong>{ord.contactName}</strong> · Tanggal: {formatDate(ord.eventDate)} ({ord.eventTime}) · Lokasi: {ord.deliveryCity}
                    </p>

                    {/* Menu items list */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {ord.items.map((it, i) => (
                        <span key={i} className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg">
                          🍳 {it.quantity}x {it.product.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Batch Controls */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                    <div className="text-right mr-2 hidden sm:block">
                      <span className="text-xs font-mono font-bold text-stone-900 block">{ord.guestCount} Pax</span>
                      <span className="text-[10px] text-stone-400">Target Siap: {ord.eventTime}</span>
                    </div>

                    {ord.status === 'processing' && (
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, 'production')}
                        className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Mulai Masak di Dapur →</span>
                      </button>
                    )}

                    {ord.status === 'production' && (
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, 'ready_to_ship')}
                        className="px-3.5 py-2 bg-purple-800 hover:bg-purple-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Selesai Masak &amp; Siap Kirim →</span>
                      </button>
                    )}

                    {ord.status === 'ready_to_ship' && (
                      <span className="px-3.5 py-1.5 bg-purple-50 text-purple-900 border border-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>Menunggu Dispatch Armada</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION: BAHAN BAKU HARIAN DAPUR */}
      {requirementsList.length > 0 && (
        <div className="space-y-3 pt-3">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-800" />
                <span>Rekap Kebutuhan Bahan Baku Dapur Hari Ini</span>
              </h4>
              <p className="text-[11px] text-stone-500">
                Dihitung dari kombinasi porsi pesanan aktif dan formula resep masakan Savoria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {requirementsList.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-stone-900 block truncate max-w-[140px]">{item.nama}</span>
                  <span className="text-[10px] text-stone-400">
                    Stok Gudang: {item.stokTersedia} {item.satuan}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-amber-900 block">
                    {item.totalDibutuhkan} {item.satuan}
                  </span>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                    item.status === 'aman' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
