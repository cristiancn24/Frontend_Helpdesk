"use client"

import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, UserPlus, MoreHorizontal, Eye, Edit, UserCheck, Tag } from "lucide-react";
import { getTriageTickets, updateTicket, getFilterOptions } from "@/services/ticketService";
import { toast } from "react-toastify";

export default function AsignadorComponent() {
  const [tickets, setTickets] = useState([]);                // [{ rawId, id, title, ... }]
  const [selectedTickets, setSelectedTickets] = useState([]); // [rawId, ...]
  const [filterStatus, setFilterStatus] = useState("all");    // all | no-category | unassigned | assigned
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(""); // userId
  const [selectedCategory, setSelectedCategory] = useState("");     // categoryId
  const [currentTicketForCategory, setCurrentTicketForCategory] = useState(null); // rawId
  const [technicians, setTechnicians] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  // Opciones (técnicos/categorías)
  useEffect(() => {
    (async () => {
      try {
        const opts = await getFilterOptions(); // { technicians, categories, ... }
        setTechnicians(opts?.technicians || []);
        setCategories(opts?.categories || []);
      } catch (e) {
        console.error(e);
        toast.error("No se pudieron cargar las opciones");
      }
    })();
  }, []);

  // Cargar tickets de triage
  const loadTickets = async () => {
    try {
      const res = await getTriageTickets({ page: 1, limit: 100, order: "desc", sortBy: "created_at" });
      const mapped = (res?.data || []).map(t => {
        // Usamos las flags del backend si existen; si no, inferimos
        const hasCategory  = t.needsCategory  !== undefined ? !t.needsCategory : Boolean(t.category && t.category !== "—");
        const hasAssignee  = t.needsAssignee  !== undefined ? !t.needsAssignee : Boolean(t.assignee && t.assignee !== "Sin asignar");
        return {
          rawId: t.rawId,              // num
          id: t.id,                    // "#123"
          title: t.title,
          client: t.createdBy || "—",
          status: t.status,
          priority: t.priority,
          technician: hasAssignee ? t.assignee : null,
          category: hasCategory ? t.category : null,
          created: t.created,
          isAssigned: hasAssignee,
          needsCategory: !hasCategory,
        };
      });
      setTickets(mapped);
      setSelectedTickets([]);
    } catch (e) {
      console.error(e);
      toast.error("No se pudieron cargar los tickets de triage");
    }
  };

  useEffect(() => { loadTickets(); }, []);

  // Filtros locales
  const filteredTickets = useMemo(() => {
    let list = tickets;
    if (filterStatus === "unassigned")  list = list.filter(t => !t.isAssigned);
    if (filterStatus === "assigned")    list = list.filter(t => t.isAssigned);
    if (filterStatus === "no-category") list = list.filter(t => t.needsCategory);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(t =>
        (t.title || "").toLowerCase().includes(q) || (t.id || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [tickets, filterStatus, search]);

  // Selección
  const handleSelectTicket = (rawId) => {
    setSelectedTickets(prev =>
      prev.includes(rawId) ? prev.filter(id => id !== rawId) : [...prev, rawId]
    );
  };

  const handleSelectAll = () => {
    const unassigned = filteredTickets.filter(t => !t.isAssigned).map(t => t.rawId);
    setSelectedTickets(prev => (prev.length === unassigned.length ? [] : unassigned));
  };

  // Abrir modal de categoría
  const openCategoryModal = (rawId) => {
    setCurrentTicketForCategory(rawId);
    setCategoryModal(true);
  };

  // Guardar categoría (individual)
  const handleCategoryAssignment = async () => {
    if (!selectedCategory || !currentTicketForCategory) return;
    try {
      await updateTicket(currentTicketForCategory, {
        category_service_id: Number(selectedCategory),
      });
      toast.success("Categoría asignada");
      setCategoryModal(false);
      setSelectedCategory("");
      setCurrentTicketForCategory(null);
      await loadTickets(); // el ticket permanece si aún no tiene técnico
    } catch (e) {
      console.error(e);
      toast.error("No se pudo asignar la categoría");
    }
  };

  // Asignación masiva de técnico (o individual desde el menú)
  const handleBulkAssignment = async () => {
    if (!selectedTechnician || selectedTickets.length === 0) return;
    try {
      await Promise.all(
        selectedTickets.map(rawId =>
          updateTicket(rawId, { assigned_user_id: Number(selectedTechnician) })
        )
      );
      toast.success("Técnico asignado");
      setSelectedTickets([]);
      setAssignmentModal(false);
      setSelectedTechnician("");
      await loadTickets(); // si además ya tenía categoría → desaparecerá
    } catch (e) {
      console.error(e);
      toast.error("No se pudo asignar el técnico");
    }
  };

  // Badges
  const getStatusBadge = (status) => {
    const map = {
      Open:        { color: "bg-red-100 text-red-800",   label: "Abierto" },
      "In Progress": { color: "bg-blue-100 text-blue-800", label: "En Progreso" },
      Resolved:    { color: "bg-green-100 text-green-800", label: "Resuelto" },
      Closed:      { color: "bg-gray-100 text-gray-800",  label: "Cerrado" },
    };
    return map[status] || { color: "bg-gray-100 text-gray-800", label: status };
  };

  const getPriorityBadge = (priority) => {
    const map = {
      High:   { color: "bg-red-100 text-red-800",    label: "Alta" },
      Medium: { color: "bg-yellow-100 text-yellow-800", label: "Media" },
      Low:    { color: "bg-green-100 text-green-800",   label: "Baja" },
    };
    return map[priority] || { color: "bg-gray-100 text-gray-800", label: priority };
  };

  // UI (tu diseño original)
  return (
    <MainLayout title="Gestión de Tickets - Supervisor">
      {/* Filtros y acciones */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Buscar tickets..." className="pl-10" value={search} onChange={(e)=>setSearch(e.target.value)} />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="no-category">Sin categoría</SelectItem>
                  <SelectItem value="unassigned">Sin asignar</SelectItem>
                  <SelectItem value="assigned">Asignados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              {selectedTickets.length > 0 && (
                <Dialog open={assignmentModal} onOpenChange={setAssignmentModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Asignar ({selectedTickets.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Asignar Tickets</DialogTitle>
                      <DialogDescription>
                        Selecciona un técnico para asignar {selectedTickets.length} ticket(s)
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar técnico..." />
                        </SelectTrigger>
                        <SelectContent>
                          {technicians.map((tech) => (
                            <SelectItem key={tech.id} value={String(tech.id)}>
                              {tech.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAssignmentModal(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleBulkAssignment} disabled={!selectedTechnician}>
                        Asignar Tickets
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {filterStatus === "unassigned"
                ? "Tickets Sin Asignar"
                : filterStatus === "assigned"
                ? "Tickets Asignados"
                : filterStatus === "no-category"
                ? "Tickets Sin Categoría"
                : "Tickets para Clasificar"}
            </CardTitle>

            {filteredTickets.filter((t) => !t.isAssigned).length > 0 && (
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                <Checkbox
                  checked={
                    selectedTickets.length === filteredTickets.filter((t) => !t.isAssigned).length &&
                    selectedTickets.length > 0
                  }
                  className="mr-2"
                />
                Seleccionar sin asignar
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600"></th>
                  <th className="text-left p-4 font-medium text-gray-600">ID</th>
                  <th className="text-left p-4 font-medium text-gray-600">Título</th>
                  <th className="text-left p-4 font-medium text-gray-600">Cliente</th>
                  <th className="text-left p-4 font-medium text-gray-600">Estado</th>
                  <th className="text-left p-4 font-medium text-gray-600">Prioridad</th>
                  <th className="text-left p-4 font-medium text-gray-600">Técnico</th>
                  <th className="text-left p-4 font-medium text-gray-600">Categoría</th>
                  <th className="text-left p-4 font-medium text-gray-600">Creado</th>
                  <th className="text-left p-4 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((ticket, idx) => (
                  <tr key={ticket.rawId} className={`border-b ${idx % 2 ? "bg-gray-50/50" : "bg-white"}`}>
                    {/* Selección */}
                    <td className="p-4">
                      <Checkbox
                        checked={selectedTickets.includes(ticket.rawId)}
                        onCheckedChange={() => handleSelectTicket(ticket.rawId)}
                        disabled={ticket.isAssigned}
                      />
                    </td>

                    <td className="p-4"><span className="text-blue-600 font-medium">{ticket.id}</span></td>
                    <td className="p-4"><div className="font-medium text-gray-900">{ticket.title}</div></td>

                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{ticket.client}</div>
                        {/* Si luego agregas email en el backend, muéstralo aquí */}
                      </div>
                    </td>

                    <td className="p-4">
                      <Badge className={getStatusBadge(ticket.status).color}>
                        {getStatusBadge(ticket.status).label}
                      </Badge>
                    </td>

                    <td className="p-4">
                      <Badge className={getPriorityBadge(ticket.priority).color}>
                        {getPriorityBadge(ticket.priority).label}
                      </Badge>
                    </td>

                    {/* Técnico */}
                    <td className="p-4">
                      {ticket.technician ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">{ticket.technician}</span>
                        </div>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Sin asignar</Badge>
                      )}
                    </td>

                    {/* Categoría */}
                    <td className="p-4">
                      {ticket.category ? (
                        <Badge className="bg-blue-100 text-blue-800">{ticket.category}</Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCategoryModal(ticket.rawId)}
                          className="bg-orange-50 text-orange-600 hover:bg-orange-100"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          Asignar
                        </Button>
                      )}
                    </td>

                    <td className="p-4"><span className="text-sm text-gray-600">{ticket.created}</span></td>

                    {/* Menú acciones */}
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Ticket
                          </DropdownMenuItem>

                          {!ticket.category && (
                            <DropdownMenuItem onClick={() => openCategoryModal(ticket.rawId)}>
                              <Tag className="h-4 w-4 mr-2" />
                              Asignar Categoría
                            </DropdownMenuItem>
                          )}

                          {!ticket.isAssigned && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedTickets([ticket.rawId]);
                                setAssignmentModal(true);
                              }}
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Asignar Técnico
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Categoría */}
      <Dialog open={categoryModal} onOpenChange={setCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Categoría</DialogTitle>
            <DialogDescription>Selecciona una categoría</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryModal(false)}>Cancelar</Button>
            <Button onClick={handleCategoryAssignment} disabled={!selectedCategory}>Asignar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Asignación (bulk / individual) */}
      <Dialog open={assignmentModal} onOpenChange={setAssignmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Tickets</DialogTitle>
            <DialogDescription>
              Selecciona un técnico para asignar {selectedTickets.length} ticket(s)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar técnico..." />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={String(tech.id)}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignmentModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleBulkAssignment} disabled={!selectedTechnician}>
              Asignar Tickets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
