import {
  BooleanField,
  FunctionField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
} from 'react-admin'
import WarningIcon from '@mui/icons-material/Warning'
import ReportIcon from '@mui/icons-material/Report'
import PersonOffIcon from '@mui/icons-material/PersonOff'

import { Account } from './type'
import { formatDate, snakeToPascal } from './utils'

export const AccountShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="username" />
      <TextField source="password" />
      <NumberField source="level" />
      <BooleanField source="in_use" />
      <BooleanField source="warn" TrueIcon={WarningIcon} />
      <BooleanField source="banned" TrueIcon={ReportIcon} />
      <BooleanField source="invalid" TrueIcon={ReportIcon} />
      <BooleanField source="suspended" TrueIcon={ReportIcon} />
      <BooleanField source="disabled" TrueIcon={PersonOffIcon} />
      <BooleanField source="warn_message_acknowledged" />
      <BooleanField source="suspended_message_acknowledged" />
      <NumberField source="warn_expiration_ms" />
      {(['last_banned', 'last_suspended', 'last_disabled'] as const).map(
        (key) => (
          <FunctionField<Account>
            key={key}
            label={snakeToPascal(key)}
            render={(account) => formatDate(account?.[key])}
          />
        ),
      )}
    </SimpleShowLayout>
  </Show>
)
