"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { logout } from "../../services/authService"
import { toast } from "react-toastify"

export default function Header({ title }) {
  const router = useRouter()

  const handleLogout = async () => {
  try {
    await logout();
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Sesión cerrada exitosamente", {
      position: "top-center",
      onClose: () => router.push("/login"),
      autoClose: 2000, // 2 segundos antes de redirigir
    });
  } catch (error) {
    toast.error("Error al cerrar sesión", {
      position: "top-center",
      autoClose: 2000,
    });
  }
};

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Menú desplegable del avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
