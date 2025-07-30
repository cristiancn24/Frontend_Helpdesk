import { Inter } from "next/font/google"
import { RoleProvider } from "@/context/RoleContext"
import "./globals.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <RoleProvider>
          {children}
          <ToastContainer /> 
        </RoleProvider>
      </body>
    </html>
  )
}
