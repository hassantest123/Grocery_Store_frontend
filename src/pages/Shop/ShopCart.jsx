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

   // Navigate to checkout (guest checkout is allowed)
   const handleCheckout = (e) => {
     e.preventDefault();
     // Allow both logged-in and guest users to proceed to checkout
     navigate('/ShopCheckOut');
   };
 
  return (
    <div>
      <>
        <ScrollToTop/>
          <div>
            {/* section*/}
            {/* section */}
            <section className="mb-8 lg:mb-14 mt-8">
            <div className="container mx-auto px-4">
              <div className="w-full">
                <div className="bg-white py-1 border-0 mb-8">
                  <div>
                    <h1 className="font-bold text-2xl">Shop Cart</h1>
                    <p className="mb-0 text-gray-600">Shopping in 382480</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-4">
                <div className="w-full lg:w-8/12 md:w-7/12 px-4">
                  <div className="py-3">
                    {items.length > 0 ? (
                      <>
                        <ul className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          {items.map((item, index) => (
                            <li 
                              key={item.id} 
                              className={`border-b border-gray-200 py-3 lg:py-0 px-4 ${index === 0 ? 'border-t' : ''} last:border-b-0`}
                            >
                              <div className="flex items-center flex-wrap">
                                <div className="w-1/4 md:w-1/6 mb-3 md:mb-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-auto object-contain"
                                  />
                                </div>
                                <div className="w-1/2 md:w-1/2 px-2 md:px-4 mb-3 md:mb-0">
                                  <h6 className="mb-0 font-semibold text-base">{item.name}</h6>
                                  <span className="block mt-1">
                                    <small className="text-gray-500">{item.category}</small>
                                  </span>
                                  <div className="mt-2 text-sm">
                                    <button
                                      onClick={() => handleRemove(item.id)}
                                      className="text-inherit border-0 bg-transparent p-0 cursor-pointer hover:text-red-600 transition-colors"
                                    >
                                      <span className="mr-1 align-text-bottom inline-flex items-center">
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
                                          className="text-green-600"
                                        >
                                          <polyline points="3 6 5 6 21 6" />
                                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                          <line x1={10} y1={11} x2={10} y2={17} />
                                          <line x1={14} y1={11} x2={14} y2={17} />
                                        </svg>
                                      </span>
                                      <span className="text-gray-500">Remove</span>
                                    </button>
                                  </div>
                                </div>
                                <div className="w-1/4 md:w-1/4 lg:w-1/6 mb-3 md:mb-0">
                                  <div className="flex items-center justify-center">
                                    <button
                                      type="button"
                                      className="w-8 h-8 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center font-semibold"
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
                                      className="w-12 h-8 border-t border-b border-gray-300 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <button
                                      type="button"
                                      className="w-8 h-8 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center font-semibold"
                                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <div className="w-full md:w-1/6 text-left md:text-right lg:text-right">
                                  <span className="font-bold text-base">Rs {(item.price * item.quantity).toFixed(2)}</span>
                                  {item.originalPrice && (
                                    <div className="line-through text-gray-500 text-sm">
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
                      <div className="text-center py-12">
                        <h5 className="text-xl font-semibold mb-2">Your cart is empty</h5>
                        <p className="text-gray-500 mb-4">Add some products to your cart to get started!</p>
                        <Link to="/Shop" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors mt-3">
                          Continue Shopping
                        </Link>
                      </div>
                    )}
                    {items.length > 0 && (
                      <div className="flex justify-between mt-4">
                        <Link to="/Shop" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                          Continue Shopping
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                {items.length > 0 && (
                  <div className="w-full lg:w-4/12 md:w-5/12 px-4 mt-6 lg:mt-0">
                    <div className="mb-5 bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
                      <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Summary</h2>
                        <div className="bg-white border border-gray-200 rounded-lg mb-2">
                          <ul className="divide-y divide-gray-200">
                            <li className="flex justify-between items-start py-3 px-4">
                              <div className="flex-1">
                                <div>Item Subtotal</div>
                              </div>
                              <span>Rs {getTotalPrice().toFixed(2)}</span>
                            </li>
                            <li className="flex justify-between items-start py-3 px-4">
                              <div className="flex-1">
                                <div>Delivery Fee</div>
                              </div>
                              <span className="font-semibold">Rs 100.00</span>
                            </li>
                            <li className="flex justify-between items-start py-3 px-4">
                              <div className="flex-1">
                                <div className="font-bold">Subtotal</div>
                              </div>
                              <div className="font-bold">Rs {(getTotalPrice() + 100).toFixed(2)}</div>
                            </li>
                          </ul>
                        </div>
                        <div className="w-full mt-4">
                          <button
                            onClick={handleCheckout}
                            className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors flex justify-between items-center text-lg font-semibold"
                          >
                            Go to Checkout <span className="font-bold">Rs {getTotalPrice().toFixed(2)}</span>
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
