import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  CssBaseline,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListAltIcon from '@mui/icons-material/ListAlt' // for Tasks
import ChatIcon from '@mui/icons-material/Chat' // for Chat
import DescriptionIcon from '@mui/icons-material/Description' // for Docs
import { SignIn, SignOut, useAuthentication } from '../services/authService' // Adjust the import path as needed

const drawerWidth = 240

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}))

export default function PersistentDrawerLayout({ children, onMenuItemClick }) {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const user = useAuthentication()
  const navigate = useNavigate(); // Adding the useNavigate hook


  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleMenuItemClick = (text) => {
    // Update the URL based on the menu item clicked
    switch(text) {
      case 'Tasks':
        navigate('/tasks');
        break;
      case 'Chat':
        navigate('/chat');
        break;
      case 'Docs':
        navigate('/docs');
        break;
      default:
        // Handle default case or error
    }
    handleDrawerClose(); // Close the drawer when a menu item is clicked
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Intemnets Lab
          </Typography>
          {user ? <SignOut /> : <SignIn />}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['Tasks', 'Chat', 'Docs'].map(text => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleMenuItemClick(text)}>
                <ListItemIcon>
                  {text === 'Tasks' && <ListAltIcon />}
                  {text === 'Chat' && <ChatIcon />}
                  {text === 'Docs' && <DescriptionIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  )
}
