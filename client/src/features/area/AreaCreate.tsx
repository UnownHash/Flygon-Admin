import { Create } from 'react-admin'

import { AreaForm } from './AreaForm'
import { Area, AreaDTO } from './type'

const transformPayload = (area: Area): AreaDTO => {
  // let hours = []

  // try {
  //   hours = JSON.parse(area.quest_mode.hours as unknown as string)
  // } catch (error) {
  //   console.error(error)
  // }

  return {
    ...area,
    geofence:
      Array.isArray(area.geofence) && area.geofence.length > 0
        ? area.geofence
        : undefined,
    // fort_mode:
    //   area.fort_mode.route.length > 0 || area.fort_mode.workers !== 0
    //     ? {
    //         ...area.fort_mode,
    //         route:
    //           area.fort_mode.route.length > 0
    //             ? area.fort_mode.route
    //             : undefined,
    //         workers:
    //           area.fort_mode.workers !== 0 ? area.fort_mode.workers : undefined,
    //       }
    //     : undefined,
    pokemon_mode:
      area.pokemon_mode.route.length > 0 || area.pokemon_mode.workers !== 0
        ? {
            ...area.pokemon_mode,
            route:
              area.pokemon_mode.route.length > 0
                ? area.pokemon_mode.route
                : undefined,
            workers:
              area.pokemon_mode.workers !== 0
                ? area.pokemon_mode.workers
                : undefined,
          }
        : undefined,
    // quest_mode:
    //   area.quest_mode.max_login_queue ||
    //   area.quest_mode.workers !== 0 ||
    //   (Array.isArray(hours) && hours.length > 0) ||
    //   area.quest_mode.route.length > 0
    //     ? {
    //         ...area.quest_mode,
    //         route:
    //           area.quest_mode.route.length > 0
    //             ? area.quest_mode.route
    //             : undefined,
    //         max_login_queue: area.quest_mode.max_login_queue
    //           ? area.quest_mode.max_login_queue
    //           : undefined,
    //         workers: area.quest_mode.workers
    //           ? area.quest_mode.workers
    //           : undefined,
    //         hours: Array.isArray(hours) && hours.length > 0 ? hours : undefined,
    //       }
    //     : undefined,
  }
}

export const AreaCreate = () => (
  <Create transform={transformPayload} redirect="show">
    <AreaForm />
  </Create>
)
