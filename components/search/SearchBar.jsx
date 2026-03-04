"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ initialValue = "" }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!value.trim()) return;

    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto flex items-center border border-border-default rounded-full px-4 py-2 bg-bg-page"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search plants, seeds, tools..."
        className="flex-1 bg-transparent outline-none text-sm"
      />

      <button
        type="submit"
        className="ml-3 text-action-primary font-medium"
      >
        Search
      </button>
    </form>
  );
}
