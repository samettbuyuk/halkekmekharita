import React from 'react';
import { Map, Home, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-rose-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-rose-200 group-hover:scale-105 transition-transform">
              İHE
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 leading-none tracking-tight">İstanbul Halk Ekmek</h1>
              <span className="text-[10px] text-rose-600 font-bold tracking-widest uppercase mt-0.5 block">Dijital Durak Haritası</span>
            </div>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <Link to="/" className={`text-sm font-bold transition-all ${isActive('/') ? 'text-rose-600 bg-rose-50 px-4 py-2 rounded-full' : 'text-slate-600 hover:text-rose-600'}`}>
              Anasayfa
            </Link>
            <Link to="/about" className={`text-sm font-bold transition-all ${isActive('/about') ? 'text-rose-600 bg-rose-50 px-4 py-2 rounded-full' : 'text-slate-600 hover:text-rose-600'}`}>
              Hakkımızda
            </Link>
            <Link to="/map" className={`hidden sm:flex items-center space-x-2 px-6 py-2.5 bg-rose-600 text-white rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 hover:shadow-rose-300 active:scale-95 transition-all`}>
              <Map size={18} />
              <span>Hemen Bul</span>
            </Link>
            <Link to="/map" className="sm:hidden w-10 h-10 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-200">
              <Map size={20} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
