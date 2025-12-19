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
   * @param {string} data.delivery_time - Delivery time
   * @param {string} data.delivery_instructions - Delivery instructions
   * @param {string} data.payment_method - Payment method (stripe, jazzcash, easypaisa, cod)
   * @param {number} data.tax - Tax amount
   * @param {number} data.shipping - Shipping amount
   * @returns {Promise} API response with order and payment intent (if applicable)
   */
  createOrder: function (data) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/orders',
      data: data,
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
};

export default orderApi;

