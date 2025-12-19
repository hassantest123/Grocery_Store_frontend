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
       <>
            <ScrollToTop/>
            </>
      <>
        <div>
          {/* section */}
          <section>
            {/* container */}
            <div className="container">
              {/* row */}
              <div className="row">
                {/* col */}
                <div className="col-12">
                  <div className="p-6 d-flex justify-content-between align-items-center d-md-none">
                    {/* heading */}
                    <h3 className="fs-5 mb-0">Account Setting</h3>
                    {/* btn */}
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
                    {/* nav item */}
                    <ul className="nav flex-column nav-pills nav-pills-dark">
                      <li className="nav-item">
                        <Link
                          className="nav-link "
                          aria-current="page"
                          to="/MyAccountOrder"
                        >
                          <i className="fas fa-shopping-bag me-2" />
                          Your Orders
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link
                          className="nav-link active"
                          to="/MyAccountSetting"
                        >
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
                        <button 
                          className="nav-link w-100 text-start border-0 bg-transparent" 
                          onClick={handleLogout}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="fas fa-sign-out-alt me-2" />
                          Log out
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
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
                          <div className="mb-6">
                            {/* heading */}
                            <h2 className="mb-0">Account Setting</h2>
                          </div>
                          <div>
                            {/* heading */}
                            <h5 className="mb-4">Account details</h5>
                            <div className="row">
                              <div className="col-lg-5">
                                {/* form */}
                                <form onSubmit={handleSubmit}>
                                  {/* input */}
                                  <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                      type="text"
                                      name="name"
                                      className="form-control"
                                      placeholder="Enter your name"
                                      value={formData.name}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </div>
                                  {/* input */}
                                  <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                      type="email"
                                      name="email"
                                      className="form-control"
                                      placeholder="Enter your email"
                                      value={formData.email}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </div>
                                  {/* input */}
                                  <div className="mb-5">
                                    <label className="form-label">Phone</label>
                                    <input
                                      type="text"
                                      name="phone"
                                      className="form-control"
                                      placeholder="Enter your phone number"
                                      value={formData.phone}
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                  {/* button */}
                                  <div className="mb-3">
                                    <button 
                                      type="submit"
                                      className="btn btn-primary"
                                      disabled={isUpdating}
                                    >
                                      {isUpdating ? "Saving..." : "Save Details"}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                          <hr className="my-10" />
                          <div className="pe-lg-14">
                            {/* heading */}
                            <h5 className="mb-4">Password</h5>
                            <form className=" row row-cols-1 row-cols-lg-2">
                              {/* input */}
                              <div className="mb-3 col">
                                <label className="form-label">
                                  New Password
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  placeholder="**********"
                                />
                              </div>
                              {/* input */}
                              <div className="mb-3 col">
                                <label className="form-label">
                                  Current Password
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  placeholder="**********"
                                />
                              </div>
                              {/* input */}
                              <div className="col-12">
                                <p className="mb-4">
                                  Can’t remember your current password?
                                  <Link to="#"> Reset your password.</Link>
                                </p>
                                <Link to="#" className="btn btn-primary">
                                  Save Password
                                </Link>
                              </div>
                            </form>
                          </div>
                          <hr className="my-10" />
                          <div>
                            {/* heading */}
                            <h5 className="mb-4">Delete Account</h5>
                            <p className="mb-2">
                              Would you like to delete your account?
                            </p>
                            <p className="mb-5">
                              This account contain 12 orders, Deleting your
                              account will remove all the order details
                              associated with it.
                            </p>
                            {/* btn */}
                            <Link to="#" className="btn btn-outline-danger">
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
                    <button 
                      className="nav-link w-100 text-start border-0 bg-transparent" 
                      onClick={handleLogout}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fas fa-sign-out-alt me-2" />
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default MyAcconutSetting;
