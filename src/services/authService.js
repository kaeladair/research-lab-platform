import { useState, useEffect } from "react"
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { auth } from "../firebaseConfig"
import { Button, Avatar } from '@mui/material';

export function SignIn() {
  return <Button variant="outlined" onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>Sign In</Button>
}

export function SignOut() {
    const userInitial = auth.currentUser.displayName ? auth.currentUser.displayName.charAt(0) : '?';

    return (
        <div>
            <Avatar sx={{ bgcolor: 'primary.main', marginRight: 1 }}>
                {auth.currentUser.photoURL ? <img src={auth.currentUser.photoURL} alt="" /> : userInitial}
            </Avatar>
            Hello, {auth.currentUser.displayName} &nbsp;
            <Button variant="outlined" onClick={() => signOut(auth)}>Sign Out</Button>
        </div>
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