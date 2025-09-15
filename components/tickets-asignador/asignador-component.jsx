"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Search, Filter, UserPlus, MoreHorizontal, Eye, Edit, UserCheck, Tag } from "lucide-react";
import { updateTicket, getFilterOptions, getTriageDailyTickets } from "@/services/ticketService";
import { toast } from "react-toastify";

const PRIORITY_FALLBACK = [
  { value: "Urgente", label: "Urgente" },
  { value: "Alta",    label: "Alta" },
  { value: "Media",   label: "Media" },
  { value: "Baja",    label: "Baja" },
];

export default function AsignadorComponent() {
  const router = useRouter();

  const [tickets, setTickets] = useState([]);                 // [{ rawId, id, title, ... }]
  const [selectedTickets, setSelectedTickets] = useState([]); // [rawId, ...]
  const [filterStatus, setFilterStatus] = useState("all");    // all | no-category | unassigned | assigned

  const [assignmentModal, setAssignmentModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);

  const [selectedTechnician, setSelectedTechnician] = useState(""); // userId
  const [selectedCategory, setSelectedCategory] = useState("");     // categoryId
  const [selectedPriority, setSelectedPriority] = useState("");     // prioridad para modal Asignar Tickets
  const [selectedPriorityForCategory, setSelectedPriorityForCategory] = useState(""); // prioridad para modal Categoría

  const [currentTicketForCategory, setCurrentTicketForCategory] = useState(null); // rawId

  const [technicians, setTechnicians] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState(PRIORITY_FALLBACK);

  const [search, setSearch] = useState("");

  // Toggle Hoy / Todos
  const [showAll, setShowAll] = useState(false); // false = HOY (por defecto), true = TODOS

  // Cargar opciones (técnicos/categorías/prioridades)
  useEffect(() => {
    (async () => {
      try {
        const opts = await getFilterOptions(); // { technicians, categories, priorities? }
        setTechnicians(opts?.technicians || []);
        setCategories(opts?.categories || []);
        setPriorities(
          Array.isArray(opts?.priorities) && opts.priorities.length ? opts.priorities : PRIORITY_FALLBACK
        );
      } catch (e) {
        console.error(e);
        toast.error("No se pudieron cargar las opciones");
      }
    })();
  }, []);

  // Cargar tickets (hoy o todos)
  const loadTickets = async () => {
    try {
      const res = await getTriageDailyTickets({
        page: 1,
        limit: 100,
        showAll, // usa el estado del toggle
        // date: "YYYY-MM-DD" // opcional si quieres un día específico
      });

      const mapped = (res?.data || []).map(t => {
        const hasCategory  = t.needsCategory !== undefined ? !t.needsCategory : Boolean(t.category && t.category !== "—");
        const hasAssignee  = t.needsAssignee !== undefined ? !t.needsAssignee : Boolean(t.assignee && t.assignee !== "Sin asignar");
        return {
          rawId: t.rawId,              // num
          id: t.id,                    // "#123"
          title: t.title,
          client: t.createdBy || "—",
          status: t.status,
          priority: t.priority,        // "Urgente" | "Alta" | "Media" | "Baja" | null
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
      toast.error(showAll ? "No se pudieron cargar todos los tickets" : "No se pudieron cargar los tickets de hoy");
    }
  };

  useEffect(() => { loadTickets(); }, []);           // al montar
  useEffect(() => { loadTickets(); }, [showAll]);    // al cambiar Hoy/Todos

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
    setSelectedCategory("");
    setSelectedPriorityForCategory("");
    setCategoryModal(true);
  };

  // Guardar categoría (individual) + prioridad opcional
  const handleCategoryAssignment = async () => {
    if (!selectedCategory || !currentTicketForCategory) return;
    try {
      await updateTicket(currentTicketForCategory, {
        category_service_id: Number(selectedCategory),
        ...(selectedPriorityForCategory ? { priority: selectedPriorityForCategory } : {}),
      });
      toast.success("Categoría y prioridad actualizadas");
      setCategoryModal(false);
      setSelectedCategory("");
      setSelectedPriorityForCategory("");
      setCurrentTicketForCategory(null);
      await loadTickets();
    } catch (e) {
      console.error(e);
      toast.error("No se pudo actualizar la categoría/prioridad");
    }
  };

  // Asignación masiva de técnico (+ prioridad opcional)
  const handleBulkAssignment = async () => {
    if (!selectedTechnician || selectedTickets.length === 0) return;
    try {
      await Promise.all(
        selectedTickets.map(rawId =>
          updateTicket(rawId, {
            assigned_user_id: Number(selectedTechnician),
            ...(selectedPriority ? { priority: selectedPriority } : {}),
          })
        )
      );
      toast.success("Asignación realizada");
      setSelectedTickets([]);
      setAssignmentModal(false);
      setSelectedTechnician("");
      setSelectedPriority("");
      await loadTickets();
    } catch (e) {
      console.error(e);
      toast.error("No se pudo asignar el técnico/prioridad");
    }
  };

  // Badges
  const getStatusBadge = (status) => {
    const map = {
      Open:        { color: "bg-red-100 text-red-800",   label: "Abierto" },
      "In Progress": { color: "bg-blue-100 text-blue-800", label: "En Progreso" },
      Resolved:    { color: "bg-green-100 text-green-800", label: "Resuelto" },
      Closed:      { color: "bg-gray-100 text-gray-800",  label: "Cerrado" },
      Asignado:    { color: "bg-yellow-100 text-yellow-800", label: "Asignado" },
      Pendiente:   { color: "bg-blue-100 text-blue-800", label: "Pendiente" },
      Validado:    { color: "bg-green-100 text-green-800", label: "Validado" },
      Cerrado:     { color: "bg-gray-100 text-gray-800", label: "Cerrado" },
    };
    return map[status] || { color: "bg-gray-100 text-gray-800", label: status || "—" };
  };

  // Soporta español y (por compatibilidad) inglés
  const getPriorityBadge = (priority) => {
    const p = (priority || "").toString();
    const mapEs = {
      Urgente: { color: "bg-red-100 text-red-800", label: "Urgente" },
      Alta:    { color: "bg-orange-100 text-orange-800", label: "Alta" },
      Media:   { color: "bg-yellow-100 text-yellow-800", label: "Media" },
      Baja:    { color: "bg-green-100 text-green-800", label: "Baja" },
    };
    const mapEn = {
      High:   mapEs.Alta,
      Medium: mapEs.Media,
      Low:    mapEs.Baja,
      Urgent: mapEs.Urgente,
    };
    return mapEs[p] || mapEn[p] || { color: "bg-gray-100 text-gray-800", label: p || "—" };
  };

  return (
    <MainLayout title="Gestión de Tickets - Asignador">
      {/* Filtros y acciones */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar tickets..."
                  className="pl-10"
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                />
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

            {/* Toggle Hoy / Todos */}
            <div className="flex items-center gap-2">
              <Button
                variant={showAll ? "outline" : "default"}
                onClick={() => setShowAll(false)}
              >
                Hoy
              </Button>
              <Button
                variant={showAll ? "default" : "outline"}
                onClick={() => setShowAll(true)}
              >
                Todos
              </Button>
            </div>

            {/* Botón para abrir modal de asignación (sólo si hay selección) */}
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
                        Selecciona un técnico y (opcional) una prioridad para {selectedTickets.length} ticket(s)
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                      {/* Técnico */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Técnico</label>
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

                      {/* Prioridad (opcional) */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Prioridad (opcional)</label>
                        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar prioridad..." />
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map(p => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAssignmentModal(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleBulkAssignment} disabled={!selectedTechnician}>
                        Asignar
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
              {showAll
                ? "Tickets para Clasificar (Todos)"
                : "Tickets para Clasificar (Hoy)"}
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

                    {/* ID como link al detalle */}
                    <td className="p-4">
                      <Link
                        href={`/tickets/${ticket.rawId}`}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        {ticket.id}
                      </Link>
                    </td>

                    {/* Título como link al detalle */}
                    <td className="p-4">
                      <Link
                        href={`/tickets/${ticket.rawId}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {ticket.title}
                      </Link>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-gray-900">{ticket.client}</div>
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

                    <td className="p-4">
                      <span className="text-sm text-gray-600">{ticket.created}</span>
                    </td>

                    {/* Menú acciones */}
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/tickets/${ticket.rawId}`)}>
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
                                setSelectedTechnician("");
                                setSelectedPriority("");
                                setAssignmentModal(true);
                              }}
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Asignar Técnico / Prioridad
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

      {/* Modal Categoría (con prioridad opcional) */}
      <Dialog open={categoryModal} onOpenChange={setCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Categoría</DialogTitle>
            <DialogDescription>Selecciona una categoría y (opcional) una prioridad</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Categoría</label>
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

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Prioridad (opcional)</label>
              <Select value={selectedPriorityForCategory} onValueChange={setSelectedPriorityForCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad..." />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(p => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryModal(false)}>Cancelar</Button>
            <Button onClick={handleCategoryAssignment} disabled={!selectedCategory}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
