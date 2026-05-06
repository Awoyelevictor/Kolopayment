const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
    // We don't necessarily want to force a page reload here to avoid losing state
    // but in some cases it's the safest way to clear all private data.
    window.location.href = '/'; 
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - potential token expiration
    if (response.status === 401) {
      const refresh = localStorage.getItem('refresh_token');
      
      // If we have a refresh token, try to refresh
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

        // Return a promise that resolves when the token is refreshed
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
