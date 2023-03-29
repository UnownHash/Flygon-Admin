import { Create, useNotify, useRedirect } from 'react-admin'

import { AccountForm } from './AccountForm'
import { Account } from './type'

const transformPayload = ({
  username,
  password,
  level,
}: Pick<Account, 'username' | 'password' | 'level'>) => {
  return {
    accounts: [
      {
        username,
        password,
      },
    ],
    default_level: level,
  }
}

export const AccountCreate = () => {
  const notify = useNotify()
  const redirect = useRedirect()

  const onSuccess = () => {
    notify('Account created successfully')
    redirect('list', 'accounts')
  }

  return (
    <Create
      title="Create One Account"
      transform={transformPayload}
      mutationOptions={{ onSuccess }}
    >
      <AccountForm />
    </Create>
  )
}
