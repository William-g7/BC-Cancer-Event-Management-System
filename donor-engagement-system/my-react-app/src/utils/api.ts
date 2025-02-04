const API_URL = 'http://localhost:5001/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

class Api {
  private username: string = localStorage.getItem('username') || 'Amy Smith';

  public setUsername(username: string) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...requestOptions } = options;
    
    // Build URL with query parameters
    const url = new URL(`${API_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    // Default headers with login name
    const headers = {
      'Content-Type': 'application/json',
      'X-User-Name': this.username || 'Invalid User',
      ...options.headers,
    };

  

    try {
      const response = await fetch(url.toString(), {
        ...requestOptions,
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody,
        });
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      // Return null for 204 No Content
      if (response.status === 204) {
        return null as T;
      }

      // Read the response body only once
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  // GET request
  public get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>(endpoint, { params });
  }

  // POST request
  public post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  public put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const api = new Api(); 