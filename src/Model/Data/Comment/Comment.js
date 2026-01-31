import axiosInstance from "../../base";

const commentApi = {
  createComment: function (data) {
    return axiosInstance.request({
      method: 'POST',
      url: '/api/v1/comments',
      data: data,
    });
  },

  getAllComments: function () {
    return axiosInstance.request({
      method: 'GET',
      url: '/api/v1/comments',
    });
  },

  getCommentById: function (id) {
    return axiosInstance.request({
      method: 'GET',
      url: `/api/v1/comments/${id}`,
    });
  },

  updateComment: function (id, data) {
    return axiosInstance.request({
      method: 'PUT',
      url: `/api/v1/comments/${id}`,
      data: data,
    });
  },

  deleteComment: function (id) {
    return axiosInstance.request({
      method: 'DELETE',
      url: `/api/v1/comments/${id}`,
    });
  },
};

export default commentApi;
