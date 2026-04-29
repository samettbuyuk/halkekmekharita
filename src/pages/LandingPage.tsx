import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Phone, Info, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <span>İstanbul Genelinde 3.200+ Nokta</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-slate-900 leading-[0.95] mb-8">
              Sofranıza En <br />
              <span className="text-rose-600">Yakın Büfe.</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-xl font-medium leading-relaxed">
              İstanbul'un her köşesindeki Halk Ekmek büfelerini dijital haritada keşfedin. 
              Saniyeler içinde konumunuzu bulun ve sağlıklı ekmeğe ulaşın.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/map"
                className="inline-flex items-center justify-center px-10 py-5 bg-rose-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-rose-200 hover:bg-rose-700 hover:-translate-y-1 transition-all group"
              >
                Haritayı Keşfet
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm"
              >
                Hakkımızda
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, type: "spring" }}
            className="relative"
          >
            <div className="relative z-10 p-4 bg-white rounded-[40px] shadow-2xl border border-slate-100 mt-12 lg:mt-0">
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544650030-3c9baf624244?auto=format&fit=crop&q=80&w=1000"
                  alt="Bread"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 p-6 bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 max-w-[240px]">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Anlık Veri</p>
                    <p className="text-white font-bold italic text-sm">"Sağlıklı Ekmek Herkese"</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-200/40 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-200/30 rounded-full blur-[100px] -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Heart className="text-rose-600" />}
              title="Toplumsal Fayda"
              description="Her sofrada eşitlik ve sağlık için çalışıyor, İstanbul'un dayanışma ruhunu her sabah taze ekmekle perçinliyoruz."
            />
            <FeatureCard
              icon={<Phone className="text-rose-600" />}
              title="Anında İletişim"
              description="Büfe yetkililerine tek tıkla ulaşın, telefon bilgilerini anında harita üzerinden görüntüleyin."
            />
            <FeatureCard
              icon={<Info className="text-rose-600" />}
              title="Modern Deneyim"
              description="Hızlı, akıcı ve mobil uyumlu haritamızla ekmeğe ulaşmanın en kısa yolunu keşfedin."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group">
      <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-rose-50 group-hover:border-rose-100 transition-all duration-500 transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-2xl font-extrabold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-600 font-medium leading-relaxed opacity-80">{description}</p>
    </div>
  );
}
