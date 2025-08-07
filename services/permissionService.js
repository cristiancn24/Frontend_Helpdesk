import axiosInstance from '@/services/axiosInstance';

export const getPermissions = async () => {
  try {
    const response = await axiosInstance.get('/permissions');
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

export const createPermission = async (permissionData) => {
  try {
    const response = await axiosInstance.post('/permissions', permissionData);
    return response.data;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
};


