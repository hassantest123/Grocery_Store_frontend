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
      case "paid":
        return "badge bg-success";
      case "pending":
      case "processing":
        return "badge bg-warning";
      case "failed":
      case "canceled":
      case "cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  // Get status text
  const getStatusText = (order) => {
    if (order.payment_status === "paid" && order.order_status === "confirmed") {
      return "Completed";
    } else if (order.payment_status === "paid" && order.order_status === "pending") {
      return "Processing";
    } else if (order.payment_status === "pending") {
      return "Pending";
    } else if (order.payment_status === "failed") {
      return "Failed";
    } else if (order.order_status === "canceled" || order.order_status === "cancelled") {
      return "Canceled";
    }
    return order.order_status || "Pending";
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

  return (
    <div>
       <>
            <ScrollToTop/>
            </>
      <>
        {/* section */}
        <section>
          <div className="container">
            {/* row */}
            <div className="row">
              {/* col */}

              {/* <div> */}
              <div className="col-12">
                <div className="p-6 d-flex justify-content-between align-items-center d-md-none">
                  {/* heading */}
                  <h3 className="fs-5 mb-0">Account Setting</h3>
                  {/* button */}
                  <button
                    className="btn btn-outline-gray-400 text-muted d-md-none"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasAccount"
                    aria-controls="offcanvasAccount"
                  >
                    <i className="fas fa-bars"></i>
                  </button>
                </div>
              </div>
              {/* col */}
              <div className="col-lg-3 col-md-4 col-12 border-end  d-none d-md-block">
                <div className="pt-10 pe-lg-10">
                  {/* nav */}
                  <ul className="nav flex-column nav-pills nav-pills-dark">
                    {/* nav item */}
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        aria-current="page"
                        to="/MyAccountOrder"
                      >
                        <i className="fas fa-shopping-bag me-2" />
                        Your Orders
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAccountSetting">
                        <i className="fas fa-cog me-2" />
                        Settings
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAccountAddress">
                        <i className="fas fa-map-marker-alt me-2" />
                        Address
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAcconutPaymentMethod">
                        <i className="fas fa-credit-card me-2" />
                        Payment Method
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAcconutNotification">
                        <i className="fas fa-bell me-2" />
                        Notification
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <hr />
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link " to="/">
                        <i className="fas fa-sign-out-alt me-2" />
                        Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* </div> */}

              <div className="col-lg-9 col-md-8 col-12">
                <div>
                  {loaderStatus ? (
                    <div className="loader-container">
                      {/* <PulseLoader loading={loaderStatus} size={50} color="#0aad0a" /> */}
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
                      <div className="p-6 p-lg-10">
                        {/* heading */}
                        <h2 className="mb-6">Your Orders</h2>
                        <div className="table-responsive border-0">
                          {/* Table */}
                          <table className="table mb-0 text-nowrap">
                            {/* Table Head */}
                            <thead className="table-light">
                              <tr>
                                <th className="border-0">&nbsp;</th>
                                <th className="border-0">Product</th>
                                <th className="border-0">Order</th>
                                <th className="border-0">Date</th>
                                <th className="border-0">Items</th>
                                <th className="border-0">Status</th>
                                <th className="border-0">Amount</th>
                                <th className="border-0" />
                              </tr>
                            </thead>
                            <tbody>
                              {/* Table body - Real Orders */}
                              {error && (
                                <tr>
                                  <td colSpan="8" className="text-center py-4">
                                    <div className="alert alert-danger mb-0">
                                      {error}
                                    </div>
                                  </td>
                                </tr>
                              )}
                              {!error && orders.length === 0 && !loaderStatus && (
                                <tr>
                                  <td colSpan="8" className="text-center py-4">
                                    <p className="text-muted mb-0">No orders found. Start shopping to see your orders here!</p>
                                  </td>
                                </tr>
                              )}
                              {orders.map((order) => {
                                // Get first item for display (or show all items)
                                const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
                                const totalItems = order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
                                
                                return (
                                  <tr key={order._id}>
                                    <td className="align-middle border-top-0 w-0">
                                      <Link to={`/order/${order._id}`}>
                                        <img
                                          src={firstItem?.image || "https://via.placeholder.com/80"}
                                          alt={firstItem?.name || "Product"}
                                          className="icon-shape icon-xl"
                                          onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/80";
                                          }}
                                        />
                                      </Link>
                                    </td>
                                    <td className="align-middle border-top-0">
                                      <Link
                                        to={`/order/${order._id}`}
                                        className="fw-semi-bold text-inherit"
                                      >
                                        <h6 className="mb-0">
                                          {firstItem?.name || "Order Items"}
                                        </h6>
                                        {order.items && order.items.length > 1 && (
                                          <span>
                                            <small className="text-muted">
                                              +{order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
                                            </small>
                                          </span>
                                        )}
                                      </Link>
                                    </td>
                                    <td className="align-middle border-top-0">
                                      <Link to={`/order/${order._id}`} className="text-inherit">
                                        {order.order_number || `#${order._id.toString().slice(-6)}`}
                                      </Link>
                                    </td>
                                    <td className="align-middle border-top-0">
                                      {formatDate(order.created_at)}
                                    </td>
                                    <td className="align-middle border-top-0">
                                      {totalItems}
                                    </td>
                                    <td className="align-middle border-top-0">
                                      <span className={getStatusBadge(getStatusText(order))}>
                                        {getStatusText(order)}
                                      </span>
                                    </td>
                                    <td className="align-middle border-top-0">
                                      Rs. {order.total?.toFixed(2) || "0.00"}
                                    </td>
                                    <td className="text-muted align-middle border-top-0">
                                      <Link to={`/order/${order._id}`} className="text-inherit">
                                        <i className="feather-icon icon-eye" />
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
      <>
        {/* modal */}
        <div
          className="offcanvas offcanvas-start"
          tabIndex={-1}
          id="offcanvasAccount"
          aria-labelledby="offcanvasAccountLabel"
        >
          {/* offcanvas header */}
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasAccountLabel">
              My Account
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          {/* offcanvas body */}
          <div className="offcanvas-body">
            <ul className="nav flex-column nav-pills nav-pills-dark">
              {/* nav item */}
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/MyAccountOrder"
                >
                  <i className="fas fa-shopping-bag me-2" />
                  Your Orders
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link " href="/MyAccountSetting">
                  <i className="fas fa-cog me-2" />
                  Settings
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAccountAddress">
                  <i className="fas fa-map-marker-alt me-2" />
                  Address
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAcconutPaymentMethod">
                  <i className="fas fa-credit-card me-2" />
                  Payment Method
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAcconutNotification">
                  <i className="fas fa-bell me-2" />
                  Notification
                </a>
              </li>
            </ul>
            <hr className="my-6" />
            <div>
              {/* nav  */}
              <ul className="nav flex-column nav-pills nav-pills-dark">
                {/* nav item */}
                <li className="nav-item">
                  <a className="nav-link " href="/">
                    <i className="fas fa-sign-out-alt me-2" />
                    Log out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default MyAccountOrder;
