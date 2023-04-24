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
        <FunctionField<Worker>
          label="Location"
          render={(record) => {
            if (!record) return null
            const totalLength = (record.end_step || 0) - (record.step || 0)
            const currentPos = (record.step || 0)
            return `${currentPos}/${totalLength}`
          }}
        />
        <TextField source="username" />
        <TextField source="host" />
        <DateField source="last_seen" showDate showTime />
      </Datagrid>
    </List>
  )
}
