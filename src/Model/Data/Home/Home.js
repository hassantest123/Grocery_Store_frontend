import axiosInstance from "../../base";

/**
 * Home API Services
 * Home page data endpoints
 */
const homeApi = {
  /**
   * Get home page data (Popular Categories and Popular Products)
   * @returns {Promise} API response with Popular_Categories and Popular_Products
   */
  getHomeData: function () {
    return axiosInstance.request({
      method: 'GET',
      url: '/api/v1/home',
    });
  },
};

export default homeApi;

