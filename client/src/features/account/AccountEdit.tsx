import { Edit, useNotify, useRedirect } from 'react-admin'

import { AccountForm } from './AccountForm'
import { Account } from './type'

const transformPayload = (
  {
    username: new_username,
    password: new_password,
    level,
  }: Pick<Account, 'username' | 'password' | 'level'>,
  options:
    | { previousData: Pick<Account, 'username' | 'password' | 'level'> }
    | undefined,
) => {
  return {
    accounts: [
      {
        username: options?.previousData.username,
        new_username,
        new_password,
      },
    ],
    default_level: level,
  }
}

export const AccountEdit = () => {
  const notify = useNotify()
  const redirect = useRedirect()

  const onSuccess = () => {
    notify('Account edited successfully')
    redirect('list', 'accounts')
  }

  return (
    <Edit
      transform={transformPayload}
      mutationOptions={{ onSuccess }}
      mutationMode="pessimistic"
    >
      <AccountForm />
    </Edit>
  )
}
