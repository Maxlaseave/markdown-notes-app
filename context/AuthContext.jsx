'use client'

import { auth } from "@/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export default function AuthProvider(props) {
    const {children} = props
    const [currentUser, setCurrentUser] = useState(null)
    const [isLoadingUser, setIsLoadingUser] = useState(true)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email,password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        setCurrentUser(null)
        return signOut(auth)
    }

    // resetpasswordemail
    // sendPasswordResetEmail(auth, email)

    useEffect(() => { 
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('Authenticating user...')
            setIsLoadingUser(true)
            try {
                setCurrentUser(user)

                if(!user){
                    throw Error('No User Found')
                }

                // if user exists, then fetch their data
            } catch (err) {
                console.log(err.message)
            } finally {
                setIsLoadingUser(false)
            }

        })    

        //clean up function, unsubscribe the auth changes, cleans the auth changes
        return unsubscribe
    }, [])

    const value = {
         currentUser,
         isLoadingUser,
         signup,
         login,
         logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}