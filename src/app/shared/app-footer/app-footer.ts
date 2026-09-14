import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppLogo } from '../app-logo/app-logo';

@Component({
  selector: 'app-footer',
  imports: [AppLogo, RouterLink],
  templateUrl: './app-footer.html',
  styleUrl: './app-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFooter {
  protected readonly year = new Date().getFullYear();
}
