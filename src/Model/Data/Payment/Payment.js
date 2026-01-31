import axiosInstance from "../../base";

/**
 * Payment API Services
 * All payment-related API endpoints
 */
const paymentApi = {
  /**
   * Create a payment intent (Stripe)
   * @param {Object} data - Payment data
   * @param {Array} data.items - Order items
   * @param {Object} data.shipping_address - Shipping address
   * @param {number} data.tax - Tax amount
   * @param {number} data.shipping - Shipping amount
   * @returns {Promise} API response with payment intent
   */
  createPaymentIntent: function (data) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/payments/create-intent',
      data: data,
    });
  },

  /**
   * Confirm a payment
   * @param {string} payment_intent_id - Payment intent ID
   * @returns {Promise} API response
   */
  confirmPayment: function (payment_intent_id) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/payments/confirm',
      data: { payment_intent_id },
    });
  },

  /**
   * Get payment status
   * @param {string} payment_intent_id - Payment intent ID
   * @returns {Promise} API response with payment status
   */
  getPaymentStatus: function (payment_intent_id) {
    return axiosInstance.request({
      method: 'GET',
      url: `/api/v1/payments/status/${payment_intent_id}`,
    });
  },

  /**
   * Create Easy Paisa payment request
   * @param {string} order_id - Order ID
   * @returns {Promise} API response with payment form data
   */
  createEasyPaisaPayment: function (order_id) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/easypaisa/payment',
      data: { order_id },
    });
  },

  /**
   * Get Easy Paisa payment status
   * @param {string} transaction_ref - Transaction reference number
   * @returns {Promise} API response with payment status
   */
  getEasyPaisaPaymentStatus: function (transaction_ref) {
    return axiosInstance.request({
      method: 'GET',
      url: `/api/v1/easypaisa/status/${transaction_ref}`,
    });
  },

  /**
   * Create JazzCash payment request
   * @param {string} order_id - Order ID
   * @returns {Promise} API response with payment form data
   */
  createJazzCashPayment: function (order_id) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/jazzcash/payment',
      data: { order_id },
    });
  },

  /**
   * Get JazzCash payment status
   * @param {string} transaction_ref - Transaction reference number
   * @returns {Promise} API response with payment status
   */
  getJazzCashPaymentStatus: function (transaction_ref) {
    return axiosInstance.request({
      method: 'GET',
      url: `/api/v1/jazzcash/status/${transaction_ref}`,
    });
  },
};

export default paymentApi;

