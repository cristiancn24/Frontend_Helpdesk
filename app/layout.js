import { Inter } from "next/font/google"
import { RoleProvider } from "@/context/RoleContext"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Web Helpdesk - Sistema de Tickets",
  description: "Sistema de gestión de tickets de soporte técnico",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  )
}
