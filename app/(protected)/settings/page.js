"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useRole } from "@/context/RoleContext"
import SettingsComponent from "@/components/settings/settings-component"

export default function SettingsPage() {
  const { role } = useRole()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (role === null) return // aún cargando el contexto
    if (role !== 1 && role !== 2) {
      router.replace("/unauthorized") // mejor que push para evitar que el usuario vuelva con "Atrás"
    } else {
      setLoading(false)
    }
  }, [role])

  if (loading) return null // o un loader/spinner si quieres

  return <SettingsComponent />
}
