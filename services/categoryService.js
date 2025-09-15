import api from './axiosInstance';

export const getCategories = async () => {
  try {
    const response = await api.get('/categoryServices');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categoryServices', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategoryStatus = async (categoryId, active) => {
  const { data } = await api.patch(`/categoryServices/${categoryId}`, { active });
  return data;
};