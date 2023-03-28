import {
  BooleanField,
  BulkDeleteWithUndoButton,
  CreateButton,
  Datagrid,
  DeleteWithUndoButton,
  EditButton,
  FunctionField,
  List,
  NumberField,
  Pagination,
  TextField,
  TopToolbar,
} from 'react-admin';

import { Area } from './type';
import { AreaExpand } from './AreaExpand';

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

const defaultSort = { field: 'id', order: 'ASC' };

const AreaPagination: typeof Pagination = (props) => <Pagination rowsPerPageOptions={[25, 50, 100]} {...props} />;

export const AreaList = () => {
  return (
    <List pagination={<AreaPagination />} title="Areas" actions={<ListActions />} perPage={25} sort={defaultSort}>
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
        <NumberField source="fort_mode.workers" label="Fort workers" />
        <NumberField source="quest_mode.workers" label="Quest workers" />
        <BooleanField source="enable_quests" label="Quest enabled" />
        <FunctionField<Area>
          label="Quest hours"
          render={(area) => {
            const hours = area?.quest_mode.hours;
            if (!hours || !Array.isArray(hours)) {
              return '-';
            }
            return hours.join(',');
          }}
        />
        <EditButton />
        <DeleteWithUndoButton />
      </Datagrid>
    </List>
  );
};
