import type { DiceEvent } from "../../types/event";
import EventCard from "../EventCard";

interface EventGridProps {
  events: DiceEvent[];
}

export function EventGrid({ events }: EventGridProps) {
  return (
    <div>
      {events.length > 0 && events[0].venue && (
        <h1 className="text-3xl mb-8">Upcoming events at {events[0].venue}</h1>
      )}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start"
        role="list"
        aria-label="Events list"
      >
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
