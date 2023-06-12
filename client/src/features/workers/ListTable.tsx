import {
  Datagrid,
  FunctionField,
  ListView,
  ListViewProps,
  TextField as RaTextField,
} from 'react-admin'
import { Worker } from '@features/workers/type'
import { getRelativeTime } from '@features/dashboard/getRelativeTime'

export const ListTable = ({
  filters,
  title = ' ',
  sortable = true,
}: {
  filters?: ListViewProps['filters']
  title?: string
  sortable?: boolean
}): JSX.Element => {
  return (
    <ListView
      empty={false}
      filters={filters}
      title={title}
      actions={false}
      pagination={false}
    >
      <Datagrid rowClick="" bulkActionButtons={false}>
        <RaTextField source="uuid" sortable={sortable} />
        <RaTextField source="username" sortable={sortable} />
        <RaTextField source="area_name" sortable={sortable} />
        <FunctionField
          label="Last Seen"
          source="last_seen"
          render={(worker: Worker) =>
            worker.username ? getRelativeTime(worker.last_seen) : 'never'
          }
          sortable={sortable}
        />
        <FunctionField
          label="Start / Current / End"
          render={(worker: Worker) =>
            `${worker.start_step} / ${worker.step} / ${worker.end_step}`
          }
          sortable={sortable}
        />
      </Datagrid>
    </ListView>
  )
}
