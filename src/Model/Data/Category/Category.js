import axiosInstance from "../../base";

/**
 * Category API Services
 * All category-related API endpoints
 */
const categoryApi = {
  /**
   * Get all categories
   * @param {Object} params - Query parameters
   * @param {number} params.is_active - Filter by active status (0 or 1)
   * @returns {Promise} API response with categories
   */
  getAllCategories: function (params = {}) {
    return axiosInstance.request({
      method: 'GET',
      url: '/api/v1/categories',
      params: {
        is_active: params.is_active || null,
      },
    });
  },

  /**
   * Get category by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise} API response with category details
   */
  getCategoryById: function (categoryId) {
    return axiosInstance.request({
      method: 'GET',
      url: `/api/v1/categories/${categoryId}`,
    });
  },

  /**
   * Create a new category (Admin only)
   * @param {Object} data - Category data
   * @param {string} data.name - Category name
   * @param {string} data.image - Category image URL
   * @returns {Promise} API response
   */
  createCategory: function (data) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/categories',
      data: {
        name: data.name,
        image: data.image,
      },
    });
  },

  /**
   * Update a category (Admin only)
   * @param {string} categoryId - Category ID
   * @param {Object} data - Updated category data
   * @returns {Promise} API response
   */
  updateCategory: function (categoryId, data) {
    return axiosInstance.request({
      method: 'PUT',
      url: `/api/v1/categories/${categoryId}`,
      data: data,
    });
  },

  /**
   * Delete a category (Admin only)
   * @param {string} categoryId - Category ID
   * @returns {Promise} API response
   */
  deleteCategory: function (categoryId) {
    return axiosInstance.request({
      method: 'DELETE',
      url: `/api/v1/categories/${categoryId}`,
    });
  },
};

export default categoryApi;

