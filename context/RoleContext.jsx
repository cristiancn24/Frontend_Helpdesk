"use client";

import { createContext, useContext, useState } from "react"

const RoleContext = createContext()

export function RoleProvider({ children }) {
  // Aquí defines el rol actual para pruebas
  const [role, setRole] = useState("admin") // puedes cambiar entre admin, agent, customer

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
