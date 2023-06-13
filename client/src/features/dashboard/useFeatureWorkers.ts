import { useQuery } from 'react-query'
import { Area } from '@features/area/type'
import { Worker } from '@features/workers/type'
// import { useMemo } from 'react'

// const buildWorkers = (areas: Area[] = []) => {
//   const workers: Worker[] = []
//   for (let i = 0; i < 200; i++) {
//     const area = areas[(Math.random() * areas.length) | 0]
//     workers.push({
//       id: i + 1,
//       step: 0,
//       start_step: 0,
//       end_step: 0,
//       username: Math.random().toString(36).substring(3),
//       uuid: Math.random().toString(36).substring(3),
//       last_seen: Date.now() - Math.random() * 100,
//       area_id: area?.id || 0,
//       mode: '',
//       // area_name: area?.name || 'Unknown',
//       host: '',
//     })
//   }
//   return workers
// }

export function useFeatureWorkers(geofence = false, refetchInterval = 1000) {
  const { data: workers = [], ...workerProps } = useQuery(
    ['status'],
    () =>
      fetch('/api/workers/')
        .then((res) => res.json())
        .then((res) => res.data as Promise<Worker[]>),
    {
      refetchInterval,
    },
  )
  const { data: areas = [], ...areaProps } = useQuery(['areas'], () =>
    fetch(
      `/api/areas/?order=ASC&page=0&perPage=1000&sortBy=name&geofence=${geofence}`,
    )
      .then((res) => res.json())
      .then((res) => res.data as Promise<Area[]>),
  )

  // const customWorkers = useMemo(
  //   () => [...workers, ...buildWorkers(areas)],
  //   [areas],
  // )

  return {
    workers,
    areas,
    isLoading: workerProps.isLoading || areaProps.isLoading,
    isError: workerProps.isError || areaProps.isError,
    isFetching: workerProps.isFetching || areaProps.isFetching,
  }
}
