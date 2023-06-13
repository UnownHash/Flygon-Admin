import { ListContextProvider, useList } from 'react-admin'
import { useFeatureWorkers } from '@features/dashboard/useFeatureWorkers'
import TextField from '@mui/material/TextField'

import { useState } from 'react'
import { ListTable } from './ListTable'

export const WorkerList = (): JSX.Element => {
  const [search, setSearch] = useState('')
  const [active, setActive] = useState(false)

  const { areas, workers, isLoading, isFetching } = useFeatureWorkers(
    false,
    active ? 3000 : 1500,
  )
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
