"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Edit, Trash2, MoreHorizontal, Building, Users, SettingsIcon } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import { getOffices, createOffice } from "@/services/officeService"
import { getDepartments, createDepartment } from "@/services/departmentsService"
import { getCategories, createCategory } from "@/services/categoryService"
import { toast } from "react-toastify";

export default function SettingsComponent() {
  const [activeSection, setActiveSection] = useState("services")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    description: "",
    code: "",
  })

  const [offices, setOffices] = useState([])
  const [departments, setDepartments] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

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

    const fetchOffices = async () => {
    try {
      setLoading(true)
      const data = await getOffices()
      setOffices(data)
    } catch (error) {
      console.error("Error fetching offices:", error)
      toast.error("Error al obtener oficinas")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Error al obtener categorías")
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const data = await getDepartments()
      setDepartments(data)
    } catch (error) {
      console.error("Error fetching departments:", error)
      toast.error("Error al obtener departamentos")
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    if (activeSection === "offices") {
      fetchOffices()
    } else if (activeSection === "departments") {
      fetchDepartments()
    } else if (activeSection === "services") {
      fetchCategories()
    }
  }, [activeSection])



  const getCurrentData = () => {
    if (activeSection === "offices") return offices
    if (activeSection === "departments") return departments
    if (activeSection === "services") return categories
    return []
  }

  const getCurrentSection = () => {
    return sections.find((section) => section.id === activeSection)
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    try {
    if (activeSection === "offices") {
      const newOfficeData = {
        name: newItemForm.name,
        id: newItemForm.id,
      };

      await createOffice(newOfficeData);

      toast.success("Oficina creada correctamente", {
        position: "top-center",
        autoClose: 2000,
      });

      setIsAddModalOpen(false);
      await fetchOffices();

      setNewItemForm({
        name: "",
        id: "",
      });
    } else if (activeSection === "departments") {
      const newDepartmentData = {
        name: newItemForm.name,
      };
      await createDepartment(newDepartmentData);

      toast.success("Departamento creado correctamente", {
        position: "top-center",
        autoClose: 2000,
      });
      setIsAddModalOpen(false);
      await fetchDepartments();
      setNewItemForm({
        name: "",
        id: "",
      });
    } else if (activeSection === "services") {
      const newCategoryData = {
        name: newItemForm.name,
      };
      await createCategory(newCategoryData);

      toast.success("Categoría creada correctamente", {
        position: "top-center",
        autoClose: 2000,
      });
      setIsAddModalOpen(false);
      await fetchCategories();
      setNewItemForm({
        name: "",
        id: "",
      });
    }
    setNewItemForm({
      name: "",
      id: "",
    });
      

    } catch (error) {
      console.error("Error al agregar el elemento:", error);
      toast.error("Error al crear la oficina", {
        position: "top-center",
        autoClose: 2000,
      });
    }
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
                  <TableHead className="w-[120px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentData().map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="w-[120px] text-right">
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
