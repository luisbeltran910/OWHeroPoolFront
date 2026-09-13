import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { rankCounterPicks } from '../../core/data/counter-picker';
import {
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

  private readonly selectedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly selectedEnemies = computed(() => {
    const ids = this.selectedIds();
    return this.snapshots.value().filter((h) => ids.has(h.heroId));
  });

  protected readonly rankedPicks = computed(() =>
    rankCounterPicks(this.selectedEnemies(), this.snapshots.value()),
  );

  protected isSelected(hero: HeroSnapshot): boolean {
    return this.selectedIds().has(hero.heroId);
  }

  protected toggleEnemy(hero: HeroSnapshot): void {
    const next = new Set(this.selectedIds());
    if (!next.delete(hero.heroId)) {
      next.add(hero.heroId);
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
