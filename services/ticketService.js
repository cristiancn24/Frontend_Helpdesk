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

export const uploadTicketFiles = async (ticketId, files) => {
  const form = new FormData();
  // acepta tanto FileList como arreglo de objetos de tu UI
  (Array.from(files || [])).forEach((f) => {
    const file = f.file || f;               // soporta { file, name... } o File directo
    form.append("files", file);
  });

  const { data } = await axiosInstance.post(
    `/tickets/${ticketId}/attachments`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,                // si usas cookies
    }
  );
  return data; // { success, data: [ {id, name, url...} ] }
};

export const addTicketComment = async(ticketId, comment) => {
  const { data } = await axiosInstance.post(
    `/tickets/${encodeURIComponent(ticketId)}/comments`,
    { comment } // 👈 sólo el texto
  );
  if (!data?.success) throw new Error(data?.error || "No se pudo agregar el comentario");
  return data.data; 
}

export const updateTicketStatus = async (id, statusId) => {
  const { data } = await axiosInstance.patch(`/tickets/${id}`, {
    status_id: Number(statusId),
  });
  if (!data?.success) throw new Error(data?.error || "No se pudo actualizar");
  return data.data; // trae { ...ticket, status_name }
}


