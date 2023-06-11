import Typography from '@mui/material/Typography'
import { useQuery } from 'react-query'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

import { Area, QuestStatus } from '../area/type'
import { Worker } from '@features/workers/type'
import { StatusTable } from './StatusTable'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ProgressBar } from './ProgressBar'
import { KojiMenuButton } from '@features/area/Koji'
import Grid from '@mui/material/Unstable_Grid2'

export const getPercent = (num = 0, total = 0) =>
  +((num || 0) / (total || 1)).toFixed(2) * 100

export const DashboardTile = ({
  area,
  workers,
}: {
  area: Area
  workers: Worker[]
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { data } = useQuery<QuestStatus>(
    ['queststatus', area.id],
    () =>
      fetch(`/api/quest-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fence: area.geofence }),
      }).then((res) => res.json()),
    {
      enabled: isIntersecting,
      refetchInterval: 1000 * 60,
    },
  )

  const areaWorkers = useMemo(() => {
    const local: Worker[] = workers
    for (let i = 0; i < area.pokemon_mode.workers; i++) {
      if (local[i]) continue
      local.push({
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
    return local
  }, [workers])

  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      })
      observer.observe(ref.current)
      return () => observer.disconnect()
    }
  }, [])

  if (isIntersecting) console.log(area.name, 'intersecting')

  return (
    <Card ref={ref} variant="outlined" sx={{ p: 4 }}>
      <CardHeader
        titleTypographyProps={{ variant: 'h4' }}
        action={<KojiMenuButton />}
        title={area.name}
        sx={{ py: 0 }}
      />
      <CardContent>
        <Grid container>
          <Grid xs={12} md={6}>
            <ProgressBar
              title="AR Quests"
              subtitle={`${data?.ar_quests || 0} / ${data?.total || 0}`}
              value={getPercent(data?.ar_quests, data?.total)}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <ProgressBar
              title="No AR Quests"
              subtitle={`${data?.no_ar_quests || 0} / ${data?.total || 0}`}
              value={getPercent(data?.no_ar_quests, data?.total)}
            />
          </Grid>
        </Grid>
        {areaWorkers.length ? (
          <StatusTable workers={areaWorkers} />
        ) : (
          <Typography variant="h6" component="div">
            No assigned or active workers
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
