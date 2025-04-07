/**
 * Base URL for API requests
 * Can be overridden by environment variables
 */
export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
