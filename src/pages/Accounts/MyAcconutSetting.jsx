import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import userApi from "../../Model/Data/User/User";
import Swal from "sweetalert2";
import useCartStore from "../../store/cartStore";

const MyAcconutSetting = () => {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

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
            setFormData({
              name: parsedUser.name || "",
              email: parsedUser.email || "",
              phone: parsedUser.phone || "",
            });
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }

        // Fetch latest user data from API
        const response = await userApi.getProfile();
        
        if (response?.data?.STATUS === "SUCCESSFUL") {
          const userData = response.data.DB_DATA.user;
          setUser(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
          });
          
          // Update localStorage
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response?.data?.ERROR_DESCRIPTION || "Failed to load user profile",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.ERROR_DESCRIPTION || "Failed to load user profile",
        });
      } finally {
        setLoaderStatus(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle logout
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear all localStorage items
        localStorage.removeItem('jwt');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('click-mart-cart'); // Clear cart data
        
        // Clear cart store
        clearCart();
        
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been successfully logged out',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate('/');
          // Reload the page to reset all state
          window.location.reload();
        });
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);

      // Validation
      if (!formData.name || !formData.email) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Name and email are required",
        });
        setIsUpdating(false);
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Please enter a valid email address",
        });
        setIsUpdating(false);
        return;
      }

      const response = await userApi.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
      });

      if (response?.data?.STATUS === "SUCCESSFUL") {
        const updatedUser = response.data.DB_DATA.user;
        setUser(updatedUser);
        
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.data?.ERROR_DESCRIPTION || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.ERROR_DESCRIPTION || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <ScrollToTop/>
      <div>
        {/* section */}
        <section>
          {/* container */}
          <div className="container mx-auto px-4">
            {/* row */}
            <div className="flex flex-wrap">
              {/* Mobile Header */}
              <div className="w-full">
                <div className="p-6 flex justify-between items-center md:hidden">
                  {/* heading */}
                  <h3 className="text-lg font-medium mb-0">Account Setting</h3>
                  {/* btn */}
                  <button
                    className="px-4 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 md:hidden"
                    type="button"
                    onClick={() => setIsOffcanvasOpen(true)}
                    aria-controls="offcanvasAccount"
                  >
                    <i className="fas fa-bars"></i>
                  </button>
                </div>
              </div>
              {/* Sidebar - Desktop */}
              <div className="hidden md:block md:w-1/3 lg:w-1/4 border-r border-gray-200">
                <div className="pt-10 pe-4 lg:pe-10">
                  {/* nav item */}
                  <ul className="flex flex-col space-y-1">
                    <li>
                      <Link
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-current="page"
                        to="/MyAccountOrder"
                      >
                        <i className="fas fa-shopping-bag mr-2" />
                        Your Orders
                      </Link>
                    </li>
                    {/* nav item */}
                    <li>
                      <Link
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
                        to="/MyAccountSetting"
                      >
                        <i className="fas fa-cog mr-2" />
                        Settings
                      </Link>
                    </li>
                    {/* nav item */}
                    <li>
                      <Link className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" to="/MyAccountAddress">
                        <i className="fas fa-map-marker-alt mr-2" />
                        Address
                      </Link>
                    </li>
                    {/* nav item */}
                    <li>
                      <Link className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" to="/MyAcconutPaymentMethod">
                        <i className="fas fa-credit-card mr-2" />
                        Payment Method
                      </Link>
                    </li>
                    {/* nav item */}
                    <li>
                      <Link className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" to="/MyAcconutNotification">
                        <i className="fas fa-bell mr-2" />
                        Notification
                      </Link>
                    </li>
                    {/* nav item */}
                    <li>
                      <Link
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        to="/MyAccountFavorites"
                      >
                        <i className="fas fa-heart mr-2" />
                        Favorites
                      </Link>
                    </li>
                    {/* nav item */}
                    <li>
                      <hr className="my-4" />
                    </li>
                    {/* nav item */}
                    <li>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left border-0 bg-transparent cursor-pointer" 
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt mr-2" />
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Main Content */}
              <div className="w-full md:w-2/3 lg:w-3/4">
                <div>
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
                    <>
                      <div className="p-6 lg:p-10">
                        <div className="mb-6">
                          {/* heading */}
                          <h2 className="mb-0 text-2xl font-bold">Account Setting</h2>
                        </div>
                        <div>
                          {/* heading */}
                          <h5 className="mb-4 text-lg font-semibold">Account details</h5>
                          <div className="flex flex-wrap">
                            <div className="w-full lg:w-5/12">
                              {/* form */}
                              <form onSubmit={handleSubmit}>
                                {/* input */}
                                <div className="mb-3">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                  <input
                                    type="text"
                                    name="name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                                {/* input */}
                                <div className="mb-3">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                  <input
                                    type="email"
                                    name="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                                {/* input */}
                                <div className="mb-5">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                  <input
                                    type="text"
                                    name="phone"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                  />
                                </div>
                                {/* button */}
                                <div className="mb-3">
                                  <button 
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isUpdating}
                                  >
                                    {isUpdating ? "Saving..." : "Save Details"}
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        <hr className="my-10 border-gray-200" />
                        <div className="pe-0 lg:pe-14">
                          {/* heading */}
                          <h5 className="mb-4 text-lg font-semibold">Password</h5>
                          <form className="flex flex-wrap gap-3">
                            {/* input */}
                            <div className="mb-3 w-full lg:w-[calc(50%-0.375rem)]">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                              </label>
                              <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                placeholder="**********"
                              />
                            </div>
                            {/* input */}
                            <div className="mb-3 w-full lg:w-[calc(50%-0.375rem)]">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                              </label>
                              <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                placeholder="**********"
                              />
                            </div>
                            {/* input */}
                            <div className="w-full">
                              <p className="mb-4 text-gray-600">
                                Can't remember your current password?
                                <Link to="#" className="text-primary hover:underline ml-1"> Reset your password.</Link>
                              </p>
                              <Link to="#" className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                                Save Password
                              </Link>
                            </div>
                          </form>
                        </div>
                        <hr className="my-10 border-gray-200" />
                        <div>
                          {/* heading */}
                          <h5 className="mb-4 text-lg font-semibold">Delete Account</h5>
                          <p className="mb-2 text-gray-600">
                            Would you like to delete your account?
                          </p>
                          <p className="mb-5 text-gray-600">
                            This account contain 12 orders, Deleting your
                            account will remove all the order details
                            associated with it.
                          </p>
                          {/* btn */}
                          <Link to="#" className="inline-block px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium">
                            I want to delete my account
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Offcanvas Menu - Mobile */}
        {isOffcanvasOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOffcanvasOpen(false)}
            />
            {/* Offcanvas Panel */}
            <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
              {/* offcanvas header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h5 className="text-lg font-semibold">
                  My Account
                </h5>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsOffcanvasOpen(false)}
                  aria-label="Close"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              {/* offcanvas body */}
              <div className="p-4">
                <ul className="flex flex-col space-y-1">
                  {/* nav item */}
                  <li>
                    <a
                      className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
                      aria-current="page"
                      href="/MyAccountOrder"
                    >
                      <i className="fas fa-shopping-bag mr-2" />
                      Your Orders
                    </a>
                  </li>
                  {/* nav item */}
                  <li>
                    <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" href="/MyAccountSetting">
                      <i className="fas fa-cog mr-2" />
                      Settings
                    </a>
                  </li>
                  {/* nav item */}
                  <li>
                    <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" href="/MyAccountAddress">
                      <i className="fas fa-map-marker-alt mr-2" />
                      Address
                    </a>
                  </li>
                  {/* nav item */}
                  <li>
                    <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" href="/MyAcconutPaymentMethod">
                      <i className="fas fa-credit-card mr-2" />
                      Payment Method
                    </a>
                  </li>
                  {/* nav item */}
                  <li>
                    <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" href="/MyAcconutNotification">
                      <i className="fas fa-bell mr-2" />
                      Notification
                    </a>
                  </li>
                  {/* nav item */}
                  <li>
                    <a
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      href="/MyAccountFavorites"
                    >
                      <i className="fas fa-heart mr-2" />
                      Favorites
                    </a>
                  </li>
                </ul>
                <hr className="my-6 border-gray-200" />
                <div>
                  {/* nav  */}
                  <ul className="flex flex-col space-y-1">
                    {/* nav item */}
                    <li>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left border-0 bg-transparent cursor-pointer" 
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt mr-2" />
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
    </div>
  );
};

export default MyAcconutSetting;
