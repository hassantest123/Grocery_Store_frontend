import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import userApi from "../../Model/Data/User/User";
import Swal from "sweetalert2";

const MyAccountAddress = () => {
  const navigate = useNavigate();
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoaderStatus(true);
        
        // Check authentication
        const token = localStorage.getItem("token") || localStorage.getItem("jwt") || localStorage.getItem("authToken");
        if (!token) {
          navigate("/MyAccountSignIn");
          return;
        }

        // Get user from localStorage first (for immediate display)
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setAddress(parsedUser.address || "");
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }

        // Fetch latest user data from API
        const response = await userApi.getProfile();
        
        if (response?.data?.STATUS === "SUCCESSFUL") {
          const userData = response.data.DB_DATA.user;
          setUser(userData);
          setAddress(userData.address || "");
          
          // Update localStorage
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response?.data?.ERROR_DESCRIPTION || "Failed to load address",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.ERROR_DESCRIPTION || "Failed to load address",
        });
      } finally {
        setLoaderStatus(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original address
    setAddress(user?.address || "");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);

      const response = await userApi.updateProfile({
        address: address,
      });

      if (response?.data?.STATUS === "SUCCESSFUL") {
        const updatedUser = response.data.DB_DATA.user;
        setUser(updatedUser);
        setIsEditing(false);
        
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Address updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.data?.ERROR_DESCRIPTION || "Failed to update address",
        });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.ERROR_DESCRIPTION || "Failed to update address. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authStateChange"));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Mobile Header */}
          <div className="md:hidden flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Account Setting</h3>
            <button
              className="p-2 text-gray-600 hover:text-gray-900"
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation - Desktop */}
            <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
              <div className="pt-4 lg:pt-8 pr-0 lg:pr-8">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Settings</h4>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                        to="/MyAccountOrder"
                      >
                        <i className="fas fa-shopping-bag w-5 mr-3"></i>
                        Your Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                        to="/MyAccountSetting"
                      >
                        <i className="fas fa-cog w-5 mr-3"></i>
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg"
                        to="/MyAccountAddress"
                      >
                        <i className="fas fa-map-marker-alt w-5 mr-3"></i>
                        Address
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                        to="/MyAcconutPaymentMethod"
                      >
                        <i className="fas fa-credit-card w-5 mr-3"></i>
                        Payment Method
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                        to="/MyAcconutNotification"
                      >
                        <i className="fas fa-bell w-5 mr-3"></i>
                        Notification
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                        to="/MyAccountFavorites"
                      >
                        <i className="fas fa-heart w-5 mr-3"></i>
                        Favorites
                      </Link>
                    </li>
                    <li className="pt-2 mt-2 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              {loaderStatus ? (
                <div className="flex justify-center items-center min-h-[400px]">
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
                <div className="bg-white rounded-lg shadow-sm p-6 lg:p-10">
                  <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Address</h2>
                  </div>

                  <div className="max-w-2xl">
                    <div className="border border-gray-200 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h5 className="text-lg font-semibold text-gray-900 flex items-center">
                          <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                          Home Address
                        </h5>
                        {!isEditing && (
                          <button
                            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                            onClick={handleEdit}
                          >
                            <i className="fas fa-edit mr-2"></i>
                            Edit
                          </button>
                        )}
                      </div>
                      
                      {!isEditing ? (
                        <>
                          {/* Display address */}
                          {user && (
                            <div className="space-y-3">
                              <p className="text-base font-semibold text-gray-900">
                                {user.name || "N/A"}
                              </p>
                              {address ? (
                                <p className="text-gray-600 whitespace-pre-line">
                                  {address}
                                </p>
                              ) : (
                                <p className="text-gray-500">
                                  No address provided
                                </p>
                              )}
                              {user.phone && (
                                <p className="text-gray-600 flex items-center">
                                  <i className="fas fa-phone text-primary mr-2"></i>
                                  {user.phone}
                                </p>
                              )}
                            </div>
                          )}
                          {!address && (
                            <div className="mt-4">
                              <p className="text-gray-500">
                                You haven't added an address yet. Click Edit to add your address.
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Edit form */}
                          <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Address
                              </label>
                              <textarea
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                rows="5"
                                placeholder="Enter your complete address (street, city, state, zip code, country)"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                              />
                              <p className="mt-2 text-sm text-gray-500">
                                Include street address, city, state, zip code, and country
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="submit"
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isUpdating}
                              >
                                {isUpdating ? "Saving..." : "Save Address"}
                              </button>
                              <button
                                type="button"
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleCancel}
                                disabled={isUpdating}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h5 className="text-lg font-semibold text-gray-900">My Account</h5>
              <button
                type="button"
                className="p-2 text-gray-600 hover:text-gray-900"
                onClick={() => setShowMobileMenu(false)}
                aria-label="Close"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Settings</h4>
              <ul className="space-y-1">
                <li>
                  <Link
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                    to="/MyAccountOrder"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-shopping-bag w-5 mr-3"></i>
                    Your Orders
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                    to="/MyAccountSetting"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-cog w-5 mr-3"></i>
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg"
                    to="/MyAccountAddress"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-map-marker-alt w-5 mr-3"></i>
                    Address
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                    to="/MyAcconutPaymentMethod"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-credit-card w-5 mr-3"></i>
                    Payment Method
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                    to="/MyAcconutNotification"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-bell w-5 mr-3"></i>
                    Notification
                  </Link>
                </li>
              </ul>
              <hr className="my-4 border-gray-200" />
              <div>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccountAddress;
