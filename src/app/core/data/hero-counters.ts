/**
 * Curated hero-vs-hero matchup guide, keyed by our own heroId (matches HeroSnapshot.heroId).
 * Each list is this hero's own top ~5, ordered strongest-first — see getHeroMatchups() in
 * hero-matchups.ts for how the two directions get reconciled when resolving a hero's full
 * matchup list against a roster.
 *
 * Sourced from counterwatch.gg's per-hero counter pages (snapshot: September 2026), which
 * derive ratings from kill-trade/duel outcomes in tracked matches rather than kit
 * theorycrafting — e.g. it correctly shows Ramattra's real counters as Zenyatta/Ashe/Ana
 * (not "other shield tanks", which a kit-only guess would suggest). This will drift as the
 * meta and patches shift; treat it as a strategic guide; a hero missing here just means we
 * haven't sourced data for it, and getHeroMatchups() falls back to the subRole archetype
 * guide (subrole-matchups.ts) in that case.
 */
export interface HeroCounterEntry {
  /** Heroes this hero tends to beat/punish. */
  counters: readonly string[];
  /** Heroes that tend to beat this hero. */
  counteredBy: readonly string[];
}

export const HERO_COUNTERS: Readonly<Record<string, HeroCounterEntry>> = {
  ana: { counteredBy: ['anran', 'winston', 'moira', 'lucio', 'mercy'], counters: ['roadhog', 'domina', 'reinhardt', 'ramattra'] },
  anran: { counteredBy: ['winston', 'dmon', 'wrecking-ball', 'junkrat', 'venture', 'pharah', 'moira', 'reinhardt'], counters: ['genji', 'ana', 'illari'] },
  ashe: { counteredBy: ['widowmaker', 'lifeweaver', 'doomfist', 'winston', 'hanzo'], counters: ['jetpack-cat', 'pharah', 'ramattra', 'juno', 'symmetra'] },
  baptiste: { counteredBy: ['illari', 'anran', 'sojourn', 'shion', 'genji'], counters: ['roadhog', 'pharah', 'wrecking-ball', 'reinhardt', 'doomfist'] },
  bastion: { counteredBy: ['genji', 'tracer', 'hanzo', 'sombra', 'illari'], counters: ['winston', 'roadhog', 'wrecking-ball'] },
  brigitte: { counteredBy: ['ramattra', 'pharah', 'dmon', 'junkrat', 'reinhardt'], counters: ['dva', 'sombra', 'roadhog'] },
  cassidy: { counteredBy: ['widowmaker', 'wuyang', 'hanzo', 'domina', 'zarya'], counters: ['jetpack-cat', 'pharah', 'tracer', 'venture', 'juno'] },
  dmon: { counteredBy: ['torbjorn', 'illari', 'dva', 'mauga', 'ramattra'], counters: ['mercy', 'anran', 'widowmaker'] },
  domina: { counteredBy: ['symmetra', 'ana', 'lifeweaver'], counters: ['wrecking-ball', 'winston', 'doomfist'] },
  dva: { counteredBy: ['brigitte', 'lucio', 'ramattra', 'sigma', 'reinhardt'], counters: ['shion', 'dmon', 'lifeweaver', 'jetpack-cat', 'freja'] },
  doomfist: { counteredBy: ['mauga', 'roadhog', 'junker-queen', 'pharah', 'baptiste'], counters: ['widowmaker', 'lifeweaver', 'venture', 'genji', 'vendetta'] },
  echo: { counteredBy: ['shion', 'moira', 'baptiste', 'soldier-76', 'sojourn'], counters: ['pharah', 'reinhardt', 'sigma'] },
  emre: { counteredBy: ['mercy', 'lifeweaver', 'widowmaker', 'soldier-76', 'zarya', 'junker-queen'], counters: ['torbjorn', 'pharah', 'jetpack-cat'] },
  freja: { counteredBy: ['illari', 'dva', 'sombra', 'ashe', 'soldier-76'], counters: ['pharah', 'reinhardt', 'mauga'] },
  genji: { counteredBy: ['wrecking-ball', 'winston', 'moira'], counters: ['bastion', 'lifeweaver', 'kiriko'] },
  hanzo: { counteredBy: ['zarya', 'wrecking-ball', 'doomfist', 'genji', 'mercy'], counters: ['ashe', 'tracer', 'bastion'] },
  hazard: { counteredBy: ['mauga', 'sigma', 'reinhardt', 'orisa', 'bastion'], counters: ['genji', 'widowmaker', 'lucio', 'venture', 'anran'] },
  illari: { counteredBy: ['anran', 'winston', 'venture', 'kiriko', 'wuyang'], counters: ['dmon', 'torbjorn', 'freja', 'jetpack-cat', 'baptiste'] },
  'jetpack-cat': { counteredBy: ['ashe', 'cassidy', 'dva'], counters: ['pharah', 'reinhardt', 'dmon'] },
  'junker-queen': { counteredBy: ['sierra', 'moira', 'mei'], counters: ['winston', 'wrecking-ball', 'doomfist'] },
  junkrat: { counteredBy: ['pharah', 'widowmaker', 'ashe', 'illari', 'juno'], counters: ['tracer', 'vendetta', 'brigitte', 'anran', 'symmetra'] },
  juno: { counteredBy: ['sombra', 'soldier-76', 'tracer', 'ashe', 'widowmaker'], counters: ['pharah', 'roadhog', 'reinhardt'] },
  kiriko: { counteredBy: ['vendetta', 'dmon', 'venture'], counters: ['torbjorn', 'mauga', 'roadhog'] },
  lifeweaver: { counteredBy: ['wrecking-ball', 'vendetta', 'winston'], counters: ['widowmaker', 'sigma', 'ashe'] },
  lucio: { counteredBy: ['pharah', 'hazard', 'winston', 'vendetta', 'venture'], counters: ['roadhog', 'dva', 'zenyatta'] },
  mauga: { counteredBy: ['symmetra', 'sierra', 'sojourn'], counters: ['wrecking-ball', 'winston', 'doomfist'] },
  mei: { counteredBy: ['jetpack-cat', 'pharah', 'juno', 'widowmaker', 'junkrat'], counters: ['mauga', 'sombra', 'roadhog', 'ramattra', 'dva'] },
  mercy: { counteredBy: ['wrecking-ball', 'dmon', 'sombra', 'vendetta', 'reaper'], counters: ['zenyatta', 'domina', 'torbjorn'] },
  mizuki: { counteredBy: ['genji', 'jetpack-cat', 'hanzo', 'pharah', 'widowmaker'], counters: ['mauga', 'hazard', 'domina', 'dmon', 'junker-queen'] },
  moira: { counteredBy: ['roadhog', 'torbjorn', 'wrecking-ball', 'doomfist', 'reinhardt'], counters: ['genji', 'anran', 'sierra', 'symmetra', 'ana'] },
  orisa: { counteredBy: ['symmetra', 'lucio', 'brigitte', 'zenyatta', 'kiriko'], counters: ['hazard', 'doomfist', 'widowmaker'] },
  pharah: { counteredBy: ['juno', 'echo', 'ashe', 'cassidy', 'soldier-76'], counters: ['reinhardt', 'venture', 'brigitte', 'junkrat', 'anran'] },
  ramattra: { counteredBy: ['zenyatta', 'ashe', 'ana'], counters: ['winston', 'brigitte', 'dva'] },
  reaper: { counteredBy: ['brigitte', 'widowmaker', 'sojourn'], counters: ['mercy', 'winston', 'wrecking-ball'] },
  reinhardt: { counteredBy: ['pharah', 'torbjorn', 'zenyatta', 'baptiste', 'jetpack-cat'], counters: ['hazard', 'anran', 'wrecking-ball'] },
  roadhog: { counteredBy: ['baptiste', 'bastion', 'lucio'], counters: ['winston', 'wrecking-ball', 'doomfist'] },
  shion: { counteredBy: ['dva', 'illari', 'vendetta', 'torbjorn', 'anran'], counters: ['reaper', 'tracer', 'echo', 'pharah', 'mercy'] },
  sierra: { counteredBy: ['genji', 'moira', 'dmon', 'widowmaker', 'hanzo'], counters: ['mauga', 'junker-queen', 'zarya'] },
  sigma: { counteredBy: ['symmetra', 'lifeweaver', 'brigitte', 'moira', 'echo'], counters: ['hazard', 'dva', 'doomfist'] },
  sojourn: { counteredBy: ['mercy', 'lifeweaver', 'wrecking-ball', 'winston', 'genji'], counters: ['mauga', 'reaper', 'torbjorn', 'tracer', 'symmetra'] },
  'soldier-76': { counteredBy: ['doomfist', 'vendetta', 'genji', 'anran', 'widowmaker'], counters: ['jetpack-cat', 'pharah', 'juno'] },
  sombra: { counteredBy: ['brigitte', 'winston', 'baptiste', 'vendetta', 'venture'], counters: ['juno', 'mercy', 'wrecking-ball', 'pharah', 'freja'] },
  symmetra: { counteredBy: ['widowmaker', 'ashe', 'moira', 'wuyang', 'ana'], counters: ['zarya', 'sigma', 'mauga'] },
  torbjorn: { counteredBy: ['emre', 'illari', 'wuyang', 'kiriko', 'mercy'], counters: ['dmon', 'reinhardt', 'roadhog'] },
  tracer: { counteredBy: ['junkrat', 'cassidy', 'hazard', 'roadhog', 'wrecking-ball'], counters: ['lifeweaver', 'juno', 'bastion', 'mercy', 'ana'] },
  vendetta: { counteredBy: ['pharah', 'torbjorn', 'winston'], counters: ['lifeweaver', 'kiriko', 'widowmaker'] },
  venture: { counteredBy: ['pharah', 'doomfist', 'wrecking-ball'], counters: ['kiriko', 'widowmaker', 'anran'] },
  widowmaker: { counteredBy: ['winston', 'wrecking-ball', 'doomfist'], counters: ['ashe', 'symmetra', 'cassidy'] },
  winston: { counteredBy: ['roadhog', 'mauga', 'bastion', 'torbjorn', 'junker-queen'], counters: ['widowmaker', 'genji', 'anran', 'lifeweaver', 'venture'] },
  'wrecking-ball': { counteredBy: ['mauga', 'domina', 'roadhog', 'junker-queen', 'symmetra'], counters: ['widowmaker', 'genji', 'mercy', 'lifeweaver', 'wuyang'] },
  wuyang: { counteredBy: ['wrecking-ball', 'winston', 'jetpack-cat'], counters: ['torbjorn', 'symmetra', 'zenyatta'] },
  zarya: { counteredBy: ['symmetra', 'brigitte', 'lifeweaver'], counters: ['genji', 'widowmaker', 'winston'] },
  zenyatta: { counteredBy: ['lucio', 'mercy', 'juno', 'jetpack-cat', 'kiriko'], counters: ['ramattra', 'reinhardt', 'roadhog', 'hazard', 'mauga'] },
};
