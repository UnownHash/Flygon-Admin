import { useQuery } from 'react-query'
import { Area } from '@features/area/type'
import { Worker } from '@features/workers/type'

export function useFeatureWorkers(geofence = false, refetchInterval = 1000) {
  const { data: workers, ...workerProps } = useQuery(
    ['status'],
    () =>
      fetch('/api/workers/')
        .then((res) => res.json())
        .then((res) => res.data as Promise<Worker[]>),
    {
      refetchInterval,
    },
  )
  const { data: areas, ...areaProps } = useQuery(['areas'], () =>
    fetch(
      `/api/areas/?order=ASC&page=0&perPage=1000&sortBy=name&geofence=${geofence}`,
    )
      .then((res) => res.json())
      .then((res) => res.data as Promise<Area[]>),
  )

  return {
    workers: workers || [],
    areas: areas || [],
    isLoading: workerProps.isLoading || areaProps.isLoading,
    isError: workerProps.isError || areaProps.isError,
    isFetching: workerProps.isFetching || areaProps.isFetching,
  }
}
