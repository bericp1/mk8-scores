export enum CupMetal {
  Gold = 'Gold',
  Silver = 'Silver',
  Bronze = 'Bronze',
  None = 'None',
}

export const WHITE = {red: 1, green: 1, blue: 1};
export const GOLD = {red: 0.9843, green: 0.7373, blue: 0.0157};
export const SILVER = {red: 0.8509, green: 0.8509, blue: 0.8509};
export const BRONZE = {red: 0.7059, green: 0.3725, blue: 0.0235};

export interface Score {
  playerName: string;
  points: number;
  metalCounts: { [key in CupMetal]: number };
}