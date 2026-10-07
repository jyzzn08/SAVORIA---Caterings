import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Eye, Plus, Star, Check } from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'Semua Menu' },
    { id: 'prasmanan', label: 'Prasmanan' },
    { id: 'nasi_kotak', label: 'Nasi Kotak' },
    { id: 'coffee_break', label: 'Coffee Break' },
    { id: 'tumpeng', label: 'Tumpeng Mini' },
    { id: 'wedding_gala', label: 'Wedding & Gala' },
    { id: 'healthy_diet', label: 'Healthy & Diet' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // popular
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, product.minOrder || 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
            Katalog Kuliner Eksklusif
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1">
            Pilihan Menu & Paket Catering
          </h1>
          <p className="text-sm text-stone-500 mt-1.5 max-w-xl">
            Dari racikan bumbu rempah Nusantara hingga hidangan jamuan internasional, disiapkan segar dengan standar tertinggi.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari menu, rendang, buffet..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-100 hover:bg-stone-50 focus:bg-white text-stone-900 placeholder-stone-400 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs & Sorting Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-6">
        
        {/* Category Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-stone-400" />
          <span className="text-xs text-stone-500">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-medium bg-stone-100 text-stone-800 border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 cursor-pointer"
          >
            <option value="popular">Paling Populer</option>
            <option value="price_asc">Harga Terendah</option>
            <option value="price_desc">Harga Tertinggi</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </div>

      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-stone-500 text-sm">Tidak ada menu yang sesuai dengan kriteria pencarian.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs text-amber-800 font-semibold hover:underline cursor-pointer"
          >
            Reset filter pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const isJustAdded = recentlyAddedId === product.id;

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onClick={() => onSelectProduct(product)}
                className="group relative bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Food Photography Slot */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    
                    {/* Subtle Overlay gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Rating Indicator */}
                    <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-stone-100 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="tabular-nums font-mono">{product.rating}</span>
                      <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-5">
                    
                    {/* Unboxed Metadata (Zero-pill discipline) */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
                      <span className="font-medium text-stone-700">{product.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>Min. {product.minOrder} {product.unit.replace('per ', '')}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.preparationTime}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Footer Bar with Price & Actions */}
                <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-xs text-stone-400 block">Mulai dari</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-[11px] text-stone-500 font-normal">
                        /{product.unit.replace('per ', '')}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-900 hover:bg-amber-900 text-white shadow-xs'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Ditambah</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Keranjang</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};
