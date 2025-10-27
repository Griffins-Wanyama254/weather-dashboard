import React, { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "Enter city name" }) {
  const [q, setQ] = useState("");

  function submit(e) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    setQ("");
  }

  return (
    <form onSubmit={submit} className="flex gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:bg-white/25 transition-all"
        aria-label="City name"
      />
      <button
        type="submit"
        className="px-5 py-2 rounded-lg bg-cyan-500 text-white font-semibold shadow-md hover:bg-cyan-600 hover:shadow-lg transition-all"
      >
        Search
      </button>
    </form>
  );
}
