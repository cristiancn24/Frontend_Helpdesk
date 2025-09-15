"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/main-layout";
import { toast } from "react-toastify";
import { getPoolTickets, updateTicket } from "@/services/ticketService";
import { useAuth } from "@/context/AuthContext";

// util: quitar etiquetas HTML básicas
const stripHtml = (html) => (typeof html === "string" ? html.replace(/<[^>]*>/g, "").trim() : html);
const todayISO = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const POOL_ROUTE = "/pool"; // cambia si tu ruta real es otra

export default function PoolTicketsComponent() {
  const { user } = useAuth(); // <-- ID del usuario actual (asegúrate de que esté disponible)
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rangeMode, setRangeMode] = useState("today"); // "today" | "all"
  const [assigningId, setAssigningId] = useState(null); // para deshabilitar el select del ticket en proceso

  // Guarda la última lista visitada (sirve de fallback en el detalle)
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lastTicketsList", `${POOL_ROUTE}?mode=${rangeMode}`);
    }
  }, [rangeMode]);

  const loadTickets = async (mode) => {
    try {
      setLoading(true);
      const params =
        mode === "today"
          ? { page: 1, limit: 100, dateFrom: todayISO(), dateTo: todayISO() }
          : { page: 1, limit: 100 };

      const res = await getPoolTickets(params);
      const rows = Array.isArray(res) ? res : res?.data || [];

      const mapped = rows.map((t) => {
        const rawId = t.rawId ?? t.id;
        const id = typeof t.id === "string" && t.id.startsWith("#") ? t.id : `#${t.id ?? rawId ?? ""}`;
        const created = t.created ?? (t.created_at ? new Date(t.created_at).toISOString().slice(0, 10) : "");

        return {
          rawId,
          id,
          date: created,
          subject: stripHtml(t.title ?? t.subject ?? "—"),
          description: stripHtml(t.description ?? t.comment ?? "—"),
          category: stripHtml(t.category ?? t.category_name ?? "—"),
          branch: stripHtml(t.supportOffice ?? t.office_name ?? "—"),
          priority: t.priority ?? "—",
        };
      });

      setTickets(mapped);
    } catch (e) {
      console.error(e);
      toast.error("No se pudieron cargar los tickets del pool");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets(rangeMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeMode]);

  // Toma el ticket: asigna prioridad y te lo asigna a ti
  const takeTicket = async (ticket, priority) => {
    if (!user?.id) {
      toast.error("No se pudo identificar al usuario actual.");
      return;
    }
    try {
      setAssigningId(ticket.rawId);
      await updateTicket(ticket.rawId, {
        assigned_user_id: Number(user.id), // <- te asigna el ticket
        priority,                          // <- prioridad elegida ("Baja"|"Media"|"Alta"|"Urgente")
      });

      toast.success(`Ticket ${ticket.id} tomado con prioridad ${priority}`);
      setTickets((prev) => prev.filter((t) => t.rawId !== ticket.rawId));
    } catch (e) {
      console.error(e);
      toast.error("No se pudo tomar el ticket");
    } finally {
      setAssigningId(null);
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      Baja: "bg-green-100 text-green-800",
      Media: "bg-yellow-100 text-yellow-800",
      Alta: "bg-orange-100 text-orange-800",
      Urgente: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  return (
    <MainLayout title="Pool de Tickets">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Tickets en Espera</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={rangeMode === "today" ? "default" : "outline"}
                className={rangeMode === "today" ? "bg-cyan-500 hover:bg-cyan-600 text-white" : ""}
                onClick={() => setRangeMode("today")}
              >
                Hoy
              </Button>
              <Button
                size="sm"
                variant={rangeMode === "all" ? "default" : "outline"}
                className={rangeMode === "all" ? "bg-cyan-500 hover:bg-cyan-600 text-white" : ""}
                onClick={() => setRangeMode("all")}
              >
                Todos
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table className="w-full table-auto">
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                      {rangeMode === "today" ? "No hay tickets hoy" : "No hay tickets"}
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((t) => (
                    <TableRow key={t.rawId ?? t.id}>
                      <TableCell className="whitespace-nowrap align-top">
                        {/* ID clickeable al detalle */}
                        <Link
                          href={{ pathname: `/tickets/${t.rawId}`, query: { from: POOL_ROUTE } }}
                          className="text-cyan-700 hover:underline font-medium"
                        >
                          {t.id}
                        </Link>
                      </TableCell>

                      <TableCell className="whitespace-nowrap align-top">{t.date}</TableCell>

                      <TableCell className="align-top">
                        {/* Asunto clickeable al detalle */}
                        <Link
                          href={{ pathname: `/tickets/${t.rawId}`, query: { from: POOL_ROUTE } }}
                          className="text-gray-900 hover:underline"
                        >
                          <div className="whitespace-pre-wrap break-words">{t.subject}</div>
                        </Link>
                      </TableCell>

                      <TableCell className="align-top">
                        <div className="whitespace-pre-wrap break-words">{t.description}</div>
                      </TableCell>

                      <TableCell className="whitespace-pre-wrap break-words align-top">{t.category}</TableCell>
                      <TableCell className="whitespace-pre-wrap break-words align-top">{t.branch}</TableCell>

                      <TableCell className="align-top">
                        <Select
                          disabled={assigningId === t.rawId}
                          onValueChange={(value) => takeTicket(t, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={assigningId === t.rawId ? "Tomando..." : "Seleccionar"} />
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
