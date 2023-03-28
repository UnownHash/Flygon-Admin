import CssBaseline from '@mui/material/CssBaseline';
import GroupIcon from '@mui/icons-material/Group';
import MapIcon from '@mui/icons-material/Map';
import { Admin, CustomRoutes, Resource } from 'react-admin';
import { Route } from 'react-router-dom';

import { AreaCreate, AreaEdit, AreaList, AreaShow } from './features/area';
import { AccountCreate, AccountEdit, AccountImport, AccountList, AccountShow } from './features/account';
import { Layout, lightTheme, dataProvider } from './features/admin';

export const App = () => (
  <>
    <CssBaseline />
    <Admin
      dataProvider={dataProvider}
      layout={Layout}
      title="Flygon"
      disableTelemetry
      theme={lightTheme}
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
      <Resource name="areas" icon={MapIcon} list={AreaList} edit={AreaEdit} create={AreaCreate} show={AreaShow} />
    </Admin>
  </>
);
