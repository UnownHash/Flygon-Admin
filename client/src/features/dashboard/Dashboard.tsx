import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Virtuoso } from 'react-virtuoso'

import { Worker } from '@features/workers/type'
import { DashboardTile } from './Tile'
import { CircularProgress, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useFeatureWorkers } from './useFeatureWorkers'

export const Dashboard = (): JSX.Element => {
  const [search, setSearch] = useState('')

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
    <Box mx={2} key={`${isLoading}`} height="75%">
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
        <Virtuoso
          totalCount={filteredAreas.length}
          data={filteredAreas}
          itemContent={(_, data) => {
            return (
              <DashboardTile area={data} workers={workerObj[data.id] || []} />
            )
          }}
        />
      )}
    </Box>
  )
}
