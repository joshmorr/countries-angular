export interface NativeName {
  official: string;
  common: string;
}

export interface Name {
  common: string;
  official: string;
  nativeName: Record<string, NativeName>;
}

export interface Currency {
  symbol: string;
  name: string;
}

export interface Flags {
  png: string;
  svg: string;
  alt?: string;
}

export interface CountryApiResponse {
  name: Name;
  tld: string[];
  cca3: string;
  currencies?: Record<string, Currency>;
  capital: string[];
  region: string;
  subregion: string;
  languages: Record<string, string>;
  borders?: string[];
  population: number;
  flags: Flags;
}

export type CountryOverviewApiResponse = Pick<CountryApiResponse, 'name' | 'cca3' | 'flags' | 'population' | 'region' | 'capital'>;

export interface MappedCountryDetail {
  nativeName: string;
  population: number;
  region: string;
  subRegion: string;
  capital: string;
  topLevelDomain: string;
  currencies: string;
  languages: string;
}
