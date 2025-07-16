"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import MainLayout from "@/components/layout/main-layout"

export default function PoolTicketsComponent() {
  const [poolTickets, setPoolTickets] = useState([
    { id: "#1240", date: "2024-07-14", subject: "Server Down", description: "Main server is down", category: "IT", branch: "Sucursal Centro" },
    { id: "#1241", date: "2024-07-14", subject: "VPN Issue", description: "Cannot connect to VPN", category: "Network", branch: "Sucursal Norte" },
    { id: "#1242", date: "2024-07-14", subject: "Software Update", description: "Request for software update", category: "Software", branch: "Sucursal Sur" },
  ])

  const takeTicket = (id, priority) => {
    alert(`Has tomado el ticket ${id} con prioridad ${priority}`)
    setPoolTickets(prev => prev.filter(ticket => ticket.id !== id))
  }

  const getPriorityBadge = (priority) => {
    const colors = {
      Baja: "bg-green-100 text-green-800",
      Media: "bg-yellow-100 text-yellow-800",
      Alta: "bg-orange-100 text-orange-800",
      Urgente: "bg-red-100 text-red-800"
    }
    return colors[priority] || "bg-gray-100 text-gray-800"
  }

  return (
    <MainLayout title="Pool de Tickets">
      <Card>
        <CardHeader>
          <CardTitle>Tickets en Espera</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Sucursal</TableHead>
                <TableHead>Prioridad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poolTickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.date}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{ticket.description}</TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>{ticket.branch}</TableCell>
                  <TableCell>
                    <Select onValueChange={(value) => takeTicket(ticket.id, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">
                          <Badge className={getPriorityBadge("Baja")}>Baja</Badge>
                        </SelectItem>
                        <SelectItem value="Media">
                          <Badge className={getPriorityBadge("Media")}>Media</Badge>
                        </SelectItem>
                        <SelectItem value="Alta">
                          <Badge className={getPriorityBadge("Alta")}>Alta</Badge>
                        </SelectItem>
                        <SelectItem value="Urgente">
                          <Badge className={getPriorityBadge("Urgente")}>Urgente</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  )
}
