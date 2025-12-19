import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import useCartStore from "../../store/cartStore";

const ShopCart = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const handleQuantityChange = (productId, newQuantity) => {
     updateQuantity(productId, parseInt(newQuantity));
   };

   const handleRemove = (productId) => {
     removeItem(productId);
   };

   // Check authentication before going to checkout
   const handleCheckout = (e) => {
     e.preventDefault();
     // Check for JWT token in localStorage
     const jwtToken = localStorage.getItem('jwt') || localStorage.getItem('token') || localStorage.getItem('authToken');
     
     if (!jwtToken) {
       // No token found, redirect to login
       navigate('/MyAccountSignIn');
     } else {
       // Token exists, proceed to checkout
       navigate('/ShopCheckOut');
     }
   };
 
  return (
    <div>
      <>
        <ScrollToTop/>
          <div>
            {/* section*/}
            {/* section */}
            <section className="mb-lg-14 mb-8 mt-8">
            <div className="container">
              {/* row */}
              <div className="row">
                <div className="col-12">
                  {/* card */}
                  <div className="card py-1 border-0 mb-8">
                    <div>
                      <h1 className="fw-bold">Shop Cart</h1>
                      <p className="mb-0">Shopping in 382480</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* row */}
              <div className="row">
                <div className="col-lg-8 col-md-7">
                  <div className="py-3">
                    {/* alert */}
                    {items.length > 0 ? (
                      <>
                        <div className="alert alert-danger p-2" role="alert">
                          You've got FREE delivery. Start{" "}
                          <Link to="/ShopCheckOut" className="alert-link">
                            checkout now!
                          </Link>
                        </div>
                        <ul className="list-group list-group-flush">
                          {items.map((item, index) => (
                            <li 
                              key={item.id} 
                              className={`list-group-item py-3 py-lg-0 px-0 ${index === 0 ? 'border-top' : ''}`}
                            >
                              {/* row */}
                              <div className="row align-items-center">
                                <div className="col-3 col-md-2">
                                  {/* img */}
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="col-4 col-md-6">
                                  {/* title */}
                                  <h6 className="mb-0">{item.name}</h6>
                                  <span>
                                    <small className="text-muted">{item.category}</small>
                                  </span>
                                  {/* text */}
                                  <div className="mt-2 small">
                                    <button
                                      onClick={() => handleRemove(item.id)}
                                      className="text-decoration-none text-inherit border-0 bg-transparent p-0"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <span className="me-1 align-text-bottom">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={16}
                                          height={16}
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="feather feather-trash-2 text-success"
                                        >
                                          <polyline points="3 6 5 6 21 6" />
                                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                          <line x1={10} y1={11} x2={10} y2={17} />
                                          <line x1={14} y1={11} x2={14} y2={17} />
                                        </svg>
                                      </span>
                                      <span className="text-muted">Remove</span>
                                    </button>
                                  </div>
                                </div>
                                {/* input group */}
                                <div className="col-3 col-md-3 col-lg-2">
                                  <div className="input-group flex-nowrap justify-content-center">
                                    <button
                                      type="button"
                                      className="button-minus form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0"
                                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      step={1}
                                      min={1}
                                      max={10}
                                      value={item.quantity}
                                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                      name="quantity"
                                      className="quantity-field form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0"
                                    />
                                    <button
                                      type="button"
                                      className="button-plus form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0"
                                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                {/* price */}
                                <div className="col-2 text-lg-end text-start text-md-end col-md-2">
                                  <span className="fw-bold">Rs {(item.price * item.quantity).toFixed(2)}</span>
                                  {item.originalPrice && (
                                    <div className="text-decoration-line-through text-muted small">
                                      Rs {(item.originalPrice * item.quantity).toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <div className="text-center py-5">
                        <h5>Your cart is empty</h5>
                        <p className="text-muted">Add some products to your cart to get started!</p>
                        <Link to="/Shop" className="btn btn-primary mt-3">
                          Continue Shopping
                        </Link>
                      </div>
                    )}
                    {items.length > 0 && (
                      <>
                        {/* btn */}
                        <div className="d-flex justify-content-between mt-4">
                          <Link to="/Shop" className="btn btn-primary">
                            Continue Shopping
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* sidebar */}
                {items.length > 0 && (
                  <div className="col-12 col-lg-4 col-md-5">
                    {/* card */}
                    <div className="mb-5 card mt-6">
                      <div className="card-body p-6">
                        {/* heading */}
                        <h2 className="h5 mb-4">Summary</h2>
                        <div className="card mb-2">
                          {/* list group */}
                          <ul className="list-group list-group-flush">
                            {/* list group item */}
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                              <div className="me-auto">
                                <div>Item Subtotal</div>
                              </div>
                              <span>Rs {getTotalPrice().toFixed(2)}</span>
                            </li>
                            {/* list group item */}
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                              <div className="me-auto">
                                <div>Delivery Fee</div>
                              </div>
                              <span className="text-success">Free</span>
                            </li>
                            {/* list group item */}
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                              <div className="me-auto">
                                <div className="fw-bold">Subtotal</div>
                              </div>
                              <div className="fw-bold">Rs {getTotalPrice().toFixed(2)}</div>
                            </li>
                          </ul>
                        </div>
                        {/* btn */}
                        <div className="d-grid mt-4">
                          <button
                            onClick={handleCheckout}
                            className="btn btn-primary btn-lg d-flex justify-content-between align-items-center"
                          >
                            {" "}
                            Go to Checkout <span className="fw-bold">Rs {getTotalPrice().toFixed(2)}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </section>
          </div>
        </>
    </div>
  );
};

export default ShopCart;
