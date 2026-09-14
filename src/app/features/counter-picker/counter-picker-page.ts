import { DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { rankCounterPicks } from '../../core/data/counter-picker';
import { HERO_TOP_PERKS, HeroTopPerks } from '../../core/data/perk-picks';
import {
  GAME_QUEUE_LABELS,
  GameQueue,
  HeroMapSnapshot,
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
  imports: [FormsModule, HeroPortrait, DecimalPipe],
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
  protected readonly queueLabels = GAME_QUEUE_LABELS;
  protected readonly GameQueue = GameQueue;

  protected readonly region = signal<Region>(Region.Americas);
  protected readonly tier = signal<Tier>(Tier.All);
  protected readonly inputType = signal<InputType>(InputType.Pc);
  protected readonly queue = signal<GameQueue>(GameQueue.Competitive);
  /** Empty string is the "All Maps" sentinel, since a native <select> needs a string value. */
  protected readonly selectedMap = signal<string>('');
  /** The map select starts collapsed behind a toggle button — the toolbar was getting crowded. */
  protected readonly mapFilterOpen = signal(false);

  protected readonly snapshots = httpResource<HeroSnapshot[]>(
    () => ({
      url: `${environment.apiUrl}/api/snapshots/latest`,
      params: { region: this.region(), tier: this.tier(), input: this.inputType(), queue: this.queue() },
    }),
    {
      defaultValue: [],
      parse: (raw) => (raw ?? []) as HeroSnapshot[],
    },
  );

  /** Independent of the enemy team — only depends on region, same as the roster fetch. */
  protected readonly heroMaps = httpResource<HeroMapSnapshot[]>(
    () => ({
      url: `${environment.apiUrl}/api/maps/latest`,
      params: { region: this.region() },
    }),
    {
      defaultValue: [],
      parse: (raw) => (raw ?? []) as HeroMapSnapshot[],
    },
  );

  /** Distinct maps we actually have data for, derived from the map fetch itself. */
  protected readonly availableMaps = computed(() => {
    const seen = new Map<string, string>();
    for (const m of this.heroMaps.value()) {
      if (!seen.has(m.map)) seen.set(m.map, m.mapName);
    }
    return Array.from(seen, ([map, mapName]) => ({ map, mapName })).sort((a, b) =>
      a.mapName.localeCompare(b.mapName),
    );
  });

  protected mapWinRateFor(heroId: string): number | undefined {
    const map = this.selectedMap();
    if (!map) return undefined;
    return this.heroMaps.value().find((m) => m.heroId === heroId && m.map === map)?.winRate;
  }

  protected readonly selectedMapName = computed(() => {
    const map = this.selectedMap();
    if (!map) return 'All Maps';
    return this.availableMaps().find((m) => m.map === map)?.mapName ?? 'All Maps';
  });

  protected toggleMapFilter(): void {
    this.mapFilterOpen.update((open) => !open);
  }

  protected chooseMap(map: string): void {
    this.selectedMap.set(map);
    this.mapFilterOpen.set(false);
  }

  protected clearMap(event: Event): void {
    event.stopPropagation();
    this.selectedMap.set('');
  }

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

  protected readonly rankedPicks = computed(() => {
    const map = this.selectedMap();
    return rankCounterPicks(
      this.selectedEnemies(),
      this.snapshots.value(),
      map ? (heroId) => this.mapWinRateFor(heroId) : undefined,
    );
  });

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

  private readonly expandedPicks = signal<ReadonlySet<string>>(new Set());

  protected isPickExpanded(heroId: string): boolean {
    return this.expandedPicks().has(heroId);
  }

  protected togglePick(heroId: string): void {
    const next = new Set(this.expandedPicks());
    if (!next.delete(heroId)) {
      next.add(heroId);
    }
    this.expandedPicks.set(next);
  }

  protected topPerksFor(heroId: string): HeroTopPerks | undefined {
    return HERO_TOP_PERKS[heroId];
  }

  private static readonly MAPS_SHOWN = 3;

  private mapsFor(heroId: string): HeroMapSnapshot[] {
    return this.heroMaps
      .value()
      .filter((m) => m.heroId === heroId)
      .sort((a, b) => b.winRate - a.winRate);
  }

  protected bestMapsFor(heroId: string): HeroMapSnapshot[] {
    return this.mapsFor(heroId).slice(0, CounterPickerPage.MAPS_SHOWN);
  }

  protected worstMapsFor(heroId: string): HeroMapSnapshot[] {
    const maps = this.mapsFor(heroId);
    const best = this.bestMapsFor(heroId);
    return maps
      .slice(-CounterPickerPage.MAPS_SHOWN)
      .reverse()
      .filter((m) => !best.includes(m));
  }
}
