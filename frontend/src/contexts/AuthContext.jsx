import React, {createContext, useEffect, useState} from 'react'

export const AuthContext = createContext({ user: null, isAuth: false })

export function AuthProvider({children}){
  const [user, setUser] = useState(null)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(()=>{
    // Check if user is already logged in via http-only cookie (on mount)
    // Backend will include user in response if cookie is valid
    checkAuth()
  },[])

  async function checkAuth(){
    try{
      // Optional: fetch /api/v1/auth/me to verify cookie is valid
      // For now, assume http-only cookie is present if set by backend
      setIsAuth(true) // placeholder
    }catch(err){
      setIsAuth(false)
    }
  }

  function login({user}){
    // Backend sets http-only cookie; frontend just stores user data
    setUser(user)
    setIsAuth(true)
  }

  function logout(){
    // Backend clears http-only cookie on logout endpoint
    setUser(null)
    setIsAuth(false)
  }

  return (
    <AuthContext.Provider value={{user, isAuth, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
