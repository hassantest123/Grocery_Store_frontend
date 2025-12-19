import axiosInstance from "../../base";

/**
 * User API Services
 * All user-related API endpoints
 */
const userApi = {
  /**
   * Register a new user
   * @param {Object} data - User registration data
   * @param {string} data.name - User's full name
   * @param {string} data.email - User's email address
   * @param {string} data.password - User's password
   * @param {string} data.phone - User's phone number (optional)
   * @param {string} data.address - User's address (optional)
   * @returns {Promise} API response
   */
  registerUser: function (data) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/users/register',
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || null,
        address: data.address || null,
      },
    });
  },

  /**
   * Login user
   * @param {Object} data - Login credentials
   * @param {string} data.email - User's email address
   * @param {string} data.password - User's password
   * @returns {Promise} API response with user data and token
   */
  loginUser: function (data) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email: data.email,
        password: data.password,
      },
    });
  },

  /**
   * Get current user profile
   * @returns {Promise} API response with user data
   */
  getProfile: function () {
    return axiosInstance.request({
      method: 'GET',
      url: '/api/v1/users/profile',
    });
  },

  /**
   * Update user profile
   * @param {Object} data - User profile update data
   * @param {string} data.name - User's full name (optional)
   * @param {string} data.email - User's email address (optional)
   * @param {string} data.phone - User's phone number (optional)
   * @param {string} data.address - User's address (optional)
   * @returns {Promise} API response with updated user data
   */
  updateProfile: function (data) {
    return axiosInstance.request({
      method: 'PUT',
      url: '/api/v1/users/profile',
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });
  },
};

export default userApi;

