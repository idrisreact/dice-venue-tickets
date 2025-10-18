import { useState } from "react";
import "./App.css";
import VenueSearch from "./components/VenueSearch";
import EventList from "./components/EventList";

function App() {
  const [venue, setVenue] = useState<string | undefined>(undefined);

  const handleSearch = (searchVenue: string) => {
    setVenue(searchVenue);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          DICE Events
        </h1>
        <VenueSearch onSearch={handleSearch} />
        <EventList venue={venue} />
      </div>
    </div>
  );
}

export default App;
