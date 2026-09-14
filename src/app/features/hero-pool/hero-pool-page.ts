import { DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { HERO_TOP_PERKS, HeroTopPerks } from '../../core/data/perk-picks';
import {
  GAME_QUEUE_LABELS,
  GameQueue,
  HeroMapSnapshot,
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

export interface PoolMapStat {
  map: string;
  mapName: string;
  avgWinRate: number;
}

@Component({
  selector: 'app-hero-pool-page',
  imports: [FormsModule, HeroPortrait, DecimalPipe],
  templateUrl: './hero-pool-page.html',
  styleUrl: './hero-pool-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroPoolPage {
  protected readonly regions = Object.values(Region);
  protected readonly tiers = Object.values(Tier);
  protected readonly inputTypes = Object.values(InputType);
  protected readonly regionLabels = REGION_LABELS;
  protected readonly tierLabels = TIER_LABELS;
  protected readonly inputLabels = INPUT_LABELS;
  protected readonly roleLabels = ROLE_LABELS;
  protected readonly queueLabels = GAME_QUEUE_LABELS;
  protected readonly GameQueue = GameQueue;

  protected static readonly MAX_POOL_SIZE = 4;
  protected readonly maxPoolSize = HeroPoolPage.MAX_POOL_SIZE;

  protected readonly region = signal<Region>(Region.Americas);
  protected readonly tier = signal<Tier>(Tier.All);
  protected readonly inputType = signal<InputType>(InputType.Pc);
  protected readonly queue = signal<GameQueue>(GameQueue.Competitive);

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

  /** Independent of tier/input/queue — the backend only scrapes map data at Tier.ALL / PC. */
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

  protected readonly rosterByRole = computed(() => {
    const roster = this.snapshots.value();
    return ROLE_ORDER.map((role) => ({ role, heroes: roster.filter((h) => h.role === role) })).filter(
      (group) => group.heroes.length > 0,
    );
  });

  private static readonly RECOMMENDED_PER_ROLE = 4;

  /** Top performers by role, offered as a starting point before the user has picked anything. */
  protected readonly recommendedByRole = computed(() => {
    return this.rosterByRole().map((group) => ({
      role: group.role,
      heroes: [...group.heroes]
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, HeroPoolPage.RECOMMENDED_PER_ROLE),
    }));
  });

  private readonly selectedIds = signal<readonly string[]>([]);

  protected readonly selectedHeroes = computed(() => {
    const ids = this.selectedIds();
    const roster = this.snapshots.value();
    return ids.map((id) => roster.find((h) => h.heroId === id)).filter((h): h is HeroSnapshot => h !== undefined);
  });

  protected readonly isPoolFull = computed(() => this.selectedIds().length >= HeroPoolPage.MAX_POOL_SIZE);

  protected isSelected(hero: HeroSnapshot): boolean {
    return this.selectedIds().includes(hero.heroId);
  }

  protected toggleHero(hero: HeroSnapshot): void {
    const current = this.selectedIds();
    if (current.includes(hero.heroId)) {
      this.selectedIds.set(current.filter((id) => id !== hero.heroId));
    } else if (current.length < HeroPoolPage.MAX_POOL_SIZE) {
      this.selectedIds.set([...current, hero.heroId]);
    }
  }

  protected clearPool(): void {
    this.selectedIds.set([]);
  }

  private static readonly MAPS_SHOWN = 5;

  /** Average win rate per map across every selected hero that has data for that map. */
  protected readonly poolMapStats = computed<PoolMapStat[]>(() => {
    const heroes = this.selectedHeroes();
    if (heroes.length === 0) return [];

    const allMaps = this.heroMaps.value();
    const byMap = new Map<string, { mapName: string; rates: number[] }>();

    for (const hero of heroes) {
      for (const snap of allMaps) {
        if (snap.heroId !== hero.heroId) continue;
        const entry = byMap.get(snap.map) ?? { mapName: snap.mapName, rates: [] };
        entry.rates.push(snap.winRate);
        byMap.set(snap.map, entry);
      }
    }

    return Array.from(byMap, ([map, { mapName, rates }]) => ({
      map,
      mapName,
      avgWinRate: rates.reduce((sum, r) => sum + r, 0) / rates.length,
    })).filter((stat) => stat.avgWinRate > 0);
  });

  protected readonly bestMaps = computed(() =>
    [...this.poolMapStats()].sort((a, b) => b.avgWinRate - a.avgWinRate).slice(0, HeroPoolPage.MAPS_SHOWN),
  );

  protected readonly worstMaps = computed(() =>
    [...this.poolMapStats()].sort((a, b) => a.avgWinRate - b.avgWinRate).slice(0, HeroPoolPage.MAPS_SHOWN),
  );

  protected topPerksFor(heroId: string): HeroTopPerks | undefined {
    return HERO_TOP_PERKS[heroId];
  }
}
