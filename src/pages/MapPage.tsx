import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import { IHEKiosk } from '../types';
import { geocodeAddress } from '../utils/geocoding';
import { MapPin, Search, Phone, Navigation, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Fix for Leaflet default icon markers
// @ts-ignore
import iconUrl from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const BreadIcon = L.divIcon({
  className: 'custom-bread-marker',
  html: `
    <div class="relative group">
      <div class="w-10 h-10 bg-rose-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bread"><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 13v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M21 20H3"/></svg>
      </div>
      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-rose-600 rotate-45 border-r border-b border-white"></div>
    </div>
  `,
  iconSize: [40, 44],
  iconAnchor: [20, 44],
  popupAnchor: [0, -42]
});

const UserIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div class="relative">
      <div class="w-6 h-6 bg-blue-600 rounded-full border-[3px] border-white shadow-2xl"></div>
      <div class="absolute -inset-2 bg-blue-500 rounded-full animate-ping opacity-20"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQPDPM9ISg3Qy-v4DIru3DlIPdxvypdBjrRnkHpW5XgnrumZl12wdTqWFhkXF8-8O6RwYFsnobZm8OX/pub?output=csv';

export default function MapPage() {
  const [kiosks, setKiosks] = useState<IHEKiosk[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [map, setMap] = useState<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestKiosk, setNearestKiosk] = useState<IHEKiosk | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error("Location error:", error),
        { enableHighAccuracy: true }
      );
    }

    const fetchData = async () => {
      try {
        const response = await fetch(CSV_URL);
        const text = await response.text();
        
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            const rawData = results.data as any[];
            
            const processedData: IHEKiosk[] = [];

            for (const item of rawData) {
              const name = item.ADI || item.Adi || item['ADI'] || 'İHE Büfesi';
              const district = item.ILCE || item.Ilce || item['ILCE'] || 'İstanbul';
              const address = item.ADRES || item.Adres || item['ADRES'] || '';
              const phone = item.TELEFON || item.Telefon || item['TELEFON'] || '';
              let lat = parseFloat(item.ENLEM || item.Enlem || item['ENLEM']);
              let lng = parseFloat(item.BOYLAM || item.Boylam || item['BOYLAM']);

              if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
                const coords = await geocodeAddress(address, district);
                if (coords) {
                  lat = coords.lat;
                  lng = coords.lng;
                }
              }

              if (!isNaN(lat) && !isNaN(lng)) {
                processedData.push({
                  id: Math.random().toString(36).substr(2, 9),
                  name,
                  district,
                  address,
                  phone,
                  lat,
                  lng
                });
              }
            }
            
            setKiosks(processedData);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate nearest kiosk when location or kiosks change
  useEffect(() => {
    if (userLocation && kiosks.length > 0) {
      let minDistance = Infinity;
      let closest: IHEKiosk | null = null;

      kiosks.forEach(kiosk => {
        const d = Math.sqrt(
          Math.pow(kiosk.lat - userLocation[0], 2) + 
          Math.pow(kiosk.lng - userLocation[1], 2)
        );
        if (d < minDistance) {
          minDistance = d;
          closest = kiosk;
        }
      });
      setNearestKiosk(closest);
    }
  }, [userLocation, kiosks]);

  const districts = useMemo(() => {
    const d = new Set(kiosks.map(k => k.district));
    return ['all', ...Array.from(d).sort()];
  }, [kiosks]);

  const sortedKiosks = useMemo(() => {
    let list = [...kiosks];
    
    // First apply search and district filters
    list = list.filter(k => {
      const matchesSearch = k.name.toLowerCase().includes(search.toLowerCase()) || 
                           k.address.toLowerCase().includes(search.toLowerCase());
      const matchesDistrict = selectedDistrict === 'all' || k.district === selectedDistrict;
      return matchesSearch && matchesDistrict;
    });

    // If user location is available, sort by distance
    if (userLocation) {
      list.sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.lat - userLocation[0], 2) + Math.pow(a.lng - userLocation[1], 2));
        const distB = Math.sqrt(Math.pow(b.lat - userLocation[0], 2) + Math.pow(b.lng - userLocation[1], 2));
        return distA - distB;
      });
    }

    return list;
  }, [kiosks, search, selectedDistrict, userLocation]);

  const handleKioskClick = (kiosk: IHEKiosk) => {
    if (map) {
      map.flyTo([kiosk.lat, kiosk.lng], 17, { duration: 1.5 });
    }
  };

  const centerOnUser = () => {
    if (map && userLocation) {
      map.flyTo(userLocation, 15, { duration: 1 });
    }
  };

  const showNearest = () => {
    if (map && nearestKiosk) {
      map.flyTo([nearestKiosk.lat, nearestKiosk.lng], 18, { duration: 1.5 });
    }
  };

  return (
    <div className="pt-16 h-screen flex flex-col sm:flex-row bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-full sm:w-[350px] lg:w-[400px] h-96 sm:h-auto flex flex-col border-r border-slate-200 bg-white z-10">
        <div className="p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Durak Haritası</h1>
            <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mt-1">İstanbul Halk Ekmek</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Büfe veya adres ara..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all placeholder:text-slate-400 font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <span className="block text-2xl font-black text-rose-600 leading-none">{sortedKiosks.length}</span>
                <span className="text-[10px] text-rose-500 uppercase font-bold tracking-tight">Aktif Büfe</span>
              </div>
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="block text-2xl font-black text-white leading-none">{selectedDistrict === 'all' ? districts.length - 1 : 1}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">İlçe Seçili</span>
              </div>
            </div>

            <select
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer hover:bg-slate-100"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="all">Tüm İstanbul</option>
              {districts.filter(d => d !== 'all').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-300">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-bold uppercase tracking-widest text-[10px]">Veriler Getiriliyor</p>
            </div>
          ) : (
            <>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-4">Sonuçlar</h3>
              {sortedKiosks.map((kiosk, index) => (
                <motion.div
                  key={kiosk.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  className={`p-5 rounded-[24px] cursor-pointer transition-all border ${
                    map?.getCenter().lat === kiosk.lat ? 'bg-rose-50 border-rose-200 shadow-lg shadow-rose-100' : 'bg-white border-slate-100 hover:border-rose-200 hover:bg-slate-50'
                  }`}
                  onClick={() => handleKioskClick(kiosk)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                      <h3 className="font-bold text-slate-900 leading-tight group-hover:text-rose-600 transition-colors">{kiosk.name}</h3>
                      {userLocation && index === 0 && (
                        <span className="text-[9px] font-black text-white bg-blue-600 px-2 py-0.5 rounded-full uppercase w-fit mt-1">En Yakın</span>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full uppercase">{kiosk.district}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{kiosk.address}</p>
                  
                  <div className="flex space-x-2">
                    <button 
                       className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center"
                       onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/dir/?api=1&destination=${kiosk.lat},${kiosk.lng}`, '_blank'); }}
                    >
                      <Navigation size={12} className="mr-2" />
                      Yol Tarifi
                    </button>
                    {kiosk.phone && (
                      <button 
                        className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${kiosk.phone}`; }}
                      >
                        <Phone size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-slate-100">
        <MapContainer
          center={[41.0082, 28.9784]}
          zoom={11}
          className="h-full w-full"
          zoomControl={false}
          ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          
          {userLocation && (
            <Marker position={userLocation} icon={UserIcon}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                Buradasınız
              </Tooltip>
            </Marker>
          )}

          {sortedKiosks.map((kiosk) => (
            <Marker 
              key={kiosk.id} 
              position={[kiosk.lat, kiosk.lng]}
              icon={BreadIcon}
            >
              <Tooltip direction="top" offset={[0, -32]} opacity={1}>
                {kiosk.name}
              </Tooltip>
              <Popup closeButton={false} className="custom-popup">
                <div className="overflow-hidden">
                  <div className="h-2 w-full bg-rose-600"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-extrabold text-xl text-slate-900 leading-tight">{kiosk.name}</h3>
                      <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                        <MapPin size={16} />
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <Info size={14} className="text-slate-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-600 leading-snug">{kiosk.address}</p>
                      </div>
                      
                      {kiosk.phone && (
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <Phone size={14} className="text-slate-500" />
                          </div>
                          <p className="text-sm font-bold text-slate-900 font-mono">{kiosk.phone}</p>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-200 hover:bg-rose-700 hover:shadow-rose-300 transition-all flex items-center justify-center"
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${kiosk.lat},${kiosk.lng}`, '_blank')}
                    >
                      <Navigation size={14} className="mr-2" />
                      Yol Tarifi Al
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <AnimatePresence>
          {!loading && sortedKiosks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white p-10 rounded-[32px] shadow-2xl text-center border border-slate-100 max-w-sm"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Search size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Sonuç Bulunamadı</h2>
              <p className="text-slate-500 mb-8 font-medium">Arama kriterlerinize uygun büfe mevcut değil. Lütfen başka bir ilçe veya büfe adı deneyin.</p>
              <button
                onClick={() => { setSearch(''); setSelectedDistrict('all'); }}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-100"
              >
                Filtreleri Temizle
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map UI Controls */}
        <div className="absolute bottom-10 right-8 z-[1000] flex flex-col space-y-3">
          <button 
            onClick={centerOnUser}
            className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-slate-600 hover:text-blue-600 active:scale-95 transition-all border border-slate-100"
            title="Konumuma Git"
          >
            <Navigation size={24} />
          </button>
          <button 
            onClick={showNearest}
            className="w-14 h-14 bg-rose-600 rounded-2xl shadow-2xl flex items-center justify-center text-white active:scale-95 transition-all hover:bg-rose-700"
            title="En Yakın Büfe"
          >
            <MapPin size={24} />
          </button>
        </div>

        {/* Cache Active Indicator */}
        <div className="absolute top-8 right-8 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xl flex items-center space-x-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </div>
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Lokasyon Servisi Aktif</span>
        </div>
      </div>
    </div>
  );
}
