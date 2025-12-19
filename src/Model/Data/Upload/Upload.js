import { axiosInstance, axiosInstanceFile } from "../../base";

/**
 * Upload API Services
 * All image upload-related API endpoints
 */
const uploadApi = {
  /**
   * Upload an image to Cloudinary
   * @param {File} file - Image file to upload
   * @param {string} folder - Optional folder name in Cloudinary (default: 'grocery_store')
   * @returns {Promise} API response with image URL
   */
  uploadImage: function (file, folder = "grocery_store") {
    const formData = new FormData();
    formData.append("image", file);
    if (folder) {
      formData.append("folder", folder);
    }

    return axiosInstanceFile.request({
      method: "POST",
      url: "/api/v1/upload/image",
      data: formData,
    });
  },

  /**
   * Delete an image from Cloudinary
   * @param {string} publicId - Public ID of the image to delete
   * @returns {Promise} API response
   */
  deleteImage: function (publicId) {
    return axiosInstance.request({
      method: "DELETE",
      url: `/api/v1/upload/image/${publicId}`,
    });
  },
};

export default uploadApi;

