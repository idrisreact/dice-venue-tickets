import { describe, it, expect } from 'vitest';
import {
  getMinimumTicketPrice,
  getEventMinPrice,
  formatCurrencyForEvent,
} from '../eventHelpers';
import type { DiceEvent, TicketType } from '../../types/event';

describe('eventHelpers - Pricing Logic', () => {
  describe('getMinimumTicketPrice', () => {
    it('should return minimum price from multiple tickets', () => {
      const tickets: TicketType[] = [
        {
          id: 1,
          name: 'Early Bird',
          price: { total: 2000, fees: 200, face_value: 1800 },
          sold_out: false,
        },
        {
          id: 2,
          name: 'Regular',
          price: { total: 3000, fees: 300, face_value: 2700 },
          sold_out: false,
        },
      ];

      expect(getMinimumTicketPrice(tickets)).toBe(20);
    });

    it('should convert pence to pounds correctly', () => {
      const tickets: TicketType[] = [
        {
          id: 1,
          name: 'Ticket',
          price: { total: 2500, fees: 250, face_value: 2250 },
          sold_out: false,
        },
      ];

      expect(getMinimumTicketPrice(tickets)).toBe(25);
    });
  });

  describe('getEventMinPrice', () => {
    it('should return minimum from ticket_types when available', () => {
      const event: Partial<DiceEvent> = {
        ticket_types: [
          {
            id: 1,
            name: 'Ticket',
            price: { total: 2500, fees: 250, face_value: 2250 },
            sold_out: false,
          },
        ],
        price: 50,
      };

      expect(getEventMinPrice(event as DiceEvent)).toBe(25);
    });

    it('should fallback to event.price when no tickets', () => {
      const event: Partial<DiceEvent> = {
        price: 30,
      };

      expect(getEventMinPrice(event as DiceEvent)).toBe(30);
    });

    it('should parse string price', () => {
      const event: Partial<DiceEvent> = {
        price: '25.50',
      };

      expect(getEventMinPrice(event as DiceEvent)).toBe(25.5);
    });
  });

  describe('formatCurrencyForEvent', () => {
    it('should format UK event price in GBP', () => {
      const event: Partial<DiceEvent> = {
        venues: [
          {
            id: 123,
            name: 'Troxy',
            url: 'https://dice.fm/venue/troxy',
            city: {
              code: 'london',
              country_alpha3: 'GBR',
              country_id: '123',
              country_name: 'United Kingdom',
              id: '456',
              name: 'London',
            },
          },
        ],
      };

      const result = formatCurrencyForEvent(25, event as DiceEvent);
      expect(result).toBe('£25.00');
    });

    it('should format French event price in EUR', () => {
      const event: Partial<DiceEvent> = {
        venues: [
          {
            id: 123,
            name: 'Olympia',
            url: 'https://dice.fm/venue/olympia',
            city: {
              code: 'paris',
              country_alpha3: 'FRA',
              country_id: '123',
              country_name: 'France',
              id: '456',
              name: 'Paris',
            },
          },
        ],
      };

      const result = formatCurrencyForEvent(25, event as DiceEvent);
      expect(result).toContain('25');
      expect(result).toContain('€');
    });
  });
});
