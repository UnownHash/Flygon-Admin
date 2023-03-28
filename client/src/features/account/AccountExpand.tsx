import { useRecordContext } from 'react-admin';
import Typography from '@mui/material/Typography';

import { Account } from './type';
import { formatDate, snakeToPascal } from './utils';

export const AccountExpand = () => {
  const record = useRecordContext<Account>();

  return (
    <div>
      {(['last_banned', 'last_disabled', 'last_suspended'] as const).map((key) => (
        <Typography key={key} variant="subtitle2">
          {snakeToPascal(key)}: {formatDate(record?.[key])}
        </Typography>
      ))}
    </div>
  );
};
