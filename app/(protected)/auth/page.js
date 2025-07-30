"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useRole } from "@/context/RoleContext"

import AuthComponent from "@/components/auth/auth-component"

export default function AuthPage() {

  const { role } = useRole()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (role === null) return
    if (role !== 1 && role !== 2) {
      router.replace("/unauthorized") 
    } else {
      setLoading(false)
    }
  }, [role])

  if (loading) return null

  return <AuthComponent />
}
