import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MockApiBackend } from './core/data/mock-api-backend';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    { provide: HttpBackend, useClass: MockApiBackend },
    provideRouter(routes),
  ],
};
