import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

// Hash routing keeps the app working on any static host without server rewrites.
export const appConfig: ApplicationConfig = { providers: [provideRouter(routes, withHashLocation(), withComponentInputBinding())] };
