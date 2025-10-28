import React, { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "Search city..." }) {
  const [q, setQ] = useState("");

  function submit(e) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    setQ("");
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center justify-between w-full max-w-md mx-auto bg-white/15 backdrop-blur-lg border border-black/25 rounded-full px-4 py-2 shadow-lg transition-all focus-within:ring-2 focus-within:ring-cyan-300"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-black placeholder-black/70 text-sm md:text-base px-2"
      />
      <button
        type="submit"
        className="ml-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-sm md:text-base hover:from-sky-400 hover:to-blue-500 shadow-md transition-all"
      >
        Search
      </button>
    </form>
  );
}
