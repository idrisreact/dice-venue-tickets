import type { DiceEvent } from "../types/event";
import {
  formatCurrencyForEvent,
  formatEventDate,
  formatEventTime,
  formatSaleDate,
  getEventMinPrice,
  getOptimizedImageUrl,
  hasAudioClips,
  isEventOnSale,
} from "../utils/eventHelpers";
import { EventCardImage } from "./EventCard/EventCardImage";
import { EventCardDetails } from "./EventCard/EventCardDetails";
import { EventCardActions } from "./EventCard/EventCardActions";

interface EventCardProps {
  event: DiceEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const hasAudioClip = hasAudioClips(event);
  const isOnSale = isEventOnSale(event.sale_start_date);
  const isFeatured = event.featured || false;
  const optimizedImageUrl = getOptimizedImageUrl(event);
  const minPrice = getEventMinPrice(event);
  const formattedMinPrice = formatCurrencyForEvent(minPrice, event);
  const eventDate = formatEventDate(event.date);
  const eventTime = formatEventTime(event.date);
  const saleDate = formatSaleDate(event.sale_start_date);
  const saleTime = formatEventTime(event.sale_start_date);

  const cityName = event.venues?.[0]?.city?.name;
  const countryCode = event.venues?.[0]?.city?.country_alpha3;

  return (
    <div className="bg-white  overflow-hidden hover:shadow-lg transition-shadow flex flex-col w-full">
      <EventCardImage
        imageUrl={optimizedImageUrl}
        eventName={event.name}
        isFeatured={isFeatured}
        hasAudioClip={hasAudioClip}
        isOnSale={isOnSale}
        saleDate={saleDate}
        saleTime={saleTime}
      />

      <div className="p-3 flex flex-col flex-1">
        <div className="text-lg  mb-1">
          {eventDate} — {eventTime}
        </div>

        <h3 className="text-2xl font-bold mb-2 line-clamp-2">{event.name}</h3>

        {event.venue && <p className="text-sm font-bold">{event.venue}</p>}
        {cityName && countryCode && (
          <p className="text-sm">
            {cityName}, {countryCode}
          </p>
        )}

        <EventCardDetails event={event} />

        <EventCardActions
          isOnSale={isOnSale}
          formattedPrice={formattedMinPrice}
        />
      </div>
    </div>
  );
}
