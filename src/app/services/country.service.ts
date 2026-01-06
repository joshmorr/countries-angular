import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal, computed } from '@angular/core';
import { Observable, map, forkJoin, of, switchMap } from 'rxjs';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';
  private readonly countries = signal<Country[]>([]);
  private readonly searchTerm = signal<string>('');
  private readonly selectedRegion = signal<string>('');

  readonly allCountries = this.countries.asReadonly();
  readonly search = this.searchTerm.asReadonly();
  readonly region = this.selectedRegion.asReadonly();

  readonly filteredCountries = computed(() => {
    let filtered = this.countries();

    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      filtered = filtered.filter(
        country =>
          country.name.toLowerCase().includes(search) ||
          country.capital?.toLowerCase().includes(search)
      );
    }

    const region = this.selectedRegion();
    if (region) {
      filtered = filtered.filter(country => country.region === region);
    }

    return filtered;
  });

  readonly uniqueRegions = computed(() => {
    const regions = new Set(this.countries().map(c => c.region));
    return Array.from(regions).sort();
  });

  loadCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries`).pipe(
      map(countries => {
        this.countries.set(countries);
        return countries;
      })
    );
  }

  getCountryByCode(code: string): Observable<Country | undefined> {
    // First check if we have it in cache
    const cached = this.countries().find(
      c => c.alpha3Code === code || c.alpha2Code === code
    );
    
    if (cached) {
      return of(cached);
    }

    // Otherwise fetch from API
    return this.http.get<Country[]>(`${this.apiUrl}/countries?alpha3Code=${code}`).pipe(
      switchMap(countries => {
        if (countries.length > 0) {
          return of(countries[0]);
        }
        // Try alpha2Code if alpha3Code didn't work
        return this.http.get<Country[]>(`${this.apiUrl}/countries?alpha2Code=${code}`).pipe(
          map(countries => countries.length > 0 ? countries[0] : undefined)
        );
      })
    );
  }

  getCountriesByCodes(codes: string[]): Observable<Country[]> {
    if (codes.length === 0) {
      return of([]);
    }

    // Try to get from cache first
    const cached = codes
      .map(code => this.countries().find(
        c => c.alpha3Code === code || c.alpha2Code === code
      ))
      .filter((c): c is Country => c !== undefined);

    if (cached.length === codes.length) {
      return of(cached);
    }

    // Otherwise fetch from API
    const requests = codes.map(code => 
      this.http.get<Country[]>(`${this.apiUrl}/countries?alpha3Code=${code}`).pipe(
        map(countries => countries.length > 0 ? countries[0] : undefined)
      )
    );

    return forkJoin(requests).pipe(
      map(countries => countries.filter((c): c is Country => c !== undefined))
    );
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setRegion(region: string): void {
    this.selectedRegion.set(region);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedRegion.set('');
  }
}
