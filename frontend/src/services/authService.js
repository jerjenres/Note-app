const API_BASE_URL = 'http://localhost:8080/api/auth';

class AuthService {
  async login(email, password) {
    try {
      console.log('[AuthService] Starting login for:', email);
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Login failed');
      }

      const data = await response.text();
      console.log('[AuthService] Login response received:', data);

      // Store authentication token if provided
      const userData = { email, isAuthenticated: true };
      console.log('[AuthService] Storing user data to localStorage:', userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('[AuthService] User data stored successfully');

      // Dispatch custom event to notify AuthContext of login
      console.log('[AuthService] Dispatching authChange event for login');
      window.dispatchEvent(new CustomEvent('authChange', {
        detail: { action: 'login', user: userData }
      }));

      const storedUser = localStorage.getItem('user');
      console.log('[AuthService] Verifying stored user data:', JSON.parse(storedUser));

      return { success: true, message: data };
    } catch (error) {
      console.error('[AuthService] Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      console.log('[AuthService] Starting registration for:', userData.email);
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Registration failed');
      }

      const data = await response.text();
      console.log('[AuthService] Registration response received:', data);

      // Store user data after successful registration
      const userDataWithAuth = { ...userData, isAuthenticated: true };
      console.log('[AuthService] Storing user data after registration:', userDataWithAuth);
      localStorage.setItem('user', JSON.stringify(userDataWithAuth));
      console.log('[AuthService] User data stored after registration');

      // Dispatch custom event to notify AuthContext of registration
      console.log('[AuthService] Dispatching authChange event for registration');
      window.dispatchEvent(new CustomEvent('authChange', {
        detail: { action: 'register', user: userDataWithAuth }
      }));

      const storedUser = localStorage.getItem('user');
      console.log('[AuthService] Verifying stored user data after registration:', JSON.parse(storedUser));

      return { success: true, message: data };
    } catch (error) {
      console.error('[AuthService] Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }

  logout() {
    console.log('[AuthService] Logging out user');
    localStorage.removeItem('user');
    console.log('[AuthService] User logged out, localStorage cleared');

    // Dispatch custom event to notify AuthContext of logout
    console.log('[AuthService] Dispatching authChange event for logout');
    window.dispatchEvent(new CustomEvent('authChange', {
      detail: { action: 'logout', user: null }
    }));
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;
    return parsedUser;
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    const authenticated = user && user.isAuthenticated;
    return authenticated;
  }
}

export default new AuthService();
