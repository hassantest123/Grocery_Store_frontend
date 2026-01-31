/**
 * Base URL Configuration
 * All API base URLs are defined here
 */

// Backend API Base URL
// When frontend is served from backend, use relative paths (empty string)
// For standalone development, use 'http://localhost:6160/'
// This will use relative paths in production build (served from same origin)
export const BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:6160/');

// Export for use in other files
export default BASE_URL;

