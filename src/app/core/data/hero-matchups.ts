import { HeroSnapshot } from '../models/overwatch.models';
import { HERO_COUNTERS } from './hero-counters';
import { SUBROLE_MATCHUPS } from './subrole-matchups';

export interface HeroMatchups {
  strongAgainst: HeroSnapshot[];
  weakAgainst: HeroSnapshot[];
}

function resolveBySubRole(subRoles: readonly string[], others: readonly HeroSnapshot[]): HeroSnapshot[] {
  return others.filter((h) => h.subRole !== null && subRoles.includes(h.subRole));
}

/**
 * Resolves `hero`'s matchups against the currently loaded roster, so the result always
 * reflects real heroes from the active region/tier/input filter. Prefers the curated,
 * match-data-sourced lists in hero-counters.ts; falls back to the subRole archetype guide
 * for any hero we haven't sourced curated data for yet.
 *
 * Each curated entry is only that hero's own top ~5, so the data isn't perfectly
 * symmetric — e.g. Ana's page lists Winston as a top counter, but Winston's own page didn't
 * happen to list Ana in its top 5 "punishes" picks. To avoid missing real relationships
 * that only got recorded from the other hero's side, this also pulls in anyone in the
 * roster whose own curated entry names `hero` in the opposite direction.
 */
export function getHeroMatchups(hero: HeroSnapshot, roster: readonly HeroSnapshot[]): HeroMatchups {
  const others = roster.filter((h) => h.heroId !== hero.heroId);

  const curated = HERO_COUNTERS[hero.heroId];
  if (curated) {
    const strongIds = new Set(curated.counters);
    const weakIds = new Set(curated.counteredBy);

    for (const other of others) {
      const otherCurated = HERO_COUNTERS[other.heroId];
      if (otherCurated?.counteredBy.includes(hero.heroId)) strongIds.add(other.heroId);
      if (otherCurated?.counters.includes(hero.heroId)) weakIds.add(other.heroId);
    }

    return {
      strongAgainst: others.filter((h) => strongIds.has(h.heroId)),
      weakAgainst: others.filter((h) => weakIds.has(h.heroId)),
    };
  }

  const archetype = hero.subRole ? SUBROLE_MATCHUPS[hero.subRole] : undefined;
  if (!archetype) {
    return { strongAgainst: [], weakAgainst: [] };
  }

  return {
    strongAgainst: resolveBySubRole(archetype.strongAgainst, others),
    weakAgainst: resolveBySubRole(archetype.weakAgainst, others),
  };
}
