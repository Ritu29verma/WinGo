import axios from 'axios';



export const checkOrRegisterUser = async (phoneNumber, username, isGuest = false) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/chat/users/check-or-register`, {
      phoneNumber,
      username,
      isGuest,
    });
    return response.data;
  } catch (error) {
    console.error('Error checking/registering user:', error);
    return null;
  }
};
