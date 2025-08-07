"use client";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "@/services/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const fetchProfile = async () => {
  try {
    const res = await axiosInstance.get("/users/me");
    console.log("Perfil recibido:", res.data);
    setUser(res.data);
    setPermissions(res.data.permissions || []);
  } catch (error) {
    console.error("Error al obtener perfil:", error);

    if (error.response?.status === 401) {
      sessionStorage.clear(); // ✅ Siempre limpia

      // Redirige solo si NO estás en /login
      if (pathname !== "/login") {
        router.replace("/login");
      }
    }
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    // Evita llamar a la API si ya estás en /login
    if (pathname === "/login") {
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [pathname]);

  const hasPermission = (permName) => permissions.includes(permName);

  const isAuthenticated = !!user;

  // 🚫 Evita renderizar mientras loading es true
  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ user, permissions, hasPermission, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
