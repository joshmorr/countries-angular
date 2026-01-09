import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { CountryService } from '../../services/country.service';
import { CountryOverviewApiResponse } from '../../models/country.model';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let countryServiceMock: any;

  const mockCountries: CountryOverviewApiResponse[] = [
    {
      name: { common: 'Germany', official: 'Federal Republic of Germany', nativeName: {} },
      cca3: 'DEU',
      flags: { png: 'germany.png', svg: 'germany.svg' },
      population: 83240000,
      region: 'Europe',
      capital: ['Berlin']
    },
    {
      name: { common: 'France', official: 'French Republic', nativeName: {} },
      cca3: 'FRA',
      flags: { png: 'france.png', svg: 'france.svg' },
      population: 67390000,
      region: 'Europe',
      capital: ['Paris']
    },
    {
      name: { common: 'Brazil', official: 'Federative Republic of Brazil', nativeName: {} },
      cca3: 'BRA',
      flags: { png: 'brazil.png', svg: 'brazil.svg' },
      population: 212559000,
      region: 'Americas',
      capital: ['Brasília']
    }
  ];

  beforeEach(async () => {
    countryServiceMock = {
      setSearchTerm: vi.fn(),
      setCountryCode: vi.fn(),
      countryOverviews: {
        value: vi.fn().mockReturnValue(mockCountries),
        isLoading: vi.fn().mockReturnValue(false),
        error: vi.fn().mockReturnValue(null)
      }
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: CountryService, useValue: countryServiceMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject CountryService', () => {
    expect(component.countryService).toBe(countryServiceMock);
  });

  describe('countryOverviews computed', () => {
    it('should return all countries sorted by name when no region is selected', () => {
      const countries = component['countryOverviews']();
      expect(countries.length).toBe(3);
      expect(countries[0].name.common).toBe('Brazil');
      expect(countries[1].name.common).toBe('France');
      expect(countries[2].name.common).toBe('Germany');
    });

    it('should filter countries by selected region', () => {
      component['selectedRegion'].set('Europe');
      fixture.detectChanges();
      const countries = component['countryOverviews']();
      expect(countries.length).toBe(2);
      expect(countries.every(c => c.region === 'Europe')).toBe(true);
    });

    it('should handle empty country list', () => {
      countryServiceMock.countryOverviews.value = vi.fn().mockReturnValue([]);
      countryServiceMock.countryOverviews.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryOverviews.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      const countries = component['countryOverviews']();
      expect(countries.length).toBe(0);
    });

    it('should handle null country list', () => {
      countryServiceMock.countryOverviews.value = vi.fn().mockReturnValue(null);
      countryServiceMock.countryOverviews.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryOverviews.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      const countries = component['countryOverviews']();
      expect(countries.length).toBe(0);
    });
  });

  describe('uniqueRegions computed', () => {
    it('should return unique regions from countries', () => {
      const regions = component['uniqueRegions']();
      expect(regions.length).toBe(2);
      expect(regions).toContain('Europe');
      expect(regions).toContain('Americas');
    });

    it('should handle empty country list', () => {
      countryServiceMock.countryOverviews.value = vi.fn().mockReturnValue([]);
      countryServiceMock.countryOverviews.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryOverviews.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      const regions = component['uniqueRegions']();
      expect(regions.length).toBe(0);
    });

    it('should handle null country list', () => {
      countryServiceMock.countryOverviews.value = vi.fn().mockReturnValue(null);
      countryServiceMock.countryOverviews.isLoading = vi.fn().mockReturnValue(false);
      countryServiceMock.countryOverviews.error = vi.fn().mockReturnValue(null);
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      const regions = component['uniqueRegions']();
      expect(regions.length).toBe(0);
    });
  });

  describe('onSearchChange', () => {
    it('should update searchTerm signal', () => {
      component['onSearchChange']('germany');
      expect(component['searchTerm']()).toBe('germany');
    });

    it('should call countryService.setSearchTerm', () => {
      component['onSearchChange']('france');
      expect(countryServiceMock.setSearchTerm).toHaveBeenCalledWith('france');
    });

    it('should handle empty search term', () => {
      component['onSearchChange']('');
      expect(component['searchTerm']()).toBe('');
      expect(countryServiceMock.setSearchTerm).toHaveBeenCalledWith('');
    });
  });

  describe('onRegionChange', () => {
    it('should update selectedRegion signal', () => {
      component['onRegionChange']('Europe');
      expect(component['selectedRegion']()).toBe('Europe');
    });

    it('should handle empty region', () => {
      component['onRegionChange']('');
      expect(component['selectedRegion']()).toBe('');
    });
  });

  describe('getCountryRoute', () => {
    it('should return correct route array', () => {
      const country = mockCountries[0];
      const route = component['getCountryRoute'](country);
      expect(route).toEqual(['/country', 'DEU']);
    });

    it('should use the country cca3 code', () => {
      const country = mockCountries[1];
      const route = component['getCountryRoute'](country);
      expect(route[1]).toBe('FRA');
    });
  });

  describe('searchTerm signal', () => {
    it('should initialize with empty string', () => {
      expect(component['searchTerm']()).toBe('');
    });
  });

  describe('selectedRegion signal', () => {
    it('should initialize with empty string', () => {
      expect(component['selectedRegion']()).toBe('');
    });
  });
});
