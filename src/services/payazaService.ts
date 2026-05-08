import axios from 'axios';

const api = axios.create({
  baseURL: '/api/payaza'
});

export const payazaService = {
  initializePayment: async (data: {
    amount: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    currency: string;
  }) => {
    const response = await api.post('/initialize-payment', data);
    return response.data;
  },

  verifyBvn: async (data: {
    bvn: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await api.post('/verify-bvn', data);
    return response.data;
  },

  createVirtualAccount: async (data: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  }) => {
    const response = await api.post('/create-virtual-account', data);
    return response.data;
  }
};
