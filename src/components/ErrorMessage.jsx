import React from "react";

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="text-red-400 bg-red-900/20 px-3 py-1 rounded-md text-sm">
      {message}
    </div>
  );
}
