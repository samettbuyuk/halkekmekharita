# İstanbul Halk Ekmek (İHE) Haritası

Bu uygulama, İstanbul'daki tüm Halk Ekmek (İHE) büfelerini modern bir arayüz ve interaktif bir harita üzerinde görmenizi sağlar.

## 🚀 Özellikler

- **Canlı Konum Takibi:** Mevcut konumunuzu harita üzerinde görebilirsiniz.
- **Akıllı Sıralama:** Büfeler konumunuza olan uzaklığına göre otomatik olarak sıralanır.
- **En Yakın Büfe:** Tek tıkla size en yakın büfeyi bulur ve yol tarifi başlatır.
- **Detaylı Bilgi:** Büfe adı, tam adresi ve telefon bilgilerine anında erişim.
- **Veri Kaynağı:** Güncel CSV verileri üzerinden anlık veri işleme.
- **Önbellek Sistemi:** Nominatim API üzerinden alınan koordinatlar yerel hafızada (LocalStorage) saklanarak performans artışı sağlar.

## 🛠️ Teknolojiler

- **React 19 + Vite**
- **TypeScript**
- **Tailwind CSS** (Modern Styling)
- **Leaflet.js + OpenStreetMap** (Harita Entegrasyonu)
- **Motion** (Akıcı Animasyonlar)
- **Lucide React** (İkon Seti)

## 📦 Kurulum ve Çalıştırma

1. Projeyi klonlayın:
   ```bash
   git clone <repo-url>
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

4. Yayına hazırlayın (Build):
   ```bash
   npm run build
   ```

## 🌍 Canlı Yayın (Deployment)

Bu proje Vercel, Netlify veya GitHub Pages gibi platformlarda sorunsuz çalışacak şekilde yapılandırılmıştır. Vercel için `vercel.json` yönlendirme kuralları eklenmiştir.

---
*Bu proje toplum yararı gözetilerek modern web teknolojileri ile geliştirilmiştir.*
