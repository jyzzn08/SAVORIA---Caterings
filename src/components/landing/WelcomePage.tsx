import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, User, UtensilsCrossed, Sparkles, ChefHat, Clock, ShieldCheck, Heart, Wine, Star } from 'lucide-react';
import { ActiveView } from '../../types';
import heroImg from '../../assets/images/hero_catering_banquet_1791382469702.jpg';
import buffetImg from '../../assets/images/catering_buffet_spread_1791382503487.jpg';
import canapesImg from '../../assets/images/catering_canapes_pastry_1791382516143.jpg';
import tumpengImg from '../../assets/images/catering_tumpeng_mini_1791382528061.jpg';
import nasiKotakImg from '../../assets/images/catering_nasi_kotak_1791382487714.jpg';

interface WelcomePageProps {
  onNavigate: (view: ActiveView) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FAF7F2] text-stone-900 selection:bg-amber-200">
      
      {/* 1. HERO SANCTUARY (COZY, FANCY & WARM) */}
      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden bg-stone-950 text-stone-100">
        
        {/* Background Hero Imagery with Cinematic Dark Amber Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Savoria Luxury Catering Banquet Setup"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.08] scale-105 transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-stone-950/60 to-stone-950/30" />
          <div className="absolute inset-0 bg-amber-950/25 mix-blend-multiply" />
        </div>

        {/* Ambient Candlelight Warm Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/15 blur-[160px] rounded-full pointer-events-none" />

        {/* Hero Content Area */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 flex-1 flex flex-col items-center justify-center text-center">
          
          {/* Opening Animation Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs tracking-widest uppercase font-medium mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Selamat Datang · Welcome to Savoria</span>
          </motion.div>

          {/* Brand Display Headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-stone-50 tracking-tight leading-[1.14] max-w-4xl [text-wrap:balance]"
          >
            Seni Kuliner Istimewa untuk Setiap Momen Berharga
          </motion.h1>

          {/* Short Compelling Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-base sm:text-lg text-stone-200 max-w-2xl font-light leading-relaxed [text-wrap:balance]"
          >
            Dari perhelatan gala agung hingga santap siang korporat presisi, Savoria menghadirkan cita rasa autentik dengan sentuhan estetika mewah dan keramahan hangat.
          </motion.p>

          {/* Key Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            {/* Primary CTA: Lihat Produk */}
            <button
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase shadow-lg shadow-amber-950/40 hover:shadow-amber-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <UtensilsCrossed className="w-4 h-4 text-stone-950" />
              <span>Lihat Produk &amp; Menu</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>

            {/* Secondary CTA: Sign In / Login */}
            <button
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-stone-100 border border-white/20 font-medium text-xs tracking-wider uppercase backdrop-blur-sm transition-all hover:border-white/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-200" />
              <span>Sign In / Login</span>
            </button>
          </motion.div>

          {/* Trust Markers Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 pt-8 border-t border-white/10 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-stone-300 text-xs"
          >
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <ChefHat className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Koki Eksekutif Berpengalaman</span>
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Sertifikasi Halal &amp; HACCP</span>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Garansi Tepat Waktu 99.8%</span>
            </div>
          </motion.div>

        </div>

      </section>

      {/* 2. THE ESSENCE OF HOSPITALITY (COZY & FANCY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
            Filosofi Jamuan Savoria
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 mt-2">
            Kehangatan Suasana di Balik Setiap Sajian
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
            Menghadirkan kenyamanan perjamuan yang tak lekang oleh waktu melalui racikan rempah murni, keindahan tata saji, dan sentuhan keramahan personal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-stone-200/90 shadow-xs text-center space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center ring-8 ring-amber-50/50">
              <ChefHat className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Cita Rasa Otentik Warisan
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Bumbu rempah Nusantara diolah perlahan dengan standar kuliner modern untuk melahirkan kelezatan yang meresap sempurna.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-stone-200/90 shadow-xs text-center space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center ring-8 ring-amber-50/50">
              <Wine className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Presentasi Meja Menawan
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Sentuhan dekorasi meja perjamuan dengan chafing dish tembaga berpemanas, ornamen kayu jati, dan bunga segar nan asri.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-stone-200/90 shadow-xs text-center space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center ring-8 ring-amber-50/50">
              <Heart className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Keramahan Penuh Ketulusan
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Kru banquet berstandar hospitality bintang lima yang senantiasa siap melayani tamu dengan santun, sigap, dan hangat.
            </p>
          </div>
        </div>
      </section>

      {/* 3. ATMOSPHERIC CATERING GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
              Inspirasi Suasana
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Ragam Konsep Perjamuan Istimewa
            </h2>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Buka Katalog Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Royal Prasmanan & Gala',
              subtitle: 'Resepsi & Grand Event',
              desc: 'Pilihan hidangan megah dengan live carving station dan tatanan meja mewah.',
              img: buffetImg,
            },
            {
              title: 'Artisanal Canapés & High Tea',
              subtitle: 'Coffee Break & Intimate',
              desc: 'Tartlet salmon lembut dan hidangan pencuci mulut anggun untuk momen berharga.',
              img: canapesImg,
            },
            {
              title: 'Tumpeng Syukuran Keraton',
              subtitle: 'Tradisi & Rasa Syukur',
              desc: 'Nasi kuning harum beraroma pandan dengan lauk lengkap warisan Nusantara.',
              img: tumpengImg,
            },
            {
              title: 'Executive Bento Lunch Box',
              subtitle: 'Corporate & VIP Lunch',
              desc: 'Bento box ramah lingkungan dengan kemasan eksklusif dan menu bernutrisi tinggi.',
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
                  <h4 className="font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors text-base">
                    {exp.title}
                  </h4>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed font-light">
                    {exp.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-900 font-semibold">
                  <span>Lihat di Katalog</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
