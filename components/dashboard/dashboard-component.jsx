"use client"

import { useState } from "react"
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

export default function DashboardComponent() {
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const [newTicketForm, setNewTicketForm] = useState({
    oficina: "",
    asunto: "",
    prioridad: "",
    descripcion: "",
  })
  const [attachedFiles, setAttachedFiles] = useState([])

  const recentTickets = [
    {
      id: "#1234",
      title: "Login Issue",
      assignee: "John Doe",
      time: "2 hours ago",
      status: "Open",
    },
    {
      id: "#1233",
      title: "Password Reset",
      assignee: "Jane Smith",
      time: "4 hours ago",
      status: "Resolved",
    },
    {
      id: "#1232",
      title: "Feature Request",
      assignee: "Mike Johnson",
      time: "6 hours ago",
      status: "In Progress",
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
          <CardHeader>
            <CardTitle>Tickets Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {ticket.id} - {ticket.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.assignee} • {ticket.time}
                    </p>
                  </div>
                  <Badge variant="secondary" className={getStatusBadge(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start bg-cyan-500 hover:bg-cyan-600 text-white">
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

            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => (window.location.href = "/tickets")}
            >
              <Search className="mr-2 h-4 w-4" />
              Buscar Tickets
            </Button>

            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Exportar Reportes
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => (window.location.href = "/auth")}
            >
              <Users className="mr-2 h-4 w-4" />
              Administrar Usuarios
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Resumen de Rendimiento</CardTitle>
        </CardHeader>
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
