import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { HeroRole, HeroSnapshot, ROLE_LABELS, ROLE_ORDER } from '../../../core/models/overwatch.models';
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

@Component({
  selector: 'app-hero-matchup-dialog',
  imports: [HeroPortrait],
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
  readonly closed = output<void>();

  protected readonly roleLabels = ROLE_LABELS;
  protected readonly strongByRole = computed(() => groupByRole(this.strongAgainst()));
  protected readonly weakByRole = computed(() => groupByRole(this.weakAgainst()));
}
