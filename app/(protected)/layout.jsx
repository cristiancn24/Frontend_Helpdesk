"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProtectedLayout({ children }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(null)

 useEffect(() => {
  const rememberMeValue = localStorage.getItem("rememberMe");
  const rememberMe = rememberMeValue === "true";
  const storage = rememberMeValue === null ? sessionStorage : (rememberMe ? localStorage : sessionStorage);

  const isAuth = storage.getItem("isAuthenticated");

  if (!isAuth || isAuth !== "true") {
    router.replace("/login");
  } else {
    setIsAuthenticated(true);
  }
}, []);


  if (isAuthenticated === null) return null // loader opcional

  return <>{children}</>
}
