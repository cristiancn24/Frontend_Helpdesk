"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function PublicLayout({ children }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe") === "true"
    const storage = rememberMe ? localStorage : sessionStorage
    const isAuth = storage.getItem("isAuthenticated") === "true"

    if (isAuth) {
      router.replace("/dashboard")
    } else {
      setChecking(false)
    }
  }, [])

  if (checking) return null // puedes retornar un loader aquí si deseas

  return <>{children}</>
}
