import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#117b12' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
  },
});

export default theme;
