"use client"

import { Button } from "@/components/ui/button"
import { LayoutDashboard, Ticket, HelpCircle, Settings, Shield } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRole } from "@/context/RoleContext"

export default function Sidebar() {
  const pathname = usePathname()
  const { role } = useRole()

  // Definimos las rutas
  const menuItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: role === 3 ? "/tickets-supervisor" : "/tickets",
      icon: Ticket,
      label: "Tickets",
    },
    {
      href: "/pool",
      icon: Ticket,
      label: "Pool Tickets",
    },
    {
      href: "/faq",
      icon: HelpCircle,
      label: "Preguntas Frecuentes",
    },
    {
      href: "/auth",
      icon: Shield,
      label: "Autenticación",
      roleRequired: [1], // Solo visible para admin
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Configuración",
      roleRequired: [1, 2],
    },
  ]

  // Filtrar items por rol si es necesario
  const filteredItems = menuItems.filter((item) => {
    if (item.roleRequired && !item.roleRequired.includes(role)) return false
    return true
  })

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-gray-900">Helpdesk</h1>
      </div>
      <nav className="mt-6">
        <div className="px-3">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start mb-1 ${
                    isActive ? "bg-cyan-500 hover:bg-cyan-600 text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
