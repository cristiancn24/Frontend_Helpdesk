"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Eye,
  Edit,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Users,
  Filter,
  X,
  Upload,
} from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import TicketEditAndReassign from "@/components/tickets/ticket-edit-reasign-component"

export default function TicketsComponent() {
  const [editTicket, setEditTicket] = useState(null)
  const [reassignTicketId, setReassignTicketId] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const [newTicketForm, setNewTicketForm] = useState({
    oficina: "",
    asunto: "",
    prioridad: "",
    descripcion: "",
  })
  const [attachedFiles, setAttachedFiles] = useState([])

  const tickets = [
    {
      id: "#1234",
      title: "Login Issue",
      customer: "John Doe",
      email: "john.doe@email.com",
      status: "Open",
      priority: "High",
      assignee: "Sarah Wilson",
      category: "Technical Support",
      department: "IT Department",
      branch: "Sucursal Centro",
      created: "2024-01-15",
      updated: "1 hour ago",
    },
    {
      id: "#1233",
      title: "Password Reset",
      customer: "Jane Smith",
      email: "jane.smith@email.com",
      status: "Resolved",
      priority: "Medium",
      assignee: "Mike Johnson",
      category: "Account Issues",
      department: "Customer Service",
      branch: "Sucursal Norte",
      created: "2024-01-14",
      updated: "2 hours ago",
    },
    {
      id: "#1232",
      title: "Feature Request",
      customer: "Mike Johnson",
      email: "mike.j@email.com",
      status: "In Progress",
      priority: "Low",
      assignee: "Alex Chen",
      category: "Enhancement",
      department: "Development",
      branch: "Sucursal Sur",
      created: "2024-01-13",
      updated: "3 hours ago",
    },
    {
      id: "#1231",
      title: "Bug Report - Dashboard",
      customer: "Emily Davis",
      email: "emily.d@email.com",
      status: "Open",
      priority: "High",
      assignee: "Sarah Wilson",
      category: "Bug Report",
      department: "QA Department",
      branch: "Sucursal Este",
      created: "2024-01-12",
      updated: "5 hours ago",
    },
    {
      id: "#1230",
      title: "Account Suspension",
      customer: "Robert Brown",
      email: "robert.b@email.com",
      status: "Closed",
      priority: "Medium",
      assignee: "Mike Johnson",
      category: "Account Issues",
      department: "Security",
      branch: "Sucursal Centro",
      created: "2024-01-11",
      updated: "12 hours ago",
    },
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      Open: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      "In Progress": "bg-blue-100 text-blue-800 hover:bg-blue-100",
      Resolved: "bg-green-100 text-green-800 hover:bg-green-100",
      Closed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    }
    return statusConfig[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      High: "bg-red-100 text-red-800 hover:bg-red-100",
      Medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      Low: "bg-green-100 text-green-800 hover:bg-green-100",
    }
    return priorityConfig[priority] || "bg-gray-100 text-gray-800"
  }

  const getActiveFiltersCount = () => {
    return Object.values(activeFilters).filter((value) => value && value !== "all").length
  }

  const clearAllFilters = () => {
    setActiveFilters({})
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
    }))
    setAttachedFiles((prev) => [...prev, ...newFiles])
    // Limpiar el input para permitir seleccionar el mismo archivo de nuevo si es necesario
    e.target.value = ""
  }

  const removeFile = (fileId) => {
    setAttachedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return "🖼️"
    if (fileType.includes("pdf")) return "📄"
    if (fileType.includes("word")) return "📝"
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "📊"
    if (fileType.includes("zip") || fileType.includes("rar")) return "🗜️"
    return "📎"
  }

  const handleNewTicketSubmit = (e) => {
    e.preventDefault()

    // Validación básica
    if (!newTicketForm.oficina || !newTicketForm.asunto || !newTicketForm.prioridad || !newTicketForm.descripcion) {
      alert("Por favor, completa todos los campos")
      return
    }

    // Aquí iría la lógica para enviar el ticket al backend
    console.log("Nuevo ticket:", newTicketForm)
    console.log("Archivos adjuntos:", attachedFiles)

    // Resetear formulario y cerrar modal
    setNewTicketForm({
      oficina: "",
      asunto: "",
      prioridad: "",
      descripcion: "",
    })
    setAttachedFiles([])
    setIsNewTicketOpen(false)

    // Mostrar mensaje de éxito (puedes reemplazar con toast)
    alert("Ticket creado exitosamente")
  }

  const handleFormChange = (field, value) => {
    setNewTicketForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <MainLayout title="Tickets">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">89</p>
              <p className="text-sm text-gray-600">Abiertos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">45</p>
              <p className="text-sm text-gray-600">En Progreso</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">234</p>
              <p className="text-sm text-gray-600">Resueltos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">879</p>
              <p className="text-sm text-gray-600">Cerrados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Buscar tickets..." className="pl-10" />
              </div>

              {/* Filters Button */}
              <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="relative bg-transparent">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                    {getActiveFiltersCount() > 0 && (
                      <Badge className="ml-2 bg-cyan-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Filtros de Tickets</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Primera fila de filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Técnico</label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar técnico" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los técnicos</SelectItem>
                            <SelectItem value="sarah">Sarah Wilson</SelectItem>
                            <SelectItem value="mike">Mike Johnson</SelectItem>
                            <SelectItem value="alex">Alex Chen</SelectItem>
                            <SelectItem value="unassigned">Sin asignar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Estado</label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="open">Abierto</SelectItem>
                            <SelectItem value="in-progress">En progreso</SelectItem>
                            <SelectItem value="resolved">Resuelto</SelectItem>
                            <SelectItem value="closed">Cerrado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Prioridad</label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar prioridad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las prioridades</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="medium">Media</SelectItem>
                            <SelectItem value="low">Baja</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Segunda fila de filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Categoría</label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="account">Account Issues</SelectItem>
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="enhancement">Enhancement</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="general">General Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Sucursal/Departamento</label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar ubicación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las ubicaciones</SelectItem>
                            <SelectItem value="centro">Sucursal Centro</SelectItem>
                            <SelectItem value="norte">Sucursal Norte</SelectItem>
                            <SelectItem value="sur">Sucursal Sur</SelectItem>
                            <SelectItem value="este">Sucursal Este</SelectItem>
                            <SelectItem value="oeste">Sucursal Oeste</SelectItem>
                            <SelectItem value="it">IT Department</SelectItem>
                            <SelectItem value="customer">Customer Service</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="qa">QA Department</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Filtros de fecha */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Rango de Fechas</label>
                      <div className="flex gap-2 items-center">
                        <Input type="date" className="flex-1" placeholder="Fecha desde" />
                        <span className="text-gray-500 text-sm">hasta</span>
                        <Input type="date" className="flex-1" placeholder="Fecha hasta" />
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        className="bg-cyan-500 hover:bg-cyan-600 text-white"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Aplicar Filtros
                      </Button>
                      <Button variant="outline" onClick={clearAllFilters}>
                        Limpiar Filtros
                      </Button>
                      <Button variant="ghost" onClick={() => setIsFilterOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Ticket</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleNewTicketSubmit} className="space-y-6 py-4">
                  {/* Campo Oficina */}
                  <div className="space-y-2">
                    <Label htmlFor="oficina" className="text-sm font-medium text-gray-700">
                      Oficina / Sucursal *
                    </Label>
                    <Select value={newTicketForm.oficina} onValueChange={(value) => handleFormChange("oficina", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar oficina" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="centro">Sucursal Centro</SelectItem>
                        <SelectItem value="norte">Sucursal Norte</SelectItem>
                        <SelectItem value="sur">Sucursal Sur</SelectItem>
                        <SelectItem value="este">Sucursal Este</SelectItem>
                        <SelectItem value="oeste">Sucursal Oeste</SelectItem>
                        <SelectItem value="it">IT Department</SelectItem>
                        <SelectItem value="customer">Customer Service</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="qa">QA Department</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Campo Asunto */}
                  <div className="space-y-2">
                    <Label htmlFor="asunto" className="text-sm font-medium text-gray-700">
                      Asunto *
                    </Label>
                    <Input
                      id="asunto"
                      type="text"
                      placeholder="Describe brevemente el problema o solicitud"
                      value={newTicketForm.asunto}
                      onChange={(e) => handleFormChange("asunto", e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Campo Prioridad */}
                  <div className="space-y-2">
                    <Label htmlFor="prioridad" className="text-sm font-medium text-gray-700">
                      Prioridad *
                    </Label>
                    <Select
                      value={newTicketForm.prioridad}
                      onValueChange={(value) => handleFormChange("prioridad", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baja">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Baja
                          </div>
                        </SelectItem>
                        <SelectItem value="media">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            Media
                          </div>
                        </SelectItem>
                        <SelectItem value="alta">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            Alta
                          </div>
                        </SelectItem>
                        <SelectItem value="urgente">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-700"></div>
                            Urgente
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Campo Descripción */}
                  <div className="space-y-2">
                    <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                      Descripción *
                    </Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Describe detalladamente el problema, error o solicitud. Incluye pasos para reproducir el problema si aplica."
                      value={newTicketForm.descripcion}
                      onChange={(e) => handleFormChange("descripcion", e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      Proporciona la mayor cantidad de detalles posible para ayudarnos a resolver tu solicitud más
                      rápido.
                    </p>
                  </div>

                  {/* Campo Archivos Adjuntos */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Archivos Adjuntos</Label>

                    {/* Botón para seleccionar archivos */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.zip,.rar,.txt"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Haz clic para seleccionar archivos</p>
                          <p className="text-xs text-gray-500">o arrastra y suelta aquí</p>
                        </div>
                        <p className="text-xs text-gray-400">PDF, DOC, XLS, imágenes, ZIP (máx. 10MB por archivo)</p>
                      </label>
                    </div>

                    {/* Lista de archivos seleccionados */}
                    {attachedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Archivos seleccionados ({attachedFiles.length})
                        </p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {attachedFiles.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-lg">{getFileIcon(file.type)}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      Puedes adjuntar capturas de pantalla, documentos o cualquier archivo que ayude a explicar el
                      problema.
                    </p>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Ticket
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsNewTicketOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Filtros activos:</span>
                {Object.entries(activeFilters).map(([key, value]) =>
                  value && value !== "all" ? (
                    <Badge key={key} variant="secondary" className="bg-cyan-100 text-cyan-800">
                      {key}: {value}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0 hover:bg-cyan-200"
                        onClick={() => setActiveFilters((prev) => ({ ...prev, [key]: null }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ) : null,
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-cyan-600 hover:text-cyan-800"
                >
                  Limpiar todos
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Sucursal</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    <Link href={`/tickets/${ticket.id.replace("#", "")}`} className="text-cyan-600 hover:text-cyan-800">
                      {ticket.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/tickets/${ticket.id.replace("#", "")}`} className="hover:text-cyan-600">
                      <p className="font-medium">{ticket.title}</p>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.customer}</p>
                      <p className="text-sm text-gray-500">{ticket.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusBadge(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getPriorityBadge(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {ticket.assignee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{ticket.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{ticket.category}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{ticket.branch}</p>
                      <p className="text-xs text-gray-500">{ticket.department}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{ticket.created}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
    <DropdownMenuItem asChild>
      <Link href={`/tickets/${ticket.id.replace("#", "")}`}>
        <Eye className="mr-2 h-4 w-4" />
        Ver Detalles
      </Link>
    </DropdownMenuItem>

    <DropdownMenuItem onClick={() => setEditTicket(ticket.id)}>
      <Edit className="mr-2 h-4 w-4" />
      Editar Ticket
    </DropdownMenuItem>

    <DropdownMenuItem onClick={() => setReassignTicketId(ticket.id)}>
      <Users className="mr-2 h-4 w-4" />
      Reasignar
    </DropdownMenuItem>
  </DropdownMenuContent>

  <TicketEditAndReassign
    ticket={ticket}
    isEditing={editTicket === ticket.id}
    setIsEditing={(value) => setEditTicket(value ? ticket.id : null)}
    isReassigning={reassignTicketId === ticket.id}
    setIsReassigning={(value) => setReassignTicketId(value ? ticket.id : null)}
  />
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">Mostrando 1 a 5 de 1,247 tickets</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button variant="outline" size="sm" className="bg-cyan-500 text-white hover:bg-cyan-600">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  )
}
