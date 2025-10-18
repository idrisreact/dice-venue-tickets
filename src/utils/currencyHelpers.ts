import type { DiceEvent } from '../types/event';

interface CurrencyConfig {
  currency: string;
  locale: string;
  symbol: string;
}

const COUNTRY_CURRENCY_MAP: Record<string, CurrencyConfig> = {
  GBR: { currency: 'GBP', locale: 'en-GB', symbol: '£' },
  USA: { currency: 'USD', locale: 'en-US', symbol: '$' },
  CAN: { currency: 'CAD', locale: 'en-CA', symbol: 'CA$' },
  FRA: { currency: 'EUR', locale: 'fr-FR', symbol: '€' },
  DEU: { currency: 'EUR', locale: 'de-DE', symbol: '€' },
  IRL: { currency: 'EUR', locale: 'en-IE', symbol: '€' },
  ITA: { currency: 'EUR', locale: 'it-IT', symbol: '€' },
  ESP: { currency: 'EUR', locale: 'es-ES', symbol: '€' },
  NLD: { currency: 'EUR', locale: 'nl-NL', symbol: '€' },
  BEL: { currency: 'EUR', locale: 'nl-BE', symbol: '€' },
  AUT: { currency: 'EUR', locale: 'de-AT', symbol: '€' },
  PRT: { currency: 'EUR', locale: 'pt-PT', symbol: '€' },
  CHE: { currency: 'CHF', locale: 'de-CH', symbol: 'CHF' },
  SWE: { currency: 'SEK', locale: 'sv-SE', symbol: 'kr' },
  NOR: { currency: 'NOK', locale: 'nb-NO', symbol: 'kr' },
  DNK: { currency: 'DKK', locale: 'da-DK', symbol: 'kr' },
  POL: { currency: 'PLN', locale: 'pl-PL', symbol: 'zł' },
  CZE: { currency: 'CZK', locale: 'cs-CZ', symbol: 'Kč' },
  AUS: { currency: 'AUD', locale: 'en-AU', symbol: 'A$' },
  NZL: { currency: 'NZD', locale: 'en-NZ', symbol: 'NZ$' },
  JPN: { currency: 'JPY', locale: 'ja-JP', symbol: '¥' },
  SGP: { currency: 'SGD', locale: 'en-SG', symbol: 'S$' },
  HKG: { currency: 'HKD', locale: 'zh-HK', symbol: 'HK$' },
  MEX: { currency: 'MXN', locale: 'es-MX', symbol: 'MX$' },
  BRA: { currency: 'BRL', locale: 'pt-BR', symbol: 'R$' },
  ARG: { currency: 'ARS', locale: 'es-AR', symbol: 'AR$' },
};

const DEFAULT_CURRENCY_CONFIG: CurrencyConfig = {
  currency: 'GBP',
  locale: 'en-GB',
  symbol: '£',
};

export function getCurrencyConfigFromEvent(event: DiceEvent): CurrencyConfig {
  if (event.venues && event.venues.length > 0) {
    const countryCode = event.venues[0].city.country_alpha3;
    if (countryCode && COUNTRY_CURRENCY_MAP[countryCode]) {
      return COUNTRY_CURRENCY_MAP[countryCode];
    }
  }

  return DEFAULT_CURRENCY_CONFIG;
}

export function getCurrencyConfig(countryCode?: string): CurrencyConfig {
  if (countryCode && COUNTRY_CURRENCY_MAP[countryCode]) {
    return COUNTRY_CURRENCY_MAP[countryCode];
  }
  return DEFAULT_CURRENCY_CONFIG;
}

export function formatPriceForEvent(amount: number, event: DiceEvent): string {
  const config = getCurrencyConfigFromEvent(event);
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(amount);
}

export function getLocaleFromEvent(event: DiceEvent): string {
  const config = getCurrencyConfigFromEvent(event);
  return config.locale;
}

export function isEurozoneEvent(event: DiceEvent): boolean {
  const config = getCurrencyConfigFromEvent(event);
  return config.currency === 'EUR';
}
