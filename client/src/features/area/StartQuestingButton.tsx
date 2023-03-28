import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Button, useListContext, useNotify } from 'react-admin'
import { useMutation } from 'react-query'
import { fetchUtils, useRecordContext, useUnselectAll } from 'ra-core'

import { Area } from '@features/area/type'

const apiUrl = '/api'

export const BaseButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
}) => (
  <Button label="Start questing" onClick={onClick}>
    <PlayArrowIcon />
  </Button>
)

export const StartQuestingButton = () => {
  const area = useRecordContext<Area>()
  const notify = useNotify()

  const startQuestingMutation = useMutation(
    () => {
      return fetchUtils.fetchJson(`${apiUrl}/quest/${area.id}`)
    },
    {
      onSuccess: () => {
        notify(`Quest started on ${area.name}`, { type: 'success' })
      },
      onError: () => {
        notify(`Failed to start quest on ${area.name}`, { type: 'error' })
      },
    },
  )

  return (
    <BaseButton
      onClick={(event) => {
        event.stopPropagation()
        startQuestingMutation.mutate()
      }}
    />
  )
}

export const BulkQuestingButton = () => {
  const { selectedIds } = useListContext()
  const unSelectAll = useUnselectAll('areas')
  const notify = useNotify()

  const startQuestingMutation = useMutation(
    () => {
      return Promise.all(
        selectedIds.map((id) => fetchUtils.fetchJson(`${apiUrl}/quest/${id}`)),
      )
    },
    {
      onSuccess: () => {
        notify(`Quest started on ${selectedIds.length} area(s)`, {
          type: 'success',
        })
      },
      onError: () => {
        notify(`Failed to start quest on ${selectedIds.length} area(s)`, {
          type: 'error',
        })
      },
    },
  )

  return (
    <BaseButton
      onClick={(event) => {
        event.stopPropagation()
        startQuestingMutation.mutate()
        unSelectAll()
      }}
    />
  )
}
