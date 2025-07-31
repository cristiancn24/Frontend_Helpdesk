"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, MoreHorizontal, Users, Shield, Key, UserCheck } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import axios from "axios"
import axiosInstance from "@/services/axiosInstance"

export default function AuthComponent() {
  const [activeSection, setActiveSection] = useState("users")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditPermissionsOpen, setIsEditPermissionsOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [rolePermissions, setRolePermissions] = useState({})
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    office: "",
    department: "",
    role: "",
    description: "",
    status: "Activo",
  })

  const [roles, setRoles] = useState([])
  const [departments, setDepartments] = useState([])
  const [offices, setOffices] = useState([])

useEffect(() => {
  const fetchData = async () => {
    try {
      const [rolesRes, officesRes, departmentsRes] = await Promise.all([
        axiosInstance.get("/roles"),
        //axiosInstance.get("/offices"),
       // axiosInstance.get("/departments"),
      ])

      setRoles(rolesRes.data)
      //setOffices(officesRes.data)
      //setDepartments(departmentsRes.data)
    } catch (error) {
      console.error("Error al cargar datos:", error)
    }
  }

  fetchData()
}, [])
  // Datos de ejemplo para cada sección
  const authData = {
    users: [
      {
        id: 1,
        name: "Juan Pérez",
        email: "juan.perez@empresa.com",
        role: "Administrador",
        status: "Activo",
        createdAt: "2024-01-01",
      },
      {
        id: 2,
        name: "María García",
        email: "maria.garcia@empresa.com",
        role: "Técnico Senior",
        status: "Activo",
        createdAt: "2024-01-02",
      },
      {
        id: 3,
        name: "Carlos López",
        email: "carlos.lopez@empresa.com",
        role: "Técnico",
        status: "Activo",
        createdAt: "2024-01-03",
      },
      {
        id: 4,
        name: "Ana Martínez",
        email: "ana.martinez@empresa.com",
        role: "Usuario",
        status: "Inactivo",
        createdAt: "2024-01-04",
      },
    ],
    roles: [
      {
        id: 1,
        name: "Administrador",
        userCount: 1,
      },
      {
        id: 2,
        name: "Técnico Senior",
        userCount: 1,
      },
      {
        id: 3,
        name: "Técnico",
        userCount: 1,
      },
      {
        id: 4,
        name: "Usuario",
        userCount: 1,
      },
    ],
    permissions: [
      {
        id: 1,
        name: "create",
        description: "Crear nuevos tickets y elementos",
        status: "Activo",
      },
      {
        id: 2,
        name: "read",
        description: "Ver tickets y información del sistema",
        status: "Activo",
      },
      {
        id: 3,
        name: "update",
        description: "Editar tickets existentes",
        status: "Activo",
      },
      {
        id: 4,
        name: "delete",
        description: "Eliminar tickets y elementos",
        status: "Activo",
      },
      {
        id: 5,
        name: "assign",
        description: "Asignar tickets a técnicos",
        status: "Activo",
      },
      {
        id: 6,
        name: "admin",
        description: "Administración completa del sistema",
        status: "Activo",
      },
      {
        id: 7,
        name: "reports",
        description: "Generar y ver reportes",
        status: "Inactivo",
      },
      {
        id: 8,
        name: "settings",
        description: "Modificar configuraciones del sistema",
        status: "Activo",
      },
    ],
    assignments: [
      {
        id: 1,
        roleName: "Administrador",
        userCount: 1,
        permissions: {
          create: true,
          read: true,
          update: true,
          delete: true,
          assign: true,
          admin: true,
          reports: true,
          settings: true,
        },
      },
      {
        id: 2,
        roleName: "Técnico Senior",
        userCount: 1,
        permissions: {
          create: true,
          read: true,
          update: true,
          delete: false,
          assign: true,
          admin: false,
          reports: true,
          settings: false,
        },
      },
      {
        id: 3,
        roleName: "Técnico",
        userCount: 1,
        permissions: {
          create: false,
          read: true,
          update: true,
          delete: false,
          assign: false,
          admin: false,
          reports: false,
          settings: false,
        },
      },
      {
        id: 4,
        roleName: "Usuario",
        userCount: 1,
        permissions: {
          create: true,
          read: true,
          update: false,
          delete: false,
          assign: false,
          admin: false,
          reports: false,
          settings: false,
        },
      },
    ],
  }

  const allPermissions = [
    { name: "create", description: "Crear nuevos tickets y elementos" },
    { name: "read", description: "Ver tickets y información del sistema" },
    { name: "update", description: "Editar tickets existentes" },
    { name: "delete", description: "Eliminar tickets y elementos" },
    { name: "assign", description: "Asignar tickets a técnicos" },
    { name: "admin", description: "Administración completa del sistema" },
    { name: "reports", description: "Generar y ver reportes" },
    { name: "settings", description: "Modificar configuraciones del sistema" },
  ]

  const sections = [
    {
      id: "users",
      name: "Usuarios",
      icon: Users,
      description: "Gestionar usuarios del sistema",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "roles",
      name: "Roles",
      icon: Shield,
      description: "Administrar roles y niveles de acceso",
      color: "bg-green-100 text-green-800",
    },
    {
      id: "permissions",
      name: "Permisos",
      icon: Key,
      description: "Definir permisos específicos",
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "assignments",
      name: "Asignación de Permisos",
      icon: UserCheck,
      description: "Gestionar permisos por rol",
      color: "bg-orange-100 text-orange-800",
    },
  ]

  const getCurrentData = () => {
    return authData[activeSection] || []
  }

  const getCurrentSection = () => {
    return sections.find((section) => section.id === activeSection)
  }

  const getStatusBadge = (status) => {
    return status === "Activo"
      ? "bg-green-100 text-green-800 hover:bg-green-100"
      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }

  

  const handleAddItem = async (e) => {
  e.preventDefault()

  if (activeSection === "users") {
    if (newItemForm.password !== newItemForm.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    if (newItemForm.password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres")
      return
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // importante para enviar cookies (token JWT)
        body: JSON.stringify({
          first_name: newItemForm.name,
          last_name: newItemForm.lastname,
          email: newItemForm.email,
          password: newItemForm.password,
          role_id: parseInt(newItemForm.role),
          office_id: 1, // Ajusta esto según tu lógica
          department_id: 1 // Ajusta esto también
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al crear usuario")
      }

      alert("Usuario creado correctamente")
      setIsAddModalOpen(false)

    } catch (error) {
      console.error("Error al crear usuario:", error.message)
      alert(error.message)
    }
  }

  setNewItemForm({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    office: "",
    department: "",
    role: "",
    description: "",
    status: "Activo",
  })
}


  const handleFormChange = (field, value) => {
    setNewItemForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEditPermissions = (role) => {
    setSelectedRole(role)
    setRolePermissions(role.permissions)
    setIsEditPermissionsOpen(true)
  }

  const handlePermissionToggle = (permissionName, isActive) => {
    setRolePermissions((prev) => ({
      ...prev,
      [permissionName]: isActive,
    }))
  }

  const handleSavePermissions = () => {
    console.log(`Guardando permisos para ${selectedRole.roleName}:`, rolePermissions)
    setIsEditPermissionsOpen(false)
    setSelectedRole(null)
    setRolePermissions({})
    alert("Permisos actualizados exitosamente")
  }

  const renderTableContent = () => {
    switch (activeSection) {
      case "users":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentData().map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusBadge(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "roles":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentData().map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                      {role.userCount} usuarios
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "permissions":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permiso</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentData().map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium font-mono">{permission.name}</TableCell>
                  <TableCell className="text-gray-600">{permission.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusBadge(permission.status)}>
                      {permission.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "assignments":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead>Permisos Activos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentData().map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.roleName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                      {assignment.userCount} usuarios
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(assignment.permissions)
                        .filter(([_, isActive]) => isActive)
                        .slice(0, 3)
                        .map(([permission]) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      {Object.values(assignment.permissions).filter(Boolean).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{Object.values(assignment.permissions).filter(Boolean).length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditPermissions(assignment)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar Permisos
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      default:
        return null
    }
  }

  const renderAddForm = () => {
    switch (activeSection) {
      case "users":
        return (
          <form onSubmit={handleAddItem} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  placeholder="Nombre"
                  value={newItemForm.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Apellido *</Label>
                <Input
                  id="lastname"
                  placeholder="Apellido"
                  value={newItemForm.lastname}
                  onChange={(e) => handleFormChange("lastname", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="cristian.jimenez@pasaportes.gob.do"
                value={newItemForm.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  value={newItemForm.password}
                  onChange={(e) => handleFormChange("password", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••••"
                  value={newItemForm.confirmPassword}
                  onChange={(e) => handleFormChange("confirmPassword", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="office">Oficina *</Label>
                <Select value={newItemForm.office} onValueChange={(value) => handleFormChange("office", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="centro">Sucursal Centro</SelectItem>
                    <SelectItem value="norte">Sucursal Norte</SelectItem>
                    <SelectItem value="sur">Sucursal Sur</SelectItem>
                    <SelectItem value="este">Sucursal Este</SelectItem>
                    <SelectItem value="oeste">Sucursal Oeste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Dep. y/o Área Oper. *</Label>
                <Select value={newItemForm.department} onValueChange={(value) => handleFormChange("department", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT Department</SelectItem>
                    <SelectItem value="customer">Customer Service</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="qa">QA Department</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select value={newItemForm.role} onValueChange={(value) => handleFormChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                Guardar
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )

      case "roles":
        return (
          <form onSubmit={handleAddItem} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Rol *</Label>
              <Input
                id="name"
                placeholder="Ej: Supervisor"
                value={newItemForm.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Rol
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        )

      case "permissions":
        return (
          <form onSubmit={handleAddItem} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Permiso *</Label>
              <Input
                id="name"
                placeholder="Ej: export_data"
                value={newItemForm.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                placeholder="Describe qué permite hacer este permiso"
                value={newItemForm.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                className="min-h-[80px] resize-none"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <Select value={newItemForm.status} onValueChange={(value) => handleFormChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Activo
                    </div>
                  </SelectItem>
                  <SelectItem value="Inactivo">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      Inactivo
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Permiso
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        )

      default:
        return null
    }
  }

  return (
    <MainLayout title="Autenticación y Permisos">
      <div className="space-y-6">
        {/* Header con descripción */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Autenticación</h2>
              <p className="text-gray-600">Administra usuarios, roles, permisos y asignaciones del sistema</p>
            </div>
          </CardContent>
        </Card>

        {/* Navegación de secciones */}
        <Card>
          <CardHeader>
            <CardTitle>Secciones de Autenticación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-start gap-3 text-left ${
                      activeSection === section.id ? "bg-cyan-500 hover:bg-cyan-600 text-white" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`p-2 rounded-lg ${activeSection === section.id ? "bg-white/20" : section.color}`}>
                        <Icon className={`h-5 w-5 ${activeSection === section.id ? "text-white" : "text-current"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{section.name}</h3>
                        <p className={`text-sm ${activeSection === section.id ? "text-white/80" : "text-gray-500"}`}>
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Contenido de la sección activa */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getCurrentSection() && (
                  <>
                    <div className={`p-2 rounded-lg ${getCurrentSection().color}`}>
                      {(() => {
                        const Icon = getCurrentSection().icon
                        return Icon ? <Icon className="h-5 w-5" /> : null
                      })()}
                    </div>
                    <div>
                      <CardTitle>{getCurrentSection().name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{getCurrentSection().description}</p>
                    </div>
                  </>
                )}
              </div>
              {activeSection !== "assignments" && (
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Nuevo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Agregar {getCurrentSection()?.name}</DialogTitle>
                    </DialogHeader>
                    {renderAddForm()}
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {renderTableContent()}

            {/* Estadísticas de la sección */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-cyan-600">{getCurrentData().length}</p>
                  <p className="text-sm text-gray-600">Total de elementos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal para editar permisos */}
        <Dialog open={isEditPermissionsOpen} onOpenChange={setIsEditPermissionsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Permisos - {selectedRole?.roleName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                {allPermissions.map((permission) => (
                  <div key={permission.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium font-mono">{permission.name}</h4>
                      <p className="text-sm text-gray-600">{permission.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rolePermissions[permission.name] || false}
                        onCheckedChange={(checked) => handlePermissionToggle(permission.name, checked)}
                      />
                      <Badge
                        variant="secondary"
                        className={
                          rolePermissions[permission.name]
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {rolePermissions[permission.name] ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSavePermissions} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Guardar Permisos
                </Button>
                <Button variant="outline" onClick={() => setIsEditPermissionsOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
