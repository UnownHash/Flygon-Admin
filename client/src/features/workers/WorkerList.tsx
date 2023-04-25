import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  Pagination,
  ReferenceField,
  TextField,
  useRefresh,
} from 'react-admin'

import { Worker } from './type'
import { useEffect } from 'react'

export const WorkerList = () => {
  const refresh = useRefresh()

  useEffect(() => {
    const timer = setInterval(() => {
      refresh()
    }, 2000)
    return () => clearInterval(timer)
  }, [])

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
            return `${record.step || 0}/${record.end_step || 0}`
          }}
        />
        <TextField source="username" />
        <TextField source="host" />
        <DateField source="last_seen" showDate showTime />
      </Datagrid>
    </List>
  )
}
