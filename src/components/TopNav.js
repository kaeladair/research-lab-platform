import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuthentication, SignIn, SignOut } from '../services/authService.js'

const TopNav = ({ onMenuClick }) => {
  const user = useAuthentication() // This defines the 'user'

  return (
    <AppBar position="static" sx={{ backgroundColor: '#000' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Intemnets Lab
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
          {user ? <SignOut /> : <SignIn />}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopNav
