import React from "react";

export default function WeatherCard({ data, units = "metric", onRefresh }) {
  if (!data) return null;

  const { name, sys, main, weather, wind } = data;
  const weatherItem = weather && weather[0];
  const icon = weatherItem?.icon;
  const desc = weatherItem?.description || "";
  const tempUnit = units === "metric" ? "°C" : "°F";
  const windSpeed = wind?.speed ?? 0;
  const windDisplay =
    units === "metric"
      ? (windSpeed * 3.6).toFixed(1) + " km/h"
      : (windSpeed * 2.237).toFixed(1) + " mph";

  return (
    <div className="bg-gray-900/60 border border-gray-700/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-2xl font-semibold text-cyan-400">
            {name}
            {sys?.country ? `, ${sys.country}` : ""}
          </div>
          <div className="text-sm text-gray-300 capitalize">{desc}</div>
        </div>
        {icon && (
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={desc}
            className="w-20 h-20 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]"
          />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-6">
        <div>
          <div className="text-6xl font-bold text-white tracking-tight">
            {Math.round(main?.temp ?? 0)}
            {tempUnit}
          </div>
          <div className="text-sm text-gray-400">
            Feels like {Math.round(main?.feels_like ?? 0)}
            {tempUnit}
          </div>
        </div>
        <div className="text-sm text-gray-300 space-y-1">
          <div>💧 Humidity: <span className="font-medium">{main?.humidity ?? "-"}%</span></div>
          <div>🌬️ Wind: <span className="font-medium">{windDisplay}</span></div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onRefresh}
          className="px-5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 transition-all text-sm"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
