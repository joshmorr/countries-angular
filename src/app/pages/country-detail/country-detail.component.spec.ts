import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryDetailComponent } from './country-detail.component';
import { CountryService } from '../../services/country.service';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { CountryApiResponse } from '../../models/country.model';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Component } from '@angular/core';

// Dummy component for routing
@Component({ template: '', standalone: true })
class DummyComponent {}

describe('CountryDetailComponent', () => {
  let component: CountryDetailComponent;
  let fixture: ComponentFixture<CountryDetailComponent>;
  let countryServiceMock: any;
  let router: Router;
  let activatedRouteMock: any;

  const mockCountry: CountryApiResponse = {
    name: {
      common: 'Germany',
      official: 'Federal Republic of Germany',
      nativeName: {
        deu: {
          official: 'Bundesrepublik Deutschland',
          common: 'Deutschland'
        }
      }
    },
    tld: ['.de'],
    cca3: 'DEU',
    currencies: {
      EUR: {
        name: 'Euro',
        symbol: '€'
      }
    },
    capital: ['Berlin'],
    region: 'Europe',
    subregion: 'Western Europe',
    languages: {
      deu: 'German'
    },
    borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
    population: 83240000,
    flags: {
      png: 'germany.png',
      svg: 'germany.svg'
    }
  };

  beforeEach(async () => {
    activatedRouteMock = {
      paramMap: of({
        get: (key: string) => 'DEU'
      })
    };

    countryServiceMock = {
      setCountryCode: vi.fn(),
      countryDetails: {
        value: vi.fn().mockReturnValue(mockCountry),
        isLoading: vi.fn().mockReturnValue(false),
        error: vi.fn().mockReturnValue(null)
      }
    };

    TestBed.configureTestingModule({
      imports: [CountryDetailComponent],
      providers: [
        { provide: CountryService, useValue: countryServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        provideRouter([
          { path: '', component: DummyComponent },
          { path: 'country/:code', component: DummyComponent }
        ])
      ]
    });

    fixture = TestBed.createComponent(CountryDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    // Don't call detectChanges here since some tests need to set up mocks first
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should inject CountryService', () => {
    fixture.detectChanges();
    expect(component.countryService).toBe(countryServiceMock);
  });

  describe('ngOnInit', () => {
    it('should call ngOnInit without errors', () => {
      // ngOnInit exists and can be called
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should have access to route and countryService', () => {
      // Verify the component has the necessary dependencies injected
      expect(component['route']).toBeDefined();
      expect(component.countryService).toBeDefined();
    });
  });

  describe('countryDetails computed', () => {
    it('should return null when country details are null', () => {
      countryServiceMock.countryDetails.value = vi.fn().mockReturnValue(null);
      countryServiceMock.countryDetails.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryDetails.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(CountryDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const details = component['countryDetails']();
      expect(details).toBeNull();
    });

    it('should return formatted country details', () => {
      fixture.detectChanges();
      const details = component['countryDetails']();
      expect(details).not.toBeNull();
      expect(details?.nativeName).toBe('Deutschland');
      expect(details?.population).toBe(83240000);
      expect(details?.region).toBe('Europe');
      expect(details?.subRegion).toBe('Western Europe');
      expect(details?.capital).toBe('Berlin');
      expect(details?.topLevelDomain).toBe('.de');
      expect(details?.currencies).toBe('Euro');
      expect(details?.languages).toBe('German');
    });

    it('should handle country without native name', () => {
      const countryWithoutNativeName = {
        ...mockCountry,
        name: {
          ...mockCountry.name,
          nativeName: null as any  // null nativeName to test fallback
        }
      };
      countryServiceMock.countryDetails.value = vi.fn().mockReturnValue(countryWithoutNativeName);
      countryServiceMock.countryDetails.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryDetails.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(CountryDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const details = component['countryDetails']();
      expect(details?.nativeName).toBe('Germany');
    });

    it('should handle country without currencies', () => {
      const countryWithoutCurrencies = {
        ...mockCountry,
        currencies: undefined
      };
      countryServiceMock.countryDetails.value = vi.fn().mockReturnValue(countryWithoutCurrencies);
      countryServiceMock.countryDetails.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryDetails.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(CountryDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const details = component['countryDetails']();
      expect(details?.currencies).toBe('N/A');
    });

    it('should handle country without languages', () => {
      const countryWithoutLanguages = {
        ...mockCountry,
        languages: undefined
      };
      countryServiceMock.countryDetails.value = vi.fn().mockReturnValue(countryWithoutLanguages);
      countryServiceMock.countryDetails.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryDetails.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(CountryDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const details = component['countryDetails']();
      expect(details?.languages).toBe('N/A');
    });

    it('should handle country without subregion', () => {
      const countryWithoutSubregion = {
        ...mockCountry,
        subregion: undefined
      };
      countryServiceMock.countryDetails.value = vi.fn().mockReturnValue(countryWithoutSubregion);
      countryServiceMock.countryDetails.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryDetails.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(CountryDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const details = component['countryDetails']();
      expect(details?.subRegion).toBe('N/A');
    });

    it('should handle country without capital', () => {
      const countryWithoutCapital = {
        ...mockCountry,
        capital: undefined
      };
      countryServiceMock.countryDetails.value = vi.fn().mockReturnValue(countryWithoutCapital);
      countryServiceMock.countryDetails.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryDetails.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(CountryDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const details = component['countryDetails']();
      expect(details?.capital).toBe('N/A');
    });

    it('should handle country without TLD', () => {
      const countryWithoutTld = {
        ...mockCountry,
        tld: undefined
      };
      countryServiceMock.countryDetails.value = vi.fn().mockReturnValue(countryWithoutTld);
      countryServiceMock.countryDetails.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryDetails.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(CountryDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const details = component['countryDetails']();
      expect(details?.topLevelDomain).toBe('N/A');
    });

    it('should handle multiple currencies', () => {
      const countryWithMultipleCurrencies = {
        ...mockCountry,
        currencies: {
          EUR: { name: 'Euro', symbol: '€' },
          USD: { name: 'United States Dollar', symbol: '$' }
        }
      };
      countryServiceMock.countryDetails.value = vi.fn().mockReturnValue(countryWithMultipleCurrencies);
      countryServiceMock.countryDetails.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryDetails.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(CountryDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const details = component['countryDetails']();
      expect(details?.currencies).toBe('Euro, United States Dollar');
    });

    it('should handle multiple languages', () => {
      const countryWithMultipleLanguages = {
        ...mockCountry,
        languages: {
          deu: 'German',
          eng: 'English'
        }
      };
      countryServiceMock.countryDetails.value = vi.fn().mockReturnValue(countryWithMultipleLanguages);
      countryServiceMock.countryDetails.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryDetails.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(CountryDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const details = component['countryDetails']();
      expect(details?.languages).toBe('German, English');
    });

    it('should handle multiple TLDs', () => {
      const countryWithMultipleTlds = {
        ...mockCountry,
        tld: ['.de', '.eu']
      };
      countryServiceMock.countryDetails.value = vi.fn().mockReturnValue(countryWithMultipleTlds);
      countryServiceMock.countryDetails.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryDetails.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(CountryDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const details = component['countryDetails']();
      expect(details?.topLevelDomain).toBe('.de, .eu');
    });
  });

  describe('goBack', () => {
    it('should navigate to home page', () => {
      fixture.detectChanges();
      component['goBack']();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('getCountryRoute', () => {
    it('should return correct route array', () => {
      fixture.detectChanges();
      const route = component['getCountryRoute']('FRA');
      expect(route).toEqual(['/country', 'FRA']);
    });

    it('should handle different country codes', () => {
      fixture.detectChanges();
      const route = component['getCountryRoute']('USA');
      expect(route).toEqual(['/country', 'USA']);
    });
  });
});
