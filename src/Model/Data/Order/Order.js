import axiosInstance from "../../base";

/**
 * Order API Services
 * All order-related API endpoints
 */
const orderApi = {
  /**
   * Create an order
   * @param {Object} data - Order data
   * @param {Array} data.items - Order items
   * @param {Object} data.shipping_address - Shipping address
   * @param {string} data.payment_method - Payment method (stripe, jazzcash, easypaisa, cod)
   * @param {number} data.tax - Tax amount
   * @param {number} data.shipping - Shipping amount
   * @param {string} data.user_id - User ID (optional, null for guest orders)
   * @returns {Promise} API response with order and payment intent (if applicable)
   */
  createOrder: function (data) {
    // Build request data
    const requestData = { ...data };
    
    // Only include user_id if it's explicitly provided (for admin-created guest orders)
    // If user_id is not in data, don't send it - backend will get it from token
    if ('user_id' in data) {
      requestData.user_id = data.user_id; // Can be null for guest orders
    }
    // If user_id is not in data, it won't be sent, and backend will use token's user_id
    
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/orders',
      data: requestData,
    });
  },

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise} API response with order details
   */
  getOrderById: function (orderId) {
    return axiosInstance.request({
      method: 'GET',
      url: `/api/v1/orders/${orderId}`,
    });
  },

  /**
   * Get user orders
   * @returns {Promise} API response with user's orders
   */
  getUserOrders: function () {
    return axiosInstance.request({
      method: 'GET',
      url: '/api/v1/orders',
    });
  },

  /**
   * Get all orders (Admin only)
   * @param {Object} params - Query parameters
   * @param {string} params.payment_status - Filter by payment status
   * @param {string} params.order_status - Filter by order status
   * @param {string} params.user_id - Filter by user ID
   * @returns {Promise} API response with all orders
   */
  getAllOrders: function (params = {}) {
    return axiosInstance.request({
      method: 'GET',
      url: '/api/v1/orders/admin/all',
      params: {
        payment_status: params.payment_status || null,
        order_status: params.order_status || null,
        user_id: params.user_id || null,
      },
    });
  },

  /**
   * Update order status (Admin only)
   * @param {string} orderId - Order ID
   * @param {string} orderStatus - New order status (pending, confirmed, processing, shipped, delivered, completed, cancelled)
   * @returns {Promise} API response with updated order
   */
  updateOrderStatus: function (orderId, orderStatus) {
    return axiosInstance.request({
      method: 'PUT',
      url: `/api/v1/orders/${orderId}/status`,
      data: {
        order_status: orderStatus,
      },
    });
  },
};

export default orderApi;

