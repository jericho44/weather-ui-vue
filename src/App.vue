<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-white border-b">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-semibold">🌤️ Weather UI</h1>
        <span class="text-xs text-slate-500">API: {{ apiBase }}</span>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <form @submit.prevent="fetchAll" class="bg-white rounded-2xl shadow-sm p-4 grid md:grid-cols-5 gap-3 items-end">
        <div>
          <label class="block text-sm text-slate-600 mb-1">Latitude</label>
          <input v-model.number="lat" type="number" step="0.0001" class="input" placeholder="-6.2" />
        </div>
        <div>
          <label class="block text-sm text-slate-600 mb-1">Longitude</label>
          <input v-model.number="lon" type="number" step="0.0001" class="input" placeholder="106.8" />
        </div>
        <div>
          <label class="block text-sm text-slate-600 mb-1">Unit</label>
          <select v-model="unit" class="input">
            <option value="metric">Metric (°C)</option>
            <option value="imperial">Imperial (°F)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-slate-600 mb-1">Days</label>
          <input v-model.number="days" type="number" min="1" max="16" class="input" placeholder="3" />
        </div>
        <div class="flex gap-2">
          <button class="btn-primary w-full" :disabled="loading">Fetch</button>
        </div>
      </form>

      <div v-if="error" class="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
        {{ error }}
      </div>

      <!-- Current -->
      <div v-if="current" class="bg-white rounded-2xl shadow-sm p-4 grid sm:grid-cols-2 gap-4">
        <div>
          <div class="text-slate-500 text-sm">Location / Timezone</div>
          <div class="text-lg font-medium">
            {{ current.location || current.timezone }}
          </div>
          <div class="text-slate-500 text-sm mt-2">Lat / Lon</div>
          <div class="text-sm">
            {{ current.latitude.toFixed(3) }}, {{ current.longitude.toFixed(3) }}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 items-center">
          <div class="text-4xl font-bold">
            {{ current.temperature.toFixed(1) }}° {{ unit === 'imperial' ? 'F' : 'C' }}
          </div>
          <div class="space-y-1 text-sm">
            <div>Feels: <b>{{ current.feels_like.toFixed(1) }}</b></div>
            <div>Humidity: <b>{{ current.humidity.toFixed(0) }}%</b></div>
            <div>Wind: <b>{{ current.wind_speed.toFixed(1) }}</b> {{ unit === 'imperial' ? 'mph' : 'km/h' }}</div>
            <div>Rain: <b>{{ current.precipitation.toFixed(1) }}</b> {{ unit === 'imperial' ? 'in' : 'mm' }}</div>
          </div>
        </div>
      </div>

      <!-- Forecast -->
      <div v-if="forecast" class="bg-white rounded-2xl shadow-sm p-4">
        <div class="font-semibold mb-3">Forecast ({{ days }} days)</div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div v-for="d in forecast.days" :key="d.date" class="rounded-xl border p-3 bg-slate-50">
            <div class="text-sm text-slate-500">{{ d.date }}</div>
            <div class="mt-1 text-lg font-semibold">
              {{ d.t_min.toFixed(1) }}° / {{ d.t_max.toFixed(1) }}° {{ unit === 'imperial' ? 'F' : 'C' }}
            </div>
            <div class="text-sm">Precip: <b>{{ d.precip_sum.toFixed(1) }}</b> {{ unit === 'imperial' ? 'in' : 'mm' }}</div>
          </div>
        </div>
      </div>

      <details class="bg-white rounded-2xl shadow-sm p-4">
        <summary class="cursor-pointer text-slate-700 font-medium">Raw JSON (debug)</summary>
        <pre class="mt-3 text-xs bg-slate-900 text-slate-100 p-3 rounded-lg overflow-auto">{{ { current, forecast } }}</pre>
      </details>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCurrent, getForecast } from './lib/api'

const lat = ref(-6.2)
const lon = ref(106.8)
const unit = ref('metric')
const days = ref(3)
const loading = ref(false)
const error = ref('')
const current = ref(null)
const forecast = ref(null)

const apiBase = computed(() => import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080')

async function fetchAll() {
  loading.value = true
  error.value = ''
  current.value = null
  forecast.value = null
  try {
    const [c, f] = await Promise.all([
      getCurrent({ lat: lat.value, lon: lon.value, unit: unit.value }),
      getForecast({ lat: lat.value, lon: lon.value, days: days.value, unit: unit.value }),
    ])
    current.value = c
    forecast.value = f
  } catch (e) {
    error.value = e.message || String(e)
  } finally {
    loading.value = false
  }
}
fetchAll()
</script>

<style scoped>
.input {
  @apply w-full rounded-xl border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.btn-primary {
  @apply inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50;
}
</style>
