import axiosInstance from "@/services/axiosInstance";

const normalizeTicketId = (id) => String(id).replace(/^#/, "");

// ------- LISTADOS -------
export async function getTickets(params = {}) {
  const { data } = await axiosInstance.get("/tickets", { params });
  return data; // { success, data, page, ... }
}

export async function getTriageTickets(params = {}) {
  const { data } = await axiosInstance.get("/tickets", {
    params: { page: 1, limit: 100, ...params, triage: 1 },
  });
  return data;
}

// ------- OPCIONES -------
export async function getStatusOptions() {
  const { data } = await axiosInstance.get("/tickets/status-options");
  return data;
}

export async function getFilterOptions() {
  const { data } = await axiosInstance.get("/tickets/filters");
  return data; // { technicians, categories, offices, ... }
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
  return data.data; // { ..., assigned_user_name, category_name, needsCategory, needsAssignee }
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
