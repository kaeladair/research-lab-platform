import { useState, useEffect } from "react"
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { auth } from "../firebaseConfig"
import { Button, Avatar, Box, Typography } from '@mui/material';

export function SignIn() {
  return <Button variant="outlined" onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>Sign In</Button>
}

export function SignOut() {
    const userInitial = auth.currentUser.displayName ? auth.currentUser.displayName.charAt(0) : '?';

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
                sx={{ bgcolor: 'primary.main', marginRight: 1 }}
                src={auth.currentUser.photoURL} 
                alt={userInitial}
            >
                {!auth.currentUser.photoURL && userInitial}
            </Avatar>
            <Typography variant="body1" sx={{ marginRight: 1 }}>
                {auth.currentUser.displayName}
            </Typography>
            <Button variant="outlined" onClick={() => signOut(auth)}>Sign Out</Button>
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