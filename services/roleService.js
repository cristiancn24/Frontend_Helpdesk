// services/roleService.js
import axiosInstance from "@/services/axiosInstance";

export const createRole = async (name) => {
  try {
    const response = await axiosInstance.post("/roles", {name});
    return response.data;
  } catch (error) {
    console.error("Error al crear rol:", error);
    throw error;
  }
};

export const getRolePermissions = async (roleId) => {
  const { data } = await axiosInstance.get(`/roles/${roleId}/permissions`);
  return data;
};

export const updateRolePermissions = async (roleId, permissions) => {
  await axiosInstance.post(`/roles/assign-permissions`, { roleId, permissions });
};

export const getRolesWithPermissions = async () => {
  try {
    const response = await axiosInstance.get("/roles/roles-with-permissions");
    return response.data;
  } catch (error) {
    console.error("Error fetching roles with permissions:", error);
    throw error;
  }
};
