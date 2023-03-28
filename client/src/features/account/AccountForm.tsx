import { number, NumberInput, required, SimpleForm, TextInput } from 'react-admin';

const stringValidation = [required()];
const levelValidation = [number()];

export const AccountForm = (): JSX.Element => {
  return (
    <SimpleForm>
      <TextInput source="username" validate={stringValidation} />
      <TextInput source="password" validate={stringValidation} />
      <NumberInput source="level" defaultValue={1} validate={levelValidation} />
    </SimpleForm>
  );
};
