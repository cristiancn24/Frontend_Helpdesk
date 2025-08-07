// services/userService.js
import axiosInstance from './axiosInstance';

export const createUser = async (params= {}) => {
  const response = await axiosInstance.post('/users', params, {
    withCredentials: true,
  });
  return response.data;
};

export const getUsers = async (page = 1, limit = 15) => {
  const response = await axiosInstance.get('/users', {
    params: { page, limit },
    withCredentials: true,
  });
  return response.data;
};
