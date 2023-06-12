import { ListContextProvider, useList } from 'react-admin'
import { useFeatureWorkers } from '@features/dashboard/useFeatureWorkers'
import TextField from '@mui/material/TextField'

import { useState } from 'react'
import { ListTable } from './ListTable'
// import { Area } from '@features/area/type'

// const buildWorkers = (areas: Area[]) => {
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
//       area_name: area?.name || 'Unknown',
//       host: '',
//     })
//   }
//   return workers
// }

export const WorkerList = (): JSX.Element => {
  const [search, setSearch] = useState('')
  const [active, setActive] = useState(false)

  const { areas, workers, isLoading, isFetching } = useFeatureWorkers(
    false,
    active ? 3000 : 1500,
  )
  // const customWorkers = useMemo(
  //   () => [...workers, ...buildWorkers(areas)],
  //   [areas],
  // )
  const areaObj = Object.fromEntries(areas.map((area) => [area.id, area]))

  const searchTerms = search.split(',')

  const listContext = useList({
    data: workers
      .map((w) => ({
        ...w,
        area_name: areaObj[w.area_id]?.name || 'Unknown',
      }))
      .filter(
        (w) =>
          !searchTerms.length ||
          searchTerms.some((t) => w.uuid.includes(t)) ||
          searchTerms.some((t) => w.username.includes(t)) ||
          searchTerms.some((t) => w.area_name.includes(t)),
      ),
    isLoading,
    isFetching,
    sort: { field: 'uuid', order: 'ASC' },
  })

  return (
    <ListContextProvider value={listContext}>
      <ListTable
        title="Workers"
        filters={
          <TextField
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            label={`Search ${
              search
                ? ` | Showing ${listContext.data.length} out of ${
                    workers.length || 0
                  }`
                : ''
            }`}
            variant="outlined"
            fullWidth
            sx={{ my: 2 }}
          />
        }
      />
    </ListContextProvider>
  )
}
