import { useState, useEffect } from "react"
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { auth } from "../firebaseConfig"
import { Button, Avatar, Box, Typography, Tooltip, IconButton, Menu, MenuItem } from '@mui/material';

export function SignIn() {
  return (
    <Button color="inherit" onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>
      Login
    </Button>
  );
}

export function SignOut() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const userInitial = auth.currentUser.displayName ? auth.currentUser.displayName.charAt(0) : '?';
  const userPhoto = auth.currentUser.photoURL;

  const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
      setAnchorElUser(null);
  };

  const handleLogout = () => {
      signOut(auth);
      handleCloseUserMenu();
  };

  return (
      <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={userInitial} src={userPhoto} />
              </IconButton>
          </Tooltip>
          <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
          >
              <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
              </MenuItem>
          </Menu>
      </Box>
  );
}


export function useAuthentication() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      user ? setUser(user) : setUser(null)
    })
  }, [])
  return user
}