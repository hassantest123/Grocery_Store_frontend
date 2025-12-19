import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import productimage1 from '../../images/product-img-1.jpg'
import productimage2 from '../../images/product-img-2.jpg'
import productimage3 from '../../images/product-img-3.jpg'
import productimage4 from '../../images/product-img-4.jpg'
import ScrollToTop from "../ScrollToTop";
import useCartStore from "../../store/cartStore";
import StripePaymentForm from "../../Component/StripePaymentForm";
import Swal from "sweetalert2";
import orderApi from "../../Model/Data/Order/Order";
import paymentApi from "../../Model/Data/Payment/Payment";
import { loadStripe } from '@stripe/stripe-js';
import { CardElement } from '@stripe/react-stripe-js';

const ShopCheckOut = () => {
   const navigate = useNavigate();
   const items = useCartStore((state) => state.items);
   const getTotalPrice = useCartStore((state) => state.getTotalPrice);
   const [user, setUser] = useState(null);
   const [paymentMethod, setPaymentMethod] = useState('stripe');
   const [deliveryInstructions, setDeliveryInstructions] = useState('');
   const [deliveryTime, setDeliveryTime] = useState('');
   const [tax, setTax] = useState(0);
   const [shipping, setShipping] = useState(0);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [stripeInstance, setStripeInstance] = useState(null);
  const [stripeElements, setStripeElements] = useState(null);
  const [jazzcashAccountNumber, setJazzcashAccountNumber] = useState('');
  const [easypaisaAccountNumber, setEasypaisaAccountNumber] = useState('');
  const clearCart = useCartStore((state) => state.clearCart);
   
   // Check authentication on component mount and get user data
   useEffect(() => {
     // Check for JWT token in localStorage
     const jwtToken = localStorage.getItem('jwt') || localStorage.getItem('token') || localStorage.getItem('authToken');
     
     if (!jwtToken) {
       // No token found, redirect to login
       navigate('/MyAccountSignIn');
     } else {
       // Get user data from localStorage
       const userData = localStorage.getItem('user');
       if (userData) {
         try {
           setUser(JSON.parse(userData));
         } catch (error) {
           console.error('Error parsing user data:', error);
         }
       }
     }
   }, [navigate]);

  // Handle Place Order
  const handlePlaceOrder = async () => {
    // Validation
    if (!deliveryTime) {
      Swal.fire({
        icon: 'warning',
        title: 'Delivery Time Required',
        text: 'Please select a delivery time.',
      });
      return;
    }

    if (!paymentMethod) {
      Swal.fire({
        icon: 'warning',
        title: 'Payment Method Required',
        text: 'Please select a payment method.',
      });
      return;
    }

    // Validate JazzCash account number
    if (paymentMethod === 'jazzcash') {
      if (!jazzcashAccountNumber || jazzcashAccountNumber.trim() === '') {
        Swal.fire({
          icon: 'warning',
          title: 'JazzCash Account Required',
          text: 'Please enter your JazzCash mobile number.',
        });
        return;
      }
      // Validate JazzCash number format (11 digits, starting with 03)
      const jazzcashRegex = /^03\d{9}$/;
      if (!jazzcashRegex.test(jazzcashAccountNumber.trim())) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid JazzCash Number',
          text: 'Please enter a valid JazzCash mobile number (11 digits, starting with 03).',
        });
        return;
      }
    }

    // Validate Easy Paisa account number
    if (paymentMethod === 'easypaisa') {
      if (!easypaisaAccountNumber || easypaisaAccountNumber.trim() === '') {
        Swal.fire({
          icon: 'warning',
          title: 'Easy Paisa Account Required',
          text: 'Please enter your Easy Paisa mobile number.',
        });
        return;
      }
      // Validate Easy Paisa number format (11 digits, starting with 03)
      const easypaisaRegex = /^03\d{9}$/;
      if (!easypaisaRegex.test(easypaisaAccountNumber.trim())) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Easy Paisa Number',
          text: 'Please enter a valid Easy Paisa mobile number (11 digits, starting with 03).',
        });
        return;
      }
    }

    if (items.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cart Empty',
        text: 'Please add items to your cart before placing an order.',
      });
      return;
    }

    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'User Not Found',
        text: 'Please log in to place an order.',
      });
      navigate('/MyAccountSignIn');
      return;
    }

    // For Stripe, validate card element and all required fields
    if (paymentMethod === 'stripe') {
      if (!stripeInstance || !stripeElements) {
        Swal.fire({
          icon: 'warning',
          title: 'Stripe Not Ready',
          text: 'Please wait for Stripe to load and try again.',
        });
        return;
      }

      // Get card element
      const cardElement = stripeElements.getElement(CardElement);
      if (!cardElement) {
        Swal.fire({
          icon: 'warning',
          title: 'Card Details Required',
          text: 'Please enter your card information.',
        });
        return;
      }

      // Validate card element completeness
      // Check if card element is complete by attempting to create a payment method
      // This validates that all required fields (card number, expiry MM/YY, CVC, ZIP) are filled
      try {
        const { error: createError } = await stripeInstance.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (createError) {
          // If there's an error, it means the card is incomplete or invalid
          if (createError.type === 'card_error' || createError.type === 'validation_error') {
            Swal.fire({
              icon: 'warning',
              title: 'Card Details Incomplete',
              text: 'Please fill all required card fields (Card Number, Expiry Date MM/YY, CVC, and ZIP Code).',
            });
            return;
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Card Validation Error',
              text: createError.message || 'Please check your card details and try again.',
            });
            return;
          }
        }
        // If no error, card is valid and all fields are filled
      } catch (validationError) {
        // If validation fails, show error
        console.error('Card validation error:', validationError);
        Swal.fire({
          icon: 'warning',
          title: 'Card Details Required',
          text: 'Please fill all required card fields (Card Number, Expiry Date MM/YY, CVC, and ZIP Code).',
        });
        return;
      }
    }

    setProcessingOrder(true);

    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shipping_address: {
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          address: user.address || '',
        },
        delivery_time: deliveryTime,
        delivery_instructions: deliveryInstructions,
        payment_method: paymentMethod,
        payment_account_number: paymentMethod === 'jazzcash' ? jazzcashAccountNumber.trim() : 
                                paymentMethod === 'easypaisa' ? easypaisaAccountNumber.trim() : null,
        tax: tax,
        shipping: shipping,
      };

      // Create order
      const orderResponse = await orderApi.createOrder(orderData);

      console.log('orderResponse', orderResponse);

      if (orderResponse?.data?.STATUS !== 'SUCCESSFUL') {
        throw new Error(orderResponse.data.ERROR_DESCRIPTION || 'Failed to create order');
      }

      const { order, payment_intent } = orderResponse.data.DB_DATA;

      // Process payment based on method
      if (paymentMethod === 'stripe') {
        // Check if payment_intent exists and has the required structure
        if (!payment_intent || !payment_intent.payment_intent || !payment_intent.payment_intent.client_secret) {
          throw new Error('Payment intent not created. Please try again.');
        }

        // Get card element
        const cardElement = stripeElements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card details not entered. Please enter your card information.');
        }

        // Extract payment intent details from nested structure
        const paymentIntentId = payment_intent.payment_intent.id;
        const clientSecret = payment_intent.payment_intent.client_secret;

        console.log('Confirming payment with Stripe:', { paymentIntentId, clientSecret: clientSecret.substring(0, 20) + '...' });

        // Confirm payment with Stripe
        // Stripe requires postal_code in billing address
        // For test cards, use any valid postal code format
        const { error, paymentIntent } = await stripeInstance.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                address: {
                  line1: user.address || '123 Main Street',
                  postal_code: '12345', // Test postal code - any 5 digit code works for US cards
                  // For other countries, use appropriate format:
                  // UK: "SW1A1AA" or "SW1A 1AA"
                  // Canada: "K1A0B1" or "K1A 0B1"
                },
              },
            },
          }
        );

        console.log('Stripe payment confirmation result:', { error, paymentIntent: paymentIntent ? { id: paymentIntent.id, status: paymentIntent.status } : null });

        if (error) {
          console.error('Stripe payment error:', error);
          // Confirm payment status on backend even if there's an error
          try {
            await paymentApi.confirmPayment(paymentIntentId);
          } catch (confirmError) {
            console.error('Error confirming payment on backend:', confirmError);
          }
          throw new Error(error.message || 'Payment failed. Please try again.');
        }

        // Always confirm payment on backend after Stripe confirmation
        // This handles all statuses: succeeded, processing, requires_action, etc.
        let confirmResponse;
        try {
          confirmResponse = await paymentApi.confirmPayment(paymentIntentId);
          console.log('Backend payment confirmation response:', confirmResponse?.data);
        } catch (confirmError) {
          console.error('Error confirming payment on backend:', confirmError);
          // Continue even if backend confirmation fails, as Stripe has already confirmed
        }
        
        // Check if payment was successful
        if (paymentIntent.status === 'succeeded') {
          // Payment successful - continue with order completion
          console.log('Payment succeeded!');
        } else if (paymentIntent.status === 'processing') {
          // Payment is processing - for test cards, this should succeed shortly
          // Wait a moment and check again
          console.log('Payment is processing, checking status...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
          
          // Check payment status again
          try {
            const statusResponse = await paymentApi.getPaymentStatus(paymentIntentId);
            if (statusResponse?.data?.DB_DATA?.payment?.status === 'completed') {
              console.log('Payment confirmed after processing');
            } else {
              console.log('Payment still processing, will be confirmed asynchronously');
            }
          } catch (statusError) {
            console.error('Error checking payment status:', statusError);
          }
        } else if (paymentIntent.status === 'requires_action') {
          // Payment requires additional action (3D Secure, etc.)
          throw new Error('Payment requires additional authentication. Please complete the verification.');
        } else if (paymentIntent.status === 'requires_payment_method') {
          // Payment method was not attached properly - this shouldn't happen if confirmCardPayment worked
          // Try to confirm again or show helpful error
          console.error('Payment requires payment method - confirmation may have failed');
          throw new Error('Payment method not attached. Please check your card details and try again. If the problem persists, please contact support.');
        } else {
          // Payment failed or in unexpected state
          console.error('Unexpected payment status:', paymentIntent.status);
          throw new Error(`Payment status: ${paymentIntent.status}. Please try again.`);
        }
      } else if (paymentMethod === 'easypaisa') {
        // Easy Paisa payment - initiate payment request
        const easypaisaResponse = await paymentApi.createEasyPaisaPayment(order._id.toString());
        
        if (easypaisaResponse.data.STATUS !== 'SUCCESSFUL') {
          throw new Error(easypaisaResponse.data.ERROR_DESCRIPTION || 'Failed to initiate Easy Paisa payment');
        }

        const { payment_form_data, payment_url } = easypaisaResponse.data.DB_DATA;
        
        // Create form and submit to Easy Paisa
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payment_url;
        form.style.display = 'none';

        // Add all form fields
        Object.keys(payment_form_data).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = payment_form_data[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        
        // Don't clear cart or show success yet - user will be redirected
        // Payment will be confirmed via callback
        return; // Exit early, user will be redirected
      } else if (paymentMethod === 'jazzcash') {
        // JazzCash payment - initiate payment request
        const jazzcashResponse = await paymentApi.createJazzCashPayment(order._id.toString());
        
        if (jazzcashResponse.data.STATUS !== 'SUCCESSFUL') {
          throw new Error(jazzcashResponse.data.ERROR_DESCRIPTION || 'Failed to initiate JazzCash payment');
        }

        const { payment_form_data, payment_url } = jazzcashResponse.data.DB_DATA;
        
        // Create form and submit to JazzCash
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payment_url;
        form.style.display = 'none';

        // Add all form fields
        Object.keys(payment_form_data).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = payment_form_data[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        
        // Don't clear cart or show success yet - user will be redirected
        // Payment will be confirmed via callback
        return; // Exit early, user will be redirected
      } else if (paymentMethod === 'cod') {
        // Cash on Delivery - order is created, payment will be collected on delivery
        // No additional payment processing needed
      }

      // Clear cart
      clearCart();

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Order Placed Successfully!',
        text: `Your order ${order.order_number} has been placed successfully.`,
        confirmButtonText: 'View Orders'
      }).then(() => {
        navigate('/MyAccountOrder');
      });

    } catch (error) {
      console.error('Order error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: error.message || 'An error occurred while placing your order. Please try again.',
      });
    } finally {
      setProcessingOrder(false);
    }
  };

  return (
    <div>
      <div>
        <>
         <>
            <ScrollToTop/>
            </>
      <>
        {/* section */}
        <section className="mb-lg-14 mb-8 mt-8">
          <div className="container">
            {/* row */}
            <div className="row">
              {/* col */}
              <div className="col-12">
                <div>
                  <div className="mb-8">
                    {/* text */}
                    <h1 className="fw-bold mb-0">Checkout</h1>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {/* row */}
              <div className="row">
                <div className="col-lg-7 col-md-12">
                  {/* accordion */}
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    {/* accordion item */}
                    <div className="accordion-item py-4">
                      <div className="d-flex justify-content-between align-items-center">
                        {/* heading one */}
                        <h4 className="fs-5 text-inherit h4">
                          <i className="feather-icon icon-map-pin me-2 text-muted" />
                          Delivery Address
                        </h4>
                      </div>
                      <div className="mt-5">
                        <div className="row">
                          <div className="col-12">
                            {/* form */}
                            <div className="border p-6 rounded-3">
                              <div className="mb-3">
                                <label className="form-check-label text-dark fw-bold">
                                  Home
                                </label>
                              </div>
                              {/* address */}
                              {user ? (
                                <address className="mb-0">
                                  <strong>{user.name || 'N/A'}</strong> <br />
                                  {user.address || 'No address provided'} <br />
                                  <abbr title="Phone">P: {user.phone || 'N/A'}</abbr>
                                  <br />
                                  <span className="text-muted">Email: {user.email || 'N/A'}</span>
                                </address>
                              ) : (
                                <address className="mb-0">
                                  <strong>Loading...</strong>
                                </address>
                              )}
                              <span className="text-danger mt-3 d-block">
                                Default address
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* accordion item */}
                    <div className="accordion-item py-4">
                      <Link
                        to="#"
                        className="text-inherit collapsed h5"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseTwo"
                        aria-expanded="false"
                        aria-controls="flush-collapseTwo"
                      >
                        <i className="feather-icon icon-clock me-2 text-muted" />
                        Delivery time
                      </Link>
                      {/* collapse */}
                      <div
                        id="flush-collapseTwo"
                        className="accordion-collapse collapse "
                        data-bs-parent="#accordionFlushExample"
                      >
                        {/* Delivery time options in flex layout */}
                        <div className="d-flex flex-wrap gap-3 mt-5">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="deliveryTime"
                              id="deliveryTime1"
                              value="Within 2 Hours"
                              checked={deliveryTime === "Within 2 Hours"}
                              onChange={(e) => setDeliveryTime(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="deliveryTime1"
                            >
                              Within 2 Hours
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="deliveryTime"
                              id="deliveryTime2"
                              value="Within 3 Hours"
                              checked={deliveryTime === "Within 3 Hours"}
                              onChange={(e) => setDeliveryTime(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="deliveryTime2"
                            >
                              Within 3 Hours
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="deliveryTime"
                              id="deliveryTime3"
                              value="1pm - 2pm"
                              checked={deliveryTime === "1pm - 2pm"}
                              onChange={(e) => setDeliveryTime(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="deliveryTime3"
                            >
                              1pm - 2pm
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="deliveryTime"
                              id="deliveryTime4"
                              value="2pm - 3pm"
                              checked={deliveryTime === "2pm - 3pm"}
                              onChange={(e) => setDeliveryTime(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="deliveryTime4"
                            >
                              2pm - 3pm
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="deliveryTime"
                              id="deliveryTime5"
                              value="3pm - 4pm"
                              checked={deliveryTime === "3pm - 4pm"}
                              onChange={(e) => setDeliveryTime(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="deliveryTime5"
                            >
                              3pm - 4pm
                            </label>
                          </div>
                        </div>
                        <div className="mt-5 d-flex justify-content-end">
                          <Link
                            to="#"
                            className="btn btn-outline-gray-400 text-muted"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseOne"
                            aria-expanded="false"
                            aria-controls="flush-collapseOne"
                          >
                            Prev
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-primary ms-2"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseThree"
                            aria-expanded="false"
                            aria-controls="flush-collapseThree"
                          >
                            Next
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* accordion item */}
                    <div className="accordion-item py-4">
                      <Link
                        to="#"
                        className="text-inherit h5"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseThree"
                        aria-expanded="false"
                        aria-controls="flush-collapseThree"
                      >
                        <i className="feather-icon icon-shopping-bag me-2 text-muted" />
                        Delivery instructions
                        {/* collapse */}{" "}
                      </Link>
                      <div
                        id="flush-collapseThree"
                        className="accordion-collapse collapse "
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="mt-5">
                          <label
                            htmlFor="DeliveryInstructions"
                            className="form-label sr-only"
                          >
                            Delivery instructions
                          </label>
                          <textarea
                            className="form-control"
                            id="DeliveryInstructions"
                            rows={3}
                            placeholder="Write delivery instructions "
                            value={deliveryInstructions}
                            onChange={(e) => setDeliveryInstructions(e.target.value)}
                          />
                          <p className="form-text">
                            Add instructions for how you want your order shopped
                            and/or delivered
                          </p>
                          <div className="mt-5 d-flex justify-content-end">
                            <Link
                              to="#"
                              className="btn btn-outline-gray-400 text-muted"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapseTwo"
                              aria-expanded="false"
                              aria-controls="flush-collapseTwo"
                            >
                              Prev
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-primary ms-2"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapseFour"
                              aria-expanded="false"
                              aria-controls="flush-collapseFour"
                            >
                              Next
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* accordion item */}
                    <div className="accordion-item py-4">
                      <Link
                        to="#"
                        className="text-inherit h5"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseFour"
                        aria-expanded="false"
                        aria-controls="flush-collapseFour"
                      >
                        <i className="feather-icon icon-credit-card me-2 text-muted" />
                        Payment Method
                        {/* collapse */}{" "}
                      </Link>
                      <div
                        id="flush-collapseFour"
                        className="accordion-collapse collapse "
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="mt-5">
                          <div>
                            {/* card */}
                            <div className="card card-bordered shadow-none mb-2">
                              {/* card body */}
                              <div className="card-body p-6">
                                <div className="d-flex mb-4">
                                  <div className="form-check ">
                                    {/* input */}
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="paymentMethod"
                                      id="creditdebitcard"
                                      checked={paymentMethod === 'stripe'}
                                      onChange={() => setPaymentMethod('stripe')}
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="creditdebitcard"
                                    ></label>
                                  </div>
                                  <div>
                                    <h5 className="mb-1 h6">
                                      {" "}
                                      Credit / Debit Card
                                    </h5>
                                    <p className="mb-0 small">
                                      Safe money transfer using your bank account. We support Mastercard,
                                      Visa, Discover and Stripe.
                                    </p>
                                  </div>
                                </div>
                                {paymentMethod === 'stripe' && user && (
                                  <StripePaymentForm
                                    onStripeReady={(stripeData) => {
                                      setStripeInstance(stripeData.stripe);
                                      setStripeElements(stripeData.elements);
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                            {/* card */}
                            <div className="card card-bordered shadow-none mb-2">
                              {/* card body */}
                              <div className="card-body p-6">
                                {/* check input */}
                                <div className="d-flex">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="paymentMethod"
                                      id="jazzcash"
                                      checked={paymentMethod === 'jazzcash'}
                                      onChange={() => setPaymentMethod('jazzcash')}
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="jazzcash"
                                    ></label>
                                  </div>
                                  <div>
                                    {/* title */}
                                    <h5 className="mb-1 h6">
                                      {" "}
                                      JazzCash
                                    </h5>
                                    <p className="mb-0 small">
                                      Pay securely using your JazzCash account.
                                      You will be redirected to complete your purchase.
                                    </p>
                                  </div>
                                </div>
                                {paymentMethod === 'jazzcash' && (
                                  <div className="mt-3">
                                    <label htmlFor="jazzcashAccountNumber" className="form-label small">
                                      JazzCash Mobile Number <span className="text-danger">*</span>
                                    </label>
                                    <input
                                      type="tel"
                                      className="form-control form-control-sm"
                                      id="jazzcashAccountNumber"
                                      placeholder="03XXXXXXXXX"
                                      value={jazzcashAccountNumber}
                                      onChange={(e) => {
                                        // Only allow numbers
                                        const value = e.target.value.replace(/\D/g, '');
                                        // Limit to 11 digits
                                        if (value.length <= 11) {
                                          setJazzcashAccountNumber(value);
                                        }
                                      }}
                                      maxLength={11}
                                      required
                                    />
                                    <small className="text-muted">
                                      Enter your 11-digit JazzCash mobile number (e.g., 03001234567)
                                    </small>
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* card */}
                            <div className="card card-bordered shadow-none mb-2">
                              {/* card body */}
                              <div className="card-body p-6">
                                {/* check input */}
                                <div className="d-flex">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="paymentMethod"
                                      id="easypaisa"
                                      checked={paymentMethod === 'easypaisa'}
                                      onChange={() => setPaymentMethod('easypaisa')}
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="easypaisa"
                                    ></label>
                                  </div>
                                  <div>
                                    {/* title */}
                                    <h5 className="mb-1 h6">
                                      {" "}
                                      Easy Paisa
                                    </h5>
                                    <p className="mb-0 small">
                                      Pay securely using your Easy Paisa account.
                                      You will be redirected to complete your purchase.
                                    </p>
                                  </div>
                                </div>
                                {paymentMethod === 'easypaisa' && (
                                  <div className="mt-3">
                                    <label htmlFor="easypaisaAccountNumber" className="form-label small">
                                      Easy Paisa Mobile Number <span className="text-danger">*</span>
                                    </label>
                                    <input
                                      type="tel"
                                      className="form-control form-control-sm"
                                      id="easypaisaAccountNumber"
                                      placeholder="03XXXXXXXXX"
                                      value={easypaisaAccountNumber}
                                      onChange={(e) => {
                                        // Only allow numbers
                                        const value = e.target.value.replace(/\D/g, '');
                                        // Limit to 11 digits
                                        if (value.length <= 11) {
                                          setEasypaisaAccountNumber(value);
                                        }
                                      }}
                                      maxLength={11}
                                      required
                                    />
                                    <small className="text-muted">
                                      Enter your 11-digit Easy Paisa mobile number (e.g., 03001234567)
                                    </small>
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* card */}
                            <div className="card card-bordered shadow-none">
                              <div className="card-body p-6">
                                {/* check input */}
                                <div className="d-flex">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="paymentMethod"
                                      id="cashonDelivery"
                                      checked={paymentMethod === 'cod'}
                                      onChange={() => setPaymentMethod('cod')}
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="cashonDelivery"
                                    ></label>
                                  </div>
                                  <div>
                                    {/* title */}
                                    <h5 className="mb-1 h6">
                                      {" "}
                                      Cash on Delivery
                                    </h5>
                                    <p className="mb-0 small">
                                      Pay with cash when your order is
                                      delivered.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Button */}
                            <div className="mt-5 d-flex justify-content-end">
                              <Link
                                to="#"
                                className="btn btn-outline-gray-400 text-muted"
                                data-bs-toggle="collapse"
                                data-bs-target="#flush-collapseThree"
                                aria-expanded="false"
                                aria-controls="flush-collapseThree"
                              >
                                Prev
                              </Link>
                              <Link
                                to="#"
                                className="btn btn-outline-gray-400 text-muted"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Scroll to Place Order button
                                  document.querySelector('.btn-primary.w-100')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                              >
                                View Order Summary
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-12 offset-lg-1 col-lg-4">
                  <div className="mt-4 mt-lg-0">
                    <div className="card shadow-sm">
                      <h5 className="px-6 py-4 bg-transparent mb-0">
                        Order Details
                      </h5>
                      <ul className="list-group list-group-flush">
                        {/* Dynamic cart items */}
                        {items.length > 0 ? (
                          items.map((item) => (
                            <li key={item.id} className="list-group-item px-4 py-3">
                              <div className="row align-items-center">
                                <div className="col-2 col-md-2">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="col-5 col-md-5">
                                  <h6 className="mb-0">{item.name}</h6>
                                  <span>
                                    <small className="text-muted">{item.category}</small>
                                  </span>
                                </div>
                                <div className="col-2 col-md-2 text-center text-muted">
                                  <span>{item.quantity}</span>
                                </div>
                                <div className="col-3 text-lg-end text-start text-md-end col-md-3">
                                  <span className="fw-bold">Rs {(item.price * item.quantity).toFixed(2)}</span>
                                  {item.originalPrice && (
                                    <div className="text-decoration-line-through text-muted small">
                                      Rs {(item.originalPrice * item.quantity).toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="list-group-item px-4 py-3">
                            <div className="text-center text-muted">
                              <p>Your cart is empty</p>
                            </div>
                          </li>
                        )}
                        {/* list group item */}
                        <li className="list-group-item px-4 py-3">
                          <div className="d-flex align-items-center justify-content-between   mb-2">
                            <div>Item Subtotal</div>
                            <div className="fw-bold">Rs {getTotalPrice().toFixed(2)}</div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between  ">
                            <div>
                              Service Fee{" "}
                              <i
                                className="feather-icon icon-info text-muted"
                                data-bs-toggle="tooltip"
                                title="Default tooltip"
                              />
                            </div>
                            <div className="fw-bold">Rs 0.00</div>
                          </div>
                        </li>
                        {/* list group item */}
                        <li className="list-group-item px-4 py-3">
                          <div className="d-flex align-items-center justify-content-between fw-bold">
                            <div>Subtotal</div>
                            <div>Rs {getTotalPrice().toFixed(2)}</div>
                          </div>
                        </li>
                        {tax > 0 && (
                          <li className="list-group-item px-4 py-3">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>Tax</div>
                              <div>Rs {tax.toFixed(2)}</div>
                            </div>
                          </li>
                        )}
                        {shipping > 0 && (
                          <li className="list-group-item px-4 py-3">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>Shipping</div>
                              <div>Rs {shipping.toFixed(2)}</div>
                            </div>
                          </li>
                        )}
                        <li className="list-group-item px-4 py-3">
                          <div className="d-flex align-items-center justify-content-between fw-bold fs-5">
                            <div>Total</div>
                            <div>Rs {(getTotalPrice() + tax + shipping).toFixed(2)}</div>
                          </div>
                        </li>
                      </ul>
                      {/* Place Order Button */}
                      <div className="px-4 py-4">
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          disabled={processingOrder || items.length === 0}
                          onClick={handlePlaceOrder}
                        >
                          {processingOrder ? 'Processing...' : 'Place Order'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
      <>
        <div>
          {/* Modal */}
          <div
            className="modal fade"
            id="deleteModal"
            tabIndex={-1}
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteModalLabel">
                    Delete address
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <h6>Are you sure you want to delete this address?</h6>
                  <p className="mb-6">
                    Jitu Chauhan
                    <br />
                    4450 North Avenue Oakland, <br />
                    Nebraska, United States,
                    <br />
                    402-776-1106
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-gray-400"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Modal */}
          <div
            className="modal fade"
            id="addAddressModal"
            tabIndex={-1}
            aria-labelledby="addAddressModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                {/* modal body */}
                <div className="modal-body p-6">
                  <div className="d-flex justify-content-between mb-5">
                    {/* heading */}
                    <div>
                      <h5 className="h6 mb-1" id="addAddressModalLabel">
                        New Shipping Address
                      </h5>
                      <p className="small mb-0">
                        Add new shipping address for your order delivery.
                      </p>
                    </div>
                    <div>
                      {/* button */}
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                  </div>
                  {/* row */}
                  <div className="row g-3">
                    {/* col */}
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        aria-label="First name"
                        required
                      />
                    </div>
                    {/* col */}
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Last name"
                        aria-label="Last name"
                        required
                      />
                    </div>
                    {/* col */}
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Address Line 1"
                      />
                    </div>
                    <div className="col-12">
                      {/* button */}
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Address Line 2"
                      />
                    </div>
                    <div className="col-12">
                      {/* button */}
                      <input
                        type="text"
                        className="form-control"
                        placeholder="City"
                      />
                    </div>
                    <div className="col-12">
                      {/* button */}
                      <select className="form-select">
                        <option selected> India</option>
                        <option value={1}>UK</option>
                        <option value={2}>USA</option>
                        <option value={3}>UAE</option>
                      </select>
                    </div>
                    <div className="col-12">
                      {/* button */}
                      <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>Gujarat</option>
                        <option value={1}>Northern Ireland</option>
                        <option value={2}> Alaska</option>
                        <option value={3}>Abu Dhabi</option>
                      </select>
                    </div>
                    <div className="col-12">
                      {/* button */}
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Zip Code"
                      />
                    </div>
                    <div className="col-12">
                      {/* button */}
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Business Name"
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="flexCheckDefault"
                        />
                        {/* label */}
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Set as Default
                        </label>
                      </div>
                    </div>
                    {/* button */}
                    <div className="col-12 text-end">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button className="btn btn-primary" type="button">
                        Save Address
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </> 
      </>
   </div>
     </div>
   );
 };
 
export default ShopCheckOut;
