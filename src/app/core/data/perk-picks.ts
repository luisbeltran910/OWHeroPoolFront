/**
 * Each hero's most-picked minor and major perk, keyed by our own heroId. Sourced from
 * owperks.com (snapshot: September 2026) — that site is a visitor click/vote poll, not
 * telemetry from real matches, so a percentage here means "share of that site's voters who
 * clicked this option," not an actual in-game pick rate. There's no Blizzard or match-data
 * source for perk popularity at all, unlike the win/pick/ban rates and hero counters
 * elsewhere in this app. Surface it as a community opinion, not a stat.
 */
export interface TopPerk {
  name: string;
  percent: number;
}

export interface HeroTopPerks {
  minor: TopPerk;
  major: TopPerk;
}

export const HERO_TOP_PERKS: Readonly<Record<string, HeroTopPerks>> = {
  ana: { minor: { name: 'Speed Serum', percent: 82 }, major: { name: 'Headhunter', percent: 76 } },
  anran: { minor: { name: 'Smoulder', percent: 68 }, major: { name: 'Hungering Blaze', percent: 63 } },
  ashe: { minor: { name: 'Remote Detonator', percent: 87 }, major: { name: "Viper's Sting", percent: 80 } },
  baptiste: { minor: { name: 'Assault Burst', percent: 65 }, major: { name: 'Automated Healing', percent: 71 } },
  bastion: { minor: { name: 'Configuration Reload', percent: 71 }, major: { name: 'Self-Repair', percent: 74 } },
  brigitte: { minor: { name: 'Morale Boost', percent: 80 }, major: { name: 'Inspiring Strike', percent: 87 } },
  cassidy: { minor: { name: 'Bang Bang', percent: 67 }, major: { name: 'Silver Bullet', percent: 91 } },
  dmon: { minor: { name: 'Beast Within', percent: 63 }, major: { name: 'Focused Fusion', percent: 53 } },
  // Doctrine isn't in Blizzard's own rates API yet (Season 5 release, currently a Quick Play
  // hero trial only), so she won't appear anywhere else in this app until Blizzard adds her —
  // this entry is just ready for when she does.
  doctrine: { minor: { name: 'Sanguine Siphon', percent: 54 }, major: { name: 'Transfusion', percent: 87 } },
  domina: { minor: { name: 'Extended Power', percent: 70 }, major: { name: 'Corporate Retreat', percent: 72 } },
  doomfist: { minor: { name: 'Survival of the Fittest', percent: 59 }, major: { name: 'Power Matrix', percent: 89 } },
  dva: { minor: { name: 'Extended Boosters', percent: 85 }, major: { name: 'Shield System', percent: 72 } },
  echo: { minor: { name: 'Partial Scan', percent: 91 }, major: { name: 'Focused Rush', percent: 56 } },
  emre: { minor: { name: 'Enhanced Agility', percent: 70 }, major: { name: 'Heat Sink', percent: 83 } },
  freja: { minor: { name: 'Relentless Barrage', percent: 75 }, major: { name: 'Aerial Recovery', percent: 74 } },
  genji: { minor: { name: "Dragon's Thirst", percent: 73 }, major: { name: 'Blade Twisting', percent: 61 } },
  hanzo: { minor: { name: 'Sonic Disruption', percent: 71 }, major: { name: 'Frost Arrow', percent: 66 } },
  hazard: { minor: { name: 'Anarchic Zeal', percent: 90 }, major: { name: 'Deep Leap', percent: 76 } },
  illari: { minor: { name: 'Summer Solstice', percent: 72 }, major: { name: 'Sunburn', percent: 88 } },
  'jetpack-cat': { minor: { name: 'Ulterior Motive', percent: 92 }, major: { name: 'Claws Out', percent: 66 } },
  'junker-queen': { minor: { name: 'Rampant Charge', percent: 80 }, major: { name: 'Savage Satiation', percent: 72 } },
  junkrat: { minor: { name: 'Nitro Boost', percent: 60 }, major: { name: 'Frag Cannon', percent: 86 } },
  juno: { minor: { name: 'Locked On', percent: 80 }, major: { name: 'Lift Off', percent: 60 } },
  kiriko: { minor: { name: 'Fortune Teller', percent: 78 }, major: { name: 'Foxtrot', percent: 81 } },
  lifeweaver: { minor: { name: 'Dashing Escape', percent: 75 }, major: { name: 'Superbloom', percent: 85 } },
  lucio: { minor: { name: 'Beat Drop', percent: 53 }, major: { name: 'Noise Violation', percent: 78 } },
  mauga: { minor: { name: 'Pyromaniac', percent: 82 }, major: { name: 'Firewalker', percent: 68 } },
  mei: { minor: { name: 'Glacial Propulsion', percent: 77 }, major: { name: 'Deep Freeze', percent: 68 } },
  mercy: { minor: { name: 'Winged Reach', percent: 60 }, major: { name: 'Chain Boost', percent: 65 } },
  mizuki: { minor: { name: 'Exposed Soul', percent: 72 }, major: { name: 'Resonant Return', percent: 55 } },
  moira: { minor: { name: 'Ethical Nourishment', percent: 83 }, major: { name: 'Phantom Step', percent: 77 } },
  orisa: { minor: { name: 'Mobile Fortification', percent: 79 }, major: { name: 'Heavy Javelin', percent: 84 } },
  pharah: { minor: { name: 'Concussive Force', percent: 72 }, major: { name: 'Rocket Salvo', percent: 89 } },
  ramattra: { minor: { name: 'Prolonged Barrier', percent: 77 }, major: { name: 'Void Surge', percent: 75 } },
  reaper: { minor: { name: 'Lingering Wraith', percent: 69 }, major: { name: 'Trigger Finger', percent: 59 } },
  reinhardt: { minor: { name: "Crusader's Resolve", percent: 78 }, major: { name: 'Shield Slam', percent: 55 } },
  roadhog: { minor: { name: 'Scrap Hook', percent: 71 }, major: { name: 'Hogdrogen Exposure', percent: 72 } },
  shion: { minor: { name: 'X Machina', percent: 89 }, major: { name: 'Faces of Death', percent: 67 } },
  sierra: { minor: { name: 'Tight Grip', percent: 81 }, major: { name: 'Locked In', percent: 90 } },
  sigma: { minor: { name: 'Hyper Regeneration', percent: 84 }, major: { name: 'Levitation', percent: 58 } },
  sojourn: { minor: { name: 'Overcharged', percent: 59 }, major: { name: 'Dual Thrusters', percent: 75 } },
  'soldier-76': { minor: { name: 'Helix Propulsion', percent: 79 }, major: { name: 'Stim Pack', percent: 80 } },
  sombra: { minor: { name: 'Ctrl Alt Esc', percent: 77 }, major: { name: 'Viral Replication', percent: 86 } },
  symmetra: { minor: { name: 'Perfect Alignment', percent: 81 }, major: { name: 'Shield Battery', percent: 83 } },
  torbjorn: { minor: { name: 'Pre-Heated', percent: 61 }, major: { name: 'Anchor Bolts', percent: 83 } },
  tracer: { minor: { name: 'Temporal Regen', percent: 69 }, major: { name: 'Quantum Entanglement', percent: 68 } },
  vendetta: { minor: { name: 'Raging Storm', percent: 66 }, major: { name: 'Siphoning Strike', percent: 50 } },
  venture: { minor: { name: 'Excavation Exhilaration', percent: 70 }, major: { name: 'Smart Extender', percent: 74 } },
  widowmaker: { minor: { name: 'Scoped Efficiency', percent: 78 }, major: { name: "Widow's Bite", percent: 91 } },
  winston: { minor: { name: 'Electric Charge', percent: 78 }, major: { name: 'Revitalizing Barrier', percent: 79 } },
  'wrecking-ball': { minor: { name: 'Multi-Ball', percent: 60 }, major: { name: 'Adaptive Barrier', percent: 75 } },
  wuyang: { minor: { name: 'Balance', percent: 70 }, major: { name: 'Falling Rain', percent: 76 } },
  zarya: { minor: { name: 'Spotter', percent: 77 }, major: { name: 'Extra Oomph', percent: 85 } },
  zenyatta: { minor: { name: 'Ascendance', percent: 60 }, major: { name: 'Dual Harmony', percent: 59 } },
};
