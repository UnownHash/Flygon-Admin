import {
  // BooleanField,
  BulkDeleteWithUndoButton,
  CreateButton,
  Datagrid,
  DeleteWithUndoButton,
  EditButton,
  // FunctionField,
  List,
  NumberField,
  Pagination,
  TextField,
  TopToolbar,
} from 'react-admin'

// import { Area } from './type'
import { AreaExpand } from './AreaExpand'
import { KojiMenuButton } from './Koji'

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
)

export const AreaList = () => {
  return (
    <List
      pagination={<Pagination rowsPerPageOptions={[25, 50, 100]} />}
      title="Areas"
      actions={<ListActions />}
      perPage={25}
      sort={{ field: 'id', order: 'ASC' }}
    >
      <Datagrid
        rowClick="expand"
        expand={<AreaExpand />}
        bulkActionButtons={
          <>
            <BulkDeleteWithUndoButton />
          </>
        }
      >
        <TextField source="name" />
        <NumberField source="pokemon_mode.workers" label="Pokemon workers" />
        {/* <NumberField source="fort_mode.workers" label="Fort workers" />
        <NumberField source="quest_mode.workers" label="Quest workers" />
        <BooleanField source="enable_quests" label="Quest enabled" />
        <FunctionField<Area>
          label="Quest hours"
          render={(area) => {
            const hours = area?.quest_mode.hours
            if (!hours || !Array.isArray(hours)) {
              return '-'
            }
            return hours.join(',')
          }}
        /> */}
        <EditButton />
        <DeleteWithUndoButton />
        <KojiMenuButton />
      </Datagrid>
    </List>
  )
}
