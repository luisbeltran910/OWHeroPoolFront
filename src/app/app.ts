import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroDashboard } from './features/hero-dashboard/hero-dashboard';

@Component({
  selector: 'app-root',
  imports: [HeroDashboard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
