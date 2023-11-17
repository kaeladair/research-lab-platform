import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: '#BB86FC', // A light purple color for primary elements
      contrastText: '#FFFFFF', // White text for better contrast on primary elements
    },
    secondary: {
      main: '#03DAC6', // A teal color for secondary elements
    },
    error: {
      main: '#CF6679', // Error color
    },
    background: {
      default: '#121212', // Dark gray background
      paper: '#1E1E1E', // Slightly lighter gray for paper elements
    },
    // Define additional colors for your theme
    info: {
      main: '#2196f3', // Blue color for informational elements
    },
    success: {
      main: '#4caf50', // Green color for success state
    },
    warning: {
      main: '#ff9800', // Orange color for warning state
    },
    text: {
      primary: '#E0E0E0', // Light gray color for primary text
      secondary: '#A0A0A0', // Dimmed gray for secondary text
    },
  },
  typography: {
    // Custom Typography options can go here
  },
  // ...other theme options
});

export default Theme;

