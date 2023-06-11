import { useRef, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useQuery } from 'react-query'
import { VariableSizeList } from 'react-window'
import { Area } from '@features/area/type'
import { Worker } from '@features/workers/type'
import { DashboardTile } from './Tile'
import { CircularProgress, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

export const Dashboard = (): JSX.Element => {
  const [search, setSearch] = useState('')

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
  const { data: areas, isLoading } = useQuery(['areas'], () =>
    fetch('/api/areas/?order=ASC&page=0&perPage=1000&sortBy=name')
      .then((res) => res.json())
      .then((res) => res.data as Promise<Area[]>),
  )

  const filteredAreas = useMemo(() => {
    if (!areas) return []
    return areas.filter((area) =>
      area.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [areas, search])

  const parentRef = useRef<HTMLDivElement>(null)

  const workerObj =
    workers?.reduce((acc, worker) => {
      acc[worker.area_id] = acc[worker.area_id] || []
      acc[worker.area_id].push(worker)
      return acc
    }, {} as Record<number, Worker[]>) || {}

  return (
    <Box mx={2}>
      <Box py={2}>
        <Typography
          variant="h3"
          sx={{ margin: '0.35em 0' }}
          component="span"
          flexGrow={1}
        >
          Dashboard
        </Typography>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          label={`Search ${
            search
              ? ` | Showing ${filteredAreas.length} out of ${
                  areas?.length || 0
                }`
              : ''
          }`}
          variant="outlined"
          fullWidth
          sx={{ my: 2 }}
        />
      </Box>
      <Box ref={parentRef} sx={{ width: '100%', height: 'calc(100%-300px)' }}>
        {isLoading ? (
          <Grid
            container
            width="100%"
            height="80vh"
            alignItems="center"
            justifyContent="center"
          >
            <Grid>
              <CircularProgress size={100} />
              <br />
              <Typography variant="h6" align="center">
                Loading...
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <VariableSizeList
            key={search}
            height={parentRef?.current?.clientHeight || 0}
            itemCount={filteredAreas.length}
            itemSize={(i) => {
              const length = workerObj[filteredAreas[i].id]?.length || 0
              return 305 + (length ? 34 * (length + 1) : 0)
            }}
            width="100%"
          >
            {({ index, style }) => {
              const area = filteredAreas[index]
              if (!area) return null
              return (
                <div key={area.id} style={style}>
                  <DashboardTile
                    area={area}
                    workers={workerObj[area.id] || []}
                  />
                </div>
              )
            }}
          </VariableSizeList>
        )}
      </Box>
    </Box>
  )
}
