import { apiBaseUrl } from "../config/apiConfig";

/**
 * Service for handling authentication-related operations
 */
const authService = {
  /**
   * Authenticate user with username and password
   * @param username User's username
   * @param password User's password
   * @returns Promise with token data
   */
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Store token in localStorage or sessionStorage
      localStorage.setItem("token", data.token);

      return data.token;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Log out the current user
   */
  logout: () => {
    localStorage.removeItem("token");
    // You may want to redirect to login page or perform other cleanup
  },

  /**
   * Check if user is authenticated
   * @returns boolean indicating if user is authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token; // Return true if token exists
  },

  /**
   * Get the current authentication token
   * @returns The authentication token or null
   */
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
