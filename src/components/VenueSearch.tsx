import { useState } from "react";

interface VenueSearchProps {
  onSearch: (venue: string) => void;
}

export default function VenueSearch({ onSearch }: VenueSearchProps) {
  const [venue, setVenue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(venue);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="Enter venue name (e.g., Alexandra Palace, O2 Academy)..."
          className="flex-1 px-4 py-3  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-8 py-3 bg-[#3C74FF] text-white  hover:bg-blue-700 transition-colors font-medium"
        >
          Search
        </button>
      </div>
    </form>
  );
}
