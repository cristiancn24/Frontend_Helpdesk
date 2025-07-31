// services/authService.js
import api from './axiosInstance';

export const login = async (email, password, rememberme = false) => {
  try {
    const response = await api.post('/users/login', { email, password, rememberme }, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al iniciar sesión');
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/users/logout', {}, {
      withCredentials: true // 🔥 IMPORTANTE para enviar la cookie
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al cerrar sesión');
  }
};
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users', {
      withCredentials: true, // enviar cookie JWT
    });
    return response.data; // debe devolver info del usuario si está autenticado
  } catch (error) {
    // Si está no autenticado, devolver null o lanzar error
    if (error.response?.status === 401) {
      return null;
    }
    throw new Error('Error al obtener el usuario');
  }
};
