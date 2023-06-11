import {
  Datagrid,
  FunctionField,
  ListContextProvider,
  ListView,
  RaRecord,
  TextField,
  useList,
} from 'react-admin'
import { getRelativeTime } from './getRelativeTime'
import { Worker } from '@features/workers/type'

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
      <ListView pagination={false} title=" " actions={false}>
        <Datagrid rowClick="" bulkActionButtons={false}>
          <TextField source="uuid" sortable={false} />
          <TextField source="username" sortable={false} />
          <FunctionField
            label="Last Seen"
            source="last_seen"
            sortable={false}
            render={(worker: Worker) =>
              worker.username ? getRelativeTime(worker.last_seen) : 'never'
            }
          />
          <FunctionField
            label="Start / Current / End"
            sortable={false}
            render={(worker: Worker) =>
              `${worker.start_step} / ${worker.step} / ${worker.end_step}`
            }
          />
        </Datagrid>
      </ListView>
    </ListContextProvider>
  )
}
