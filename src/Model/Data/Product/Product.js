import axiosInstance from "../../base";

/**
 * Product API Services
 * All product-related API endpoints
 */
const productApi = {
  /**
   * Get all products with pagination, filtering, and sorting
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 50)
   * @param {string} params.category - Filter by category
   * @param {string} params.search - Search in name and description
   * @param {string} params.sort_by - Sort by: price_low, price_high, rating, newest
   * @returns {Promise} API response with products and pagination
   */
  getAllProducts: function (params = {}) {
    const requestParams = {
      page: params.page || 1,
      limit: params.limit || 50,
      search: params.search || null,
      sort_by: params.sort_by || 'newest',
    };
    
    // Use category_id if provided, otherwise use category name (backward compatibility)
    if (params.category_id) {
      requestParams.category_id = params.category_id;
    } else if (params.category) {
      requestParams.category = params.category;
    }
    
    return axiosInstance.request({
      method: 'GET',
      url: '/api/v1/products',
      params: requestParams,
    });
  },

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise} API response with product details
   */
  getProductById: function (productId) {
    return axiosInstance.request({
      method: 'GET',
      url: `/api/v1/products/${productId}`,
    });
  },

  /**
   * Create a new product (Admin only)
   * @param {Object} data - Product data
   * @param {string} data.name - Product name
   * @param {string} data.description - Product description
   * @param {number} data.price - Product price
   * @param {number} data.original_price - Original price (for discount)
   * @param {string} data.image - Product image URL
   * @param {string} data.category - Product category
   * @param {string} data.label - Product label (Sale, Hot, New)
   * @param {number} data.stock_quantity - Stock quantity
   * @returns {Promise} API response
   */
  createProduct: function (data) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/products',
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price,
        original_price: data.original_price || null,
        image: data.image,
        category: data.category,
        label: data.label || null,
        stock_quantity: data.stock_quantity || 0,
      },
    });
  },

  /**
   * Update a product (Admin only)
   * @param {string} productId - Product ID
   * @param {Object} data - Updated product data
   * @returns {Promise} API response
   */
  updateProduct: function (productId, data) {
    return axiosInstance.request({
      method: 'PUT',
      url: `/api/v1/products/${productId}`,
      data: data,
    });
  },

  /**
   * Delete a product (Admin only)
   * @param {string} productId - Product ID
   * @returns {Promise} API response
   */
  deleteProduct: function (productId) {
    return axiosInstance.request({
      method: 'DELETE',
      url: `/api/v1/products/${productId}`,
    });
  },
};

export default productApi;

