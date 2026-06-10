import axios from 'axios';

export const authApi = {
  loginWithGoogle: async (idToken: string) => {
    const response = await axios.post('http://localhost:5198/api/iam/auth/sso', {
      idTokenGoogle: idToken
    });
    return response.data.token;
  }
};