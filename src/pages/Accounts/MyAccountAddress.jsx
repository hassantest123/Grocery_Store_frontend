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
                        {/* nav link */}
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
                        <Link className="nav-link " to="/MyAccountSetting">
                          <i className="fas fa-cog me-2" />
                          Settings
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link
                          className="nav-link active"
                          to="/MyAccountAddress"
                        >
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
                            <h2 className="mb-0">Address</h2>
                          </div>
                          <div className="row">
                            {/* col */}
                            <div className="col-lg-8 col-xxl-6 col-12">
                              {/* form */}
                              <div className="border p-6 rounded-3">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                  <h5 className="mb-0 text-dark fw-semi-bold">
                                    <i className="fas fa-map-marker-alt me-2"></i>
                                    Home Address
                                  </h5>
                                  {!isEditing && (
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={handleEdit}
                                    >
                                      <i className="fas fa-edit me-1"></i>
                                      Edit
                                    </button>
                                  )}
                                </div>
                                
                                {!isEditing ? (
                                  <>
                                    {/* Display address */}
                                    {user && (
                                      <div className="mb-4">
                                        <p className="mb-2">
                                          <strong>{user.name || "N/A"}</strong>
                                        </p>
                                        {address ? (
                                          <p className="mb-2 text-muted">
                                            {address.split('\n').map((line, index) => (
                                              <React.Fragment key={index}>
                                                {line}
                                                <br />
                                              </React.Fragment>
                                            ))}
                                          </p>
                                        ) : (
                                          <p className="mb-2 text-muted">
                                            No address provided
                                          </p>
                                        )}
                                        {user.phone && (
                                          <p className="mb-0 text-muted">
                                            <i className="fas fa-phone me-2"></i>
                                            {user.phone}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    {!address && (
                                      <div className="mb-4">
                                        <p className="text-muted mb-0">
                                          You haven't added an address yet. Click Edit to add your address.
                                        </p>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {/* Edit form */}
                                    <form onSubmit={handleSubmit}>
                                      <div className="mb-4">
                                        <label className="form-label fw-bold">
                                          Full Address
                                        </label>
                                        <textarea
                                          className="form-control"
                                          rows="5"
                                          placeholder="Enter your complete address (street, city, state, zip code, country)"
                                          value={address}
                                          onChange={(e) => setAddress(e.target.value)}
                                          required
                                        />
                                        <small className="form-text text-muted">
                                          Include street address, city, state, zip code, and country
                                        </small>
                                      </div>
                                      <div className="d-flex gap-2">
                                        <button
                                          type="submit"
                                          className="btn btn-primary"
                                          disabled={isUpdating}
                                        >
                                          {isUpdating ? "Saving..." : "Save Address"}
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-outline-secondary"
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
                    <a className="nav-link " href="/">
                      <i className="fas fa-sign-out-alt me-2" />
                      Log out
                    </a>
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

export default MyAccountAddress;
