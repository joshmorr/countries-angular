import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { CountryOverview } from '../../models/country.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly countryService = inject(CountryService);

  protected readonly countryOverviews = computed(() => {
    const countries = this.countryService.countryOverviews.value() ?? [];
    const selectedRegion = this.selectedRegion();
    let filteredCountries = countries;

    if (selectedRegion) {
      filteredCountries = countries.filter(country => country.region === selectedRegion);
    }

    return [...filteredCountries].sort((a, b) => a.name.common.localeCompare(b.name.common));
  });
  protected readonly searchTerm = signal('');
  protected readonly selectedRegion = signal('');
  protected readonly uniqueRegions = computed(() => {
    const countries = this.countryService.countryOverviews.value();
    return [...new Set(countries?.map(country => country.region) ?? [])];
  });

  
  protected onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.countryService.setSearchTerm(value);
  }

  protected onRegionChange(value: string): void {
    this.selectedRegion.set(value);
  }

  protected getCountryRoute(country: CountryOverview): string[] {
    return ['/country', country.cca3];
  }

  protected formatPopulation(population: number): string {
    return new Intl.NumberFormat('en-US').format(population);
  }
}
