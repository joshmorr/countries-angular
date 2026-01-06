import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-country-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly countryService = inject(CountryService);

  protected readonly country = signal<Country | null>(null);
  protected readonly borderCountries = signal<Country[]>([]);
  protected readonly loading = signal(true);

  protected readonly countryDetails = computed(() => {
    const c = this.country();
    if (!c) return null;

    return {
      nativeName: c.nativeName,
      population: this.formatPopulation(c.population),
      region: c.region,
      subRegion: c.subregion,
      capital: c.capital || 'N/A',
      topLevelDomain: c.topLevelDomain.join(', '),
      currencies: c.currencies?.map(curr => curr.name).join(', ') || 'N/A',
      languages: c.languages.map(lang => lang.name).join(', ')
    };
  });

  ngOnInit(): void {
    this.countryService.loadCountries().subscribe(() => {
      // Subscribe to paramMap changes instead of reading snapshot once
      this.route.paramMap.subscribe(params => {
        const code = params.get('code');
        if (code) {
          this.loadCountry(code);
        }
      });
    });
  }

  private loadCountry(code: string): void {
    this.loading.set(true);
    this.countryService.getCountryByCode(code).subscribe(country => {
      if (country) {
        this.country.set(country);
        if (country.borders && country.borders.length > 0) {
          this.countryService.getCountriesByCodes(country.borders).subscribe(borders => {
            this.borderCountries.set(borders);
          });
        } else {
          this.borderCountries.set([]);
        }
        this.loading.set(false);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  protected goBack(): void {
    this.router.navigate(['/']);
  }

  protected getCountryRoute(country: Country): string[] {
    return ['/country', country.alpha3Code];
  }

  protected formatPopulation(population: number): string {
    return new Intl.NumberFormat('en-US').format(population);
  }
}
