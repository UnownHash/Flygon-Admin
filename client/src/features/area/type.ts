export interface Cords {
  lat: number
  lon: number
}

export type CordsList = Cords[]

interface ScanningMode {
  workers: number
  route: CordsList
}

interface QuestCheck {
  location: Cords
  pokestops: string[]
}

interface QuestScanningMode extends ScanningMode {
  checks: QuestCheck[]
  hours?: number[]
  max_login_queue: number | null
}

export interface Area {
  enable_quests: boolean
  fort_mode: ScanningMode
  geofence?: CordsList
  id: number
  name: string
  pokemon_mode: ScanningMode
  quest_mode: QuestScanningMode
}

export interface QuestStatus {
  ar_quests: number
  no_ar_quests: number
  total: number
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P]
}

export type AreaDTO = RecursivePartial<Area> & { name: string }

export interface KojiOptions {
  category?: 'pokestop' | 'gym' | 'pokemon' | 'fort'
  cluster_mode?: 'Fast' | 'Balanced' | 'BruteForce'
  tth?: 'All' | 'Known' | 'Unknown'
  sort_by?: 'GeoHash' | 'Random' | 'ClusterCount'
  radius?: number
  fast?: boolean
  min_points?: number
  route_split_level?: number
  cluster_split_level?: number
  calculation_mode?: 'Radius' | 'S2'
  s2_level?: number
  s2_size?: number
}

export interface KojiResponse<T = { lat: number; lon: number }[]> {
  data: T
  status_code: number
  status: string
  message: string
  stats: null
}
