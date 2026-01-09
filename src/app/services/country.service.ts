import { Injectable, signal } from '@angular/core';
import { CountryApiResponse, CountryOverviewApiResponse } from '../models/country.model';
import { httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  readonly baseUrl = 'https://restcountries.com/v3.1/';

  private readonly searchTerm  = signal<string>('');
  private readonly countryCode = signal<string>('');

  readonly countryOverviews = httpResource<CountryOverviewApiResponse[]>(() => {
    let url = this.baseUrl;
    if (this.searchTerm()) {
      url += `name/${this.searchTerm()}`;
    } else {
      url += 'all';
    }
    return url + `?fields=name,cca3,flags,population,region,capital`;
  });

  readonly countryDetails = httpResource<CountryApiResponse | null>(() => {
    const code = this.countryCode();
    if (!code) return undefined;
    return `${this.baseUrl}alpha/${code}?fields=name,cca3,flags,population,region,subregion,capital,tld,currencies,languages,borders`;
  });

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setCountryCode(code: string): void {
    this.countryCode.set(code.toLowerCase());
  }
}
