import axios from 'axios';

export const checkOrRegisterAgent = async (phoneNumber, isGuest = false) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/chat/agents/check-or-register`, {
      phoneNumber,
      isGuest,
    });
    return response.data;
  } catch (error) {
    console.error('Error checking/registering agent:', error);
    return null;
  }
};
