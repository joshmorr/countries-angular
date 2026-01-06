import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private readonly countryService = inject(CountryService);

  protected readonly filteredCountries = this.countryService.filteredCountries;
  protected readonly uniqueRegions = this.countryService.uniqueRegions;
  protected readonly searchTerm = signal('');
  protected readonly selectedRegion = signal('');

  ngOnInit(): void {
    this.countryService.loadCountries().subscribe();
  }

  protected onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.countryService.setSearchTerm(value);
  }

  protected onRegionChange(value: string): void {
    this.selectedRegion.set(value);
    this.countryService.setRegion(value);
  }

  protected getCountryRoute(country: Country): string[] {
    return ['/country', country.alpha3Code];
  }

  protected formatPopulation(population: number): string {
    return new Intl.NumberFormat('en-US').format(population);
  }
}
