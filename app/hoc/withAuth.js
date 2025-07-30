// app/hoc/withAuth.js o src/hoc/withAuth.js (según tu estructura)
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const router = useRouter()

    useEffect(() => {
      const isAuthenticated = localStorage.getItem("isAuthenticated")
      if (!isAuthenticated || isAuthenticated !== "true") {
        router.replace("/")
      }
    }, [])

    return <WrappedComponent {...props} />
  }
}

export default withAuth
