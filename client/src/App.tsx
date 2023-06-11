import CssBaseline from '@mui/material/CssBaseline'
import GroupIcon from '@mui/icons-material/Group'
import MapIcon from '@mui/icons-material/Map'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import { Admin, CustomRoutes, Resource } from 'react-admin'
import { Route } from 'react-router-dom'

import { AreaCreate, AreaEdit, AreaList, AreaShow } from '@features/area'
import {
  AccountCreate,
  AccountEdit,
  AccountImport,
  AccountList,
  AccountShow,
} from '@features/account'
import { Layout, dataProvider, darkTheme } from '@features/admin'
import { authProvider } from '@features/admin/authProvider'
import { WorkerList } from '@features/workers'
import { Dashboard } from '@features/dashboard'

export const App = () => (
  <>
    <CssBaseline />
    <Admin
      dashboard={Dashboard}
      dataProvider={dataProvider}
      authProvider={authProvider}
      layout={Layout}
      title="Flygon"
      disableTelemetry
      theme={darkTheme}
    >
      <Resource
        name="accounts"
        icon={GroupIcon}
        list={AccountList}
        edit={AccountEdit}
        create={AccountCreate}
        show={AccountShow}
      />
      <CustomRoutes>
        <Route path="/accounts/import" element={<AccountImport />} />
      </CustomRoutes>
      <Resource
        name="areas"
        icon={MapIcon}
        list={AreaList}
        edit={AreaEdit}
        create={AreaCreate}
        show={AreaShow}
      />
      <Resource name="workers" icon={PhoneIphoneIcon} list={WorkerList} />
    </Admin>
  </>
)
