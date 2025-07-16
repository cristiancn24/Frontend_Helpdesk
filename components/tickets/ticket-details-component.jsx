"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Building,
  Tag,
  AlertTriangle,
  Send,
  Paperclip,
  Edit,
  History,
  FileText,
  UserCheck,
  CheckCircle,
  XCircle,
} from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import Link from "next/link"

export default function TicketDetailsComponent({ ticketId }) {
  const [newComment, setNewComment] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  // Datos del ticket (normalmente vendrían de una API)
  const ticket = {
    id: "#1234",
    title: "Login Issue - Cannot access dashboard",
    description:
      "Users are reporting that they cannot log into the system. The login page loads but after entering credentials, it shows a generic error message. This started happening around 2 PM today. Multiple users from different departments are affected.",
    status: "Open",
    priority: "High",
    assignee: "Sarah Wilson",
    reporter: "John Doe",
    office: "Sucursal Centro",
    category: "Technical Support",
    created: "2024-01-15 14:30",
    updated: "2024-01-15 16:45",
    dueDate: "2024-01-16 18:00",
  }

  const comments = [
    {
      id: 1,
      author: "John Doe",
      role: "Reporter",
      content:
        "I've tried clearing my browser cache and cookies, but the issue persists. Other colleagues are experiencing the same problem.",
      timestamp: "2024-01-15 14:35",
      isInternal: false,
    },
    {
      id: 2,
      author: "Sarah Wilson",
      role: "IT Support",
      content:
        "Thanks for reporting this. I'm investigating the authentication service. It seems like there might be an issue with the login server.",
      timestamp: "2024-01-15 15:20",
      isInternal: true,
    },
    {
      id: 3,
      author: "Sarah Wilson",
      role: "IT Support",
      content:
        "Update: Found the issue. The authentication service was experiencing high load. I've restarted the service and it should be working now. Can you please test and confirm?",
      timestamp: "2024-01-15 16:45",
      isInternal: false,
    },
  ]

  // Historial con los datos que me mostraste pero con nuestro diseño
  const ticketHistory = [
    {
      id: "1234",
      fecha: "10/07/2025 12:27:19 PM",
      estado: "Cerrado",
      usuario: "Raister Feliz",
      icon: XCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "1234",
      fecha: "10/07/2025 12:04:38 PM",
      estado: "Asignado",
      usuario: "Maribel Hernandez",
      icon: UserCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      id: "1234",
      fecha: "10/07/2025 12:03:21 PM",
      estado: "Validado",
      usuario: "Ofic. Higuey",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "1234",
      fecha: "10/07/2025 12:03:21 PM",
      estado: "Pendiente",
      usuario: "Ofic. Higuey",
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      id: "1234",
      fecha: "10/07/2025 12:00:00 PM",
      estado: "Creado",
      usuario: "John Doe",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      // Estados originales
      Open: "bg-orange-100 text-orange-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Resolved: "bg-green-100 text-green-800",
      Closed: "bg-gray-100 text-gray-800",
      // Estados del historial como en tu ejemplo
      Cerrado: "bg-blue-500 text-white",
      Asignado: "bg-orange-500 text-white",
      Validado: "bg-green-500 text-white",
      Pendiente: "bg-gray-500 text-white",
      Creado: "bg-blue-100 text-blue-800",
    }
    return statusConfig[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    }
    return priorityConfig[priority] || "bg-gray-100 text-gray-800"
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    // Aquí iría la lógica para enviar el comentario al backend
    console.log("Nuevo comentario:", newComment)

    // Resetear el campo
    setNewComment("")

    // Mostrar mensaje de éxito
    alert("Comentario agregado exitosamente")
  }

  const formatHistoryTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace menos de 1 hora"
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`

    return timestamp
  }

  return (
    <MainLayout title="Detalles del Ticket">
      <div className="space-y-6">
        {/* Header con navegación */}
        <div className="flex items-center gap-4">
          <Link href="/tickets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Tickets
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{ticket.id}</h1>
            <p className="text-gray-600">{ticket.title}</p>
          </div>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detalles del ticket */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
              </CardContent>
            </Card>

            {/* Comentarios */}
            <Card>
              <CardHeader>
                <CardTitle>Comentarios ({comments.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lista de comentarios */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="text-xs">
                          {comment.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <Badge variant="secondary" className="text-xs">
                                {comment.role}
                              </Badge>
                              {comment.isInternal && (
                                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                  Interno
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Formulario para nuevo comentario */}
                <form onSubmit={handleAddComment} className="space-y-4">
                  <div>
                    <Label htmlFor="comment" className="text-sm font-medium">
                      Agregar Comentario
                    </Label>
                    <Textarea
                      id="comment"
                      placeholder="Escribe tu comentario aquí..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="sm">
                        <Paperclip className="mr-2 h-4 w-4" />
                        Adjuntar archivo
                      </Button>
                      <Label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        Comentario interno
                      </Label>
                    </div>
                    <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                      <Send className="mr-2 h-4 w-4" />
                      Enviar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar con información */}
          <div className="space-y-6">
            {/* Estado y acciones */}
            <Card>
              <CardHeader>
                <CardTitle>Estado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado actual:</span>
                  <Badge className={getStatusBadge(ticket.status)}>{ticket.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Prioridad:</span>
                  <Badge className={getPriorityBadge(ticket.priority)}>{ticket.priority}</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm">Cambiar Estado</Label>
                  <Select defaultValue={ticket.status.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Abierto</SelectItem>
                      <SelectItem value="in-progress">En Progreso</SelectItem>
                      <SelectItem value="resolved">Resuelto</SelectItem>
                      <SelectItem value="closed">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600">Actualizar Estado</Button>
              </CardContent>
            </Card>

            {/* Información del ticket */}
            <Card>
              <CardHeader>
                <CardTitle>Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Reportado por</p>
                      <p className="text-sm font-medium">{ticket.reporter}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Asignado a</p>
                      <p className="text-sm font-medium">{ticket.assignee}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Oficina</p>
                      <p className="text-sm font-medium">{ticket.office}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Categoría</p>
                      <p className="text-sm font-medium">{ticket.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Creado</p>
                      <p className="text-sm font-medium">{ticket.created}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Última actualización</p>
                      <p className="text-sm font-medium">{ticket.updated}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Fecha límite</p>
                      <p className="text-sm font-medium">{ticket.dueDate}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Historial con nuestro diseño pero tus datos */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Historial del Ticket
                  </h4>
                  <ScrollArea className="h-[320px] pr-2">
                    <div className="space-y-3">
                      {ticketHistory.map((entry, index) => {
                        const Icon = entry.icon
                        return (
                          <div key={index} className="relative">
                            {/* Línea conectora */}
                            {index < ticketHistory.length - 1 && (
                              <div className="absolute left-4 top-8 w-0.5 h-4 bg-gray-200"></div>
                            )}

                            <div className="flex gap-3">
                              <div
                                className={`flex-shrink-0 w-8 h-8 rounded-full ${entry.bgColor} flex items-center justify-center`}
                              >
                                <Icon className={`h-4 w-4 ${entry.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className={`text-xs ${getStatusBadge(entry.estado)}`}>
                                      {entry.estado}
                                    </Badge>
                                    <span className="text-xs text-gray-500">#{entry.id}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">{formatHistoryTime(entry.fecha)}</span>
                                </div>

                                <p className="text-xs text-gray-600 mt-1">{entry.fecha}</p>
                                <p className="text-xs font-medium text-gray-700">por {entry.usuario}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
