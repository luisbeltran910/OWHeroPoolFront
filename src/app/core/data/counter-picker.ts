import { HeroSnapshot } from '../models/overwatch.models';
import { getHeroMatchups } from './hero-matchups';

export interface RankedPick {
  hero: HeroSnapshot;
  /** Selected enemy heroes this pick counters. */
  countered: HeroSnapshot[];
  /** Selected enemy heroes that counter this pick back. */
  counteredBy: HeroSnapshot[];
  /** This hero's win rate on the selected map, if a specific map is filtering the results. */
  mapWinRate?: number;
}

/**
 * Ranks every hero in `roster` (excluding the selected enemies) by how many of the
 * selected enemy heroes it counters, reusing the same per-hero matchup data as the
 * single-hero dialog. Only heroes that counter at least one selected enemy are returned.
 *
 * Ties break toward fewer enemies that counter the pick back, then — when `mapWinRateFor`
 * is given — toward that hero's win rate on the selected map specifically, falling back to
 * their overall win rate for any hero without map data.
 */
export function rankCounterPicks(
  enemies: readonly HeroSnapshot[],
  roster: readonly HeroSnapshot[],
  mapWinRateFor?: (heroId: string) => number | undefined,
): RankedPick[] {
  if (enemies.length === 0) {
    return [];
  }

  const enemyIds = new Set(enemies.map((h) => h.heroId));
  const candidates = roster.filter((h) => !enemyIds.has(h.heroId));

  return candidates
    .map((hero): RankedPick => {
      const matchups = getHeroMatchups(hero, roster);
      return {
        hero,
        countered: matchups.strongAgainst.filter((h) => enemyIds.has(h.heroId)),
        counteredBy: matchups.weakAgainst.filter((h) => enemyIds.has(h.heroId)),
        mapWinRate: mapWinRateFor?.(hero.heroId),
      };
    })
    .filter((pick) => pick.countered.length > 0)
    .sort((a, b) => {
      if (b.countered.length !== a.countered.length) return b.countered.length - a.countered.length;
      if (a.counteredBy.length !== b.counteredBy.length) return a.counteredBy.length - b.counteredBy.length;
      const aRate = mapWinRateFor ? (a.mapWinRate ?? a.hero.winRate) : a.hero.winRate;
      const bRate = mapWinRateFor ? (b.mapWinRate ?? b.hero.winRate) : b.hero.winRate;
      return bRate - aRate;
    });
}
