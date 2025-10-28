import React, { useEffect, useRef, useState } from "react";
import { fetchCurrentWeatherByCity } from "./api";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ErrorMessage from "./components/ErrorMessage";
import RecentSearches from "./components/RecentSearches";

const AUTO_REFRESH_MS = 1000 * 60 * 5;

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
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-100 px-4 py-10 relative">
      <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-md tracking-wide">
            Weather Dashboard
          </h1>
          <p className="text-gray-300 text-sm md:text-base mt-2">
            Search any city to get current weather 🌆
          </p>
        </header>
      {/* Floating Search Section */}
      <div className="w-full max-w-xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-4 mb-10 animate-fadeIn">
        <SearchBar onSearch={onSearch} />
        <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-gray-200 font-medium text-sm">Units:</label>
            <select
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="bg-gray-900/60 border border-gray-600 text-gray-100 rounded-md px-3 py-1 text-sm hover:bg-gray-800 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
            >
              <option value="metric">Metric (°C, km/h)</option>
              <option value="imperial">Imperial (°F, mph)</option>
            </select>
          </div>

          <button
            onClick={manualRefresh}
            className="px-4 py-1 rounded-md bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 transition-all text-sm"
          >
            Refresh
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {loading && <div className="text-cyan-400 font-medium animate-pulse">Loading...</div>}
          <ErrorMessage message={error} />
          <RecentSearches items={recent} onSelect={onRecentClick} />
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-center w-full">
        {data ? (
          <WeatherCard data={data} units={units} onRefresh={manualRefresh} />
        ) : (
          <div className="text-center text-gray-300 p-10 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20 animate-fadeIn">
            <div className="text-xl font-semibold mb-1">No city selected</div>
            <div className="text-sm">Search for a city to view weather details</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-400 text-sm">
        Auto-refresh every {Math.round(AUTO_REFRESH_MS / 60000)} minutes · Data from OpenWeatherMap
      </footer>
    </div>
  );
}
