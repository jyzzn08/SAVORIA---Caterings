import React, { useState } from 'react';
import { Truck, MapPin, Phone, User, Clock, CheckCircle2, ShieldCheck, Navigation, AlertCircle } from 'lucide-react';
import { CustomerOrder, OrderStatus } from '../../types';
import { formatDate } from '../../utils/formatters';

interface PengirimanManagerProps {
  orders: CustomerOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

interface ArmadaVehicle {
  id: string;
  name: string;
  plat: string;
  driver: string;
  phone: string;
  status: 'tersedia' | 'dalam_perjalanan' | 'bongkar_muat';
  suhuKontainer: string;
  kapasitas: string;
}

const DEFAULT_FLEET: ArmadaVehicle[] = [
  {
    id: 'fl-1',
    name: 'Van Chiller Termal #01',
    plat: 'B 9482 SVR',
    driver: 'Bambang Sudirjo',
    phone: '+62 812-4455-8899',
    status: 'dalam_perjalanan',
    suhuKontainer: '4.2°C (Chiller Dingin)',
    kapasitas: '450 Pax',
  },
  {
    id: 'fl-2',
    name: 'Van Chiller Termal #02',
    plat: 'B 9120 SVR',
    driver: 'Rian Pratama',
    phone: '+62 813-8899-1122',
    status: 'bongkar_muat',
    suhuKontainer: '65.0°C (Hot Holding Box)',
    kapasitas: '350 Pax',
  },
  {
    id: 'fl-3',
    name: 'Truk Banquet & Peralatan #03',
    plat: 'B 9801 SVR',
    driver: 'Hendra Gunawan',
    phone: '+62 857-1122-3344',
    status: 'tersedia',
    suhuKontainer: 'Suhu Ruang / Linen & Alat',
    kapasitas: '1.200 Pax Alat',
  },
  {
    id: 'fl-4',
    name: 'Blind Van Quick Service #04',
    plat: 'B 9043 SVR',
    driver: 'Dedi Kurniawan',
    phone: '+62 819-0022-7711',
    status: 'tersedia',
    suhuKontainer: 'Box Termal Bento',
    kapasitas: '150 Box',
  },
];

export const PengirimanManager: React.FC<PengirimanManagerProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [fleet] = useState<ArmadaVehicle[]>(DEFAULT_FLEET);

  const shippingOrders = orders.filter(
    (o) => o.status === 'ready_to_ship' || o.status === 'completed' || o.status === 'production'
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Logistik &amp; Armada Pengiriman Catering
            </h3>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
              Live Fleet
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manajemen rute van chiller pendingin, penugasan driver catering, dan monitoring ketepatan waktu sampai di lokasi acara.
          </p>
        </div>

        <div className="text-xs font-medium text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl">
          Standar Suhu: <strong>Hot Food &gt;60°C · Cold Food &lt;5°C</strong>
        </div>
      </div>

      {/* Monitoring Armada Cards */}
      <div>
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
          Status Armada Van Catering Savoria
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fleet.map((van) => (
            <div key={van.id} className="p-4 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">{van.name}</span>
                  <span className="font-mono text-[11px] text-stone-500 font-semibold">{van.plat}</span>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  van.status === 'tersedia'
                    ? 'bg-emerald-100 text-emerald-800'
                    : van.status === 'dalam_perjalanan'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {van.status.replace('_', ' ')}
                </span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-stone-400" />
                    <span>Driver:</span>
                  </span>
                  <strong className="text-stone-800">{van.driver}</strong>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Kontrol Suhu:</span>
                  <strong className="text-amber-900">{van.suhuKontainer}</strong>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Kapasitas:</span>
                  <span className="font-mono">{van.kapasitas}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch and Deliveries List */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-amber-800" />
          <span>Daftar Pengiriman Acara &amp; Alamat Tujuan</span>
        </h4>

        {shippingOrders.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300">
            <Truck className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-stone-700">Tidak ada pengiriman dalam antrean.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shippingOrders.map((ord) => {
              const isReady = ord.status === 'ready_to_ship';
              const isDone = ord.status === 'completed';

              return (
                <div
                  key={ord.id}
                  className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs hover:border-amber-800/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-900">{ord.orderNumber}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : isReady
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-800'
                      }`}>
                        {isDone ? 'Tiba di Lokasi & Selesai' : isReady ? 'Siap Berangkat' : 'Menunggu Dapur Selesai'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900">{ord.eventTitle}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 pt-1">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-stone-800 block">{ord.deliveryAddress}</strong>
                          <span className="text-[11px] text-stone-400">{ord.deliveryCity}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-stone-800 font-medium block">Penerima: {ord.contactName}</span>
                          <span className="text-[11px] font-mono text-stone-500">{ord.contactPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-semibold text-stone-800 block">
                        Jadwal Tiba: {formatDate(ord.eventDate)}
                      </span>
                      <span className="text-xs text-amber-900 font-bold block">{ord.eventTime} WIB</span>
                    </div>

                    {isReady && (
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, 'completed')}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Konfirmasi Tiba &amp; Selesai Antar</span>
                      </button>
                    )}

                    {isDone && (
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Telah Diterima Klien</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
