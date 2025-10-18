import type { DiceEvent, DiceApiResponse } from '../../types/event';

export const mockEvent: DiceEvent = {
  id: '1',
  name: 'Test Event',
  date: '2025-12-31T20:00:00Z',
  event_images: {
    square: 'https://example.com/image.jpg',
    landscape: 'https://example.com/landscape.jpg',
  },
  venue: 'Test Venue',
  description: 'A test event description',
  featured: false,
  price: 25,
  apple_music_tracks: [],
  spotify_tracks: [],
  lineup: [
    { details: 'Artist 1', time: '20:00' },
    { details: 'Artist 2', time: '21:00' },
  ],
  ticket_types: [
    {
      id: 1,
      name: 'General Admission',
      price: {
        total: 2500,
        fees: 250,
        face_value: 2250,
      },
      sold_out: false,
    },
  ],
};

export const mockEvents: DiceEvent[] = Array.from({ length: 12 }, (_, i) => ({
  ...mockEvent,
  id: `${i + 1}`,
  name: i < 3 ? `Test Event ${i === 0 ? '' : i + 1}`.trim() : `Test Event ${i + 1}`,
  featured: i === 1,
}));

export const mockApiResponse: DiceApiResponse = {
  data: mockEvents,
  links: {
    first: 'https://api.example.com/events?page=1',
    last: 'https://api.example.com/events?page=5',
    prev: null,
    next: 'https://api.example.com/events?page=2',
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 5,
    path: 'https://api.example.com/events',
    per_page: 12,
    to: 12,
    total: 50,
  },
};

export const mockEmptyApiResponse: DiceApiResponse = {
  data: [],
  links: {
    first: 'https://api.example.com/events?page=1',
    last: 'https://api.example.com/events?page=1',
    prev: null,
    next: null,
  },
  meta: {
    current_page: 1,
    from: 0,
    last_page: 1,
    path: 'https://api.example.com/events',
    per_page: 12,
    to: 0,
    total: 0,
  },
};
