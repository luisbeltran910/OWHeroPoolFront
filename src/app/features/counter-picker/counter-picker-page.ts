import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { rankCounterPicks } from '../../core/data/counter-picker';
import {
  HeroRole,
  HeroSnapshot,
  INPUT_LABELS,
  InputType,
  REGION_LABELS,
  Region,
  ROLE_LABELS,
  ROLE_ORDER,
  TIER_LABELS,
  Tier,
} from '../../core/models/overwatch.models';
import { HeroPortrait } from '../../shared/hero-portrait/hero-portrait';

type TeamFormat = '5v5' | '6v6';

/** Role-queue composition limits per format: 5v5 is 1-2-2, 6v6 is 2-2-2. */
const ROLE_CAPS: Record<TeamFormat, Record<HeroRole, number>> = {
  '5v5': { [HeroRole.Tank]: 1, [HeroRole.Damage]: 2, [HeroRole.Support]: 2 },
  '6v6': { [HeroRole.Tank]: 2, [HeroRole.Damage]: 2, [HeroRole.Support]: 2 },
};

function emptyRoleCounts(): Record<HeroRole, number> {
  return { [HeroRole.Tank]: 0, [HeroRole.Damage]: 0, [HeroRole.Support]: 0 };
}

@Component({
  selector: 'app-counter-picker-page',
  imports: [FormsModule, HeroPortrait],
  templateUrl: './counter-picker-page.html',
  styleUrl: './counter-picker-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterPickerPage {
  protected readonly regions = Object.values(Region);
  protected readonly tiers = Object.values(Tier);
  protected readonly inputTypes = Object.values(InputType);
  protected readonly regionLabels = REGION_LABELS;
  protected readonly tierLabels = TIER_LABELS;
  protected readonly inputLabels = INPUT_LABELS;
  protected readonly roleLabels = ROLE_LABELS;

  protected readonly region = signal<Region>(Region.Americas);
  protected readonly tier = signal<Tier>(Tier.All);
  protected readonly inputType = signal<InputType>(InputType.Pc);

  protected readonly snapshots = httpResource<HeroSnapshot[]>(
    () => ({
      url: `${environment.apiUrl}/api/snapshots/latest`,
      params: { region: this.region(), tier: this.tier(), input: this.inputType() },
    }),
    {
      defaultValue: [],
      parse: (raw) => (raw ?? []) as HeroSnapshot[],
    },
  );

  protected readonly rosterByRole = computed(() => {
    const roster = this.snapshots.value();
    return ROLE_ORDER.map((role) => ({ role, heroes: roster.filter((h) => h.role === role) })).filter(
      (group) => group.heroes.length > 0,
    );
  });

  protected readonly format = signal<TeamFormat>('5v5');
  protected readonly roleCaps = computed(() => ROLE_CAPS[this.format()]);
  protected readonly maxEnemies = computed(() => {
    const caps = this.roleCaps();
    return caps[HeroRole.Tank] + caps[HeroRole.Damage] + caps[HeroRole.Support];
  });

  private readonly selectedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly selectedEnemies = computed(() => {
    const ids = this.selectedIds();
    return this.snapshots.value().filter((h) => ids.has(h.heroId));
  });

  protected readonly selectedCountByRole = computed(() => {
    const counts = emptyRoleCounts();
    for (const hero of this.selectedEnemies()) counts[hero.role]++;
    return counts;
  });

  protected readonly rankedPicks = computed(() =>
    rankCounterPicks(this.selectedEnemies(), this.snapshots.value()),
  );

  private static readonly MAX_PICKS_PER_ROLE = 6;

  protected readonly pickedByRole = computed(() => {
    const picks = this.rankedPicks();
    return ROLE_ORDER.map((role) => ({
      role,
      picks: picks.filter((p) => p.hero.role === role).slice(0, CounterPickerPage.MAX_PICKS_PER_ROLE),
    })).filter((group) => group.picks.length > 0);
  });

  protected isSelected(hero: HeroSnapshot): boolean {
    return this.selectedIds().has(hero.heroId);
  }

  protected isRoleFull(role: HeroRole): boolean {
    return this.selectedCountByRole()[role] >= this.roleCaps()[role];
  }

  protected setFormat(format: TeamFormat): void {
    this.format.set(format);

    const caps = ROLE_CAPS[format];
    const roster = this.snapshots.value();
    const counts = emptyRoleCounts();
    const trimmed = new Set<string>();

    for (const id of this.selectedIds()) {
      const hero = roster.find((h) => h.heroId === id);
      if (!hero) continue;
      if (counts[hero.role] < caps[hero.role]) {
        trimmed.add(id);
        counts[hero.role]++;
      }
    }

    this.selectedIds.set(trimmed);
  }

  protected toggleEnemy(hero: HeroSnapshot): void {
    const next = new Set(this.selectedIds());
    if (next.has(hero.heroId)) {
      next.delete(hero.heroId);
    } else if (!this.isRoleFull(hero.role)) {
      next.add(hero.heroId);
    } else {
      return;
    }
    this.selectedIds.set(next);
  }

  protected clearEnemies(): void {
    this.selectedIds.set(new Set());
  }

  protected namesOf(heroes: readonly HeroSnapshot[]): string {
    return heroes.map((h) => h.heroName).join(', ');
  }
}
