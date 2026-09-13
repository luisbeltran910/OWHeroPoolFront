import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { HeroSnapshot } from '../../../core/models/overwatch.models';
import { HeroPortrait } from '../../../shared/hero-portrait/hero-portrait';

@Component({
  selector: 'app-hero-card',
  imports: [DecimalPipe, HeroPortrait],
  templateUrl: './hero-card.html',
  styleUrl: './hero-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroCard {
  readonly hero = input.required<HeroSnapshot>();
  readonly select = output<HeroSnapshot>();

  protected readonly winRateTone = computed(() => {
    const winRate = this.hero().winRate;
    if (winRate >= 52) return 'positive';
    if (winRate <= 48) return 'negative';
    return 'neutral';
  });
}
