import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { VariableSizeList } from 'react-window'
import { Worker } from '@features/workers/type'
import { DashboardTile } from './Tile'
import {
  CircularProgress,
  TextField,
  Theme,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useFeatureWorkers } from './useFeatureWorkers'

export const Dashboard = (): JSX.Element => {
  const [search, setSearch] = useState('')
  const isTablet = useMediaQuery((t: Theme) => t.breakpoints.down('sm'))

  const { workers, areas, isLoading } = useFeatureWorkers(true, 3000)

  const filteredAreas = useMemo(() => {
    if (!areas) return []
    return areas.filter((area) =>
      area.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [areas, search])

  const workerObj =
    workers?.reduce((acc, worker) => {
      acc[worker.area_id] = acc[worker.area_id] || []
      acc[worker.area_id].push(worker)
      return acc
    }, {} as Record<number, Worker[]>) || {}

  return (
    <Box mx={2} key={`${isLoading}`}>
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
          height={window.innerHeight}
          itemCount={filteredAreas.length}
          itemSize={(i) => {
            const length = workerObj[filteredAreas[i].id]?.length || 0
            return (
              (isTablet ? 450 : 305) +
              (length ? (isTablet ? 50 : 34) * (length + 1) : 0)
            )
          }}
          width={isTablet ? 800 : '100%'}
        >
          {({ index, style }) => {
            const area = filteredAreas[index]
            if (!area) return null
            return (
              <div key={area.id} style={style}>
                <DashboardTile area={area} workers={workerObj[area.id] || []} />
              </div>
            )
          }}
        </VariableSizeList>
      )}
    </Box>
  )
}
