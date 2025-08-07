import { Inter } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext"
import "./globals.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { RoleProvider } from "@/context/RoleContext"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <RoleProvider>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </RoleProvider>
      </body>
    </html>
  )
}
