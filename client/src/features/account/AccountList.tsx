import {
  BooleanField,
  Button,
  CreateButton,
  Datagrid,
  DeleteWithUndoButton,
  EditButton,
  List,
  NumberField,
  Pagination,
  TextField,
  TopToolbar,
  useCreatePath,
  useResourceContext,
} from 'react-admin'
import WarningIcon from '@mui/icons-material/Warning'
import ReportIcon from '@mui/icons-material/Report'
import UploadIcon from '@mui/icons-material/Upload'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import { Link } from 'react-router-dom'

import { AccountExpand } from './AccountExpand'
import { LevelStatsTable } from './LevelStats'

export const ListActions = () => {
  const resource = useResourceContext()
  const createPath = useCreatePath()

  return (
    <TopToolbar>
      <Button
        color="primary"
        component={Link}
        to={createPath({ resource, type: 'import' })}
        label="Batch import"
      >
        <UploadIcon />
      </Button>
      <CreateButton />
    </TopToolbar>
  )
}

const defaultSort = { field: 'username', order: 'ASC' }

const AccountPagination: typeof Pagination = (props) => (
  <Pagination rowsPerPageOptions={[25, 50, 100]} {...props} />
)

export const AccountList = () => {
  return (
    <>
      <LevelStatsTable />
      <List
        pagination={<AccountPagination />}
        title="Accounts"
        actions={<ListActions />}
        perPage={25}
        sort={defaultSort}
      >
        <Datagrid rowClick="expand" expand={<AccountExpand />}>
          <TextField source="username" />
          <NumberField source="level" />
          <BooleanField source="in_use" />
          <BooleanField source="warn" TrueIcon={WarningIcon} />
          <BooleanField source="banned" TrueIcon={ReportIcon} />
          <BooleanField source="invalid" TrueIcon={ReportIcon} />
          <BooleanField source="suspended" TrueIcon={ReportIcon} />
          <BooleanField source="disabled" TrueIcon={PersonOffIcon} />
          <EditButton />
          <DeleteWithUndoButton />
        </Datagrid>
      </List>
    </>
  )
}
