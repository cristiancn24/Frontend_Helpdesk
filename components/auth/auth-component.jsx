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
import { Plus, Edit, Trash2, MoreHorizontal, Users, Shield, Key, UserCheck, ChevronLeft, ChevronRight } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import axios from "axios"
import axiosInstance from "@/services/axiosInstance"
import { createUser, getUsers } from "@/services/userService";
import { toast } from "react-toastify"
import { getPermissions } from "@/services/permissionService"; 
import { createRole, getRolePermissions, getRolesWithPermissions, updateRolePermissions } from "@/services/roleService"
import { createPermission } from "@/services/permissionService"
import { useAuth } from "@/context/AuthContext"


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
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;
  const [permissions, setPermissions] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const fetchPermissions = async (page = 1) => {
    try {
      const data = await getPermissions();
      setPermissions(data); // Asumiendo que los permisos están en `data.permissions`
    } catch (error) {
      console.error("Error al cargar los permisos:", error);
    }
  };

  useEffect(() => {
    fetchPermissions(); // Llama a la función para obtener los permisos al cargar el componente
  }, []);

  const fetchRolesWithPermissions = async () => {
  try {
    const data = await getRolesWithPermissions();
    setAssignments(data);
  } catch (error) {
    console.error("Error al cargar roles con permisos:", error);
  }
};

useEffect(() => {
  if (activeSection === "assignments") {
    fetchRolesWithPermissions();
  }
}, [activeSection]);


  const fetchUsers = async (page = 1) => {
  try {
    const data = await getUsers(page, itemsPerPage);
    console.log("Usuarios desde userService:", data); // ✅ DEBUG

    setUsers(data.data);          // asegúrate que `data.data` es un array
    setCurrentPage(data.page);
    setTotalPages(data.totalPages);
  } catch (error) {
    console.error("Error al obtener usuarios desde el servicio:", error);
  }
};


  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);


useEffect(() => {
  const fetchData = async () => {
    try {
      const [rolesRes, officesRes, departmentsRes] = await Promise.all([
        axiosInstance.get("/roles"),
        axiosInstance.get("/offices"),
        axiosInstance.get("/departments"),
      ])

      setRoles(rolesRes.data)
      setOffices(officesRes.data)
      setDepartments(departmentsRes.data)
    } catch (error) {
      console.error("Error al cargar datos:", error)
    }
  }

  fetchData()
}, [])


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
  switch (activeSection) {
    case "users":
      return users;
    case "roles":
      return roles;
    case "permissions":
      return permissions;
    case "assignments":
      return assignments;
    default:
      return [];
  }
};


  const getCurrentSection = () => {
    return sections.find((section) => section.id === activeSection)
  }

  const getStatusBadge = (status) => {
    return status === "Activo" || status === "Activado"
      ? "bg-green-100 text-green-800 hover:bg-green-100"
      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }

  

  const handleAddItem = async (e) => {
  e.preventDefault();

  try {
    if (activeSection === "users") {
      if (newItemForm.password !== newItemForm.confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      if (newItemForm.password.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres");
        return;
      }

      const newUserData = {
        first_name: newItemForm.name,
        last_name: newItemForm.lastname,
        email: newItemForm.email,
        password: newItemForm.password,
        role_id: parseInt(newItemForm.role),
        office_id: parseInt(newItemForm.office),
        department_id: parseInt(newItemForm.department),
        activated: "active",
      };

      await createUser(newUserData);

      toast.success("Usuario creado correctamente", {
        position: "top-center",
        autoClose: 2000,
      });

      setIsAddModalOpen(false);
      await fetchUsers();

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
      });
    } 
    
    else if (activeSection === "roles") {
      await createRole(newItemForm.name);

      toast.success("Rol creado correctamente", {
        position: "top-center",
        autoClose: 2000,
      });

      setIsAddModalOpen(false);
      if (typeof fetchRoles === "function") {
        await fetchRoles();
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
      });
    } 
    
    else if (activeSection === "permissions") {
      const newPermissionData = {
        name: newItemForm.name,
        description: newItemForm.description,
        status: newItemForm.status,
      };

      await createPermission(newPermissionData);

      toast.success("Permiso creado correctamente", {
        position: "top-center",
        autoClose: 2000,
      });

      setIsAddModalOpen(false);
      await fetchPermissions();

      setNewItemForm({
        name: "",
        description: "",
        status: "Activado",
      });
    }
  } catch (error) {
    console.error(`Error al crear ${activeSection}:`, error);
    toast.error(error.response?.data?.error || "Error desconocido", {
      position: "top-center",
      autoClose: 2000,
    });
  }
};



  const handleFormChange = (field, value) => {
    setNewItemForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEditPermissions = async (role) => {
  try {
    const rolePerms = await getRolePermissions(role.id);

    // Convertimos a objeto {permName: true/false}
    const permState = {};
    permissions.forEach((p) => {
      permState[p.name] = rolePerms.some((rp) => rp.name === p.name);
    });

    setSelectedRole(role);
    setRolePermissions(permState);
    setIsEditPermissionsOpen(true);
  } catch (error) {
    console.error("Error al obtener permisos del rol:", error);
  }
}

  const handlePermissionToggle = (permissionName, isActive) => {
    setRolePermissions((prev) => ({
      ...prev,
      [permissionName]: isActive,
    }))
  }

  const handleSavePermissions = async () => {
  try {
    const selectedPermissions = Object.entries(rolePermissions)
      .filter(([_, isActive]) => isActive)
      .map(([permName]) => {
        const perm = permissions.find(p => p.name === permName);
        return perm?.id;
      })
      .filter(Boolean);

    await updateRolePermissions(selectedRole.id, selectedPermissions);

    toast.success("Permisos actualizados correctamente", { autoClose: 2000 });
    setIsEditPermissionsOpen(false);
    fetchRolesWithPermissions(); // recargar tabla
  } catch (error) {
    console.error("Error al actualizar permisos:", error);
    toast.error("No se pudieron actualizar los permisos", { autoClose: 2000 });
  }
};


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
                  <TableCell className="font-medium">{`${user.first_name} ${user.last_name}`}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {user.roles?.name || "Sin rol"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusBadge(user.activated === "active" ? "Activo" : "Inactivo")}
                    >
                      {user.activated === "active" ? "Activo" : "Inactivo"}
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
              {Array.isArray(getCurrentData()) && getCurrentData().map((permission) => (
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
              {assignments.map((assignment) => (
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
                    {offices.map((office) => (
                      <SelectItem key={office.id} value={String(office.id)}>
                        {office.name}
                      </SelectItem>
                    ))}
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
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={String(department.id)}>
                        {department.name}
                      </SelectItem>
                    ))}
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
                  <SelectItem value="Activado">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Activado
                    </div>
                  </SelectItem>
                  <SelectItem value="Pendiente">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      Pendiente
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

            <div className="flex items-center justify-center mt-6 space-x-2">
  <Button
    variant="outline"
    size="sm"
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    <ChevronLeft className="h-4 w-4 mr-1" />
    Anterior
  </Button>

  {Array.from({ length: totalPages }, (_, i) => (
    <Button
      key={i}
      size="sm"
      className={currentPage === i + 1 ? "bg-cyan-500 text-white hover:bg-cyan-600" : ""}
      variant="outline"
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </Button>
  ))}

  <Button
    variant="outline"
    size="sm"
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    Siguiente
    <ChevronRight className="h-4 w-4 ml-1" />
  </Button>
</div>



            {/* Estadísticas de la sección */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-cyan-600">{Array.isArray(getCurrentData()) && getCurrentData().length}</p>
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
                {permissions.map((permission) => (
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
