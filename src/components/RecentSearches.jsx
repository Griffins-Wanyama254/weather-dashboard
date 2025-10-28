import React from "react";

export default function RecentSearches({ items = [], onSelect }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="text-sm text-white/80 mb-2">Recent searches</div>
      <div className="flex gap-2 flex-wrap">
        {items.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className="px-3 py-1 border border-white/50 rounded-full text-sm text-white/90 hover:bg-white/20 transition-colors"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
