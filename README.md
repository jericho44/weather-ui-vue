# Weather UI (Vue 3 + Vite + Tailwind)

Frontend terpisah untuk **Go Weather API**. Dibangun dengan **Vue 3**, **Vite**, dan **TailwindCSS**.

## 🚀 Ringkas

- Dev server via **Vite** (`npm run dev`)
- Build **produksi** (`npm run build`) + **preview** (`npm run preview`)
- Image **Docker** production (Nginx) + cara jalaninnya
  (`docker build -t weather-ui:local .`) dan jalankan container (`docker run --rm -p 8081:80 weather-ui:local`)

---

## ✅ Prasyarat

- **Node.js ≥ 18** (direkomendasikan 20 LTS)
- **npm** (bawaan Node)
- Backend Go Weather API aktif (default: `http://localhost:8080`)

Cek versi:

```bash
node -v
npm -v
```
