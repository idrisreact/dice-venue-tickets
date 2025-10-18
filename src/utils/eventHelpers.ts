import type { DiceEvent, TicketType } from '../types/event';
import { getCurrencyConfigFromEvent } from './currencyHelpers';

export function formatCurrency(
  amount: number,
  locale: string = 'en-GB',
  currency: string = 'GBP'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatCurrencyForEvent(
  amount: number,
  event: DiceEvent
): string {
  const config = getCurrencyConfigFromEvent(event);
  return formatCurrency(amount, config.locale, config.currency);
}

export function getMinimumTicketPrice(tickets: TicketType[]): number {
  if (!tickets || tickets.length === 0) {
    return 0;
  }
  return Math.min(...tickets.map((ticket) => ticket.price.total)) / 100;
}

export function getEventMinPrice(event: DiceEvent, fallbackPrice: number = 12): number {
  if (event.ticket_types && event.ticket_types.length > 0) {
    return getMinimumTicketPrice(event.ticket_types);
  }

  if (typeof event.price === 'number') {
    return event.price;
  }

  if (typeof event.price === 'string') {
    const parsed = parseFloat(event.price);
    return isNaN(parsed) ? fallbackPrice : parsed;
  }

  return fallbackPrice;
}

export function formatEventDate(dateString: string | undefined, locale: string = 'en-GB'): string {
  if (!dateString) return '';

  return new Date(dateString).toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatEventTime(dateString: string | undefined, locale: string = 'en-GB'): string {
  if (!dateString) return '';

  return new Date(dateString).toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatSaleDate(dateString: string | undefined, locale: string = 'en-GB'): string {
  if (!dateString) return '';

  return new Date(dateString).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
  });
}

export function isEventOnSale(saleDateString: string | undefined): boolean {
  if (!saleDateString) return false;
  return new Date(saleDateString) > new Date();
}

export function hasAudioClips(event: DiceEvent): boolean {
  return Boolean(
    (event.apple_music_tracks && event.apple_music_tracks.length > 0) ||
    (event.spotify_tracks && event.spotify_tracks.length > 0)
  );
}

export function getOptimizedImageUrl(
  event: DiceEvent,
  width: number = 400,
  height: number = 400
): string | null {
  const imageUrl = event.event_images?.landscape || event.event_images?.square;
  if (!imageUrl) return null;

  return `${imageUrl}?w=${width}&h=${height}&fit=crop&auto=format,compress`;
}
