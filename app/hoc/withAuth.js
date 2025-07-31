"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
  const localAuth = localStorage.getItem("isAuthenticated")
  const sessionAuth = sessionStorage.getItem("isAuthenticated")

  console.log("LOCAL:", localAuth)
  console.log("SESSION:", sessionAuth)

  if (localAuth === "true" || sessionAuth === "true") {
    setLoading(false)
  } else {
    router.replace("/login")
  }
}, [router])


    if (loading) return null // Evita parpadeo de contenido

    return <WrappedComponent {...props} />
  }
}

export default withAuth
