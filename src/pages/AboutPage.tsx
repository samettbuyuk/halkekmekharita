import React from 'react';
import { motion } from 'motion/react';
import { Users, Heart, Shield, Award, Leaf, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight">
              İnsan İçin, <span className="text-rose-600">Toplum İçin.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              İstanbul Halk Ekmek, sadece bir üretim tesisi değil; her sofrada eşitlik, her evde sağlık 
              ve toplumun her kesiminde refah sağlamayı amaçlayan kutsal bir görevdir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                Temel Değerlerimiz ve <br />
                <span className="text-rose-600 font-black">Toplumsal Sorumluluğumuz</span>
              </h2>
              <div className="space-y-6">
                <ValueItem 
                  icon={<Heart className="text-rose-600" />}
                  title="İnsan Odaklılık"
                  text="Her bir İstanbullunun sağlıklı ve besleyici gıdaya erişim hakkını en temel insan hakkı olarak görüyor, üretimimizi bu hassasiyetle yapıyoruz."
                />
                <ValueItem 
                  icon={<Globe className="text-rose-600" />}
                  title="Sosyal Adalet"
                  text="Gelir adaletsizliğinin sofralara yansımasını engellemek için çalışıyor, en kaliteli ekmeği en uygun fiyatla tüm şehre ulaştırıyoruz."
                />
                <ValueItem 
                  icon={<Shield className="text-rose-600" />}
                  title="Güven ve Şeffaflık"
                  text="Modern tesislerimizde, en yüksek hijyen standartlarında üretim yaparak toplumun güvenini her gün yeniden kazanıyoruz."
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white rotate-2">
                <img 
                  src="https://images.unsplash.com/photo-1555507036-31c3b5a0443a?auto=format&fit=crop&q=80&w=1000" 
                  alt="Modern Halk Ekmek Tesisleri" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-rose-100 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-rose-500 mb-4">Toplumsal Etkimiz</h2>
            <p className="text-3xl font-bold italic">"Sağlıklı Nesiller, Mutlu Sofralar"</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <ImpactStat number="1.5M+" label="Günlük Üretim" />
            <ImpactStat number="3000+" label="Satış Noktası" />
            <ImpactStat number="39" label="İlçe Erişimi" />
            <ImpactStat number="5000+" label="Mutlu Çalışan" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-600/20 to-transparent"></div>
      </section>

      {/* Closing Quote */}
      <section className="py-32 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="w-16 h-1 w-16 bg-rose-600 mx-auto mb-12"></div>
          <p className="text-3xl lg:text-4xl font-extrabold text-slate-800 leading-tight">
            "Bizim için her ekmek, bir komşu ilişkisidir. İstanbul'un dayanışma ruhunu fırınlarımızda harlıyoruz."
          </p>
        </div>
      </section>
    </div>
  );
}

function ValueItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex space-x-5 group p-4 rounded-3xl hover:bg-white transition-all border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/50">
      <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-bold text-slate-900 mb-1">{title}</h4>
        <p className="text-slate-600 text-sm font-medium leading-relaxed opacity-80">{text}</p>
      </div>
    </div>
  );
}

function ImpactStat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center p-8 bg-slate-800/50 backdrop-blur-md rounded-[32px] border border-slate-700">
      <div className="text-4xl lg:text-5xl font-black text-rose-500 mb-2 tracking-tighter">{number}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
    </div>
  );
}
