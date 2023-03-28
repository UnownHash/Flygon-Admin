import {
  Create,
  Datagrid,
  FormDataConsumer,
  number,
  NumberInput,
  required,
  ResourceContextProvider,
  SimpleForm,
  TextField,
  TextInput,
  useNotify,
  useRedirect,
} from 'react-admin';
import { parse } from 'papaparse';
import { Typography } from '@mui/material';

import { Account } from './type';

export const transformPayload = ({ csv, level }: { csv: string; level: number }) => {
  return {
    accounts: parseCSVtoAccountArray(csv),
    default_level: level,
  };
};

const parseCSVtoAccountArray = (value: string): Array<Pick<Account, 'username' | 'password'> & { index: number }> => {
  const parsedValue = parse<string[]>(value);

  return parsedValue.data.map((csvColumn, index) => ({ index, username: csvColumn[0], password: csvColumn[1] }));
};

const sort = { field: 'index', order: 'ASC' };
const levelValidation = [required(), number()];
const requiredValidation = [required()];

export const AccountImport = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify('Account created successfully');
    redirect('list', 'accounts');
  };

  return (
    <ResourceContextProvider value="accounts">
      <Create title="Import multiple accounts" transform={transformPayload} mutationOptions={{ onSuccess }}>
        <SimpleForm>
          <NumberInput source="level" defaultValue={1} validate={levelValidation} />
          <TextInput
            fullWidth
            helperText="CSV of the accounts list, one account per line"
            multiline
            placeholder={`username,password\nusername,password`}
            rows={10}
            source="csv"
            validate={requiredValidation}
          />
          <FormDataConsumer>
            {({ formData }) => {
              if (!('csv' in formData) || !formData.csv) {
                return null;
              }

              const parsedCsv = parseCSVtoAccountArray(formData.csv);

              return (
                <>
                  <Typography>Parsed value</Typography>
                  <Datagrid data={parsedCsv} sort={sort}>
                    <TextField source="username" />
                    <TextField source="password" />
                  </Datagrid>
                </>
              );
            }}
          </FormDataConsumer>
        </SimpleForm>
      </Create>
    </ResourceContextProvider>
  );
};
