"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, Upload } from "lucide-react"

export default function TicketEditAndReassign({ ticket, isEditing, setIsEditing, isReassigning, setIsReassigning }) {
  const [editForm, setEditForm] = useState({
    oficina: "",
    asunto: "",
    prioridad: "",
    descripcion: ""
  })

  const [attachedFiles, setAttachedFiles] = useState([])
  const [assignee, setAssignee] = useState("")

  useEffect(() => {
    if (ticket) {
      setEditForm({
        oficina: ticket.branch || "",
        asunto: ticket.title || "",
        prioridad: ticket.priority || "",
        descripcion: ticket.description || ""
      })
      setAssignee(ticket.assignee || "")
      setAttachedFiles(ticket.files || []) // archivos ya existentes si los hay
    }
  }, [ticket])

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }))
    setAttachedFiles(prev => [...prev, ...files])
    e.target.value = ""
  }

  const removeFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type.includes("pdf")) return "📄"
    if (type.includes("word")) return "📝"
    if (type.includes("excel")) return "📊"
    if (type.includes("zip") || type.includes("rar")) return "🗜️"
    return "📎"
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    console.log("Edición guardada:", editForm, attachedFiles)
    setIsEditing(false)
    alert("Ticket editado exitosamente")
  }

  const handleReassignSubmit = (e) => {
    e.preventDefault()
    console.log("Ticket reasignado a:", assignee)
    setIsReassigning(false)
    alert(`Ticket reasignado a ${assignee}`)
  }

  return (
    <>
      {/* Modal Editar */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ticket</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label>Oficina / Sucursal</Label>
              <Select value={editForm.oficina} onValueChange={(v) => handleEditChange("oficina", v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar oficina" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sucursal Centro">Sucursal Centro</SelectItem>
                  <SelectItem value="Sucursal Norte">Sucursal Norte</SelectItem>
                  <SelectItem value="Sucursal Sur">Sucursal Sur</SelectItem>
                  <SelectItem value="Sucursal Este">Sucursal Este</SelectItem>
                  <SelectItem value="Sucursal Oeste">Sucursal Oeste</SelectItem>
                  <SelectItem value="IT Department">IT Department</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="QA Department">QA Department</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Asunto</Label>
              <Input value={editForm.asunto} onChange={(e) => handleEditChange("asunto", e.target.value)} />
            </div>

            <div>
              <Label>Prioridad</Label>
              <Select value={editForm.prioridad} onValueChange={(v) => handleEditChange("prioridad", v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar prioridad" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">Alta</SelectItem>
                  <SelectItem value="Medium">Media</SelectItem>
                  <SelectItem value="Low">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea value={editForm.descripcion} onChange={(e) => handleEditChange("descripcion", e.target.value)} />
            </div>

            <div>
              <Label>Archivos Adjuntos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-1">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-600">Haz clic para seleccionar archivos</span>
                </label>
              </div>

              {attachedFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{getFileIcon(file.type)}</span>
                        <span>{file.name} ({formatFileSize(file.size)})</span>
                      </div>
                      <button type="button" onClick={() => removeFile(file.id)} className="text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="bg-cyan-500 text-white w-full">Guardar Cambios</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Reasignar */}
      <Dialog open={isReassigning} onOpenChange={setIsReassigning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reasignar Ticket</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleReassignSubmit} className="space-y-4">
            <div>
              <Label>Asignar a</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger><SelectValue placeholder="Seleccionar técnico" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                  <SelectItem value="Alex Chen">Alex Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="bg-cyan-500 text-white w-full">Reasignar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
