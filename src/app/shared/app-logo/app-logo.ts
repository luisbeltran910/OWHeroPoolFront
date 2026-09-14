import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The app's mark: a hex badge with a crosshair, echoing the target icon used for the
 * Counter Picker nav item. Kept as flat solid shapes (no gradients) to match the rest of
 * the UI, and as an inline SVG (rather than an <img>) so it stays crisp at any size and
 * needs no separate asset — the standalone favicon.svg mirrors this design by hand.
 */
@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './app-logo.html',
  styleUrl: './app-logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLogo {
  readonly size = input(32);
}
