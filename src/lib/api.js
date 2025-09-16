// src/lib/api.js
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export function getCurrent({ lat, lon, unit }) {
  const u = new URL('/api/v1/weather/current', BASE);
  u.searchParams.set('lat', lat);
  u.searchParams.set('lon', lon);
    if (unit) u.searchParams.set('unit', unit);
  return getJSON(u.toString());
}

export function getForecast({ lat, lon, days = 3, unit }) {
  const u = new URL('/api/v1/weather/forecast', BASE);
  u.searchParams.set('lat', lat);
  u.searchParams.set('lon', lon);
  u.searchParams.set('days', days);
  if (unit) u.searchParams.set('unit', unit);
  return getJSON(u.toString());
}
