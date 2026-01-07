export interface NativeName {
  official: string;
  common: string;
}

export interface Name {
  common: string;
  official: string;
  nativeName: {
    [key: string]: NativeName;
  };
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

export interface Country {
  name: Name;
  tld: string[];
  cca3: string;
  currencies?: {
    [key: string]: Currency;
  };
  capital: string[];
  region: string;
  subregion: string;
  languages: {
    [key: string]: string;
  };
  borders?: string[];
  population: number;
  flags: Flags;
}


export type CountryOverview = Pick<Country, 'name' | 'cca3' | 'flags' | 'population' | 'region' | 'capital'>;