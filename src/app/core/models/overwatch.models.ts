/**
 * Mirrors com.heropool.backend.model.Region — values must match the Java enum names exactly,
 * since they are sent as @RequestParam and bound by Spring's enum converter.
 */
export enum Region {
  Americas = 'AMERICAS',
  Europe = 'EUROPE',
  Asia = 'ASIA',
}

/** Mirrors com.heropool.backend.model.Tier. */
export enum Tier {
  All = 'ALL',
  Bronze = 'BRONZE',
  Silver = 'SILVER',
  Gold = 'GOLD',
  Platinum = 'PLATINUM',
  Emerald = 'EMERALD',
  Diamond = 'DIAMOND',
  Master = 'MASTER',
  Grandmaster = 'GRANDMASTER',
}

/** Mirrors com.heropool.backend.model.InputType. */
export enum InputType {
  Pc = 'PC',
  Console = 'CONSOLE',
}

/** Mirrors com.heropool.backend.model.HeroRole. */
export enum HeroRole {
  Tank = 'TANK',
  Damage = 'DAMAGE',
  Support = 'SUPPORT',
}

/**
 * Mirrors com.heropool.backend.model.GameQueue. Quick Play never has ban data (bans only
 * happen in Competitive), so banRate is always 0 for Quick Play snapshots.
 */
export enum GameQueue {
  QuickPlay = 'QUICK_PLAY',
  Competitive = 'COMPETITIVE',
}

/** Mirrors com.heropool.backend.model.HeroSnapshot as serialized by Jackson. */
export interface HeroSnapshot {
  id: number;
  snapshotDate: string;
  heroId: string;
  heroName: string;
  portraitUrl: string | null;
  role: HeroRole;
  subRole: string | null;
  region: Region;
  tier: Tier;
  inputType: InputType;
  gameQueue: GameQueue;
  winRate: number;
  pickRate: number;
  banRate: number;
}

/**
 * Mirrors com.heropool.backend.model.HeroMapSnapshot as serialized by Jackson. Scraped only at
 * Tier.ALL / InputType.PC (see HeroMapScrapeService on the backend for why), so this data
 * reflects all ranks regardless of the tier selected elsewhere in the app.
 */
export interface HeroMapSnapshot {
  id: number;
  snapshotDate: string;
  heroId: string;
  heroName: string;
  portraitUrl: string | null;
  role: HeroRole;
  region: Region;
  tier: Tier;
  inputType: InputType;
  map: string;
  mapName: string;
  winRate: number;
  pickRate: number;
  banRate: number;
}

export const REGION_LABELS: Record<Region, string> = {
  [Region.Americas]: 'Americas',
  [Region.Europe]: 'Europe',
  [Region.Asia]: 'Asia',
};

export const TIER_LABELS: Record<Tier, string> = {
  [Tier.All]: 'All Ranks',
  [Tier.Bronze]: 'Bronze',
  [Tier.Silver]: 'Silver',
  [Tier.Gold]: 'Gold',
  [Tier.Platinum]: 'Platinum',
  [Tier.Emerald]: 'Emerald',
  [Tier.Diamond]: 'Diamond',
  [Tier.Master]: 'Master',
  [Tier.Grandmaster]: 'Grandmaster',
};

export const INPUT_LABELS: Record<InputType, string> = {
  [InputType.Pc]: 'PC',
  [InputType.Console]: 'Console',
};

export const GAME_QUEUE_LABELS: Record<GameQueue, string> = {
  [GameQueue.QuickPlay]: 'Quick Play',
  [GameQueue.Competitive]: 'Competitive',
};

export const ROLE_LABELS: Record<HeroRole, string> = {
  [HeroRole.Tank]: 'Tank',
  [HeroRole.Damage]: 'Damage',
  [HeroRole.Support]: 'Support',
};

/** Display order for role sections on the dashboard. */
export const ROLE_ORDER: readonly HeroRole[] = [HeroRole.Tank, HeroRole.Damage, HeroRole.Support];
