const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
  private getAuthHeader() {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // In a real app, you might want to try refreshing the token here
      // or dispatch an event to force logout in the UI.
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      let errorMessage = 'API request failed';
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (typeof errorData === 'object') {
        const firstKey = Object.keys(errorData)[0];
        if (firstKey && Array.isArray(errorData[firstKey])) {
          const fieldName = firstKey.replace('_', ' ');
          errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${errorData[firstKey][0]}`;
        } else if (firstKey && typeof errorData[firstKey] === 'string') {
          errorMessage = errorData[firstKey];
        }
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth
  async register(data: any) {
    const res = await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.access) {
      localStorage.setItem('access_token', res.access);
      localStorage.setItem('refresh_token', res.refresh);
    }
    return res;
  }

  async login(data: any) {
    const res = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.access) {
      localStorage.setItem('access_token', res.access);
      localStorage.setItem('refresh_token', res.refresh);
    }
    return res;
  }

  async verifyBvn(bvn: string) {
    return this.request('/auth/verify-bvn/', {
      method: 'POST',
      body: JSON.stringify({ bvn })
    });
  }

  async getProfile() {
    return this.request('/auth/profile/', {
      method: 'GET'
    });
  }

  // Groups
  async getGroups() {
    return this.request('/groups/', {
      method: 'GET'
    });
  }

  async createGroup(data: any) {
    return this.request('/groups/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getGroupDetails(id: number | string) {
    return this.request(`/groups/${id}/`, {
      method: 'GET'
    });
  }

  async joinGroup(id: number | string) {
    return this.request(`/groups/${id}/join/`, {
      method: 'POST'
    });
  }

  // Payments
  async processPayment(contributionId: number | string) {
    return this.request('/payments/process/', {
      method: 'POST',
      body: JSON.stringify({ contribution_id: contributionId })
    });
  }

  async getContributions() {
    return this.request('/payments/contributions/', {
      method: 'GET'
    });
  }
}

export const api = new ApiService();
