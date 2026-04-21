import { fetchApi } from './apiClient';
import { User, UserPayload } from '../types/user.types';

export const usersService = {
  getAll: async (): Promise<User[]> => {
    return fetchApi('/users', {
      method: 'GET',
    });
  },

  create: async (userData: UserPayload): Promise<User> => {
    return fetchApi('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id: number, userData: UserPayload): Promise<User> => {
    return fetchApi(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  softDelete: async (id: number): Promise<void> => {
    return fetchApi(`/users/${id}/soft`, {
      method: 'DELETE',
    });
  },

  hardDelete: async (id: number): Promise<void> => {
    return fetchApi(`/users/${id}/hard`, {
      method: 'DELETE',
    });
  },
};
