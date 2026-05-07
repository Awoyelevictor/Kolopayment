const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

class ApiService {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private getAuthHeader() {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.map(cb => cb(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token available');

    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    });

    if (!response.ok) {
      this.logout();
      throw new Error('Refresh token expired');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    return data.access;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/'; 
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const isFormData = options.body instanceof FormData;
    
    const headers: Record<string, string> = {
      ...this.getAuthHeader() as Record<string, string>,
      ...(options.headers as Record<string, string>),
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          try {
            const newToken = await this.refreshToken();
            this.isRefreshing = false;
            this.onTokenRefreshed(newToken);
          } catch (error) {
            this.isRefreshing = false;
            this.logout();
            throw error;
          }
        }

        return new Promise((resolve) => {
          this.addRefreshSubscriber((token: string) => {
            const newOptions = {
              ...options,
              headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`
              }
            };
            resolve(this.request(endpoint, newOptions));
          });
        });
      } else {
        this.logout();
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = 'API request failed';
      if (errorData.error) errorMessage = errorData.error;
      else if (errorData.detail) errorMessage = errorData.detail;
      else if (typeof errorData === 'object') {
        const firstKey = Object.keys(errorData)[0];
        if (firstKey && Array.isArray(errorData[firstKey])) {
          errorMessage = `${firstKey}: ${errorData[firstKey][0]}`;
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

  async updateProfile(data: any) {
    // If data contains a file, use FormData
    let body;
    if (data.profile_image instanceof File) {
      body = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          body.append(key, data[key]);
        }
      });
    } else {
      body = JSON.stringify(data);
    }

    return this.request('/auth/profile/', {
      method: 'PATCH',
      body
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
