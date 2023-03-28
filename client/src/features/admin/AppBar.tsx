import { Box, Typography } from '@mui/material';
import { AppBar as BaseAppBar, ToggleThemeButton } from 'react-admin';

import { darkTheme, lightTheme } from './themes';

export const AppBar: typeof BaseAppBar = (props) => (
  <BaseAppBar {...props}>
    <Box flex="1">
      <Typography variant="h6" id="react-admin-title" />
    </Box>
    <ToggleThemeButton lightTheme={lightTheme} darkTheme={darkTheme} />
  </BaseAppBar>
);
