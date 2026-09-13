import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HeroSnapshot } from '../../../core/models/overwatch.models';

@Component({
  selector: 'app-hero-card',
  imports: [DecimalPipe],
  templateUrl: './hero-card.html',
  styleUrl: './hero-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroCard {
  readonly hero = input.required<HeroSnapshot>();

  protected readonly winRateTone = computed(() => {
    const winRate = this.hero().winRate;
    if (winRate >= 52) return 'positive';
    if (winRate <= 48) return 'negative';
    return 'neutral';
  });
}
