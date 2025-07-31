// components/VisibleByRole.jsx
"use client"

import { useRole } from "@/context/RoleContext"

export default function VisibleByRole({ allowedRoles = [], children }) {
  const { role } = useRole()

  if (!allowedRoles.includes(role)) return null

  return children
}
