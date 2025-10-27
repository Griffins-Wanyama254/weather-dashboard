const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE = "https://api.openweathermap.org/data/2.5";

async function request(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData.message || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchCurrentWeatherByCity(city, units = "metric") {
  if (!API_KEY) throw new Error("Missing OpenWeatherMap API key. Set VITE_OWM_API_KEY in .env");
  if (!city) throw new Error("City is required");
  const url = `${BASE}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`;
  return request(url);
}
