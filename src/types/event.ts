export interface TicketType {
  id: number;
  name: string;
  price: {
    total: number;
    fees: number;
    face_value: number;
  };
  sold_out: boolean;
}

export interface LineupItem {
  details: string;
  time: string;
}

export interface VenueCity {
  code: string;
  country_alpha3: string;
  country_id: string;
  country_name: string;
  id: string;
  name: string;
}

export interface Venue {
  city: VenueCity;
  id: number;
  name: string;
  url: string;
}

export interface DiceEvent {
  id: string;
  name: string;
  date: string;
  event_images?: {
    square?: string;
    landscape?: string;
  };
  venue?: string;
  venues?: Venue[];
  apple_music_tracks?: string[];
  spotify_tracks?: string[];
  sale_start_date?: string;
  description?: string;
  artists?: Array<{
    id: string;
    name: string;
  }>;
  featured?: boolean;
  price?: number | string;
  lineup?: LineupItem[];
  ticket_types?: TicketType[];
}

export interface DiceApiResponse {
  data: DiceEvent[];
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    current_page?: number;
    from?: number;
    last_page?: number;
    path?: string;
    per_page?: number;
    to?: number;
    total?: number;
  };
}
