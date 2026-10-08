export type ProductCategory = 
  | 'all'
  | 'prasmanan'
  | 'nasi_kotak'
  | 'coffee_break'
  | 'tumpeng'
  | 'healthy_diet'
  | 'wedding_gala';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  unit: string; // e.g. "per porsi", "per box", "per pax", "per paket"
  shortDescription: string;
  fullDescription: string;
  image: string;
  minOrder: number;
  preparationTime: string;
  servingRecommendation: string;
  includedItems: string[];
  dietaryTags: string[];
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  modalPerPorsi?: number;
  marginPersen?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 
  | 'draft'
  | 'pending_payment'
  | 'processing'
  | 'production'
  | 'ready_to_ship'
  | 'completed';

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  timestamp?: string;
  notes?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  status: OrderStatus;
  statusLabel: string;
  items: {
    product: Product;
    quantity: number;
    price: number;
    notes?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  total: number;
  deliveryAddress: string;
  deliveryCity: string;
  contactName: string;
  contactPhone: string;
  customerEmail?: string;
  paymentMethod: string;
  paymentStatus: 'unpaid' | 'dp_paid' | 'fully_paid';
  createdAt: string;
  timeline: OrderTimelineStep[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'production' | 'delivery' | 'system';
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export type UserRole = 'guest' | 'customer' | 'admin';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  companyOrEvent?: string;
}

export interface UserAccount extends UserProfile {
  id: string;
  password?: string;
  createdAt: string;
  status: 'active' | 'pending';
}

export type ActiveView = 
  | 'welcome' 
  | 'home' 
  | 'products' 
  | 'login' 
  | 'orders' 
  | 'admin';

export type AdminModule = 
  | 'dashboard'
  | 'pelanggan'
  | 'menu'
  | 'pesanan'
  | 'produksi'
  | 'bahan_baku'
  | 'resep'
  | 'pengiriman'
  | 'pembayaran'
  | 'laporan'
  | 'notifikasi'
  | 'pengaturan'
  | 'google_sheets';

export interface BahanBaku {
  id: string;
  kodeBahan: string;
  nama: string;
  kategori: 'Daging & Unggas' | 'Bumbu & Rempah' | 'Beras & Karbohidrat' | 'Sayuran Segar' | 'Seafood' | 'Dairy & Bakery' | 'Packaging Food Grade';
  stokSaatIni: number;
  satuan: 'kg' | 'liter' | 'butir' | 'ikat' | 'pack' | 'pcs' | 'box';
  stokMinimum: number;
  hargaSatuan: number;
  supplier: string;
  status: 'aman' | 'menipis' | 'habis';
  lokasiPenyimpanan: string;
  lastUpdated?: string;
}

export interface ResepBahanItem {
  bahanId: string;
  namaBahan: string;
  jumlah: number;
  satuan: string;
  biayaPerSatuan: number;
  subtotalBiaya: number;
}

export interface Resep {
  id: string;
  kodeResep: string;
  namaMenu: string;
  productId?: string;
  kategori: string;
  porsiStandar: number; // e.g. 50 porsi
  satuanPorsi: string; // 'pax' | 'box' | 'porsi'
  totalBiayaBahan: number; // HPP per batch
  biayaPerPorsi: number; // HPP per porsi
  hargaJualPerPorsi: number;
  marginPersen: number;
  waktuPersiapanMenit: number;
  bahanList: ResepBahanItem[];
  langkahPembuatan: string[];
  tipsChef: string;
}

export interface GoogleSheetsSyncConfig {
  webAppUrl: string;
  lastSyncedAt?: string;
  autoSyncOrders: boolean;
  isConnected: boolean;
}
