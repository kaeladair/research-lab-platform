import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const TopNav = ({ onMenuClick }) => {
    return (
      <AppBar position="static" sx={{ backgroundColor: '#000' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            Intemnets Lab
          </Typography>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default TopNav;
  
  