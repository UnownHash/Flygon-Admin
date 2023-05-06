import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  Pagination,
  ReferenceField,
  TextField,
} from 'react-admin'

import { Worker } from './type'

export const WorkerList = () => {
  return (
    <List
      pagination={<Pagination rowsPerPageOptions={[25, 50, 100]} />}
      title="Workers"
      actions={false}
      perPage={25}
      sort={{ field: 'uuid', order: 'ASC' }}
    >
      <Datagrid>
        <TextField source="uuid" label="UUID" />
        <ReferenceField source="area_id" reference="areas">
          <TextField source="name" />
        </ReferenceField>
        <FunctionField
          label="Start / Current / End"
          render={(worker: Worker) =>
            `${worker.start_step} / ${worker.step} / ${worker.end_step}`
          }
        />
        <TextField source="username" />
        <TextField source="host" />
        <DateField source="last_seen" showDate showTime />
      </Datagrid>
    </List>
  )
}
