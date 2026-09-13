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

export const ROLE_LABELS: Record<HeroRole, string> = {
  [HeroRole.Tank]: 'Tank',
  [HeroRole.Damage]: 'Damage',
  [HeroRole.Support]: 'Support',
};

/** Display order for role sections on the dashboard. */
export const ROLE_ORDER: readonly HeroRole[] = [HeroRole.Tank, HeroRole.Damage, HeroRole.Support];
