import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: '#212121', // Example primary color
    },
    background: {
      default: '#121212', // Dark gray background
      paper: '#212121', // Dark gray for paper elements
    },
    // ...other customizations
  },
  // ...other theme options
});

export default Theme;
