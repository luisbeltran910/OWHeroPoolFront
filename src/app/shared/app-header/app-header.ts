import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppLogo } from '../app-logo/app-logo';

interface NavLink {
  path: string;
  label: string;
  icon: 'dashboard' | 'target' | 'pool';
  /** Whether routerLinkActive should require an exact path match (e.g. '/' vs a prefix). */
  exact: boolean;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AppLogo],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  protected readonly navLinks: readonly NavLink[] = [
    { path: '/', label: 'Dashboard', icon: 'dashboard', exact: true },
    { path: '/counter-picker', label: 'Counter Picker', icon: 'target', exact: false },
    { path: '/hero-pool', label: 'Hero Pool', icon: 'pool', exact: false },
  ];
}
