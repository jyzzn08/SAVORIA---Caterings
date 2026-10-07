import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ChefHat, Heart, Wine, Eye, Star, Utensils, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { Product, UserProfile, ActiveView } from '../../types';
import heroImg from '../../assets/images/hero_catering_banquet_1791382469702.jpg';
import buffetImg from '../../assets/images/catering_buffet_spread_1791382503487.jpg';
import canapesImg from '../../assets/images/catering_canapes_pastry_1791382516143.jpg';
import tumpengImg from '../../assets/images/catering_tumpeng_mini_1791382528061.jpg';
import nasiKotakImg from '../../assets/images/catering_nasi_kotak_1791382487714.jpg';

interface CustomerHomeProps {
  user: UserProfile;
  products: Product[];
  onNavigate: (view: ActiveView) => void;
  onSelectProduct: (product: Product) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  user,
  products,
  onNavigate,
  onSelectProduct,
}) => {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <div className="space-y-20 pb-20 bg-[#FAF7F2] text-stone-900 selection:bg-amber-200">
      
      {/* 1. COZY & FANCY HERO SHOWCASE (WARM CANDLELIGHT AMBIANCE) */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-stone-950 text-stone-100">
        {/* Background Image with Deep Warm Scrim & Amber Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Warm Banquet Hospitality Setup"
            className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.08] scale-105 transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-stone-950/60 to-stone-950/40" />
          <div className="absolute inset-0 bg-amber-950/30 mix-blend-multiply" />
        </div>

        {/* Ambient Warm Candlelight Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-amber-500/15 blur-[160px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          
          {/* Subtle Golden Pill */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs tracking-widest uppercase font-medium mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Artisanal Haute Cuisine · Kehangatan Jamuan Istimewa</span>
          </motion.div>

          {/* Elegant Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-50 tracking-tight leading-[1.16] [text-wrap:balance]"
          >
            Harmoni Cita Rasa &amp; Seni Tata Meja Berkelas
          </motion.h1>

          {/* Warm Personalized Narrative (No Active Orders, Pure Cozy Greeting) */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-sm sm:text-base text-stone-200/90 font-light max-w-2xl leading-relaxed [text-wrap:balance]"
          >
            Selamat datang kembali, <strong className="font-semibold text-amber-200">{user.name}</strong>. Di Savoria, setiap perhelatan dirancang layaknya karya seni—memadukan bumbu rempah pilihan, linen lembut, dan keramahan hangat yang membuat seluruh tamu merasa istimewa.
          </motion.p>

          {/* Fancy Action Buttons (No Prices, No Add to Cart) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase rounded-full shadow-lg shadow-amber-950/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Jelajahi Koleksi Menu</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('filosofi-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/15 text-stone-100 border border-white/20 rounded-full text-xs font-medium tracking-wide backdrop-blur-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Heart className="w-3.5 h-3.5 text-amber-300" />
              <span>Cerita &amp; Filosofi Dapur</span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* 2. THE ESSENCE OF SAVORIA (COZY & FANCY PILLARS) */}
      <section id="filosofi-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
            Sentuhan Kehangatan Savoria
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 mt-2">
            Tiga Janji Kehangatan di Setiap Meja Jamuan
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
            Katering bukan semata tentang menyajikan makanan lezat, melainkan menghadirkan suasana penuh kenyamanan, aroma rempah yang menggugah, dan kebersamaan yang berkesan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white/90 backdrop-blur-xs rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow text-center space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center ring-8 ring-amber-50/50">
              <ChefHat className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Harmoni Rasa &amp; Rempah Warisan
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Diracik dari resep keluarga turun-temurun dengan 16 rempah nusantara segar dan teknik kuliner presisi, menghasilkan rasa autentik yang kaya dan menenangkan jiwa.
            </p>
          </div>

          <div className="p-8 bg-white/90 backdrop-blur-xs rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow text-center space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center ring-8 ring-amber-50/50">
              <Wine className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Tata Saji Estetik &amp; Menawan
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Balutan kain linen berkualitas, chafing dish tembaga berpemanas api lilin, ornamen keramik buatan tangan, dan rangkaian bunga segar menciptakan pemandangan jamuan mewah.
            </p>
          </div>

          <div className="p-8 bg-white/90 backdrop-blur-xs rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow text-center space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center ring-8 ring-amber-50/50">
              <Heart className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Hospitality Hangat &amp; Tulus
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Kru banquet kami berpenampilan rapi dengan standar keramahan bintang lima: santun, sigap menjaga kenyamanan para tamu, dan selalu melayani dengan senyuman tulus.
            </p>
          </div>
        </div>
      </section>

      {/* 3. ATMOSPHERIC CATERING EXPERIENCES (FANCY EDITORIAL MOMENTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
              Suasana &amp; Ruang Perayaan
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Inspirasi Tata Ruang &amp; Format Acara
            </h2>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1.5 cursor-pointer group"
          >
            <span>Buka Katalog Lengkap</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Royal Prasmanan & Grand Gala',
              subtitle: 'Resepsi Megah & Ballroom',
              desc: 'Pilihan 9 menu istimewa, live carving station daging panggang, dan dessert bar memikat dengan penataan lampu ambient hangat.',
              img: buffetImg,
            },
            {
              title: 'Artisanal Canapés & High Tea',
              subtitle: 'Coffee Break & Intimate Soirée',
              desc: 'Tartlet salmon asap, petite pastry renyah, dan racikan kopi seduh untuk perbincangan santai yang akrab nan elegan.',
              img: canapesImg,
            },
            {
              title: 'Tumpeng Syukuran Keraton',
              subtitle: 'Peresmian & Momen Syukur',
              desc: 'Nasi kuning gurih beraroma pandan dengan 8 lauk tradisional dalam wadah anyam alami berhias janur artistik.',
              img: tumpengImg,
            },
            {
              title: 'Executive Bento Lunch Gathering',
              subtitle: 'Rapat Direksi & Seminar Eksklusif',
              desc: 'Bento box higienis berbahan ramah lingkungan dengan rendang empuk, telur balado, dan sayuran segar berstandar HACCP.',
              img: nasiKotakImg,
            },
          ].map((exp, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('products')}
              className="group relative rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={exp.img}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[11px] text-amber-300 font-medium block">
                    {exp.subtitle}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors text-base leading-snug">
                    {exp.title}
                  </h4>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed font-light">
                    {exp.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-900 font-semibold">
                  <span>Lihat Pilihan di Katalog</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CHEF'S SIGNATURE CREATIONS (NO PRICES, NO CART BUTTONS, PURE GOURMET STORYTELLING) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
            Koleksi Cita Rasa
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Mahakarya Koki Eksekutif Savoria
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed font-light">
            Eksplorasi mahakarya kuliner kami yang dirancang dengan perpaduan tekstur lembut, aroma rempah harum, dan presentasi meja yang memikat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onNavigate('products')}
              className="group bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-stone-900/85 text-white text-[10px] font-semibold tracking-wide px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
                    <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                    <span>Chef's Signature Recipe</span>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block mb-1">
                    {product.categoryLabel}
                  </span>
                  <h3 className="font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors text-lg leading-snug">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-xs text-stone-600 line-clamp-3 leading-relaxed font-light">
                    {product.shortDescription}
                  </p>
                </div>
              </div>

              {/* Clean Aesthetics Footer: NO PRICES, NO CART BUTTONS */}
              <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-stone-100 mt-2">
                <span className="text-xs text-stone-500 font-medium">
                  {product.servingRecommendation}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('products');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-stone-900 bg-stone-100 group-hover:bg-amber-900 group-hover:text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pelajari di Katalog</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. COZY GUEST EXPERIENCES & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-900/5 rounded-3xl border border-amber-900/10 p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
              Kesan Para Tuan Rumah
            </span>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
              Kenangan Hangat dari Jamuan Istimewa
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  "Para tamu resepsi kami tidak henti-hentinya memuji kelezatan rendang dan keindahan susunan prasmanan Savoria. Ruang perjamuan terasa sangat hangat, megah, dan kru katering melayani dengan begitu santun."
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-serif font-bold text-stone-900 block">Dr. Amanda &amp; Rian</span>
                  <span className="text-stone-500 text-[11px]">Resepsi Pernikahan Ballroom</span>
                </div>
                <span className="text-stone-400 text-[11px]">Jakarta</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  "Bento box dan sajian coffee break saat rapat tahunan direksi mendapat apresiasi penuh. Tampilan bento sangat fancy dan rasanya autentik, mencerminkan citra perusahaan yang profesional."
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-serif font-bold text-stone-900 block">Denny Setiawan</span>
                  <span className="text-stone-500 text-[11px]">Head of Corporate Affairs</span>
                </div>
                <span className="text-stone-400 text-[11px]">Surabaya</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COZY INVITATION CONCIERGE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
          {/* Subtle Warm Glow in Corner */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-xl relative z-10">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block mb-2">
              Concierge Jamuan Savoria
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-50">
              Ingin Menyesuaikan Menu dengan Tema Acara Anda?
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Tim kuliner kami siap berdiskusi untuk merancang hidangan yang selaras dengan selera tamu, tata ruang, dan anggaran perhelatan Anda.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={() => onNavigate('products')}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-lg shadow-amber-950/50 cursor-pointer whitespace-nowrap flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Buka Katalog &amp; Pilih Menu</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
