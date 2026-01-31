import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import orderApi from "../../Model/Data/Order/Order";
import Swal from "sweetalert2";

const MyAccountOrder = () => {
  const navigate = useNavigate();
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Format date helper
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
      case "delivered":
      case "shipped":
        return "px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800";
      case "pending":
      case "processing":
        return "px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800";
      case "failed":
      case "canceled":
      case "cancelled":
        return "px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800";
      default:
        return "px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800";
    }
  };

  // Get status text - show actual order_status to match admin dashboard
  const getStatusText = (order) => {
    // Prioritize order_status (this is what admin updates)
    // Show the actual order_status value to keep it synchronized with admin dashboard
    if (order.order_status) {
      // Capitalize first letter for display
      return order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1);
    }
    
    // Fallback to payment_status if order_status is not set
    if (order.payment_status === "paid") {
      return "Processing";
    } else if (order.payment_status === "failed") {
      return "Failed";
    }
    
    return "Pending";
  };

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoaderStatus(true);
        setError(null);

        // Check authentication
        const token = localStorage.getItem("token") || localStorage.getItem("jwt") || localStorage.getItem("authToken");
        if (!token) {
          navigate("/MyAccountSignIn");
          return;
        }

        const response = await orderApi.getUserOrders();
        
        if (response?.data?.STATUS === "SUCCESSFUL") {
          const ordersData = response.data.DB_DATA?.orders || [];
          // Sort orders by created_at descending (newest first)
          const sortedOrders = ordersData.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
          setOrders(sortedOrders);
        } else {
          setError(response?.data?.ERROR_DESCRIPTION || "Failed to fetch orders");
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.ERROR_DESCRIPTION || "Failed to load orders. Please try again.");
        setOrders([]);
      } finally {
        setLoaderStatus(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div>
      <>
        <ScrollToTop/>
      </>
      <>
        {/* section */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            {/* Mobile Header */}
            <div className="flex justify-between items-center p-6 md:hidden">
              <h3 className="text-lg font-semibold mb-0">Account Setting</h3>
              <button
                className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                type="button"
                onClick={() => setShowMobileMenu(true)}
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar Navigation - Desktop */}
              <div className="hidden md:block w-full md:w-1/4 lg:w-1/5 border-r border-gray-200 pr-6 pt-10">
                <ul className="flex flex-col space-y-1">
                  <li>
                    <Link
                      className="flex items-center px-4 py-3 rounded-lg bg-primary text-white font-medium"
                      to="/MyAccountOrder"
                    >
                      <i className="fas fa-shopping-bag mr-2" />
                      Your Orders
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      to="/MyAccountSetting"
                    >
                      <i className="fas fa-cog mr-2" />
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      to="/MyAccountAddress"
                    >
                      <i className="fas fa-map-marker-alt mr-2" />
                      Address
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      to="/MyAcconutPaymentMethod"
                    >
                      <i className="fas fa-credit-card mr-2" />
                      Payment Method
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      to="/MyAcconutNotification"
                    >
                      <i className="fas fa-bell mr-2" />
                      Notification
                    </Link>
                  </li>
                  <li>
                    <hr className="my-2" />
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-left"
                    >
                      <i className="fas fa-sign-out-alt mr-2" />
                      Log out
                    </button>
                  </li>
                </ul>
              </div>

              {/* Main Content */}
              <div className="w-full md:w-3/4 lg:w-4/5">
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
                      <div className="p-6 lg:p-10">
                        {/* heading */}
                        <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
                        
                        {/* Error Message */}
                        {error && (
                          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                            {error}
                          </div>
                        )}

                        {/* Empty State */}
                        {!error && orders.length === 0 && !loaderStatus && (
                          <div className="text-center py-12">
                            <p className="text-gray-500 mb-0">No orders found. Start shopping to see your orders here!</p>
                          </div>
                        )}

                        {/* Orders Table - Desktop */}
                        {orders.length > 0 && (
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full border-collapse">
                              {/* Table Head */}
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">&nbsp;</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Product</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Order</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Date</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Items</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Status</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Amount</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">&nbsp;</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orders.map((order) => {
                                  const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
                                  const totalItems = order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
                                  
                                  return (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-4 py-4 align-middle">
                                        <Link to={`/order/${order._id}`}>
                                          <img
                                            src={firstItem?.image || "https://via.placeholder.com/80"}
                                            alt={firstItem?.name || "Product"}
                                            className="w-16 h-16 object-contain rounded"
                                            onError={(e) => {
                                              e.target.src = "https://via.placeholder.com/80";
                                            }}
                                          />
                                        </Link>
                                      </td>
                                      <td className="px-4 py-4 align-middle">
                                        <Link
                                          to={`/order/${order._id}`}
                                          className="font-semibold text-gray-900 hover:text-primary transition-colors"
                                        >
                                          <h6 className="mb-0 font-semibold">
                                            {firstItem?.name || "Order Items"}
                                          </h6>
                                          {order.items && order.items.length > 1 && (
                                            <span>
                                              <small className="text-gray-500">
                                                +{order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
                                              </small>
                                            </span>
                                          )}
                                        </Link>
                                      </td>
                                      <td className="px-4 py-4 align-middle">
                                        <Link to={`/order/${order._id}`} className="text-gray-700 hover:text-primary transition-colors">
                                          {order.order_number || `#${order._id.toString().slice(-6)}`}
                                        </Link>
                                      </td>
                                      <td className="px-4 py-4 align-middle text-gray-600">
                                        {formatDate(order.created_at)}
                                      </td>
                                      <td className="px-4 py-4 align-middle text-gray-600">
                                        {totalItems}
                                      </td>
                                      <td className="px-4 py-4 align-middle">
                                        <span className={getStatusBadge(getStatusText(order))}>
                                          {getStatusText(order)}
                                        </span>
                                      </td>
                                      <td className="px-4 py-4 align-middle font-semibold text-gray-900">
                                        Rs. {order.total?.toFixed(2) || "0.00"}
                                      </td>
                                      <td className="px-4 py-4 align-middle">
                                        <Link to={`/order/${order._id}`} className="text-gray-500 hover:text-primary transition-colors">
                                          <i className="feather-icon icon-eye" />
                                        </Link>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Orders Cards - Mobile */}
                        {orders.length > 0 && (
                          <div className="md:hidden space-y-4">
                            {orders.map((order) => {
                              const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
                              const totalItems = order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
                              
                              return (
                                <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                  <div className="flex items-start space-x-4">
                                    <Link to={`/order/${order._id}`} className="flex-shrink-0">
                                      <img
                                        src={firstItem?.image || "https://via.placeholder.com/80"}
                                        alt={firstItem?.name || "Product"}
                                        className="w-16 h-16 object-contain rounded"
                                        onError={(e) => {
                                          e.target.src = "https://via.placeholder.com/80";
                                        }}
                                      />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                      <Link
                                        to={`/order/${order._id}`}
                                        className="block"
                                      >
                                        <h6 className="font-semibold text-gray-900 mb-1">
                                          {firstItem?.name || "Order Items"}
                                        </h6>
                                        {order.items && order.items.length > 1 && (
                                          <p className="text-sm text-gray-500 mb-2">
                                            +{order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
                                          </p>
                                        )}
                                      </Link>
                                      <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Order:</span>
                                          <span className="font-medium text-gray-900">
                                            {order.order_number || `#${order._id.toString().slice(-6)}`}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Date:</span>
                                          <span className="text-gray-700">{formatDate(order.created_at)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Items:</span>
                                          <span className="text-gray-700">{totalItems}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Status:</span>
                                          <span className={getStatusBadge(getStatusText(order))}>
                                            {getStatusText(order)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                          <span className="text-gray-500">Amount:</span>
                                          <span className="font-bold text-lg text-gray-900">
                                            Rs. {order.total?.toFixed(2) || "0.00"}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="mt-3">
                                        <Link 
                                          to={`/order/${order._id}`}
                                          className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm"
                                        >
                                          View Details
                                          <i className="feather-icon icon-eye ml-2" />
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl md:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h5 className="text-lg font-semibold">My Account</h5>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4">
                <ul className="flex flex-col space-y-1">
                  <li>
                    <Link
                      className="flex items-center px-4 py-3 rounded-lg bg-primary text-white font-medium"
                      to="/MyAccountOrder"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="fas fa-shopping-bag mr-2" />
                      Your Orders
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      to="/MyAccountSetting"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="fas fa-cog mr-2" />
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      to="/MyAccountAddress"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="fas fa-map-marker-alt mr-2" />
                      Address
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      to="/MyAcconutPaymentMethod"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="fas fa-credit-card mr-2" />
                      Payment Method
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      to="/MyAcconutNotification"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="fas fa-bell mr-2" />
                      Notification
                    </Link>
                  </li>
                </ul>
                <hr className="my-4" />
                <div>
                  <ul className="flex flex-col space-y-1">
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-left"
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
        </>
      )}
    </div>
  );
};

export default MyAccountOrder;
