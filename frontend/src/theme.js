import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#059669' },
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
