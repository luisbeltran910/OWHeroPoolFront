import { HeroSnapshot } from '../models/overwatch.models';
import { getHeroMatchups } from './hero-matchups';

export interface RankedPick {
  hero: HeroSnapshot;
  /** Selected enemy heroes this pick counters. */
  countered: HeroSnapshot[];
  /** Selected enemy heroes that counter this pick back. */
  counteredBy: HeroSnapshot[];
}

/**
 * Ranks every hero in `roster` (excluding the selected enemies) by how many of the
 * selected enemy heroes it counters, reusing the same per-hero matchup data as the
 * single-hero dialog. Only heroes that counter at least one selected enemy are returned.
 * Ties break toward fewer enemies that counter the pick back, then toward current win rate.
 */
export function rankCounterPicks(enemies: readonly HeroSnapshot[], roster: readonly HeroSnapshot[]): RankedPick[] {
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
      };
    })
    .filter((pick) => pick.countered.length > 0)
    .sort((a, b) => {
      if (b.countered.length !== a.countered.length) return b.countered.length - a.countered.length;
      if (a.counteredBy.length !== b.counteredBy.length) return a.counteredBy.length - b.counteredBy.length;
      return b.hero.winRate - a.hero.winRate;
    });
}
