import { HeroSnapshot } from '../models/overwatch.models';
import { HERO_COUNTERS } from './hero-counters';
import { SUBROLE_MATCHUPS } from './subrole-matchups';

export interface HeroMatchups {
  strongAgainst: HeroSnapshot[];
  weakAgainst: HeroSnapshot[];
}

/**
 * Resolves `hero`'s matchups against the currently loaded roster, so the result always
 * reflects real heroes from the active region/tier/input filter. Merges two sources rather
 * than treating one as a fallback for the other:
 *
 * 1. Curated, match-data-sourced pairs from hero-counters.ts — each hero's own top ~5, which
 *    isn't perfectly symmetric (e.g. Ana's page lists Winston as a top counter, but Winston's
 *    own page didn't happen to list Ana back), so this also pulls in anyone whose own curated
 *    entry names `hero` in the opposite direction.
 * 2. The subRole archetype guide in subrole-matchups.ts, applied to every hero.
 *
 * Every hero in this app now has a curated entry, which would make the archetype guide dead
 * code if it only ran as a fallback for heroes *without* one — curated data is specific but
 * necessarily sparse (~5-10 relationships per hero), so most hero-vs-hero pairs have no
 * curated relationship at all and would otherwise show no matchup information whatsoever.
 * Merging keeps the specific real-data pairs while ensuring every hero still has a baseline
 * relationship (via role archetype) against most of the roster.
 */
export function getHeroMatchups(hero: HeroSnapshot, roster: readonly HeroSnapshot[]): HeroMatchups {
  const others = roster.filter((h) => h.heroId !== hero.heroId);
  const strongIds = new Set<string>();
  const weakIds = new Set<string>();

  const curated = HERO_COUNTERS[hero.heroId];
  if (curated) {
    curated.counters.forEach((id) => strongIds.add(id));
    curated.counteredBy.forEach((id) => weakIds.add(id));

    for (const other of others) {
      const otherCurated = HERO_COUNTERS[other.heroId];
      if (otherCurated?.counteredBy.includes(hero.heroId)) strongIds.add(other.heroId);
      if (otherCurated?.counters.includes(hero.heroId)) weakIds.add(other.heroId);
    }
  }

  const archetype = hero.subRole ? SUBROLE_MATCHUPS[hero.subRole] : undefined;
  if (archetype) {
    for (const other of others) {
      if (other.subRole === null) continue;
      if (archetype.strongAgainst.includes(other.subRole)) strongIds.add(other.heroId);
      if (archetype.weakAgainst.includes(other.subRole)) weakIds.add(other.heroId);
    }
  }

  return {
    strongAgainst: others.filter((h) => strongIds.has(h.heroId)),
    weakAgainst: others.filter((h) => weakIds.has(h.heroId)),
  };
}
