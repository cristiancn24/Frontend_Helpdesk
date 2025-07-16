import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Bell,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Ticket,
  Users,
  Eye,
  Edit,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function TicketsPage() {
  const tickets = [
    {
      id: "#1235",
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
    {
      id: "#1229",
      title: "Integration Help",
      customer: "Lisa Garcia",
      email: "lisa.g@email.com",
      status: "In Progress",
      priority: "Medium",
      assignee: "Alex Chen",
      category: "Technical Support",
      department: "IT Department",
      branch: "Sucursal Oeste",
      created: "2024-01-10",
      updated: "6 hours ago",
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-900">Web Helpdesk</h1>
        </div>
        <nav className="mt-6">
          <div className="px-3">
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 mb-1">
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="default" className="w-full justify-start bg-cyan-500 hover:bg-cyan-600 text-white mb-1">
              <Ticket className="mr-3 h-4 w-4" />
              Tickets
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 mb-1">
              <HelpCircle className="mr-3 h-4 w-4" />
              FAQ
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 mb-1">
              <FileText className="mr-3 h-4 w-4" />
              Reports
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Tickets</h2>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Tickets Content */}
        <div className="p-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">89</p>
                  <p className="text-sm text-gray-600">Open</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">45</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">234</p>
                  <p className="text-sm text-gray-600">Resolved</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">879</p>
                  <p className="text-sm text-gray-600">Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Primera fila de filtros */}
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Buscar tickets..." className="pl-10" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los técnicos</SelectItem>
                      <SelectItem value="sarah">Sarah Wilson</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                      <SelectItem value="alex">Alex Chen</SelectItem>
                      <SelectItem value="unassigned">Sin asignar</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="open">Abierto</SelectItem>
                      <SelectItem value="in-progress">En progreso</SelectItem>
                      <SelectItem value="resolved">Resuelto</SelectItem>
                      <SelectItem value="closed">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Ticket
                  </Button>
                </div>

                {/* Segunda fila de filtros */}
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  <div className="flex gap-2">
                    <Input type="date" className="w-40" placeholder="Fecha desde" />
                    <span className="flex items-center text-gray-500">hasta</span>
                    <Input type="date" className="w-40" placeholder="Fecha hasta" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Categoría" />
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
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las prioridades</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sucursal/Departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las sucursales</SelectItem>
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

                {/* Botones de acción para filtros */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    Aplicar Filtros
                  </Button>
                  <Button variant="ghost" size="sm">
                    Limpiar Filtros
                  </Button>
                  <Button variant="ghost" size="sm">
                    Exportar Resultados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Tickets</CardTitle>
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
                    <TableHead>Sucursal/Depto</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ticket.title}</p>
                        </div>
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar Ticket
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              Reasignar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">Showing 1 to 6 of 1,247 tickets</p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
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
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
