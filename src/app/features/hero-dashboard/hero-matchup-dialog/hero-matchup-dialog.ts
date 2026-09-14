import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { HeroMapSnapshot, HeroRole, HeroSnapshot, ROLE_LABELS, ROLE_ORDER } from '../../../core/models/overwatch.models';
import { HeroPortrait } from '../../../shared/hero-portrait/hero-portrait';

interface RoleBucket {
  role: HeroRole;
  heroes: HeroSnapshot[];
}

function groupByRole(heroes: readonly HeroSnapshot[]): RoleBucket[] {
  return ROLE_ORDER.map((role) => ({ role, heroes: heroes.filter((h) => h.role === role) })).filter(
    (bucket) => bucket.heroes.length > 0,
  );
}

const MAPS_SHOWN = 3;

@Component({
  selector: 'app-hero-matchup-dialog',
  imports: [HeroPortrait, DecimalPipe],
  templateUrl: './hero-matchup-dialog.html',
  styleUrl: './hero-matchup-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class HeroMatchupDialog {
  readonly hero = input.required<HeroSnapshot>();
  readonly strongAgainst = input.required<HeroSnapshot[]>();
  readonly weakAgainst = input.required<HeroSnapshot[]>();
  /** Pre-sorted best-to-worst by win rate; see HeroDashboard.selectedHeroMaps. */
  readonly maps = input.required<HeroMapSnapshot[]>();
  readonly closed = output<void>();

  protected readonly roleLabels = ROLE_LABELS;
  protected readonly strongByRole = computed(() => groupByRole(this.strongAgainst()));
  protected readonly weakByRole = computed(() => groupByRole(this.weakAgainst()));

  protected readonly bestMaps = computed(() => this.maps().slice(0, MAPS_SHOWN));
  protected readonly worstMaps = computed(() =>
    this.maps().slice(-MAPS_SHOWN).reverse().filter((m) => !this.bestMaps().includes(m)),
  );
}
