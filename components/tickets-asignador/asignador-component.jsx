"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus, UserPlus, Users, MoreHorizontal, Eye, Edit, UserCheck, Tag } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"

export default function AsignadorComponent() {
  const [selectedTickets, setSelectedTickets] = useState([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [assignmentModal, setAssignmentModal] = useState(false)
  const [categoryModal, setCategoryModal] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [currentTicketForCategory, setCurrentTicketForCategory] = useState(null)

  const tickets = [
    {
      id: "#1234",
      title: "Login Issue",
      client: "John Doe",
      email: "john.doe@email.com",
      status: "Open",
      priority: "High",
      technician: null,
      category: null,
      branch: "Sucursal Centro",
      created: "2024-01-15",
      isAssigned: false,
      needsCategory: true,
    },
    {
      id: "#1233",
      title: "Password Reset",
      client: "Jane Smith",
      email: "jane.smith@email.com",
      status: "Resolved",
      priority: "Medium",
      technician: "Mike Johnson",
      category: "Account Issues",
      branch: "Sucursal Norte",
      created: "2024-01-14",
      isAssigned: true,
      needsCategory: false,
    },
    {
      id: "#1232",
      title: "Feature Request",
      client: "Mike Johnson",
      email: "mike.j@email.com",
      status: "In Progress",
      priority: "Low",
      technician: "Alex Chen",
      category: "Enhancement",
      branch: "Sucursal Sur",
      created: "2024-01-13",
      isAssigned: true,
      needsCategory: false,
    },
    {
      id: "#1231",
      title: "Bug Report - Dashboard",
      client: "Emily Davis",
      email: "emily.d@email.com",
      status: "Open",
      priority: "High",
      technician: null,
      category: null,
      branch: "Sucursal Este",
      created: "2024-01-12",
      isAssigned: false,
      needsCategory: true,
    },
    {
      id: "#1230",
      title: "Account Suspension",
      client: "Robert Brown",
      email: "robert.b@email.com",
      status: "Closed",
      priority: "Medium",
      technician: "Mike Johnson",
      category: "Account Issues",
      branch: "Sucursal Centro",
      created: "2024-01-11",
      isAssigned: true,
      needsCategory: false,
    },
  ]

  const technicians = [
    { id: "1", name: "Sarah Wilson", department: "IT Department", available: true },
    { id: "2", name: "Mike Johnson", department: "Customer Service", available: true },
    { id: "3", name: "Alex Chen", department: "Development", available: false },
    { id: "4", name: "Emily Rodriguez", department: "IT Department", available: true },
    { id: "5", name: "David Kim", department: "Customer Service", available: true },
  ]

  const categories = [
    { id: "1", name: "Technical Support", description: "Problemas técnicos generales" },
    { id: "2", name: "Account Issues", description: "Problemas de cuenta y acceso" },
    { id: "3", name: "Bug Report", description: "Reportes de errores del sistema" },
    { id: "4", name: "Enhancement", description: "Solicitudes de mejoras" },
    { id: "5", name: "Hardware", description: "Problemas de hardware" },
    { id: "6", name: "Software", description: "Problemas de software" },
  ]

  const stats = [
    {
      title: "Sin Categoría",
      count: tickets.filter((t) => t.needsCategory).length,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Sin Asignar",
      count: tickets.filter((t) => !t.isAssigned).length,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "En Progreso",
      count: tickets.filter((t) => t.status === "In Progress").length,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Resueltos",
      count: tickets.filter((t) => t.status === "Resolved").length,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      Open: { color: "bg-red-100 text-red-800", label: "Abierto" },
      "In Progress": { color: "bg-blue-100 text-blue-800", label: "En Progreso" },
      Resolved: { color: "bg-green-100 text-green-800", label: "Resuelto" },
      Closed: { color: "bg-gray-100 text-gray-800", label: "Cerrado" },
    }
    return statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status }
  }

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      High: { color: "bg-red-100 text-red-800", label: "Alta" },
      Medium: { color: "bg-yellow-100 text-yellow-800", label: "Media" },
      Low: { color: "bg-green-100 text-green-800", label: "Baja" },
    }
    return priorityConfig[priority] || { color: "bg-gray-100 text-gray-800", label: priority }
  }

  const handleSelectTicket = (ticketId) => {
    setSelectedTickets((prev) => (prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]))
  }

  const handleSelectAll = () => {
    const unassignedTickets = tickets.filter((ticket) => !ticket.isAssigned).map((ticket) => ticket.id)
    setSelectedTickets((prev) => (prev.length === unassignedTickets.length ? [] : unassignedTickets))
  }

  const handleBulkAssignment = () => {
    if (selectedTechnician && selectedTickets.length > 0) {
      console.log(`Asignando tickets ${selectedTickets.join(", ")} a ${selectedTechnician}`)
      setSelectedTickets([])
      setAssignmentModal(false)
      setSelectedTechnician("")
    }
  }

  const handleCategoryAssignment = () => {
    if (selectedCategory && currentTicketForCategory) {
      console.log(`Asignando categoría ${selectedCategory} al ticket ${currentTicketForCategory}`)
      setCategoryModal(false)
      setSelectedCategory("")
      setCurrentTicketForCategory(null)
    }
  }

  const openCategoryModal = (ticketId) => {
    setCurrentTicketForCategory(ticketId)
    setCategoryModal(true)
  }

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus === "unassigned") return !ticket.isAssigned
    if (filterStatus === "assigned") return ticket.isAssigned
    if (filterStatus === "no-category") return ticket.needsCategory
    return true
  })

  return (
    <MainLayout title="Gestión de Tickets - Supervisor">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.count}</p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-full`}>
                  <Users className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Buscar tickets..." className="pl-10" />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tickets</SelectItem>
                  <SelectItem value="no-category">Sin categoría</SelectItem>
                  <SelectItem value="unassigned">Sin asignar</SelectItem>
                  <SelectItem value="assigned">Asignados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              {selectedTickets.length > 0 && (
                <Dialog open={assignmentModal} onOpenChange={setAssignmentModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Asignar ({selectedTickets.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Asignar Tickets</DialogTitle>
                      <DialogDescription>
                        Selecciona un técnico para asignar {selectedTickets.length} ticket(s)
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar técnico..." />
                        </SelectTrigger>
                        <SelectContent>
                          {technicians
                            .filter((tech) => tech.available)
                            .map((tech) => (
                              <SelectItem key={tech.id} value={tech.name}>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  {tech.name} - {tech.department}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAssignmentModal(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleBulkAssignment} disabled={!selectedTechnician}>
                        Asignar Tickets
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              <Dialog open={categoryModal} onOpenChange={setCategoryModal}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Asignar Categoría</DialogTitle>
                    <DialogDescription>
                      Selecciona una categoría para el ticket {currentTicketForCategory}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            <div>
                              <div className="font-medium">{category.name}</div>
                              <div className="text-sm text-gray-500">{category.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCategoryModal(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCategoryAssignment} disabled={!selectedCategory}>
                      Asignar Categoría
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Ticket
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {filterStatus === "unassigned"
                ? "Tickets Sin Asignar"
                : filterStatus === "assigned"
                  ? "Tickets Asignados"
                  : filterStatus === "no-category"
                    ? "Tickets Sin Categoría"
                    : "Todos los Tickets"}
            </CardTitle>
            {filteredTickets.filter((t) => !t.isAssigned).length > 0 && (
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                <Checkbox
                  checked={selectedTickets.length === filteredTickets.filter((t) => !t.isAssigned).length}
                  className="mr-2"
                />
                Seleccionar sin asignar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">
                    <Checkbox checked={selectedTickets.length > 0} onCheckedChange={handleSelectAll} />
                  </th>
                  <th className="text-left p-4 font-medium text-gray-600">ID</th>
                  <th className="text-left p-4 font-medium text-gray-600">Título</th>
                  <th className="text-left p-4 font-medium text-gray-600">Cliente</th>
                  <th className="text-left p-4 font-medium text-gray-600">Estado</th>
                  <th className="text-left p-4 font-medium text-gray-600">Prioridad</th>
                  <th className="text-left p-4 font-medium text-gray-600">Técnico</th>
                  <th className="text-left p-4 font-medium text-gray-600">Categoría</th>
                  <th className="text-left p-4 font-medium text-gray-600">Creado</th>
                  <th className="text-left p-4 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedTickets.includes(ticket.id)}
                        onCheckedChange={() => handleSelectTicket(ticket.id)}
                        disabled={ticket.isAssigned}
                      />
                    </td>
                    <td className="p-4">
                      <span className="text-blue-600 font-medium">{ticket.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{ticket.title}</div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{ticket.client}</div>
                        <div className="text-sm text-gray-500">{ticket.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusBadge(ticket.status).color}>
                        {getStatusBadge(ticket.status).label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getPriorityBadge(ticket.priority).color}>
                        {getPriorityBadge(ticket.priority).label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {ticket.technician ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">{ticket.technician}</span>
                        </div>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Sin asignar</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      {ticket.category ? (
                        <Badge className="bg-blue-100 text-blue-800">{ticket.category}</Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCategoryModal(ticket.id)}
                          className="bg-orange-50 text-orange-600 hover:bg-orange-100"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          Asignar
                        </Button>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">{ticket.created}</span>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Ticket
                          </DropdownMenuItem>
                          {!ticket.category && (
                            <DropdownMenuItem onClick={() => openCategoryModal(ticket.id)}>
                              <Tag className="h-4 w-4 mr-2" />
                              Asignar Categoría
                            </DropdownMenuItem>
                          )}
                          {!ticket.isAssigned && (
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Asignar Técnico
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  )
}
