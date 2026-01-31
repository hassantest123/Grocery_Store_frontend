import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";

const MyAcconutPaymentMethod = () => {
  const navigate = useNavigate();
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

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
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                        to="/MyAccountAddress"
                      >
                        <i className="fas fa-map-marker-alt w-5 mr-3"></i>
                        Address
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg"
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
                  {/* Heading */}
                  <div className="mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Payment Methods</h2>
                    <p className="text-gray-600">
                      Available payment methods for your orders
                    </p>
                  </div>

                  {/* Payment Methods List */}
                  <div className="space-y-4">
                    {/* Stripe Payment Method */}
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          {/* Icon */}
                          <div className="bg-primary text-white rounded-lg flex items-center justify-center mr-4" style={{ width: '60px', height: '60px' }}>
                            <i className="fab fa-cc-stripe text-2xl"></i>
                          </div>
                          {/* Text */}
                          <div>
                            <h5 className="text-lg font-semibold text-gray-900 mb-1">Stripe</h5>
                            <p className="text-sm text-gray-600">
                              Credit/Debit Card Payment
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Easy Paisa Payment Method */}
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          {/* Icon */}
                          <div className="bg-green-500 text-white rounded-lg flex items-center justify-center mr-4" style={{ width: '60px', height: '60px' }}>
                            <i className="fas fa-mobile-alt text-2xl"></i>
                          </div>
                          {/* Text */}
                          <div>
                            <h5 className="text-lg font-semibold text-gray-900 mb-1">Easy Paisa</h5>
                            <p className="text-sm text-gray-600">
                              Mobile Wallet Payment
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* JazzCash Payment Method */}
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          {/* Icon */}
                          <div className="bg-yellow-500 text-white rounded-lg flex items-center justify-center mr-4" style={{ width: '60px', height: '60px' }}>
                            <i className="fas fa-wallet text-2xl"></i>
                          </div>
                          {/* Text */}
                          <div>
                            <h5 className="text-lg font-semibold text-gray-900 mb-1">JazzCash</h5>
                            <p className="text-sm text-gray-600">
                              Mobile Wallet Payment
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Cash on Delivery Payment Method */}
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          {/* Icon */}
                          <div className="bg-blue-500 text-white rounded-lg flex items-center justify-center mr-4" style={{ width: '60px', height: '60px' }}>
                            <i className="fas fa-money-bill-wave text-2xl"></i>
                          </div>
                          {/* Text */}
                          <div>
                            <h5 className="text-lg font-semibold text-gray-900 mb-1">Cash on Delivery (COD)</h5>
                            <p className="text-sm text-gray-600">
                              Pay when you receive your order
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
                        </div>
                      </div>
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
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                    to="/MyAccountAddress"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-map-marker-alt w-5 mr-3"></i>
                    Address
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg"
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

export default MyAcconutPaymentMethod;
