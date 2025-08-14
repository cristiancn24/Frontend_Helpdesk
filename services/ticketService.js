import axiosInstance from "@/services/axiosInstance";

export async function getTickets(params = {}) {
  const { data } = await axiosInstance.get("/tickets", { params });
  return data; // { data, page, limit, totalItems, totalPages }
}

export async function getStatusOptions() {
  const { data } = await axiosInstance.get("/tickets/status-options");
  return data; // [{id,name}, ...]
}

export async function getFilterOptions() {
  const { data } = await axiosInstance.get("/tickets/filters");
  return data;
}

export async function createTicket(ticketData) {
  const { data } = await axiosInstance.post("/tickets", ticketData);
  return data;
};

export async function getTicketById(id) {
  const { data } = await axiosInstance.get(`/tickets/${id}`);
  if (!data?.success) throw new Error(data?.error || "Error al obtener ticket");
  return data.data; // <- devuelve directamente el objeto del ticket
};

