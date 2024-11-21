import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    // Add any custom theme properties here if needed
  }
  interface ThemeOptions {
    // Add any custom theme options here if needed
  }
  interface Palette {
    darkGrey: Palette['primary'];
    darkpurple: Palette['primary'];
    green: Palette['primary'];
    lightgrey: Palette['primary'];
  }
  interface PaletteOptions {
    darkGrey: PaletteOptions['primary'];
    darkpurple: PaletteOptions['primary'];
    green: PaletteOptions['primary'];
    lightgrey: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: '1.5rem',
      color: '#333D4E',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      color: '#333D4E',
      fontWeight: 400,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 400,
    },
    body1: {
      fontSize: '1rem',
      color: '#333D4E',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: '#666666',
    },
  },
  palette: {
    lightgrey: {
      main: '#F6F6F6',
    },
    darkGrey: {
      main: '#787486',
      contrastText: '#ffffff',
    },
    primary: {
      main: '#333D4E',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#000000',
    },

    green: {
      main: '#0CBFD5',
    },

    darkpurple: {
      main: '#905AA6',
    },
  },
}); 