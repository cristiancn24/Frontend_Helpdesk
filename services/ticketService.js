import axiosInstance from "@/services/axiosInstance";

export async function getTickets(params = {}) {
  const { data } = await axiosInstance.get("/tickets", { params });
  return data; // { data, page, limit, totalItems, totalPages }
}

export async function getStatusOptions() {
  const { data } = await axiosInstance.get("/tickets/status-options");
  return data; // [{id,name}, ...]
}
