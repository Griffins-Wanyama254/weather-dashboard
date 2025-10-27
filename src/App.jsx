import React, { useEffect, useRef, useState } from "react";
import { fetchCurrentWeatherByCity } from "./api";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ErrorMessage from "./components/ErrorMessage";
import RecentSearches from "./components/RecentSearches";

const AUTO_REFRESH_MS = 1000 * 60 * 5; // 5 minutes

export default function App() {
  const [units, setUnits] = useState(() => localStorage.getItem("units") || "metric");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recentSearches") || "[]");
    } catch {
      return [];
    }
  });

  const lastCityRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("units", units);
    resetAutoRefresh();
  }, [units]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function resetAutoRefresh() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (lastCityRef.current) {
      timerRef.current = setInterval(() => {
        fetchForCity(lastCityRef.current, { silent: true });
      }, AUTO_REFRESH_MS);
    }
  }

  async function fetchForCity(city, opts = {}) {
    setError("");
    if (!city) return;
    if (!opts.silent) setLoading(true);
    try {
      const r = await fetchCurrentWeatherByCity(city, units);
      setData(r);
      lastCityRef.current = city;
      setRecent(prev => {
        const next = [city, ...prev.filter(x => x.toLowerCase() !== city.toLowerCase())].slice(0, 6);
        localStorage.setItem("recentSearches", JSON.stringify(next));
        return next;
      });
      resetAutoRefresh();
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
    } finally {
      if (!opts.silent) setLoading(false);
    }
  }

  function onSearch(city) {
    fetchForCity(city);
  }

  function onRecentClick(city) {
    fetchForCity(city);
  }

  function manualRefresh() {
    if (lastCityRef.current) fetchForCity(lastCityRef.current);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-sky-500 to-cyan-400 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white/15 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-10 border border-white/20">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2 tracking-wide">
            Weather Dashboard
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            Search any city to get current weather 🌦️
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col">
            <SearchBar onSearch={onSearch} />

            <div className="mt-4 flex gap-3 items-center">
              <label className="text-white font-medium text-sm">Units:</label>
              <select
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="border border-white/30 bg-white/20 text-white rounded-md px-3 py-1 text-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="metric">Metric (°C, km/h)</option>
                <option value="imperial">Imperial (°F, mph)</option>
              </select>

              <button
                onClick={manualRefresh}
                className="ml-auto px-4 py-1 rounded-md bg-white/30 text-white font-medium hover:bg-white/40 transition-colors"
              >
                Refresh
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {loading && <div className="text-white font-medium animate-pulse">Loading...</div>}
              <ErrorMessage message={error} />
              <RecentSearches items={recent} onSelect={onRecentClick} />
            </div>
          </div>

          <div className="flex items-center justify-center">
            {data ? (
              <WeatherCard data={data} units={units} onRefresh={manualRefresh} />
            ) : (
              <div className="text-center text-white/80 p-6 rounded-xl bg-white/20 backdrop-blur-md shadow-inner">
                <div className="text-lg font-semibold">No city selected</div>
                <div className="text-sm mt-2">Search for a city to view weather details</div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-10 text-center text-white/70 text-sm">
          Auto-refresh every {Math.round(AUTO_REFRESH_MS / 60000)} minutes · Data from OpenWeatherMap
        </footer>
      </div>
    </div>
  );
}
