import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useQuery } from 'react-query'

import { useGetList } from 'ra-core'
import { Area } from '@features/area/type'
import { Worker } from '@features/workers/type'
import { usePersist } from '@state/useStore'
import { MemoAreaTable } from './AreaTable'

export const Dashboard = (): JSX.Element => {
  const { data: workers } = useQuery(
    ['status'],
    () =>
      fetch('/api/workers/')
        .then((res) => res.json())
        .then((res) => res.data as Promise<Worker[]>),
    {
      refetchInterval: 3000,
    },
  )
  const { data: areas } = useGetList<Area>('areas', {
    sort: { field: 'name', order: 'ASC' },
    pagination: { page: 1, perPage: 1000 },
    filter: { geometry: false },
  })
  const { toggleAll } = usePersist.getState()
  const [expandedState, setExpandedState, partial] = usePersist((s) => [
    s.expandedState,
    usePersist.setState,
    s.partiallyExpanded(),
  ])

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="h3"
          sx={{ margin: '0.35em 0' }}
          component="span"
          flexGrow={1}
        >
          Dashboard
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => toggleAll(!partial)}
          sx={{ marginLeft: '8px' }}
        >
          {partial ? 'Fold All' : 'Expand All'}
        </Button>
      </Box>

      {(areas || []).map((area) => {
        const areaWorkers =
          workers?.filter((worker) => worker.area_id === area.id) || []
        for (let i = 0; i < area.pokemon_mode.workers; i++) {
          if (areaWorkers[i]) continue
          areaWorkers.push({
            id: i + 1,
            step: 0,
            start_step: 0,
            end_step: 0,
            username: '',
            uuid: '',
            last_seen: Date.now(),
            area_id: area.id,
            host: '',
          })
        }
        return (
          <MemoAreaTable
            key={area.name}
            area={area}
            workers={areaWorkers}
            expanded={expandedState[area.name]}
            onChange={() =>
              setExpandedState((prev) => ({
                expandedState: {
                  ...prev.expandedState,
                  [area.name]: !prev.expandedState[area.name],
                },
              }))
            }
          />
        )
      })}
    </Box>
  )
}
