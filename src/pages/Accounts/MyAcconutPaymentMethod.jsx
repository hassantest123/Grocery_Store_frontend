import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";

const MyAcconutPaymentMethod = () => {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  return (
    <div>
       <>
            <ScrollToTop/>
            </>
      <>
        <div>
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
                <div className="col-lg-3 col-md-4 col-12 border-end  d-none d-md-block">
                  <div className="pt-10 pe-lg-10">
                    {/* nav */}
                    <ul className="nav flex-column nav-pills nav-pills-dark">
                      {/* nav item */}
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
                        <Link className="nav-link " to="/MyAccountSetting">
                          <i className="fas fa-cog me-2" />
                          Settings
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link className="nav-link " to="/MyAccountAddress">
                          <i className="fas fa-map-marker-alt me-2" />
                          Address
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link
                          className="nav-link active"
                          to="/MyAcconutPaymentMethod"
                        >
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
                      </li>{" "}
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
                          {/* heading */}
                          <div className="mb-6">
                            <h2 className="mb-0">Payment Methods</h2>
                            <p className="text-muted mb-0 mt-2">
                              Available payment methods for your orders
                            </p>
                          </div>
                          <ul className="list-group list-group-flush">
                            {/* Stripe Payment Method */}
                            <li className="list-group-item py-5 px-0">
                              <div className="d-flex align-items-center">
                                <div className="d-flex align-items-center flex-grow-1">
                                  {/* Icon */}
                                  <div
                                    className="bg-primary text-white rounded d-inline-flex align-items-center justify-content-center me-4"
                                    style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                                  >
                                    <i className="fab fa-cc-stripe"></i>
                                  </div>
                                  {/* text */}
                                  <div>
                                    <h5 className="mb-1 h6 fw-bold">Stripe</h5>
                                    <p className="mb-0 small text-muted">
                                      Credit/Debit Card Payment
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <span className="badge bg-success">Active</span>
                                </div>
                              </div>
                            </li>
                            
                            {/* Easy Paisa Payment Method */}
                            <li className="list-group-item px-0 py-5">
                              <div className="d-flex align-items-center">
                                <div className="d-flex align-items-center flex-grow-1">
                                  {/* Icon */}
                                  <div
                                    className="bg-success text-white rounded d-inline-flex align-items-center justify-content-center me-4"
                                    style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                                  >
                                    <i className="fas fa-mobile-alt"></i>
                                  </div>
                                  {/* text */}
                                  <div>
                                    <h5 className="mb-1 h6 fw-bold">Easy Paisa</h5>
                                    <p className="mb-0 small text-muted">
                                      Mobile Wallet Payment
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <span className="badge bg-success">Active</span>
                                </div>
                              </div>
                            </li>
                            
                            {/* JazzCash Payment Method */}
                            <li className="list-group-item px-0 py-5">
                              <div className="d-flex align-items-center">
                                <div className="d-flex align-items-center flex-grow-1">
                                  {/* Icon */}
                                  <div
                                    className="bg-warning text-white rounded d-inline-flex align-items-center justify-content-center me-4"
                                    style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                                  >
                                    <i className="fas fa-wallet"></i>
                                  </div>
                                  {/* text */}
                                  <div>
                                    <h5 className="mb-1 h6 fw-bold">JazzCash</h5>
                                    <p className="mb-0 small text-muted">
                                      Mobile Wallet Payment
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <span className="badge bg-success">Active</span>
                                </div>
                              </div>
                            </li>
                            
                            {/* Cash on Delivery Payment Method */}
                            <li className="list-group-item px-0 py-5 border-bottom">
                              <div className="d-flex align-items-center">
                                <div className="d-flex align-items-center flex-grow-1">
                                  {/* Icon */}
                                  <div
                                    className="bg-info text-white rounded d-inline-flex align-items-center justify-content-center me-4"
                                    style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                                  >
                                    <i className="fas fa-money-bill-wave"></i>
                                  </div>
                                  {/* text */}
                                  <div>
                                    <h5 className="mb-1 h6 fw-bold">Cash on Delivery (COD)</h5>
                                    <p className="mb-0 small text-muted">
                                      Pay when you receive your order
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <span className="badge bg-success">Active</span>
                                </div>
                              </div>
                            </li>
                          </ul>
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

export default MyAcconutPaymentMethod;
