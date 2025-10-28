import React from "react";

export default function RecentSearches({ items = [], onSelect }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-md transition-all">
      <div className="text-base font-semibold text-cyan-300 mb-3">
        Recent Searches
      </div>
      <div className="flex flex-wrap gap-3">
        {items.map((city) => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-white/90 text-sm font-medium 
                       border border-white/30 hover:from-cyan-500/50 hover:to-blue-500/50 
                       hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            {/* Example: add small icon here if you have one */}
            {/* <img src="/src/assets/city-icon.png" alt="city" className="inline-block w-4 h-4 mr-1 opacity-80" /> */}
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
