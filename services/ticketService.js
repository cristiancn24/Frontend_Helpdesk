import axiosInstance from "@/services/axiosInstance";

const normalizeTicketId = (id) => String(id).replace(/^#/, "");

// ------- LISTADOS -------
export async function getTickets(params = {}) {
  const { data } = await axiosInstance.get("/tickets", { params });
  return data;
}

// ⚠️ Deja esta si aún la usas en otras pantallas (triage viejo)
export async function getTriageTickets(params = {}) {
  const { data } = await axiosInstance.get("/tickets", {
    params: { page: 1, limit: 100, ...params, triage: 1 },
  });
  return data;
}

// ✅ NUEVO: triage “diario” (hoy por defecto / ver todos con showAll=1)
export async function getTriageDailyTickets(options = {}) {
  const {
    page = 1,
    limit = 100,
    showAll = false,        // boolean en FE
    date,                   // opcional: 'YYYY-MM-DD' si quieres un día específico
  } = options;

  const params = {
    page,
    limit,
    showAll: showAll ? "1" : "0",   // el backend parsea "1"/"true"
    show_all: showAll ? "1" : "0",  // por si el router está en snake_case
  };
  if (date) params.date = date;

  try {
    const { data } = await axiosInstance.get("/tickets/triage-daily", { params });
    return data;
  } catch (err) {
    // Log útil para ver el motivo del 400
    const serverMsg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Bad Request";
    console.error("getTriageDailyTickets error:", err?.response?.data || serverMsg);
    throw new Error(serverMsg);
  }
}

// ------- OPCIONES -------
export async function getStatusOptions() {
  const { data } = await axiosInstance.get("/tickets/status-options");
  return data;
}

export async function getFilterOptions() {
  const { data } = await axiosInstance.get("/tickets/filters");
  return data;
}

// ------- CRUD -------
export async function createTicket(ticketData) {
  const { data } = await axiosInstance.post("/tickets", ticketData);
  return data;
}

export async function getTicketById(id) {
  const tid = normalizeTicketId(id);
  const { data } = await axiosInstance.get(`/tickets/${tid}`);
  if (!data?.success) throw new Error(data?.error || "Error al obtener ticket");
  return data.data;
}

export async function uploadTicketFiles(ticketId, files) {
  const tid = normalizeTicketId(ticketId);
  const form = new FormData();
  (Array.from(files || [])).forEach((f) => {
    const file = f.file || f;
    form.append("files", file);
  });
  const { data } = await axiosInstance.post(`/tickets/${tid}/attachments`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return data;
}

export async function addTicketComment(ticketId, comment) {
  const tid = normalizeTicketId(ticketId);
  const { data } = await axiosInstance.post(`/tickets/${tid}/comments`, { comment });
  if (!data?.success) throw new Error(data?.error || "No se pudo agregar el comentario");
  return data.data;
}

export async function updateTicketStatus(id, statusId) {
  const tid = normalizeTicketId(id);
  const { data } = await axiosInstance.patch(`/tickets/${tid}`, { status_id: Number(statusId) });
  if (!data?.success) throw new Error(data?.error || "No se pudo actualizar");
  return data.data;
}

export async function updateTicket(id, patch) {
  const tid = normalizeTicketId(id);
  const { data } = await axiosInstance.patch(`/tickets/${tid}`, patch);
  if (!data?.success) throw new Error(data?.error || "No se pudo actualizar");
  return data.data;
}

// Helpers
export async function setTicketCategory(id, categoryId) {
  return updateTicket(id, { category_service_id: Number(categoryId) });
}

export async function assignTicket(id, technicianUserId) {
  return updateTicket(id, { assigned_user_id: Number(technicianUserId) });
}

export async function bulkAssignTickets(ids = [], technicianUserId) {
  await Promise.all(ids.map(tid => assignTicket(tid, technicianUserId)));
  return true;
}

export async function getPoolTickets(params = {}) {
  const { data } = await axiosInstance.get("/tickets/pool", {
    params: { page: 1, limit: 100, ...params },
  });
  return data; // { success, data: [...], ... }
}

