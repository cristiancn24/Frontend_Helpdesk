"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Edit, Trash2, MoreHorizontal, Building, Users, SettingsIcon } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"

export default function SettingsComponent() {
  const [activeSection, setActiveSection] = useState("services")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    description: "",
    code: "",
  })

  // Datos de ejemplo para cada sección
  const settingsData = {
    services: [
      { id: 1, name: "Soporte Técnico", description: "Asistencia técnica general", code: "ST001", status: "Activo" },
      { id: 2, name: "Mantenimiento", description: "Servicios de mantenimiento", code: "MT002", status: "Activo" },
      { id: 3, name: "Instalación", description: "Instalación de equipos", code: "IN003", status: "Activo" },
      { id: 4, name: "Capacitación", description: "Entrenamiento de usuarios", code: "CP004", status: "Inactivo" },
    ],
    offices: [
      { id: 1, name: "Sucursal Centro", description: "Oficina principal", code: "SC001", status: "Activo" },
      { id: 2, name: "Sucursal Norte", description: "Sucursal zona norte", code: "SN002", status: "Activo" },
      { id: 3, name: "Sucursal Sur", description: "Sucursal zona sur", code: "SS003", status: "Activo" },
      { id: 4, name: "Sucursal Este", description: "Sucursal zona este", code: "SE004", status: "Activo" },
      { id: 5, name: "Sucursal Oeste", description: "Sucursal zona oeste", code: "SO005", status: "Inactivo" },
    ],
    departments: [
      { id: 1, name: "IT Department", description: "Tecnología de la información", code: "IT001", status: "Activo" },
      { id: 2, name: "Customer Service", description: "Atención al cliente", code: "CS001", status: "Activo" },
      { id: 3, name: "Development", description: "Desarrollo de software", code: "DV001", status: "Activo" },
      { id: 4, name: "QA Department", description: "Control de calidad", code: "QA001", status: "Activo" },
      { id: 5, name: "Security", description: "Seguridad informática", code: "SC001", status: "Activo" },
      { id: 6, name: "Human Resources", description: "Recursos humanos", code: "HR001", status: "Inactivo" },
    ],
  }

  const sections = [
    {
      id: "services",
      name: "Categorías de Servicios",
      icon: SettingsIcon,
      description: "Gestionar tipos de servicios disponibles",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "offices",
      name: "Oficinas",
      icon: Building,
      description: "Administrar sucursales y ubicaciones",
      color: "bg-green-100 text-green-800",
    },
    {
      id: "departments",
      name: "Departamentos/Áreas",
      icon: Users,
      description: "Organizar departamentos y áreas",
      color: "bg-pink-100 text-pink-800",
    },
  ]

  const getCurrentData = () => {
    return settingsData[activeSection] || []
  }

  const getCurrentSection = () => {
    return sections.find((section) => section.id === activeSection)
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para agregar el nuevo elemento
    console.log("Nuevo elemento:", newItemForm, "Sección:", activeSection)

    // Resetear formulario y cerrar modal
    setNewItemForm({ name: "", description: "", code: "" })
    setIsAddModalOpen(false)

    alert("Elemento agregado exitosamente")
  }

  const handleFormChange = (field, value) => {
    setNewItemForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <MainLayout title="Configuración del Sistema">
      <div className="space-y-6">
        {/* Header con descripción */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuración del Sistema</h2>
              <p className="text-gray-600">Administra las configuraciones principales del sistema de helpdesk</p>
            </div>
          </CardContent>
        </Card>

        {/* Navegación de secciones */}
        <Card>
          <CardHeader>
            <CardTitle>Secciones de Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Nuevo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agregar {getCurrentSection()?.name}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddItem} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{getCurrentSection()?.name} *</Label>
                      <Input
                        id="name"
                        placeholder={`Ingresar ${getCurrentSection()?.name}`}
                        value={newItemForm.name}
                        onChange={(e) => handleFormChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tabla de elementos */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentData().map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.code}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-gray-600">{item.description}</TableCell>
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
      </div>
    </MainLayout>
  )
}
