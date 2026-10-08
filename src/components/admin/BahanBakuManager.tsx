import React, { useState } from 'react';
import { Package, Search, Plus, Minus, AlertTriangle, CheckCircle2, ArrowUpDown, Filter, Building2, MapPin } from 'lucide-react';
import { BahanBaku } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface BahanBakuManagerProps {
  bahanBakuList: BahanBaku[];
  onUpdateStok: (id: string, delta: number) => void;
  onAddBahanBaku: (newBahan: BahanBaku) => void;
}

export const BahanBakuManager: React.FC<BahanBakuManagerProps> = ({
  bahanBakuList,
  onUpdateStok,
  onAddBahanBaku,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'menipis' | 'aman'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding New Item
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState<BahanBaku['kategori']>('Bumbu & Rempah');
  const [stokSaatIni, setStokSaatIni] = useState<number | ''>('');
  const [satuan, setSatuan] = useState<BahanBaku['satuan']>('kg');
  const [stokMinimum, setStokMinimum] = useState<number | ''>('');
  const [hargaSatuan, setHargaSatuan] = useState<number | ''>('');
  const [supplier, setSupplier] = useState('');
  const [lokasiPenyimpanan, setLokasiPenyimpanan] = useState('');

  const categories = [
    'all',
    'Daging & Unggas',
    'Bumbu & Rempah',
    'Beras & Karbohidrat',
    'Sayuran Segar',
    'Seafood',
    'Dairy & Bakery',
    'Packaging Food Grade',
  ];

  const filteredList = bahanBakuList.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kodeBahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'all' || item.kategori === selectedCategory;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'menipis' && item.status === 'menipis') ||
      (statusFilter === 'aman' && item.status === 'aman');

    return matchesSearch && matchesCat && matchesStatus;
  });

  const totalSKU = bahanBakuList.length;
  const totalValuasi = bahanBakuList.reduce((sum, b) => sum + b.stokSaatIni * b.hargaSatuan, 0);
  const itemMenipisCount = bahanBakuList.filter((b) => b.stokSaatIni <= b.stokMinimum).length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBahan: BahanBaku = {
      id: `bb-${Date.now()}`,
      kodeBahan: `BB-${String(bahanBakuList.length + 1).padStart(3, '0')}`,
      nama,
      kategori,
      stokSaatIni: Number(stokSaatIni) || 0,
      satuan,
      stokMinimum: Number(stokMinimum) || 0,
      hargaSatuan: Number(hargaSatuan) || 0,
      supplier: supplier.trim() || 'Supplier Rekanan Savoria',
      status: (Number(stokSaatIni) || 0) <= (Number(stokMinimum) || 0) ? 'menipis' : 'aman',
      lokasiPenyimpanan: lokasiPenyimpanan.trim() || 'Gudang Utama',
      lastUpdated: 'Baru saja',
    };
    onAddBahanBaku(newBahan);
    setIsAddModalOpen(false);
    setNama('');
    setStokSaatIni('');
    setStokMinimum('');
    setHargaSatuan('');
    setSupplier('');
    setLokasiPenyimpanan('');
  };

  return (
    <div className="space-y-6">
      
      {/* 3 Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
          <span className="text-xs text-stone-500 font-medium block">Total Inventaris Bahan (SKU)</span>
          <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block">{totalSKU} Item</span>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Tersimpan di gudang dingin & kering</span>
        </div>

        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
          <span className="text-xs text-stone-500 font-medium block">Total Valuasi Nilai Bahan Baku</span>
          <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block">{formatCurrency(totalValuasi)}</span>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Berdasarkan stok fisik real-time</span>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
          <span className="text-xs text-amber-900 font-medium block">Perlu Reorder / Stok Menipis</span>
          <span className="text-2xl font-bold font-mono text-amber-950 mt-1 block">{itemMenipisCount} Bahan</span>
          <span className="text-[11px] text-amber-800 mt-0.5 block">Di bawah batas minimum aman</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, bumbu, kode..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-white font-semibold text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusFilter('menipis')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'menipis' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-stone-600'
              }`}
            >
              Menipis ({itemMenipisCount})
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start md:self-auto px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Tambah Bahan Baru</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-stone-800 text-white font-semibold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat === 'all' ? 'Semua Kategori' : cat}
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
              <tr>
                <th className="px-4 py-3">Kode & Nama Bahan</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-center">Stok Fisik</th>
                <th className="px-4 py-3">Min. Stok</th>
                <th className="px-4 py-3">Harga Beli</th>
                <th className="px-4 py-3">Lokasi / Supplier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Penyesuaian Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredList.map((item) => {
                const isLow = item.stokSaatIni <= item.stokMinimum;
                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-stone-400 block">{item.kodeBahan}</span>
                      <span className="font-semibold text-stone-900 block">{item.nama}</span>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      <span>{item.kategori}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono font-bold text-sm text-stone-900">
                        {item.stokSaatIni}
                      </span>{' '}
                      <span className="text-[11px] text-stone-500">{item.satuan}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-stone-500">
                      {item.stokMinimum} {item.satuan}
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-stone-800">
                      {formatCurrency(item.hargaSatuan)}/{item.satuan}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-stone-700 block">{item.lokasiPenyimpanan}</span>
                      <span className="text-[10px] text-stone-400 block truncate max-w-[140px]">{item.supplier}</span>
                    </td>
                    <td className="px-4 py-3">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          <span>Menipis</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Aman</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50 text-xs">
                        <button
                          onClick={() => onUpdateStok(item.id, -1)}
                          disabled={item.stokSaatIni <= 0}
                          title="Kurangi 1 satuan"
                          className="px-2 py-1 hover:bg-stone-200 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3 text-stone-700" />
                        </button>
                        <span className="px-2 font-mono text-[11px] font-semibold text-stone-600">
                          Ubah
                        </span>
                        <button
                          onClick={() => onUpdateStok(item.id, 1)}
                          title="Tambah 1 satuan"
                          className="px-2 py-1 hover:bg-stone-200 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3 text-stone-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Tambah Bahan Baku Baru ke Inventaris
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Nama Bahan Baku</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Daging Sapi Gandik Segar"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Kategori</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Daging & Unggas">Daging & Unggas</option>
                    <option value="Bumbu & Rempah">Bumbu & Rempah</option>
                    <option value="Beras & Karbohidrat">Beras & Karbohidrat</option>
                    <option value="Sayuran Segar">Sayuran Segar</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Dairy & Bakery">Dairy & Bakery</option>
                    <option value="Packaging Food Grade">Packaging Food Grade</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Satuan Ukur</label>
                  <select
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="liter">liter</option>
                    <option value="butir">butir</option>
                    <option value="ikat">ikat</option>
                    <option value="pack">pack</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Stok Awal</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    required
                    value={stokSaatIni}
                    onChange={(e) => setStokSaatIni(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Batas Minimum</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    required
                    value={stokMinimum}
                    onChange={(e) => setStokMinimum(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Harga Beli (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    required
                    value={hargaSatuan}
                    onChange={(e) => setHargaSatuan(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Nama Supplier / Rekanan</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Contoh: PT Dharma Jaya Segar"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Lokasi Penyimpanan Gudang</label>
                <input
                  type="text"
                  value={lokasiPenyimpanan}
                  onChange={(e) => setLokasiPenyimpanan(e.target.value)}
                  placeholder="Contoh: Chiller Dapur Utama Rak #2"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl font-semibold hover:bg-amber-900"
                >
                  Simpan Bahan Baku
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
