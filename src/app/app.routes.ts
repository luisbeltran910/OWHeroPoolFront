import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/hero-dashboard/hero-dashboard').then((m) => m.HeroDashboard),
  },
  {
    path: 'counter-picker',
    loadComponent: () => import('./features/counter-picker/counter-picker-page').then((m) => m.CounterPickerPage),
  },
  { path: '**', redirectTo: '' },
];
