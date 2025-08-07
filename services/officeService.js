import axiosInstance from '@/services/axiosInstance';

export const getOffices = async () => {
  try {
    const response = await axiosInstance.get('/offices');
    return response.data;
  } catch (error) {
    console.error('Error fetching offices:', error);
    throw error;
  }
};

export const createOffice = async (officeData) => {
  try {
    const response = await axiosInstance.post('/offices', officeData);
    return response.data;
  } catch (error) {
    console.error('Error creating office:', error);
    throw error;
  }
};