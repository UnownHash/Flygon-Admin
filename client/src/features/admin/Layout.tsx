import { Layout as BaseLayout } from 'react-admin'

import { AppBar } from './AppBar'

export const Layout: typeof BaseLayout = (props) => (
  <BaseLayout {...props} appBar={AppBar} />
)
