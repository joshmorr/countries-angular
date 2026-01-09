import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  computed,
  LOCALE_ID
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CountryService } from '../../services/country.service';

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
  readonly countryService = inject(CountryService);

  protected readonly countryDetails = computed(() => {
    const c = this.countryService.countryDetails.value();
    if (!c) return null;

    const nativeNameObj = c.name.nativeName;
    const firstNativeName = nativeNameObj ? Object.values(nativeNameObj)[0]?.common : c.name.common;

    const currenciesObj = c.currencies;
    const currenciesStr = currenciesObj ? Object.values(currenciesObj).map(curr => curr.name).join(', ') : 'N/A';

    const languagesObj = c.languages;
    const languagesStr = languagesObj ? Object.values(languagesObj).join(', ') : 'N/A';

    return {
      nativeName: firstNativeName,
      population: c.population,
      region: c.region,
      subRegion: c.subregion || 'N/A',
      capital: c.capital?.[0] || 'N/A',
      topLevelDomain: c.tld?.join(', ') || 'N/A',
      currencies: currenciesStr,
      languages: languagesStr
    };
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const code = params.get('code');
      if (code) {
        this.countryService.setCountryCode(code);
      }
    });
  }

  protected goBack(): void {
    this.router.navigate(['/']);
  }

  protected getCountryRoute(cca3: string): string[] {
    return ['/country', cca3];
  }
}
