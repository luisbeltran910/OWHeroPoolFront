import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppLogo } from '../app-logo/app-logo';

@Component({
  selector: 'app-footer',
  imports: [AppLogo],
  templateUrl: './app-footer.html',
  styleUrl: './app-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFooter {
  protected readonly year = new Date().getFullYear();
}
