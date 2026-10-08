import React, { useState, useRef } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Trash2,
  DollarSign,
  Calculator,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  X,
  Layers,
  ChevronRight,
  TrendingUp,
  Percent,
  ShieldCheck,
  Package
} from 'lucide-react';
import { Product, ProductCategory, Resep, ResepBahanItem, BahanBaku } from '../../types';
import { formatCurrency } from '../../utils/formatters';

// Preset catering photos from Savoria
import imgBuffetSpread from '../../assets/images/catering_buffet_spread_1791382503487.jpg';
import imgNasiKotak from '../../assets/images/catering_nasi_kotak_1791382487714.jpg';
import imgCanapes from '../../assets/images/catering_canapes_pastry_1791382516143.jpg';
import imgTumpeng from '../../assets/images/catering_tumpeng_mini_1791382528061.jpg';
import imgBanquet from '../../assets/images/hero_catering_banquet_1791382469702.jpg';

interface MenuManagerProps {
  products: Product[];
  resepList: Resep[];
  bahanBakuList: BahanBaku[];
  onAddProduct: (newProduct: Product, newResep?: Resep, newBahanBakuItems?: BahanBaku[]) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenResepDetail?: (resep: Resep) => void;
}

interface NewBahanRow {
  isNewBahan: boolean;
  bahanId?: string;
  nama: string;
  kategori: BahanBaku['kategori'];
  jumlah: number | '';
  satuan: string;
  hargaSatuan: number | '';
  subtotal: number;
}

const PRESET_IMAGES = [
  { label: 'Buffet Prasmanan Mewah', url: imgBuffetSpread },
  { label: 'Nasi Kotak Royal Bento', url: imgNasiKotak },
  { label: 'Canapés & Pastry Bites', url: imgCanapes },
  { label: 'Tumpeng Mini Nusantara', url: imgTumpeng },
  { label: 'Grand Banquet Table', url: imgBanquet },
];

export const MenuManager: React.FC<MenuManagerProps> = ({
  products,
  resepList,
  bahanBakuList,
  onAddProduct,
  onDeleteProduct,
  onOpenResepDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Form State - biarkan kolom ketik kosong agar admin bebas mengisi
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('prasmanan');
  const [unit, setUnit] = useState('');
  const [minOrder, setMinOrder] = useState<number | ''>('');
  const [preparationTime, setPreparationTime] = useState('');
  const [servingRecommendation, setServingRecommendation] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string>(imgBuffetSpread);
  const [imageType, setImageType] = useState<'preset' | 'upload' | 'url'>('preset');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ingredients and Direct Pricing - mulai kosong agar admin menambahkan bahan sesuai resepnya
  const [bahanRows, setBahanRows] = useState<NewBahanRow[]>([]);

  // Operational & Packaging Overhead (%)
  const [overheadPercent, setOverheadPercent] = useState<number>(15);
  // Target Margin (%)
  const [targetMarginPercent, setTargetMarginPercent] = useState<number>(45);
  // Custom Final Selling Price - kosong atau terisi otomatis saat kalkulasi
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [isPriceAutoSet, setIsPriceAutoSet] = useState(true);

  // Included Items (comma separated or tags) - biarkan kosong
  const [includedItemsText, setIncludedItemsText] = useState('');
  const [dietaryTagsText, setDietaryTagsText] = useState('');

  // Calculations
  const rawIngredientCostPerPortion = bahanRows.reduce((sum, row) => sum + row.subtotal, 0);
  const operationalOverheadCost = (rawIngredientCostPerPortion * overheadPercent) / 100;
  const totalModalHppPerPortion = Math.round(rawIngredientCostPerPortion + operationalOverheadCost);

  // Recommended price: modal / (1 - margin/100)
  const recommendedSellingPrice = totalModalHppPerPortion > 0
    ? Math.round(totalModalHppPerPortion / (1 - targetMarginPercent / 100))
    : 0;

  // Actual margin & profit with current selling price
  const numericSellingPrice = Number(sellingPrice) || 0;
  const numericMinOrder = Number(minOrder) || 1;
  const grossProfitPerPortion = numericSellingPrice > 0 ? numericSellingPrice - totalModalHppPerPortion : 0;
  const actualMarginPercent = numericSellingPrice > 0
    ? Math.round((grossProfitPerPortion / numericSellingPrice) * 100)
    : 0;
  const potentialProfitPerMinBatch = grossProfitPerPortion * numericMinOrder;

  // Update auto price when modal or target margin changes
  const handleMarginChange = (newMargin: number) => {
    setTargetMarginPercent(newMargin);
    if (isPriceAutoSet && totalModalHppPerPortion > 0) {
      const rec = Math.round(totalModalHppPerPortion / (1 - newMargin / 100));
      const neat = Math.ceil(rec / 1000) * 1000;
      setSellingPrice(neat);
    }
  };

  const handleUpdateOverhead = (newOverhead: number) => {
    setOverheadPercent(newOverhead);
    const newModal = Math.round(rawIngredientCostPerPortion + (rawIngredientCostPerPortion * newOverhead) / 100);
    if (isPriceAutoSet && newModal > 0) {
      const rec = Math.round(newModal / (1 - targetMarginPercent / 100));
      const neat = Math.ceil(rec / 1000) * 1000;
      setSellingPrice(neat);
    }
  };

  // Add new ingredient row
  const handleAddIngredientRow = (isNew: boolean) => {
    if (isNew) {
      const newRow: NewBahanRow = {
        isNewBahan: true,
        nama: '',
        kategori: 'Bumbu & Rempah',
        jumlah: '',
        satuan: '',
        hargaSatuan: '',
        subtotal: 0,
      };
      setBahanRows([...bahanRows, newRow]);
    } else {
      const firstAvailable = bahanBakuList[0];
      const newRow: NewBahanRow = {
        isNewBahan: false,
        bahanId: firstAvailable ? firstAvailable.id : '',
        nama: firstAvailable ? firstAvailable.nama : '',
        kategori: firstAvailable ? firstAvailable.kategori : 'Bumbu & Rempah',
        jumlah: '',
        satuan: firstAvailable ? firstAvailable.satuan : 'kg',
        hargaSatuan: firstAvailable ? firstAvailable.hargaSatuan : '',
        subtotal: 0,
      };
      setBahanRows([...bahanRows, newRow]);
    }
  };

  // Handle ingredient row changes
  const handleUpdateRow = (index: number, updates: Partial<NewBahanRow>) => {
    const updated = [...bahanRows];
    const curr = { ...updated[index], ...updates };

    if (updates.bahanId && !curr.isNewBahan) {
      const selectedBahan = bahanBakuList.find((b) => b.id === updates.bahanId);
      if (selectedBahan) {
        curr.nama = selectedBahan.nama;
        curr.kategori = selectedBahan.kategori;
        curr.satuan = selectedBahan.satuan;
        curr.hargaSatuan = selectedBahan.hargaSatuan;
      }
    }

    const numJml = Number(curr.jumlah) || 0;
    const numHrg = Number(curr.hargaSatuan) || 0;
    curr.subtotal = Math.round(numJml * numHrg);
    updated[index] = curr;
    setBahanRows(updated);

    // recalculate price if auto
    const newRaw = updated.reduce((s, r) => s + r.subtotal, 0);
    const newModal = Math.round(newRaw + (newRaw * overheadPercent) / 100);
    if (isPriceAutoSet && newModal > 0) {
      const rec = Math.round(newModal / (1 - targetMarginPercent / 100));
      const neat = Math.ceil(rec / 1000) * 1000;
      setSellingPrice(neat);
    }
  };

  const handleRemoveRow = (index: number) => {
    const updated = bahanRows.filter((_, i) => i !== index);
    setBahanRows(updated);
    const newRaw = updated.reduce((s, r) => s + r.subtotal, 0);
    const newModal = Math.round(newRaw + (newRaw * overheadPercent) / 100);
    if (isPriceAutoSet && newModal > 0) {
      const rec = Math.round(newModal / (1 - targetMarginPercent / 100));
      const neat = Math.ceil(rec / 1000) * 1000;
      setSellingPrice(neat);
    } else if (newModal === 0 && isPriceAutoSet) {
      setSellingPrice('');
    }
  };

  // Handle Image File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
          setImageType('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const categoryLabels: Record<ProductCategory, string> = {
    all: 'Semua Kategori',
    prasmanan: 'Prasmanan & Buffet',
    nasi_kotak: 'Nasi Kotak & Bento',
    coffee_break: 'Coffee Break & Canapés',
    tumpeng: 'Tumpeng & Syukuran',
    healthy_diet: 'Healthy Diet',
    wedding_gala: 'Wedding & Gala Dinner',
  };

  // Submit Menu Creation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProdId = `prod-${Date.now()}`;
    const newResepId = `rsp-${Date.now()}`;

    // Extract newly added bahan-baku if any
    const createdBahanBakuItems: BahanBaku[] = [];
    const resepBahanList: ResepBahanItem[] = [];

    const effectiveUnit = unit.trim() || 'per porsi';
    const effectiveMinOrder = Number(minOrder) || 25;
    const effectivePrice = numericSellingPrice > 0 ? numericSellingPrice : (recommendedSellingPrice > 0 ? recommendedSellingPrice : 35000);

    bahanRows.forEach((row, idx) => {
      let bId = row.bahanId;
      if (row.isNewBahan || !bId) {
        bId = `bb-cust-${Date.now()}-${idx}`;
        const newBahan: BahanBaku = {
          id: bId,
          kodeBahan: `BB-${String(bahanBakuList.length + idx + 1).padStart(3, '0')}`,
          nama: row.nama.trim() || `Bahan ${idx + 1}`,
          kategori: row.kategori,
          stokSaatIni: 20,
          satuan: (row.satuan as any) || 'kg',
          stokMinimum: 5,
          hargaSatuan: Number(row.hargaSatuan) || 0,
          supplier: 'Supplier Terverifikasi Savoria',
          status: 'aman',
          lokasiPenyimpanan: 'Central Kitchen Savoria',
          lastUpdated: 'Baru saja',
        };
        createdBahanBakuItems.push(newBahan);
      }

      resepBahanList.push({
        bahanId: bId,
        namaBahan: row.nama.trim() || 'Bahan Masakan',
        jumlah: Number(row.jumlah) || 1,
        satuan: row.satuan || 'porsi',
        biayaPerSatuan: Number(row.hargaSatuan) || 0,
        subtotalBiaya: row.subtotal,
      });
    });

    const finalImage = imagePreview;

    const newProduct: Product = {
      id: newProdId,
      name,
      category,
      categoryLabel: categoryLabels[category] || 'Menu Catering',
      price: effectivePrice,
      unit: effectiveUnit,
      shortDescription: shortDescription || `${name} dengan cita rasa istimewa Savoria.`,
      fullDescription: fullDescription || `${name} diracik dari bahan-bahan segar pilihan kualitas terbaik untuk menyempurnakan acara spesial Anda.`,
      image: finalImage,
      minOrder: effectiveMinOrder,
      preparationTime: preparationTime || 'H-1 Pemesanan',
      servingRecommendation: servingRecommendation || 'Sajikan hangat',
      includedItems: includedItemsText
        ? includedItemsText.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      dietaryTags: dietaryTagsText
        ? dietaryTagsText.split(',').map((s) => s.trim()).filter(Boolean)
        : ['100% Halal'],
      rating: 5.0,
      reviewCount: 1,
      isFeatured: true,
      modalPerPorsi: totalModalHppPerPortion,
      marginPersen: actualMarginPercent,
    };

    const newResep: Resep = {
      id: newResepId,
      kodeResep: `RSP-${String(resepList.length + 1).padStart(3, '0')}`,
      namaMenu: name,
      productId: newProdId,
      kategori: categoryLabels[category] || 'Menu Baru',
      porsiStandar: effectiveMinOrder,
      satuanPorsi: effectiveUnit.includes('box') ? 'box' : 'porsi',
      totalBiayaBahan: totalModalHppPerPortion * effectiveMinOrder,
      biayaPerPorsi: totalModalHppPerPortion,
      hargaJualPerPorsi: effectivePrice,
      marginPersen: actualMarginPercent,
      waktuPersiapanMenit: 60,
      bahanList: resepBahanList,
      langkahPembuatan: [
        'Persiapkan dan timbang seluruh bahan baku sesuai takaran standar.',
        'Proses pengolahan bahan utama dengan bumbu racikan Savoria.',
        'Penyelesaian, plating, pengujian rasa, dan penataan temperatur higienis.',
      ],
      tipsChef: 'Pastikan kesegaran bahan dan sajikan pada suhu ideal sebelum acara dimulai.',
    };

    onAddProduct(newProduct, newResep, createdBahanBakuItems);

    // Reset Form to blank
    setIsModalOpen(false);
    setName('');
    setCategory('prasmanan');
    setUnit('');
    setMinOrder('');
    setPreparationTime('');
    setServingRecommendation('');
    setShortDescription('');
    setFullDescription('');
    setIncludedItemsText('');
    setDietaryTagsText('');
    setSellingPrice('');
    setBahanRows([]);
    setCustomImageUrl('');
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Katalog Menu Catering & Analisis Modal Langsung
            </h3>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              {products.length} Menu Aktif
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Kelola menu catering, unggah foto makanan, tambah bahan-bahan dengan harga langsung, serta hitung modal (HPP) dan margin keuntungan secara otomatis.
          </p>
        </div>

        <button
          onClick={() => {
            setIsPriceAutoSet(true);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Menu Makanan Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari menu berdasarkan nama, lauk, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-800 cursor-pointer"
        >
          <option value="all">Semua Kategori Menu</option>
          <option value="prasmanan">Prasmanan & Buffet</option>
          <option value="nasi_kotak">Nasi Kotak & Bento</option>
          <option value="coffee_break">Coffee Break & Canapés</option>
          <option value="tumpeng">Tumpeng & Syukuran</option>
          <option value="healthy_diet">Healthy Diet</option>
          <option value="wedding_gala">Wedding Gala</option>
        </select>
      </div>

      {/* Grid of Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => {
          const matchedResep = resepList.find(
            (r) => r.productId === p.id || r.namaMenu.toLowerCase() === p.name.toLowerCase()
          );
          const modalVal = p.modalPerPorsi || matchedResep?.biayaPerPorsi || Math.round(p.price * 0.55);
          const marginVal = p.marginPersen || matchedResep?.marginPersen || Math.round(((p.price - modalVal) / p.price) * 100);
          const grossProfit = p.price - modalVal;

          return (
            <div
              key={p.id}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-amber-800/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Category Badge */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                    {p.categoryLabel}
                  </span>
                  <span className="absolute bottom-3 left-3 text-white font-serif font-bold text-sm drop-shadow-sm line-clamp-1">
                    {p.name}
                  </span>
                </div>

                {/* Content & Cost breakdown */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-stone-500 line-clamp-2">{p.shortDescription}</p>

                  {/* Financial & Modal breakdown table */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">Harga Jual / Satuan:</span>
                      <span className="font-mono font-bold text-stone-900">{formatCurrency(p.price)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Calculator className="w-3 h-3 text-amber-700" />
                        <span>Modal (HPP / Porsi):</span>
                      </span>
                      <span className="font-mono font-semibold text-stone-700">{formatCurrency(modalVal)}</span>
                    </div>

                    <div className="pt-1.5 border-t border-stone-200 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Laba Bersih / Porsi:</span>
                      </span>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-700">+{formatCurrency(grossProfit)}</span>
                        <span className="text-[10px] text-emerald-800 ml-1 font-semibold">({marginVal}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Min order and lead time */}
                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>Min. Order: <strong className="text-stone-700">{p.minOrder} {p.unit}</strong></span>
                    <span>{p.preparationTime}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3.5 bg-stone-50/60 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProductDetail(p)}
                  className="text-xs text-amber-900 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Detail Menu</span>
                </button>

                <div className="flex items-center gap-2">
                  {matchedResep && onOpenResepDetail && (
                    <button
                      onClick={() => onOpenResepDetail(matchedResep)}
                      className="text-xs px-2.5 py-1 bg-stone-200/80 hover:bg-stone-300 text-stone-800 rounded-lg font-medium cursor-pointer"
                      title="Lihat formula resep & HPP"
                    >
                      Formula Resep
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus menu "${p.name}" dari katalog?`)) {
                        onDeleteProduct(p.id);
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Menu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-stone-200 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full uppercase">
                  {selectedProductDetail.categoryLabel}
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 mt-1">
                  {selectedProductDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-56 rounded-2xl overflow-hidden bg-stone-100">
              <img
                src={selectedProductDetail.image}
                alt={selectedProductDetail.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {selectedProductDetail.fullDescription}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block">Harga Jual:</span>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {formatCurrency(selectedProductDetail.price)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block">Modal (HPP / Porsi):</span>
                <span className="font-mono font-bold text-amber-900 text-sm">
                  {formatCurrency(selectedProductDetail.modalPerPorsi || Math.round(selectedProductDetail.price * 0.55))}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block">Margin Keuntungan:</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {selectedProductDetail.marginPersen || 45}%
                </span>
              </div>
            </div>

            {selectedProductDetail.includedItems && selectedProductDetail.includedItems.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-stone-800 mb-2">Item yang Disertakan dalam Paket:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProductDetail.includedItems.map((item, i) => (
                    <span key={i} className="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH MENU MAKANAN BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full border border-stone-200 shadow-2xl my-6 max-h-[92vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-800 text-white flex items-center justify-center">
                    <UtensilsCrossed className="w-4 h-4" />
                  </span>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Tambah Menu Makanan & Kalkulasi Modal HPP Langsung
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Masukkan identitas menu, pilih/tambah bahan-bahan dengan harga langsung, dan sistem otomatis menghitung modal (HPP) serta rekomendasi harga jual catering.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* SEKSI 1: IDENTITAS MENU */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Informasi & Spesifikasi Menu
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Nama Menu Makanan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Rendang Daging Sapi Suwir Balado"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Kategori Menu
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProductCategory)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800 cursor-pointer"
                    >
                      <option value="prasmanan">Prasmanan & Buffet</option>
                      <option value="nasi_kotak">Nasi Kotak & Bento</option>
                      <option value="coffee_break">Coffee Break & Canapés</option>
                      <option value="tumpeng">Tumpeng & Syukuran</option>
                      <option value="healthy_diet">Healthy Diet</option>
                      <option value="wedding_gala">Wedding & Gala Dinner</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Satuan Penjualan
                    </label>
                    <input
                      type="text"
                      placeholder="per porsi / per box / per pax"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Minimal Pemesanan (Min. Order)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={minOrder}
                        onChange={(e) => setMinOrder(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800 font-mono"
                      />
                      <span className="text-xs text-stone-500 whitespace-nowrap">{unit}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Waktu Persiapan Dapur
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: H-1 Pemesanan"
                      value={preparationTime}
                      onChange={(e) => setPreparationTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Rekomendasi Penyajian
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Hangat dalam Chafing Dish roll-top"
                      value={servingRecommendation}
                      onChange={(e) => setServingRecommendation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Deskripsi Singkat Menu
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Jelaskan daya tarik rasa makanan ini untuk katalog..."
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>

              {/* SEKSI 2: FOTO MENU MAKANAN */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Foto & Gambar Menu Makanan
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  
                  {/* Photo Preview Card */}
                  <div className="border border-stone-200 rounded-2xl p-3 bg-stone-50 text-center">
                    <span className="text-[11px] font-semibold text-stone-600 block mb-2">Live Preview Foto:</span>
                    <div className="w-full h-36 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 relative">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-stone-400">
                          <ImageIcon className="w-8 h-8 mb-1" />
                          <span className="text-[10px]">Belum ada foto</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photo Source Selector */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImageType('preset')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                          imageType === 'preset'
                            ? 'bg-amber-800 text-white font-semibold'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        Pilih dari Koleksi Savoria
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageType('upload');
                          fileInputRef.current?.click();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                          imageType === 'upload'
                            ? 'bg-amber-800 text-white font-semibold'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        Upload File dari Komputer
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageType('url')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                          imageType === 'url'
                            ? 'bg-amber-800 text-white font-semibold'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        URL Gambar
                      </button>
                    </div>

                    {imageType === 'preset' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {PRESET_IMAGES.map((preset, idx) => (
                          <div
                            key={idx}
                            onClick={() => setImagePreview(preset.url)}
                            className={`p-1.5 rounded-xl border text-left cursor-pointer transition-all ${
                              imagePreview === preset.url
                                ? 'border-amber-800 bg-amber-50 ring-1 ring-amber-800'
                                : 'border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="w-full h-14 object-cover rounded-lg mb-1" />
                            <span className="text-[10px] font-semibold text-stone-800 block truncate">{preset.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {imageType === 'upload' && (
                      <div className="p-4 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50 text-center">
                        <Upload className="w-6 h-6 text-stone-400 mx-auto mb-1.5" />
                        <span className="text-xs font-semibold text-stone-800 block">Pilih File Foto Makanan</span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">JPG, PNG, atau WebP (Maks 5MB)</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-3 px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-500 rounded-lg text-xs font-medium text-stone-700 cursor-pointer"
                        >
                          Pilih Dokumen Foto
                        </button>
                      </div>
                    )}

                    {imageType === 'url' && (
                      <div>
                        <input
                          type="url"
                          placeholder="https://example.com/foto-makanan.jpg"
                          value={customImageUrl}
                          onChange={(e) => {
                            setCustomImageUrl(e.target.value);
                            setImagePreview(e.target.value);
                          }}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SEKSI 3: BAHAN-BAHAN & HARGA LANGSUNG (BAHAN BAKU & HPP) */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center justify-center">
                      3
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Bahan-Bahan &amp; Harga Beli Langsung (Per Porsi)
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddIngredientRow(false)}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[11px] font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Pilih dari Bahan Terdaftar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddIngredientRow(true)}
                      className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Tambah Bahan Baru Langsung</span>
                    </button>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 text-stone-600 border-b border-stone-200 text-[11px]">
                        <tr>
                          <th className="px-3.5 py-2.5 font-semibold">Tipe & Nama Bahan</th>
                          <th className="px-3.5 py-2.5 font-semibold">Kategori</th>
                          <th className="px-3.5 py-2.5 font-semibold">Takaran / Porsi</th>
                          <th className="px-3.5 py-2.5 font-semibold">Satuan</th>
                          <th className="px-3.5 py-2.5 font-semibold">Harga Langsung (Rp)</th>
                          <th className="px-3.5 py-2.5 font-semibold text-right">Subtotal Modal</th>
                          <th className="px-2 py-2.5 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {bahanRows.map((row, idx) => (
                          <tr key={idx} className="bg-white hover:bg-stone-50/80">
                            {/* Nama / Pick */}
                            <td className="px-3.5 py-2 min-w-[200px]">
                              {row.isNewBahan ? (
                                <div>
                                  <input
                                    type="text"
                                    placeholder="Ketik Nama Bahan Baru..."
                                    value={row.nama}
                                    onChange={(e) => handleUpdateRow(idx, { nama: e.target.value })}
                                    className="w-full px-2.5 py-1.5 bg-amber-50/50 border border-amber-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                                  />
                                  <span className="text-[9px] text-amber-700 font-medium">Bahan Baru Otomatis Disimpan</span>
                                </div>
                              ) : (
                                <select
                                  value={row.bahanId}
                                  onChange={(e) => handleUpdateRow(idx, { bahanId: e.target.value })}
                                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                                >
                                  {bahanBakuList.map((b) => (
                                    <option key={b.id} value={b.id}>
                                      {b.nama} ({formatCurrency(b.hargaSatuan)} / {b.satuan})
                                    </option>
                                  ))}
                                </select>
                              )}
                            </td>

                            {/* Kategori */}
                            <td className="px-3.5 py-2">
                              {row.isNewBahan ? (
                                <select
                                  value={row.kategori}
                                  onChange={(e) => handleUpdateRow(idx, { kategori: e.target.value as any })}
                                  className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[11px]"
                                >
                                  <option value="Daging & Unggas">Daging & Unggas</option>
                                  <option value="Bumbu & Rempah">Bumbu & Rempah</option>
                                  <option value="Beras & Karbohidrat">Beras & Karbo</option>
                                  <option value="Sayuran Segar">Sayuran Segar</option>
                                  <option value="Seafood">Seafood</option>
                                  <option value="Dairy & Bakery">Dairy & Bakery</option>
                                  <option value="Packaging Food Grade">Packaging</option>
                                </select>
                              ) : (
                                <span className="text-[11px] text-stone-500">{row.kategori}</span>
                              )}
                            </td>

                            {/* Takaran / Jumlah */}
                            <td className="px-3.5 py-2 w-24">
                              <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={row.jumlah}
                                onChange={(e) => handleUpdateRow(idx, { jumlah: Number(e.target.value) })}
                                className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-semibold"
                              />
                            </td>

                            {/* Satuan */}
                            <td className="px-3.5 py-2 w-20">
                              {row.isNewBahan ? (
                                <input
                                  type="text"
                                  value={row.satuan}
                                  onChange={(e) => handleUpdateRow(idx, { satuan: e.target.value })}
                                  className="w-full px-1.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[11px]"
                                />
                              ) : (
                                <span className="font-mono text-stone-600">{row.satuan}</span>
                              )}
                            </td>

                            {/* Harga Langsung / Unit Cost */}
                            <td className="px-3.5 py-2 w-32">
                              <input
                                type="number"
                                min="0"
                                value={row.hargaSatuan}
                                onChange={(e) => handleUpdateRow(idx, { hargaSatuan: Number(e.target.value) })}
                                className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-semibold"
                              />
                            </td>

                            {/* Subtotal */}
                            <td className="px-3.5 py-2 text-right font-mono font-bold text-stone-900 whitespace-nowrap">
                              {formatCurrency(row.subtotal)}
                            </td>

                            {/* Remove button */}
                            <td className="px-2 py-2 text-center">
                              {bahanRows.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRow(idx)}
                                  className="p-1 text-stone-400 hover:text-rose-600 rounded-md cursor-pointer"
                                  title="Hapus baris bahan"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary row */}
                  <div className="p-3 bg-stone-100/70 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs">
                    <span className="text-stone-600 font-medium">
                      Total Bahan Pokok: <strong>{bahanRows.length} Macam Bahan</strong>
                    </span>
                    <span className="font-mono font-bold text-stone-900">
                      Subtotal Bahan / Porsi: {formatCurrency(rawIngredientCostPerPortion)}
                    </span>
                  </div>
                </div>
              </div>

              {/* SEKSI 4: KALKULATOR MODAL (HPP), OVERHEAD, MARGIN & HARGA JUAL */}
              <div className="p-5 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-stone-100 rounded-3xl space-y-5 border border-stone-800 shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                      $
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-100 uppercase tracking-wider">
                        Kalkulator Finansial Catering (HPP &amp; Analisis Margin)
                      </h4>
                      <span className="text-[10px] text-stone-400">
                        Otomatis menghitung seluruh modal pokok dan menetapkan rekomendasi harga jual katering.
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                    Kalkulasi Real-Time
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  
                  {/* Parameter 1: Subtotal Bahan */}
                  <div className="p-3.5 bg-stone-800/60 rounded-2xl border border-stone-700/60">
                    <span className="text-[10px] text-stone-400 block">1. Modal Bahan Mentah</span>
                    <span className="text-lg font-mono font-bold text-amber-300 mt-1 block">
                      {formatCurrency(rawIngredientCostPerPortion)}
                    </span>
                    <span className="text-[10px] text-stone-400 mt-0.5 block">Akumulasi bahan baku</span>
                  </div>

                  {/* Parameter 2: Overhead & Packaging */}
                  <div className="p-3.5 bg-stone-800/60 rounded-2xl border border-stone-700/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-400">2. Kemasan & Dapur (%):</span>
                      <span className="text-xs font-mono font-bold text-stone-200">{overheadPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="35"
                      step="5"
                      value={overheadPercent}
                      onChange={(e) => handleUpdateOverhead(Number(e.target.value))}
                      className="w-full mt-2 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-stone-300 mt-1 block">
                      +{formatCurrency(operationalOverheadCost)} / porsi
                    </span>
                  </div>

                  {/* Parameter 3: Total Modal Pokok (HPP) */}
                  <div className="p-3.5 bg-amber-950/40 rounded-2xl border border-amber-600/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">3. TOTAL MODAL (HPP / Porsi)</span>
                    <span className="text-xl font-mono font-bold text-white mt-1 block">
                      {formatCurrency(totalModalHppPerPortion)}
                    </span>
                    <span className="text-[10px] text-amber-400/80 mt-0.5 block">Harga Pokok Penjualan</span>
                  </div>

                  {/* Parameter 4: Target Margin Keuntungan */}
                  <div className="p-3.5 bg-stone-800/60 rounded-2xl border border-stone-700/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-400">4. Target Margin (%):</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{targetMarginPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="75"
                      step="5"
                      value={targetMarginPercent}
                      onChange={(e) => handleMarginChange(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">Rekomendasi industri: 40-55%</span>
                  </div>
                </div>

                {/* Pricing Decision Bar */}
                <div className="p-4 bg-stone-800/90 rounded-2xl border border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-stone-400 block">
                      Harga Jual Rekomendasi Savoria:
                    </span>
                    <span className="text-lg font-mono font-bold text-amber-300">
                      {formatCurrency(recommendedSellingPrice)} / {unit}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const neat = Math.ceil(recommendedSellingPrice / 1000) * 1000;
                        setSellingPrice(neat);
                        setIsPriceAutoSet(true);
                      }}
                      className="text-[10px] text-amber-400 underline block mt-0.5 hover:text-amber-300 cursor-pointer"
                    >
                      Gunakan Rekomendasi Ini
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-300 block mb-1">
                        Harga Jual Final ke Customer (Rp)
                      </label>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        value={sellingPrice}
                        onChange={(e) => {
                          setSellingPrice(Number(e.target.value));
                          setIsPriceAutoSet(false);
                        }}
                        className="px-3 py-2 bg-stone-900 border border-stone-600 text-amber-300 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Profit summary */}
                  <div className="text-right sm:border-l sm:border-stone-700 sm:pl-4">
                    <span className="text-[11px] text-stone-400 block">Laba Kotor Bersih:</span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      +{formatCurrency(grossProfitPerPortion)} ({actualMarginPercent}%)
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      Potensi Profit Min. Batch ({minOrder} pax): <strong className="text-emerald-300">{formatCurrency(potentialProfitPerMinBatch)}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* SEKSI 5: LAUK PENDAMPING & TAGS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center justify-center">
                    5
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Kelengkapan Menu &amp; Tag Diet
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Item yang Disertakan dalam Paket (Pisahkan Koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Nasi Putih Pulen, Sambal Khas, Acar, Sendok Food-Grade"
                      value={includedItemsText}
                      onChange={(e) => setIncludedItemsText(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Label / Tag Diet (Pisahkan Koma)
                    </label>
                    <input
                      type="text"
                      placeholder="100% Halal, Chef Special, Bebas Pengawet"
                      value={dietaryTagsText}
                      onChange={(e) => setDietaryTagsText(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-stone-500">
                  Menu baru akan langsung tersedia di Katalog Customer &amp; tersinkron ke Google Sheets.
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2.5 border border-stone-300 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-100 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan Menu &amp; Daftarkan Formula Resep</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
