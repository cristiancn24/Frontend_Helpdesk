import api from './axiosInstance';

export const getFAQs = async () => {
  try {
    const response = await api.get('/faq');
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
};

export const createFAQ = async (faqData) => {
  try {
    const response = await api.post('/faq', faqData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error creating FAQ:", error); // Aquí ya se imprime
    throw error; // Aquí se relanza el error
  }
};
