import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { DOCUMENT } from '@angular/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ThemeService', () => {
  let service: ThemeService;
  let documentMock: any;
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      return localStorageMock[key] || null;
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      localStorageMock[key] = value;
    });

    // Mock document
    documentMock = {
      documentElement: {
        classList: {
          add: vi.fn(),
          remove: vi.fn()
        }
      }
    };

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: documentMock }
      ]
    });
  });

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme when no saved theme exists', () => {
    service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
  });

  it('should initialize with saved theme from localStorage', () => {
    localStorageMock['countries-theme'] = 'dark';
    service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
  });

  it('should apply light theme classes on initialization', () => {
    service = TestBed.inject(ThemeService);
    expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith('light-theme');
    expect(documentMock.documentElement.classList.remove).toHaveBeenCalledWith('dark-theme');
  });

  it('should apply dark theme classes on initialization when saved', () => {
    localStorageMock['countries-theme'] = 'dark';
    service = TestBed.inject(ThemeService);
    expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith('dark-theme');
    expect(documentMock.documentElement.classList.remove).toHaveBeenCalledWith('light-theme');
  });

  describe('toggleTheme', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeService);
      // Reset spies after initialization
      vi.clearAllMocks();
    });

    it('should toggle from light to dark', () => {
      service.toggleTheme();
      TestBed.flushEffects();
      expect(service.theme()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      service.toggleTheme(); // light -> dark
      TestBed.flushEffects();
      service.toggleTheme(); // dark -> light
      TestBed.flushEffects();
      expect(service.theme()).toBe('light');
    });

    it('should apply dark theme classes when toggling to dark', () => {
      service.toggleTheme();
      TestBed.flushEffects();
      expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith('dark-theme');
      expect(documentMock.documentElement.classList.remove).toHaveBeenCalledWith('light-theme');
    });

    it('should save theme to localStorage when toggling', () => {
      service.toggleTheme();
      TestBed.flushEffects();
      expect(localStorage.setItem).toHaveBeenCalledWith('countries-theme', 'dark');
    });
  });

  describe('theme persistence', () => {
    it('should persist light theme', () => {
      service = TestBed.inject(ThemeService);
      TestBed.flushEffects();
      expect(localStorage.setItem).toHaveBeenCalledWith('countries-theme', 'light');
    });

    it('should persist dark theme', () => {
      service = TestBed.inject(ThemeService);
      service.toggleTheme();
      TestBed.flushEffects();
      expect(localStorage.setItem).toHaveBeenCalledWith('countries-theme', 'dark');
    });
  });
});
