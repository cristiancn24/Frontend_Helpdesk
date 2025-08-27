"use client"

import { useState, useEffect } from "react"
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
  ArrowLeft, Calendar, Clock, User, Building, Tag, AlertTriangle, Send, Paperclip,
  Edit, History, FileText, UserCheck, CheckCircle, XCircle
} from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import Link from "next/link"

// Servicio
import { getTicketById, addTicketComment, getStatusOptions, updateTicketStatus } from "@/services/ticketService"

export default function TicketDetailsComponent({ ticketId }) {
  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [ticketHistory, setTicketHistory] = useState([])
  const [attachments, setAttachments] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  const [newComment, setNewComment] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [statusId, setStatusId] = useState(null);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
  (async () => {
    try {
      const opts = await getStatusOptions(); // [{id, name}]
      setStatusOptions(opts);
    } catch (e) {
      console.error("No se pudieron cargar estados", e);
    }
  })();
}, []);


  // Helpers para adjuntos
  const isImageExt = (ext) =>
    ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes((ext || "").toLowerCase())

  const fileEmoji = (ext) => {
    const e = (ext || "").toLowerCase()
    if (["pdf"].includes(e)) return "📄"
    if (["doc", "docx", "rtf"].includes(e)) return "📝"
    if (["xls", "xlsx", "csv"].includes(e)) return "📊"
    if (["zip", "rar", "7z"].includes(e)) return "🗜️"
    if (isImageExt(e)) return "🖼️"
    return "📎"
  }

  // Carga de ticket
  useEffect(() => {
    if (!ticketId) return
    let alive = true

    ;(async () => {
      try {
        setLoading(true)
        setErr(null)

        let raw = await getTicketById(ticketId)
        // por si el servicio devuelve {success, data}
        if (raw && raw.data) raw = raw.data

        setStatusId(raw.status_id ?? null);

        // Mapeo principal
        const mapped = {
          id: `#${raw.id}`,
          title: raw.subject,
          description: raw.comment,
          status: raw.status || "Open",
          priority: raw.priority || "Medium",
          assignee: raw.assigned_to || "No asignado",
          reporter: raw.created_by || "—",
          office: raw.office_name || raw.office || "—",
          category: raw.category_name || raw.category || "—",
          created: raw.created_at ? new Date(raw.created_at).toLocaleString() : "—",
          updated: raw.updated_at ? new Date(raw.updated_at).toLocaleString() : "—",
          dueDate: raw.due_date ? new Date(raw.due_date).toLocaleString() : "—",
        }

        // Historial
        const STATUS_LABEL = { 3: "Pendiente", 4: "Validado", 5: "Cerrado" }
        const history = Array.isArray(raw.histories)
          ? raw.histories.map(h => ({
              id: raw.id,
              fecha: h.created_at ? new Date(h.created_at).toLocaleString() : "—",
              estado: h.status || STATUS_LABEL[h.status_id] || `Estado ${h.status_id ?? ""}`,
              usuario: h.user || "—",
              icon: h.status_id === 5 ? XCircle : h.status_id === 4 ? CheckCircle : h.status_id === 3 ? Clock : FileText,
              color: "text-blue-600",
              bgColor: "bg-blue-100",
            }))
          : []

        // Adjuntos
        const mappedAttachments = Array.isArray(raw.uploads)
          ? raw.uploads.map(u => {
              const name = u.name || u.original_name || "archivo"
              const ext = name.split(".").pop()?.toLowerCase() || ""
              return {
                id: u.id,
                name,
                url: u.url, // debe venir del backend público (p.ej. http://localhost:4000/uploads/...)
                created: u.created_at ? new Date(u.created_at).toLocaleString() : "—",
                ext,
              }
            })
          : []

        // Comentarios (si los tuvieras en la API)
        const mappedComments = Array.isArray(raw.comments)
          ? raw.comments.map(c => ({
              id: c.id,
              author: c.user_name || c.author || "—",
              role: c.role || "Usuario",
              content: c.content || c.comment || "",
              timestamp: c.created_at ? new Date(c.created_at).toLocaleString() : "—",
              isInternal: !!c.is_internal,
            }))
          : []

        if (!alive) return
        setTicket(mapped)
        setTicketHistory(history)
        setAttachments(mappedAttachments)
        setComments(mappedComments)
      } catch (e) {
        console.error(e)
        if (alive) setErr("No se pudo cargar el ticket")
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => { alive = false }
  }, [ticketId])

  // Badges
  const getStatusBadge = (status) => {
    const statusConfig = {
      Open: "bg-orange-100 text-orange-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Resolved: "bg-green-100 text-green-800",
      Closed: "bg-gray-100 text-gray-800",
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

  // Acciones
  const handleAddComment = async (e) => {
    e.preventDefault();
    const text = newComment.trim();
    if (!text) return;

    try {
      setSubmitting(true);
      const saved = await addTicketComment(ticketId, text);

      // Empuja el nuevo comentario al estado actual
      setComments(prev => [
        ...prev,
        {
          id: saved.id,
          author: saved.user_name || "Tú",
          role: "Usuario",                // opcional
          content: saved.content,
          timestamp: new Date(saved.created_at).toLocaleString(),
          isInternal: false,
        },
      ]);

      // Limpia formulario
      setNewComment("");
    } catch (err) {
      alert(err.message || "No se pudo agregar el comentario");
    } finally {
      setSubmitting(false);
    }
  };

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

  // Loading/Error
  if (loading) return <MainLayout title="Detalles del Ticket"><div className="p-6">Cargando…</div></MainLayout>
  if (err)      return <MainLayout title="Detalles del Ticket"><div className="p-6 text-red-600">{err}</div></MainLayout>
  if (!ticket)  return null


  const handleUpdateStatus = async () => {
  if (!statusId) return;
  try {
    setSavingStatus(true);
    await updateTicketStatus(ticketId, statusId);

    // Actualiza el texto del estado mostrado
    const newName = statusOptions.find(s => s.id === statusId)?.name || ticket.status;
    setTicket(prev => prev ? { ...prev, status: newName, updated: new Date().toLocaleString() } : prev);

    // (Opcional) agrega un item al historial visual
    setTicketHistory(prev => [
      ...prev,
      {
        id: Number(String(ticket.id).replace("#", "")),
        fecha: new Date().toLocaleString(),
        estado: newName,
        usuario: "Tú",
        icon: newName?.toLowerCase().includes("cerr") ? XCircle : CheckCircle,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      }
    ]);
  } catch (e) {
    alert(e.message || "No se pudo actualizar el estado");
  } finally { 
    setSavingStatus(false);
  }
};


  return (
    <MainLayout title="Detalles del Ticket">
      <div className="space-y-6">
        {/* Header */}
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
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción */}
            <Card>
              <CardHeader><CardTitle>Descripción</CardTitle></CardHeader>
              <CardContent><p className="text-gray-700 leading-relaxed">{ticket.description}</p></CardContent>
            </Card>

            {/* Adjuntos */}
            <Card>
              <CardHeader>
                <CardTitle>Archivos adjuntos ({attachments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {attachments.length === 0 ? (
                  <p className="text-sm text-gray-500">Sin archivos adjuntos.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attachments.map((f) => (
                      <a
                        key={f.id}
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border rounded-lg p-3 hover:shadow transition flex gap-3"
                      >
                        {isImageExt(f.ext) ? (
                          <img
                            src={f.url}
                            alt={f.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center rounded bg-gray-100">
                            <span className="text-2xl">{fileEmoji(f.ext)}</span>
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{f.name}</p>
                          <p className="text-xs text-gray-500">{f.created}</p>
                          <p className="text-xs text-gray-500 uppercase">{f.ext || "archivo"}</p>
                          <span className="inline-block mt-2 text-xs text-cyan-700">
                            Ver / Descargar
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comentarios */}
            <Card>
              <CardHeader><CardTitle>Comentarios ({comments.length})</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="text-xs">
                          {comment.author.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <Badge variant="secondary" className="text-xs">{comment.role}</Badge>
                              {comment.isInternal && (
                                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Interno</Badge>
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

                <form onSubmit={handleAddComment} className="space-y-4">
                  <div>
                    <Label htmlFor="comment" className="text-sm font-medium">Agregar Comentario</Label>
                    <Textarea id="comment" placeholder="Escribe tu comentario aquí..."
                      value={newComment} onChange={(e) => setNewComment(e.target.value)}
                      className="mt-2 min-h-[100px]" />
                  </div>
                  <div className="flex items-center justify-end">
                    <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600" disabled={submitting}>
                      <Send className="mr-2 h-4 w-4" />
                      {submitting ? "Enviando..." : "Enviar"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Estado</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado actual:</span>
                  <Badge className={getStatusBadge(ticket.status)}>{ticket.status}</Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm">Cambiar Estado</Label>
                  <Select
                    value={statusId ? String(statusId) : ""}
                    onValueChange={(v) => setStatusId(Number(v))}
                    disabled={!statusOptions.length}
                  >
                    <SelectTrigger><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(s => (
                        <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-cyan-500 hover:bg-cyan-600"
                  onClick={handleUpdateStatus}
                  disabled={!statusId || savingStatus}
                >
                  {savingStatus ? "Guardando..." : "Actualizar Estado"}
                </Button>
              </CardContent>
            </Card>


            <Card>
              <CardHeader><CardTitle>Información</CardTitle></CardHeader>
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
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Historial del Ticket
                  </h4>
                  <ScrollArea className="h-[320px] pr-2">
                    <div className="space-y-3">
                      {ticketHistory.map((entry, index) => {
                        const Icon = entry.icon || FileText
                        return (
                          <div key={index} className="relative">
                            {index < ticketHistory.length - 1 && (
                              <div className="absolute left-4 top-8 w-0.5 h-4 bg-gray-200"></div>
                            )}
                            <div className="flex gap-3">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${entry.bgColor} flex items-center justify-center`}>
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
