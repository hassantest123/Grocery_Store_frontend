import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../Model/BaseUri";

const Contact = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment || !comment.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a comment",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get token from localStorage if user is logged in
      const token = localStorage.getItem("jwt") || localStorage.getItem("token") || localStorage.getItem("authToken");
      
      const config = {
        headers: {},
      };
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${BASE_URL}api/v1/comments`,
        { comment: comment.trim() },
        config
      );

      if (response.data.STATUS === "SUCCESSFUL") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your comment has been submitted successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        setComment("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.ERROR_DESCRIPTION || "Failed to submit comment",
        });
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.ERROR_DESCRIPTION || "Failed to submit comment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div>
        {loaderStatus ? (
          <div className="loader-container">
            <MagnifyingGlass
              visible={true}
              height="100"
              width="100"
              ariaLabel="magnifying-glass-loading"
              wrapperStyle={{}}
              wrapperclassName="magnifying-glass-wrapper"
              glassColor="#c0efff"
              color="#0aad0a"
            />
          </div>
        ) : (
          <>
            <ScrollToTop />
            {/* section */}
            <section className="my-16 lg:my-20">
              {/* container */}
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap -mx-4">
                  {/* col */}
                  <div className="w-full lg:w-8/12 lg:mx-auto px-4">
                    <div className="mb-12">
                      {/* heading */}
                      <h1 className="text-2xl lg:text-3xl font-semibold mb-4">Retailer Inquiries</h1>
                      <p className="text-lg lg:text-xl text-gray-600 mb-0">
                        This form is for retailer inquiries only. For all
                        other customer or shopper support requests, please
                        visit the links below this form.
                      </p>
                    </div>
                    {/* form */}
                    <form onSubmit={handleSubmit}>
                      <div className="mb-6">
                        {/* input */}
                        <label className="block text-base font-medium mb-2">
                          Comments<span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={6}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                          placeholder="Enter your comments here..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        {/* btn */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Contact;
