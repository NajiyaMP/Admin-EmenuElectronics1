// src/services/authService.js
import axios from 'axios';

const AuthService = {
    logout: async () => {
        try {
            const response = await axios.post('/logout'); // Adjust the endpoint if necessary
            return response.data;
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    }
};

export default AuthService;
