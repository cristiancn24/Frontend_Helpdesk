"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const remember = localStorage.getItem("rememberMe") === "true"
    const storage = remember ? localStorage : sessionStorage
    const isAuthenticated = storage.getItem("isAuthenticated") === "true"

    if (isAuthenticated) {
      router.replace("/dashboard")
    } else {
      router.replace("/login")
    }
  }, [])

  return null
}
