export interface Cords {
  lat: number;
  lon: number;
}

export type CordsList = Cords[];

interface ScanningMode {
  workers: number;
  route: CordsList;
}

interface QuestCheck {
  location: Cords;
  pokestops: string[];
}

interface QuestScanningMode extends ScanningMode {
  checks: QuestCheck[];
  hours?: number[];
  max_login_queue: number | null;
}

export interface Area {
  enable_quests: boolean;
  fort_mode: ScanningMode;
  geofence?: CordsList;
  id: number;
  name: string;
  pokemon_mode: ScanningMode;
  quest_mode: QuestScanningMode;
}

export interface QuestStatus {
  quests: number;
  alt_quests: number;
  total: number;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

export type AreaDTO = RecursivePartial<Area> & { name: string };
