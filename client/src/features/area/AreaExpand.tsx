import { useRecordContext } from 'react-admin'
import Typography from '@mui/material/Typography'
import { useQuery } from 'react-query'

import { Area, QuestStatus } from './type'

export const AreaExpand = () => {
  const record = useRecordContext<Area>()
  const { data } = useQuery<QuestStatus>(['queststatus', record.id], () =>
    fetch(`/api/quest-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fence: record.geofence }),
    }).then((res) => res.json()),
  )

  return (
    <div>
      <Typography variant="caption">
        Total Pokéstops: {data?.total || 0} | Quests Found: {data?.quests || 0}{' '}
        | Alt Quests Found: {data?.alt_quests || 0}
      </Typography>
    </div>
  )
}
