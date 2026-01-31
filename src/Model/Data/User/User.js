import axiosInstance from "../../base";

/**
 * User API Services
 * All user-related API endpoints
 */
const userApi = {
  /**
   * Register a new user
   * @param {Object} data - User registration data
   * @param {string} data.name - User's full name (required)
   * @param {string} data.email - User's email address (optional)
   * @param {string} data.phone - User's phone number (required)
   * @param {string} data.address - User's address (required)
   * @returns {Promise} API response
   */
  registerUser: function (data) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/users/register',
      data: {
        name: data.name,
        email: data.email || null, // Email is optional
        phone: data.phone,
        address: data.address,
      },
    });
  },

  /**
   * Login user with phone number (and password for special accounts)
   * @param {Object} data - Login credentials
   * @param {string} data.phone - User's phone number (required, Pakistani format: 030xxxxxxxxxxx)
   * @param {string} data.password - Password (required only for special phone numbers like 03286440332)
   * @returns {Promise} API response with user data and token
   */
  loginUser: function (data) {
    const payload = {
      phone: data.phone,
    };
    
    // Include password in payload if provided (for special phone numbers)
    if (data.password) {
      payload.password = data.password;
    }
    
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/users/login',
      data: payload,
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

  /**
   * Get all users list (name and id only) - Admin only
   * @returns {Promise} API response with users list
   */
  getAllUsersList: function () {
    return axiosInstance.request({
      method: 'GET',
      url: '/api/v1/users/list',
    });
  },

  /**
   * Request password reset
   * @param {string} email - User's email address
   * @returns {Promise} API response
   */
  forgotPassword: function (email) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/users/forgot-password',
      data: {
        email: email,
      },
    });
  },

  /**
   * Add product to favorites
   * @param {string} productId - Product ID to add to favorites
   * @returns {Promise} API response
   */
  addToFavorites: function (productId) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/users/favorites',
      data: {
        product_id: productId,
      },
    });
  },

  /**
   * Remove product from favorites
   * @param {string} productId - Product ID to remove from favorites
   * @returns {Promise} API response
   */
  removeFromFavorites: function (productId) {
    return axiosInstance.request({
      method: 'DELETE',
      url: `/api/v1/users/favorites/${productId}`,
    });
  },

  /**
   * Get user's favorite products
   * @returns {Promise} API response with favorite products
   */
  getFavorites: function () {
    return axiosInstance.request({
      method: 'GET',
      url: '/api/v1/users/favorites',
    });
  },
};

export default userApi;

