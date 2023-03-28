import { createTheme } from '@mui/material';
import { defaultTheme } from 'react-admin';

export const lightTheme = {
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
    secondary: {
      ...defaultTheme.palette.secondary,
      dark: '#b26a00',
      main: '#ff9800',
      light: '#ffac33',
    },
  },
};
export const darkTheme = createTheme({
  palette: { mode: 'dark' },
});
