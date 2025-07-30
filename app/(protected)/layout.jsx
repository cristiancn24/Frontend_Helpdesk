// app/(protected)/layout.jsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProtectedLayout({ children }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) {
      router.replace("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [])

  if (isAuthenticated === null) return null // muestra loader si quieres

  return <>{children}</>
}
