import React from 'react';
import { Phone, Mail, MapPin, Clock, Award, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigateToCatalog: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToCatalog }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand & Story */}
          <div className="md:col-span-1 space-y-4">
            <span className="text-2xl font-serif font-bold text-stone-100 tracking-tight block">
              Savoria
            </span>
            <p className="text-xs leading-relaxed text-stone-400">
              Layanan katering artisanal dan manajemen banquet premium untuk pernikahan, acara korporat, dan syukuran keluarga di Jabodetabek.
            </p>
            <div className="flex items-center gap-3 pt-2 text-stone-400 text-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Halal MUI & HACCP</span>
              </div>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Kategori Sajian
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={onNavigateToCatalog} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Prasmanan & Buffet Banquet
                </button>
              </li>
              <li>
                <button onClick={onNavigateToCatalog} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Nasi Kotak Executive
                </button>
              </li>
              <li>
                <button onClick={onNavigateToCatalog} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Coffee Break & Canapés
                </button>
              </li>
              <li>
                <button onClick={onNavigateToCatalog} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Tumpeng Mini Nusantara
                </button>
              </li>
              <li>
                <button onClick={onNavigateToCatalog} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Healthy & Dietary Catering
                </button>
              </li>
            </ul>
          </div>

          {/* Service Commitment */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Standar Pelayanan
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Bahan segar bersertifikasi grade-A pilihan chef</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Ketepatan pengiriman 99.8% berarmada pendingin</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Kru saji profesional & protokol higienitas ketat</span>
              </li>
            </ul>
          </div>

          {/* Contact & Kitchen Central */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Dapur Pusat & Reservasi
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span>Sentra Kuliner Boga Lestari No. 18, Kebayoran Baru, Jakarta Selatan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                <span>(021) 7890-4421 · 0812-8899-7721</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                <span>concierge@savoria-catering.com</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Savoria Catering Management System. Seluruh hak cipta dilindungi.</p>
          <p className="text-stone-400">
            Dibuat untuk pengalaman jamuan istimewa dan operasional katering terintegrasi.
          </p>
        </div>
      </div>
    </footer>
  );
};
