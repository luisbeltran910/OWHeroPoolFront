/**
 * Archetype-level matchup guide, keyed by Blizzard's own hero `subRole` tag (the same
 * tactician/flanker/stalwart/etc. labels the rates API returns for every hero, including
 * ones released after this file was written). There's no official hero-vs-hero counter
 * data from Blizzard, so this is derived from established Overwatch design patterns
 * (dive punishes backline, shields block sightlines, peel/CC punishes dive, chip damage
 * wears down tanks, burst beats sustained healing) rather than per-hero kit trivia —
 * it stays meaningful even for heroes whose exact kit isn't reflected here.
 */
export interface SubRoleMatchup {
  strongAgainst: readonly string[];
  weakAgainst: readonly string[];
}

export const SUBROLE_MATCHUPS: Readonly<Record<string, SubRoleMatchup>> = {
  // Tank
  stalwart: { strongAgainst: ['sharpshooter'], weakAgainst: ['flanker', 'initiator', 'recon'] },
  bruiser: { strongAgainst: ['flanker', 'initiator'], weakAgainst: ['specialist', 'sharpshooter'] },
  initiator: {
    strongAgainst: ['sharpshooter', 'medic', 'specialist', 'recon'],
    weakAgainst: ['survivor', 'tactician', 'bruiser'],
  },

  // Damage
  sharpshooter: { strongAgainst: ['specialist', 'medic', 'recon'], weakAgainst: ['flanker', 'initiator', 'stalwart'] },
  specialist: {
    strongAgainst: ['stalwart', 'bruiser'],
    weakAgainst: ['flanker', 'recon', 'sharpshooter', 'initiator'],
  },
  flanker: { strongAgainst: ['sharpshooter', 'medic', 'specialist'], weakAgainst: ['survivor', 'bruiser'] },
  recon: { strongAgainst: ['stalwart', 'bruiser', 'tactician'], weakAgainst: ['sharpshooter', 'initiator'] },

  // Support
  tactician: { strongAgainst: ['initiator'], weakAgainst: ['flanker', 'recon'] },
  medic: { strongAgainst: ['bruiser', 'stalwart'], weakAgainst: ['flanker', 'sharpshooter', 'initiator'] },
  survivor: { strongAgainst: ['flanker', 'initiator'], weakAgainst: ['specialist', 'sharpshooter'] },
};
