"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Info, AlertCircle, CheckCircle, Clock, Plus, Search, Users, X, Upload, Download } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import { toast } from "react-toastify"

// 👇 servicios que ya usas en Tickets
import { getFilterOptions, createTicket, uploadTicketFiles } from "@/services/ticketService"

export default function DashboardComponent() {
  const { hasPermission } = useAuth()

  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // ⚠️ usamos las MISMAS llaves que en Tickets (oficinaId, asunto, descripcion)
  const [newTicketForm, setNewTicketForm] = useState({
    oficinaId: "",
    asunto: "",
    descripcion: "",
  })

  const [attachedFiles, setAttachedFiles] = useState([])
  const [filterOptions, setFilterOptions] = useState({
    offices: [],
  })

  // Cargar oficinas para el select (igual que en Tickets)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await getFilterOptions()
        if (!alive) return
        setFilterOptions({ offices: data.offices || [] })
      } catch (err) {
        console.error("Error cargando oficinas:", err)
        toast.error("No se pudieron cargar las oficinas")
      }
    })()
    return () => { alive = false }
  }, [])

  const recentTickets = [
    { id: "#1234", title: "Login Issue", assignee: "John Doe", time: "2 hours ago", status: "Open" },
    { id: "#1233", title: "Password Reset", assignee: "Jane Smith", time: "4 hours ago", status: "Resolved" },
    { id: "#1232", title: "Feature Request", assignee: "Mike Johnson", time: "6 hours ago", status: "In Progress" },
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

  // ---------- Adjuntos ----------
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }))
    setAttachedFiles((prev) => [...prev, ...newFiles])
    e.target.value = ""
  }

  const removeFile = (fileId) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId))
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

  // ---------- Form ----------
  const handleFormChange = (field, value) => {
    setNewTicketForm((prev) => ({ ...prev, [field]: value }))
  }

  // 💥 Crear ticket + subir archivos (idéntico a Tickets)
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
      office_id: Number(oficinaId),   // 👈 mismo nombre que el backend
      category_service_id: null,
      office_support_to: 1,
    }

    try {
      setIsCreating(true)

      // 1) Crear ticket
      const created = await createTicket(payload)
      const ticketId = created?.id ?? created?.data?.id ?? created?.data?.data?.id
      if (!ticketId) throw new Error("No se pudo obtener el ID del ticket recién creado")

      // 2) Subir adjuntos si hay
      if (attachedFiles.length > 0) {
        const onlyFiles = attachedFiles.map(f => f.file)
        await uploadTicketFiles(ticketId, onlyFiles)
        toast.success(`Ticket #${ticketId} creado y ${onlyFiles.length} archivo(s) subido(s)`)
      } else {
        toast.success(`Ticket #${ticketId} creado`)
      }

      // 3) Limpiar y cerrar
      setNewTicketForm({ oficinaId: "", asunto: "", descripcion: "" })
      setAttachedFiles([])
      setIsNewTicketOpen(false)

      // (Opcional) Redirigir a /tickets o al detalle
      // window.location.href = `/tickets/${ticketId}`
    } catch (err) {
      console.error("Error al crear/subir archivos:", err)
      toast.error(err?.message || "No se pudo crear el ticket o subir archivos")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <MainLayout title="Dashboard">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tickets Totales</p>
                <p className="text-3xl font-bold text-gray-900">1,247</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tickets Abiertos</p>
                <p className="text-3xl font-bold text-gray-900">89</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tickets Resueltos Hoy</p>
                <p className="text-3xl font-bold text-gray-900">34</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio de Respuesta</p>
                <p className="text-3xl font-bold text-gray-900">2.4h</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Tickets Recientes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{ticket.id} - {ticket.title}</p>
                    <p className="text-sm text-gray-600">{ticket.assignee} • {ticket.time}</p>
                  </div>
                  <Badge variant="secondary" className={getStatusBadge(ticket.status)}>{ticket.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader><CardTitle>Acciones Rápidas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
              <DialogTrigger asChild>
                {hasPermission("create_ticket") && (
                  <Button className="w-full justify-start bg-cyan-500 hover:bg-cyan-600 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Ticket
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Crear Nuevo Ticket</DialogTitle></DialogHeader>
                <form onSubmit={handleNewTicketSubmit} className="space-y-6 py-4">
                  {/* Oficina */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Oficina / Sucursal *</Label>
                    <Select
                      value={newTicketForm.oficinaId}
                      onValueChange={(value) => handleFormChange("oficinaId", value)}
                    >
                      <SelectTrigger><SelectValue placeholder="Seleccionar oficina" /></SelectTrigger>
                      <SelectContent>
                        {filterOptions.offices.map(o => (
                          <SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Asunto */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Asunto *</Label>
                    <Input
                      type="text"
                      placeholder="Describe brevemente el problema o solicitud"
                      value={newTicketForm.asunto}
                      onChange={(e) => handleFormChange("asunto", e.target.value)}
                    />
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Descripción *</Label>
                    <Textarea
                      placeholder="Describe detalladamente el problema, error o solicitud."
                      value={newTicketForm.descripcion}
                      onChange={(e) => handleFormChange("descripcion", e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      Proporciona la mayor cantidad de detalles posible para resolver tu solicitud más rápido.
                    </p>
                  </div>

                  {/* Adjuntos */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Archivos Adjuntos</Label>
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
                        <p className="text-xs text-gray-400">Máx. 10MB por archivo</p>
                      </label>
                    </div>

                    {attachedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Archivos seleccionados ({attachedFiles.length})
                        </p>
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
                  </div>

                  {/* Acción */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button type="submit" disabled={isCreating} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      {isCreating ? "Creando..." : "Crear Ticket"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsNewTicketOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {hasPermission("view_tickets") && (
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => (window.location.href = "/tickets")}
              >
                <Search className="mr-2 h-4 w-4" />
                Buscar Tickets
              </Button>
            )}

            {hasPermission("view_reports") && (
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Exportar Reportes
              </Button>
            )}

            {hasPermission("view_auth") && (
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => (window.location.href = "/auth")}
              >
                <Users className="mr-2 h-4 w-4" />
                Administrar Usuarios
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="mt-6">
        <CardHeader><CardTitle>Resumen de Rendimiento</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-cyan-500">94%</p>
              <p className="text-sm text-gray-600 mt-2">Customer Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-500">87%</p>
              <p className="text-sm text-gray-600 mt-2">First Contact Resolution</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500">1.8h</p>
              <p className="text-sm text-gray-600 mt-2">Average Response Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  )
}
