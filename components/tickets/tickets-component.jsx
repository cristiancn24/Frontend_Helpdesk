"use client"

import { useState, useEffect, useMemo } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getTickets as fetchTickets, getFilterOptions, createTicket, uploadTicketFiles } from "@/services/ticketService"
import {
  Plus, Search, Eye, Edit, MoreHorizontal, ChevronLeft, ChevronRight, Users, Filter, X, Upload,
} from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import TicketEditAndReassign from "@/components/tickets/ticket-edit-reasign-component"
import { useAuth } from "@/context/AuthContext"
import { toast } from "react-toastify"

export default function TicketsComponent() {
  const { user } = useAuth() || {}
  const roleId = Number(user?.role_id ?? 0)
  const isSupport = roleId === 4 || roleId === 11

  const [tickets, setTickets] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(15)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [editTicket, setEditTicket] = useState(null)
  const [reassignTicketId, setReassignTicketId] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newTicketForm, setNewTicketForm] = useState({ oficinaId: "", asunto: "", descripcion: "" })
  const [attachedFiles, setAttachedFiles] = useState([])

  const [filterOptions, setFilterOptions] = useState({
    technicians: [], statuses: [], priorities: [], categories: [], offices: [],
  })

  const ALL = "__all__"

  // ✅ Arranca ocultando cerrados. Si NO es soporte, lo ponemos en true.
  const [showClosed, setShowClosed] = useState(false)
  useEffect(() => {
    if (!isSupport) setShowClosed(true)
  }, [isSupport])

  const setFilter = (key, value) =>
    setActiveFilters(prev => ({
      ...prev,
      [key]: (value === ALL || value === "" || value == null) ? null : value
    }))

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const data = await getFilterOptions()
        if (!cancel) setFilterOptions(data)
      } catch (err) {
        console.error("Error cargando filtros:", err)
      }
    })()
    return () => { cancel = true }
  }, [])

  useEffect(() => { setPage(1) }, [activeFilters, search, showClosed])

  const goToPage = (p) => setPage(Math.max(1, Math.min(p, totalPages)))
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, totalItems)

  const queryParams = useMemo(() => {
    const {
      statusId, categoryId, officeId, departmentId,
      technicianId, dateFrom, dateTo, priority
    } = activeFilters

    const hasStrongFilter =
      (priority && priority !== ALL) ||
      statusId || categoryId || officeId || departmentId ||
      technicianId || dateFrom || dateTo || (search && search.trim())

    const params = {
      page,
      limit,
      sortBy: "created_at",
      order: "desc",
      ...(hasStrongFilter ? {} : { latest: 1 }),
    }

    if (search && search.trim()) params.q = search.trim()
    if (statusId)     params.statusId = statusId
    if (categoryId)   params.categoryId = categoryId
    if (officeId)     params.officeId = officeId
    if (departmentId) params.departmentId = departmentId
    if (technicianId) params.technicianId = technicianId
    if (dateFrom)     params.dateFrom = dateFrom
    if (dateTo)       params.dateTo = dateTo
    if (priority && priority !== ALL) params.priority = priority

    // 👇 Clave para soporte: el backend decide si aplica según el rol real (req.user)
    params.showClosed = showClosed ? 1 : 0

    return params
  }, [
    page, limit, search, showClosed,
    activeFilters.statusId, activeFilters.categoryId, activeFilters.officeId,
    activeFilters.departmentId, activeFilters.technicianId,
    activeFilters.dateFrom, activeFilters.dateTo, activeFilters.priority
  ])

  const loadTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchTickets(queryParams)
      setTickets(res.data)
      setTotalPages(res.totalPages)
      setTotalItems(res.totalItems)
    } catch (e) {
      console.error(e)
      setError("No se pudieron cargar los tickets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

  const normalizeText = (text) =>
    (text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  const getStatusBadge = (status) => {
    const s = normalizeText(status)
    if (["abierto","pendiente"].includes(s)) return "bg-blue-100 text-blue-800"
    if (["cerrado","closed"].includes(s))    return "bg-gray-100 text-gray-800"
    if (["en progreso","asignado"].includes(s)) return "bg-yellow-100 text-yellow-800"
    if (["resuelto","resolved"].includes(s)) return "bg-green-100 text-green-800"
    return "bg-gray-200 text-gray-800"
  }

  const getPriorityBadge = (priority) => {
    const p = normalizeText(priority)
    if (["urgente","urgent"].includes(p)) return "bg-red-100 text-red-800"
    if (["alta","high"].includes(p))      return "bg-orange-100 text-orange-800"
    if (["media","medium"].includes(p))   return "bg-yellow-100 text-yellow-800"
    if (["baja","low"].includes(p))       return "bg-green-100 text-green-800"
    return "bg-gray-200 text-gray-800"
  }

  const getActiveFiltersCount = () => Object.values(activeFilters).filter(v => v != null).length
  const clearAllFilters = () => setActiveFilters({})

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      file, name: file.name, size: file.size, type: file.type,
    }))
    setAttachedFiles((prev) => [...prev, ...newFiles])
    e.target.value = ""
  }
  const removeFile = (fileId) => setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId))
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024, sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type.includes("pdf")) return "📄"
    if (type.includes("word")) return "📝"
    if (type.includes("excel") || type.includes("spreadsheet")) return "📊"
    if (type.includes("zip") || type.includes("rar")) return "🗜️"
    return "📎"
  }

  const handleNewTicketSubmit = async (e) => {
    e.preventDefault()
    const { oficinaId, asunto, descripcion } = newTicketForm
    if (!oficinaId || !asunto?.trim() || !descripcion?.trim()) {
      toast.error("Por favor, completa todos los campos")
      return
    }
    const payload = {
      subject: asunto.trim(),
      comment: descripcion.trim(),
      office_id: Number(oficinaId),
      category_service_id: null,
      office_support_to: 1,
    }

    try {
      setIsCreating(true)
      const created = await createTicket(payload)
      const ticketId = created?.id ?? created?.data?.id ?? created?.data?.data?.id
      if (!ticketId) throw new Error("No se pudo obtener el ID del ticket recién creado")

      if (attachedFiles.length > 0) {
        const onlyFiles = attachedFiles.map((f) => f.file)
        await uploadTicketFiles(ticketId, onlyFiles)
        toast.success(`Ticket #${ticketId} creado y ${onlyFiles.length} archivo(s) subido(s)`)
      } else {
        toast.success(`Ticket #${ticketId} creado`)
      }

      await loadTickets()
      setNewTicketForm({ oficinaId: "", asunto: "", descripcion: "" })
      setAttachedFiles([])
      setIsNewTicketOpen(false)
    } catch (error) {
      console.error("Error al crear/subir archivos:", error)
      toast.error(error?.message || "No se pudo crear el ticket o subir archivos")
    } finally {
      setIsCreating(false)
    }
  }

  const handleFormChange = (field, value) => setNewTicketForm((prev) => ({ ...prev, [field]: value }))

  return (
    <MainLayout title="Tickets">
      {/* Barra superior */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar tickets..." className="pl-10" />
              </div>

              {/* Filtros */}
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
                  <DialogHeader><DialogTitle>Filtros de Tickets</DialogTitle></DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Técnico</label>
                        <Select value={activeFilters.technicianId ?? ""} onValueChange={(v) => setFilter("technicianId", v || null)}>
                          <SelectTrigger><SelectValue placeholder="Seleccionar técnico" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL}>Todos los técnicos</SelectItem>
                            {filterOptions.technicians.map(t => (<SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Estado</label>
                        <Select value={activeFilters.statusId ?? ""} onValueChange={(v) => setFilter("statusId", v || null)}>
                          <SelectTrigger><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL}>Todos los estados</SelectItem>
                            {filterOptions.statuses.map(s => (<SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Prioridad</label>
                        <Select value={activeFilters.priority ?? ALL} onValueChange={(v) => setFilter("priority", v)}>
                          <SelectTrigger><SelectValue placeholder="Seleccionar prioridad" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL}>Todas las prioridades</SelectItem>
                            {filterOptions.priorities.map(p => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Categoría</label>
                        <Select value={activeFilters.categoryId ?? ""} onValueChange={(v) => setFilter("categoryId", v || null)}>
                          <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL}>Todas las categorías</SelectItem>
                            {filterOptions.categories.map(c => (<SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Sucursal/Departamento</label>
                        <Select value={activeFilters.officeId ?? ""} onValueChange={(v) => setFilter("officeId", v || null)}>
                          <SelectTrigger><SelectValue placeholder="Seleccionar ubicación" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL}>Todas las ubicaciones</SelectItem>
                            {filterOptions.offices.map(o => (<SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Rango de Fechas</label>
                      <div className="flex gap-2 items-center">
                        <Input type="date" className="flex-1" value={activeFilters.dateFrom ?? ""} onChange={(e) => setFilter("dateFrom", e.target.value)} />
                        <span className="text-gray-500 text-sm">hasta</span>
                        <Input type="date" className="flex-1" value={activeFilters.dateTo ?? ""} onChange={(e) => setFilter("dateTo", e.target.value)} />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                      <Button className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => setIsFilterOpen(false)}>Aplicar Filtros</Button>
                      <Button variant="outline" onClick={clearAllFilters}>Limpiar Filtros</Button>
                      <Button variant="ghost" onClick={() => setIsFilterOpen(false)}>Cancelar</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Selector para soporte: Abiertos / Todos */}
              {isSupport && (
                <Select value={showClosed ? "all" : "open"} onValueChange={(v) => setShowClosed(v === "all")}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Mostrar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Solo abiertos</SelectItem>
                    <SelectItem value="all">Todos</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Nuevo Ticket */}
            <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Crear Nuevo Ticket</DialogTitle></DialogHeader>
                <form onSubmit={handleNewTicketSubmit} className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="oficina" className="text-sm font-medium text-gray-700">Oficina / Sucursal *</Label>
                    <Select value={newTicketForm.oficinaId} onValueChange={(value) => setNewTicketForm(p => ({ ...p, oficinaId: value }))}>
                      <SelectTrigger><SelectValue placeholder="Seleccionar oficina" /></SelectTrigger>
                      <SelectContent>
                        {filterOptions.offices.map(o => (<SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto *</Label>
                    <Input id="asunto" value={newTicketForm.asunto} onChange={(e) => setNewTicketForm(p => ({ ...p, asunto: e.target.value }))} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción *</Label>
                    <Textarea id="descripcion" className="min-h-[120px]" value={newTicketForm.descripcion} onChange={(e) => setNewTicketForm(p => ({ ...p, descripcion: e.target.value }))} />
                  </div>

                  <div className="space-y-2">
                    <Label>Archivos Adjuntos</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input type="file" id="file-upload" multiple onChange={handleFileSelect} className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.zip,.rar,.txt" />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Haz clic para seleccionar archivos</p>
                          <p className="text-xs text-gray-500">o arrastra y suelta aquí</p>
                        </div>
                        <p className="text-xs text-gray-400">PDF, DOC, XLS, imágenes, ZIP (máx. 10MB por archivo)</p>
                      </label>
                    </div>

                    {attachedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Archivos seleccionados ({attachedFiles.length})</p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {attachedFiles.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-lg">{getFileIcon(file.type)}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="h-8 w-8 p-0 text-gray-400 hover:text-red-500">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button type="submit" disabled={isCreating} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      {isCreating ? "Creando..." : "Crear Ticket"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsNewTicketOpen(false)}>Cancelar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader><CardTitle>Todos los Tickets</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Oficina</TableHead>
                <TableHead>Fecha creación</TableHead>
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
                          {ticket.assignee.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{ticket.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm text-gray-600">{ticket.category}</span></TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{ticket.createdBy}</p>
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

          {/* Paginación */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              {totalItems > 0 ? `Mostrando ${start} a ${end} de ${totalItems} tickets` : 'Sin resultados'}
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => goToPage(page - 1)} disabled={page === 1 || loading}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(n)}
                  className={page === n ? "bg-cyan-500 text-white hover:bg-cyan-600" : ""}
                  disabled={loading}
                >
                  {n}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={() => goToPage(page + 1)} disabled={page === totalPages || loading}>
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  )
}
