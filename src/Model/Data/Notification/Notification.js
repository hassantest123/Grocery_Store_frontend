import axiosInstance from "../../base";

/**
 * Notification API Services
 * Notification settings endpoints
 */
const notificationApi = {
  /**
   * Get user notification settings
   * @returns {Promise} API response with notification settings
   */
  getSettings: function () {
    return axiosInstance.request({
      method: 'GET',
      url: '/api/v1/notifications/settings',
    });
  },

  /**
   * Update user notification settings
   * @param {Object} settings - Notification settings object
   * @returns {Promise} API response
   */
  updateSettings: function (settings) {
    return axiosInstance.request({
      method: 'PUT',
      url: '/api/v1/notifications/settings',
      data: settings,
    });
  },
};

export default notificationApi;

