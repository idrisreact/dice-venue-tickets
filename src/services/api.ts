import type { DiceApiResponse } from '../types/event';

const API_BASE_URL = 'https://partners-endpoint.dice.fm/api/v2';
const API_KEY = import.meta.env.VITE_DICE_API_KEY;

export interface FetchEventsParams {
  venue?: string;
  pageSize?: number;
  page?: number;
}

export const fetchEvents = async ({
  venue,
  pageSize = 12,
  page = 1,
}: FetchEventsParams): Promise<DiceApiResponse> => {
  if (!API_KEY) {
    throw new Error('Missing DICE_API_KEY environment variable');
  }

  const params = new URLSearchParams({
    'page[size]': String(pageSize),
    'page[number]': String(page),
  });

  if (venue) params.append('filter[venues][]', venue);

  const response = await fetch(`${API_BASE_URL}/events?${params.toString()}`, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await safeParseJSON(response);
    throw new Error(
      `Dice API error: ${response.status} ${response.statusText} — ${JSON.stringify(errorBody)}`
    );
  }

  const data = (await response.json()) as DiceApiResponse;
  return data;
};

async function safeParseJSON(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}