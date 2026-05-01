import { Product, User } from '../types';

const API_URL = '/api';

export const apiService = {
  // Auth
  async login(credentials: any): Promise<{token: string, user: User}> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(details: any): Promise<{token: string, user: User}> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
    // Map _id to id for frontend compatibility
    return data.map((p: any) => ({ ...p, id: p._id.toString() }));
  }
};
