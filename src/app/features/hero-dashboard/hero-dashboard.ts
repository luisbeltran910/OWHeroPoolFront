import { DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { getHeroMatchups } from '../../core/data/hero-matchups';
import {
  HeroSnapshot,
  INPUT_LABELS,
  InputType,
  REGION_LABELS,
  Region,
  ROLE_ORDER,
  TIER_LABELS,
  Tier,
} from '../../core/models/overwatch.models';
import { HeroSnapshotService } from '../../core/services/hero-snapshot.service';
import { HeroMatchupDialog } from './hero-matchup-dialog/hero-matchup-dialog';
import { HeroRoleGroup } from './hero-role-group/hero-role-group';

type SnapshotMode = 'latest' | 'date';
type SortKey = 'pickRate' | 'winRate' | 'banRate' | 'heroName';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-hero-dashboard',
  imports: [FormsModule, DecimalPipe, HeroRoleGroup, HeroMatchupDialog],
  templateUrl: './hero-dashboard.html',
  styleUrl: './hero-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroDashboard {
  private readonly heroSnapshotService = inject(HeroSnapshotService);

  protected readonly regions = Object.values(Region);
  protected readonly tiers = Object.values(Tier);
  protected readonly inputTypes = Object.values(InputType);
  protected readonly regionLabels = REGION_LABELS;
  protected readonly tierLabels = TIER_LABELS;
  protected readonly inputLabels = INPUT_LABELS;

  protected readonly region = signal<Region>(Region.Americas);
  protected readonly tier = signal<Tier>(Tier.All);
  protected readonly inputType = signal<InputType>(InputType.Pc);
  protected readonly mode = signal<SnapshotMode>('latest');
  protected readonly date = signal<string>(todayIso());
  protected readonly search = signal('');
  protected readonly sortKey = signal<SortKey>('pickRate');
  protected readonly maxDate = todayIso();

  /** Reactively refetches whenever any filter signal it reads changes. */
  protected readonly snapshots = httpResource<HeroSnapshot[]>(
    () => ({
      url: `${environment.apiUrl}/api/snapshots/${this.mode() === 'latest' ? 'latest' : 'on'}`,
      params: {
        region: this.region(),
        tier: this.tier(),
        input: this.inputType(),
        ...(this.mode() === 'date' ? { date: this.date() } : {}),
      },
    }),
    {
      defaultValue: [],
      parse: (raw) => (raw ?? []) as HeroSnapshot[],
    },
  );

  protected readonly filteredSorted = computed(() => {
    const query = this.search().trim().toLowerCase();
    const key = this.sortKey();
    const list = this.snapshots.value() ?? [];
    const filtered = query ? list.filter((h) => h.heroName.toLowerCase().includes(query)) : list;

    return [...filtered].sort((a, b) =>
      key === 'heroName' ? a.heroName.localeCompare(b.heroName) : b[key] - a[key],
    );
  });

  protected readonly groupedByRole = computed(() => {
    const list = this.filteredSorted();
    return ROLE_ORDER.map((role) => ({
      role,
      heroes: list.filter((h) => h.role === role),
    })).filter((group) => group.heroes.length > 0);
  });

  protected readonly snapshotDate = computed(() => this.snapshots.value()?.[0]?.snapshotDate ?? null);
  protected readonly heroCount = computed(() => this.snapshots.value()?.length ?? 0);
  protected readonly averageWinRate = computed(() => {
    const list = this.snapshots.value() ?? [];
    if (!list.length) return null;
    return list.reduce((sum, h) => sum + h.winRate, 0) / list.length;
  });

  protected readonly scraping = signal(false);
  protected readonly scrapeMessage = signal<string | null>(null);
  protected readonly scrapeError = signal(false);

  protected readonly selectedHero = signal<HeroSnapshot | null>(null);
  protected readonly selectedHeroMatchups = computed(() => {
    const hero = this.selectedHero();
    if (!hero) return null;
    return getHeroMatchups(hero, this.snapshots.value() ?? []);
  });

  protected setMode(mode: SnapshotMode): void {
    this.mode.set(mode);
  }

  protected openHero(hero: HeroSnapshot): void {
    this.selectedHero.set(hero);
  }

  protected closeHero(): void {
    this.selectedHero.set(null);
  }

  protected runScrape(): void {
    this.scraping.set(true);
    this.scrapeMessage.set(null);
    this.scrapeError.set(false);

    this.heroSnapshotService.triggerScrape().subscribe({
      next: (message) => {
        this.scraping.set(false);
        this.scrapeMessage.set(message);
        this.snapshots.reload();
      },
      error: () => {
        this.scraping.set(false);
        this.scrapeError.set(true);
        this.scrapeMessage.set('Scrape failed — check the backend logs.');
      },
    });
  }
}
