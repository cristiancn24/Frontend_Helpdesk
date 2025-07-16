"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, AlertCircle, CheckCircle, Clock } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"

export default function PanelsComponent() {
  // Datos de ejemplo basados en la imagen del panel
  const ticketStatusData = {
    hoy: {
      nuevos: 38,
      pendientes: 9,
      asignados: 5,
      enEspera: 0,
      trabajados: 24,
    },
    total: {
      nuevos: 80,
      pendientes: 79,
      asignados: 9,
      enEspera: 9,
      trabajados: 103647,
    },
  }

  const supportStaffDataLeft = [
    { name: "Albereon Suarez", nuevos: 1, trabajados: 0, totalPend: 2 },
    { name: "Denis Reyes (Soporte)", nuevos: 0, trabajados: 0, totalPend: 0 },
    { name: "Deyanira Hernández", nuevos: 0, trabajados: 0, totalPend: 1 },
    { name: "Domingo Guzmán", nuevos: 0, trabajados: 0, totalPend: 0 },
    { name: "Eric Baez", nuevos: 0, trabajados: 0, totalPend: 0 },
    { name: "Geovanny Sanchez", nuevos: 0, trabajados: 0, totalPend: 0 },
    { name: "Gina Cuevas", nuevos: 0, trabajados: 0, totalPend: 0 },
    { name: "Gustavo Farias", nuevos: 8, trabajados: 6, totalPend: 6 },
    { name: "John Ozuna", nuevos: 0, trabajados: 0, totalPend: 0 },
    { name: "José Valdez", nuevos: 0, trabajados: 0, totalPend: 5 },
    { name: "Lindon Castillo", nuevos: 0, trabajados: 0, totalPend: 0 },
    { name: "Norberto Margarin", nuevos: 0, trabajados: 0, totalPend: 2 },
    { name: "Raul Alberto Vallejo Valera", nuevos: 2, trabajados: 2, totalPend: 0 },
    { name: "Ricardo Rodriguez", nuevos: 0, trabajados: 0, totalPend: 1 },
    { name: "Salvador Ramirez", nuevos: 5, trabajados: 4, totalPend: 1 },
    { name: "Yuniol Joel Rosario", nuevos: 9, trabajados: 9, totalPend: 1 },
  ]

  const supportStaffDataRight = [
    { name: "Ariel Perez", nuevos: 0, trabajados: 0, totalPend: 2 },
    { name: "Carlos Perez", nuevos: 0, trabajados: 0, totalPend: 1 },
    { name: "joel cruz", nuevos: 0, trabajados: 0, totalPend: 0 },
    { name: "José Medina", nuevos: 0, trabajados: 0, totalPend: 17 },
    { name: "Jose Miguel Paulino", nuevos: 2, trabajados: 2, totalPend: 0 },
    { name: "Juan Jimenez", nuevos: 1, trabajados: 0, totalPend: 11 },
    { name: "Lisrreymon Tavarez", nuevos: 0, trabajados: 0, totalPend: 5 },
    { name: "Luis Daniel Perez Guaba", nuevos: 0, trabajados: 0, totalPend: 5 },
    { name: "Maribel Hernandez", nuevos: 0, trabajados: 0, totalPend: 1 },
    { name: "Orlando Florenzan", nuevos: 0, trabajados: 0, totalPend: 1 },
    { name: "Rafael Galva", nuevos: 0, trabajados: 0, totalPend: 1 },
    { name: "Raister Feliz", nuevos: 1, trabajados: 1, totalPend: 1 },
    { name: "Roberto Belbere", nuevos: 0, trabajados: 0, totalPend: 1 },
    { name: "Waskar Martinez", nuevos: 0, trabajados: 0, totalPend: 13 },
  ]

  const priorityData = [
    { level: "Baja", count: 5, color: "bg-cyan-500" },
    { level: "Media", count: 0, color: "bg-green-500" },
    { level: "Alta", count: 80, color: "bg-orange-500" },
    { level: "Urgente", count: 0, color: "bg-red-500" },
  ]

  const getBadgeColor = (count, type) => {
    if (count === 0) return "bg-gray-100 text-gray-400" // Siempre devuelve una clase

    switch (type) {
      case "nuevos":
        return "bg-blue-100 text-blue-800"
      case "trabajados":
        return "bg-green-100 text-green-800"
      case "totalPend":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <MainLayout title="Panel de Tickets" showSidebar={false}>
      {/* Metrics Cards - Siguiendo el patrón del dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tickets Nuevos</p>
                <p className="text-3xl font-bold text-gray-900">{ticketStatusData.hoy.nuevos}</p>
                <p className="text-xs text-gray-500">Total: {ticketStatusData.total.nuevos}</p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-full">
                <Info className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tickets Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">{ticketStatusData.hoy.pendientes}</p>
                <p className="text-xs text-gray-500">Total: {ticketStatusData.total.pendientes}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tickets Asignados</p>
                <p className="text-3xl font-bold text-gray-900">{ticketStatusData.hoy.asignados}</p>
                <p className="text-xs text-gray-500">Total: {ticketStatusData.total.asignados}</p>
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
                <p className="text-sm font-medium text-gray-600">En Espera</p>
                <p className="text-3xl font-bold text-gray-900">{ticketStatusData.hoy.enEspera}</p>
                <p className="text-xs text-gray-500">Total: {ticketStatusData.total.enEspera}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tickets Trabajados</p>
                <p className="text-3xl font-bold text-gray-900">{ticketStatusData.hoy.trabajados}</p>
                <p className="text-xs text-gray-500">Total: {ticketStatusData.total.trabajados.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Asignados por Soportes - Contenedor de ambas tablas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Asignados por Soportes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Tabla Izquierda */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                {/* Table Header */}
                <div className="grid grid-cols-4 bg-gray-700 text-white text-sm font-medium">
                  <div className="p-3 text-left">Nombre</div>
                  <div className="p-3 text-center">NUEVOS (hoy)</div>
                  <div className="p-3 text-center">TRAB. (hoy)</div>
                  <div className="p-3 text-center">TOTAL PEND.</div>
                </div>

                {/* Staff Rows */}
                {supportStaffDataLeft.map((staff, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-4 text-sm border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="p-3 text-left font-medium text-gray-900">{staff.name}</div>
                    <div className="p-3 text-center">
                      <Badge variant="secondary" className={getBadgeColor(staff.nuevos, "nuevos")}>
                        {staff.nuevos}
                      </Badge>
                    </div>
                    <div className="p-3 text-center">
                      <Badge variant="secondary" className={getBadgeColor(staff.trabajados, "trabajados")}>
                        {staff.trabajados}
                      </Badge>
                    </div>
                    <div className="p-3 text-center">
                      <Badge variant="secondary" className={getBadgeColor(staff.totalPend, "totalPend")}>
                        {staff.totalPend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabla Derecha */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                {/* Table Header */}
                <div className="grid grid-cols-4 bg-gray-700 text-white text-sm font-medium">
                  <div className="p-3 text-left">Nombre</div>
                  <div className="p-3 text-center">NUEVOS (hoy)</div>
                  <div className="p-3 text-center">TRAB. (hoy)</div>
                  <div className="p-3 text-center">TOTAL PEND.</div>
                </div>

                {/* Staff Rows */}
                {supportStaffDataRight.map((staff, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-4 text-sm border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="p-3 text-left font-medium text-gray-900">{staff.name}</div>
                    <div className="p-3 text-center">
                      <Badge variant="secondary" className={`${getBadgeColor(staff.nuevos, "nuevos")}`}>
                        {staff.nuevos}
                      </Badge>
                    </div>
                    <div className="p-3 text-center">
                      <Badge variant="secondary" className={`${getBadgeColor(staff.trabajados, "trabajados")}`}>
                        {staff.trabajados}
                      </Badge>
                    </div>
                    <div className="p-3 text-center">
                      <Badge variant="secondary" className={`${getBadgeColor(staff.totalPend, "totalPend")}`}>
                        {staff.totalPend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Rendimiento - Sección inferior */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Resumen de Asignaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-cyan-500">
                {[...supportStaffDataLeft, ...supportStaffDataRight].reduce((acc, staff) => acc + staff.nuevos, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Total Tickets Nuevos Asignados</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-500">
                {[...supportStaffDataLeft, ...supportStaffDataRight].reduce((acc, staff) => acc + staff.trabajados, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Total Tickets Trabajados Hoy</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500">
                {[...supportStaffDataLeft, ...supportStaffDataRight].reduce((acc, staff) => acc + staff.totalPend, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Total Tickets Pendientes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  )
}
