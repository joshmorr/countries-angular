import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ThemeService } from '../../services/theme.service';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let themeServiceMock: any;

  beforeEach(async () => {
    // Create a mock ThemeService
    themeServiceMock = {
      toggleTheme: vi.fn(),
      theme: signal('light')
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject ThemeService', () => {
    expect(component['themeService']).toBe(themeServiceMock);
  });

  it('should have theme signal from ThemeService', () => {
    expect(component['theme']()).toBe('light');
  });

  it('should call toggleTheme on ThemeService when toggleTheme is called', () => {
    component['toggleTheme']();
    expect(themeServiceMock.toggleTheme).toHaveBeenCalled();
  });

  it('should render the header element', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('header');
    expect(header).toBeTruthy();
  });
});
