import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { HeroSnapshot } from '../../core/models/overwatch.models';

@Component({
  selector: 'app-hero-portrait',
  imports: [],
  templateUrl: './hero-portrait.html',
  styleUrl: './hero-portrait.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroPortrait {
  readonly hero = input.required<HeroSnapshot>();
  readonly size = input(28);

  private readonly imageFailed = signal(false);

  protected readonly initial = computed(() => this.hero().heroName.charAt(0).toUpperCase());
  protected readonly showImage = computed(() => this.hero().portraitUrl !== null && !this.imageFailed());

  protected onImageError(): void {
    this.imageFailed.set(true);
  }
}
