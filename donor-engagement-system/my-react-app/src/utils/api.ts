const API_URL = 'http://localhost:5001/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

export class Api {
  private baseUrl: string = 'http://localhost:5001';

  private username: string | null = localStorage.getItem('username') || null;

  public setUsername(username: string) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/api${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Name': this.username || 'Invalid User',
          ...options.headers,
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  public get<T>(url: string): Promise<T> {
    return this.request<T>(url);
  }

  // POST request
  public post<T>(url: string, body: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // PUT request
  public put<T>(url: string, body: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  // DELETE request
  public delete<T>(url: string): Promise<T> {
    return this.request<T>(url, {
      method: 'DELETE'
    });
  }
}

export const api = new Api(); 