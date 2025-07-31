"use client"

import { createContext, useContext, useState, useEffect } from "react"

const RoleContext = createContext()

export function RoleProvider({ children }) {
  const [role, setRole] = useState(null)

  useEffect(() => {
  const localRemember = localStorage.getItem("rememberMe") === "true"
  const sessionRemember = sessionStorage.getItem("rememberMe") === "true"
  const rememberMe = localRemember || sessionRemember

  const storage = rememberMe ? localStorage : sessionStorage
  const storedRole = storage.getItem("userRole")

  if (storedRole) {
    setRole(parseInt(storedRole, 10))
  }
}, [])



  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
