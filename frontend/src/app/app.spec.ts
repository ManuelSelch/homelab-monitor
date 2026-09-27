import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const http = TestBed.inject(HttpTestingController);
    const app = fixture.componentInstance;

    http.expectOne('/api/machines').flush([]);
    http.expectOne('/api/services').flush([]);

    expect(app).toBeTruthy();
    http.verify();
  });

  it('should render services grouped by machine', async () => {
    const fixture = TestBed.createComponent(App);
    const http = TestBed.inject(HttpTestingController);

    http.expectOne('/api/machines').flush([
      { id: '100', name: 'Docker VM', status: 'Up', cpuUsage: 12.5, memoryUsage: 48.0 },
    ]);
    http.expectOne('/api/services').flush([
      { id: 'nextcloud', name: 'Nextcloud', status: 'Up', machineId: '100' },
    ]);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Homelab Monitor');
    expect(compiled.textContent).toContain('Docker VM');
    expect(compiled.textContent).toContain('Nextcloud');
    expect(compiled.textContent).toContain('Online');
    http.verify();
  });
});
