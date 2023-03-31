export interface Worker {
  id: number
  uuid: string
  username: string
  area_id: number
  start_step: number
  end_step: number
  step: number
  host: string
  last_seen: number
}
