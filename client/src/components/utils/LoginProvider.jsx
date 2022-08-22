import React from 'react'
import { useState } from 'react'

export const Context = React.createContext();

const LoginProvider = ({ children, loginState }) => {
  const [login, setLogin] = loginState
  return (
    <Context.Provider value={[login, setLogin]}>{children}</Context.Provider>
  )
}

export default LoginProvider