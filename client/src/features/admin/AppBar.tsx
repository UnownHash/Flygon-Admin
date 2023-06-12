import { Box, Typography } from '@mui/material'
import { AppBar as BaseAppBar } from 'react-admin'

export const AppBar: typeof BaseAppBar = (props) => (
  <BaseAppBar {...props}>
    <Box flex="1">
      <Typography variant="h6" id="react-admin-title" />
    </Box>
  </BaseAppBar>
)
