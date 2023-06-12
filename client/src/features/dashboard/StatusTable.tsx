import { ListContextProvider, RaRecord, useList } from 'react-admin'
import { Worker } from '@features/workers/type'
import { ListTable } from '@features/workers'

export const StatusTable = ({
  workers,
}: {
  workers: Worker[]
}): JSX.Element => {
  const listContext = useList({
    data: workers as unknown as RaRecord[],
    sort: { field: 'start_step', order: 'ASC' },
  })

  return (
    <ListContextProvider value={listContext}>
      <ListTable sortable={false} />
    </ListContextProvider>
  )
}
