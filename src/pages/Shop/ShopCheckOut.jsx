import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import productimage1 from '../../images/product-img-1.jpg'
import productimage2 from '../../images/product-img-2.jpg'
import productimage3 from '../../images/product-img-3.jpg'
import productimage4 from '../../images/product-img-4.jpg'
import ScrollToTop from "../ScrollToTop";
import useCartStore from "../../store/cartStore";
import StripePaymentForm from "../../Component/StripePaymentForm";
import LocationPickerModal from "../../Component/LocationPickerModal";
import Swal from "sweetalert2";
import orderApi from "../../Model/Data/Order/Order";
import paymentApi from "../../Model/Data/Payment/Payment";
import uploadApi from "../../Model/Data/Upload/Upload";
import { loadStripe } from '@stripe/stripe-js';
import { CardElement } from '@stripe/react-stripe-js';

const ShopCheckOut = () => {
   const navigate = useNavigate();
   const items = useCartStore((state) => state.items);
   const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Changed default from 'stripe' to 'cod' since stripe is commented out
  const [tax, setTax] = useState(0);
   const [shipping, setShipping] = useState(100);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [stripeInstance, setStripeInstance] = useState(null);
  const [stripeElements, setStripeElements] = useState(null);
  const [jazzcashAccountNumber, setJazzcashAccountNumber] = useState('');
  const [easypaisaPaymentProof, setEasypaisaPaymentProof] = useState(null);
  const [easypaisaPaymentProofPreview, setEasypaisaPaymentProofPreview] = useState(null);
  const [uploadingPaymentProof, setUploadingPaymentProof] = useState(false);
  // Editable shipping address fields
  const [shippingName, setShippingName] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingLatitude, setShippingLatitude] = useState(null);
  const [shippingLongitude, setShippingLongitude] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);
   
   // Check authentication on component mount and get user data
   useEffect(() => {
     // Check for JWT token in localStorage
     const jwtToken = localStorage.getItem('jwt') || localStorage.getItem('token') || localStorage.getItem('authToken');
     
     if (jwtToken) {
       // User is logged in - get user data from localStorage
       const userData = localStorage.getItem('user');
       if (userData) {
         try {
           const parsedUser = JSON.parse(userData);
           setUser(parsedUser);
           // Initialize shipping address fields with user data
           setShippingName(parsedUser.name || '');
           setShippingEmail(parsedUser.email || '');
           setShippingPhone(parsedUser.phone || '');
           setShippingAddress(parsedUser.address || '');
         } catch (error) {
           console.error('Error parsing user data:', error);
         }
       }
     } else {
       // Guest checkout - user is not logged in
       // Don't redirect, allow guest checkout
       setUser(null);
       // Clear shipping fields for guest to fill manually
       setShippingName('');
       setShippingEmail('');
       setShippingPhone('');
       setShippingAddress('');
     }
   }, [navigate]);

  // Handle Place Order
  const handlePlaceOrder = async () => {
    const isGuest = !user; // Check if user is logged in

    // Validation - Shipping address
    // For guest orders: name, phone, address are required
    // For logged-in users: name, email, phone, address are required
    if (!shippingName || shippingName.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Name Required',
        text: 'Please enter your full name for delivery.',
      });
      return;
    }

    if (!isGuest) {
      // For logged-in users, email is required
      if (!shippingEmail || shippingEmail.trim() === '') {
        Swal.fire({
          icon: 'warning',
          title: 'Email Required',
          text: 'Please enter your email address for delivery.',
        });
        return;
      }

      // Validate email format
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(shippingEmail.trim())) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Email',
          text: 'Please enter a valid email address.',
        });
        return;
      }
    }

    if (!shippingAddress || shippingAddress.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Address Required',
        text: 'Please enter your delivery address.',
      });
      return;
    }

    if (!shippingPhone || shippingPhone.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Phone Number Required',
        text: 'Please enter your phone number for delivery.',
      });
      return;
    }

    // Validate phone format (Pakistani format: 11 digits starting with 03)
    const phone_regex = /^03\d{9}$/;
    const normalized_shipping_phone = shippingPhone.trim().replace(/[\s-]/g, '');
    if (!phone_regex.test(normalized_shipping_phone)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Phone Number',
        text: 'Phone number must be in Pakistani format: 11 digits starting with 03 (e.g., 030xxxxxxxxxxx)',
      });
      return;
    }

    // Validation - Payment method
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

    // Validate Easy Paisa payment proof
    if (paymentMethod === 'easypaisa') {
      // Validate payment proof
      if (!easypaisaPaymentProof) {
        Swal.fire({
          icon: 'warning',
          title: 'Payment Proof Required',
          text: 'Please upload a screenshot of your Easy Paisa payment confirmation.',
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

    // Guest checkout is allowed - no need to check for user
    // If user is null, it's a guest order which is supported

    // Validate minimum order amount (Rs 200)
    const totalAmount = getTotalPrice() + tax + shipping;
    const MINIMUM_ORDER_AMOUNT = 200;
    
    if (totalAmount < MINIMUM_ORDER_AMOUNT) {
      Swal.fire({
        icon: 'error',
        title: 'Minimum Order Amount Required',
        text: `Minimum order amount is Rs ${MINIMUM_ORDER_AMOUNT}. Your order total is Rs ${totalAmount.toFixed(2)}. Please add more items to your cart.`,
      });
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
      // Upload payment proof for Easy Paisa if provided
      let paymentProofUrl = null;
      if (paymentMethod === 'easypaisa' && easypaisaPaymentProof) {
        try {
          setUploadingPaymentProof(true);
          const uploadResponse = await uploadApi.uploadImage(easypaisaPaymentProof, 'payment_proofs');
          if (uploadResponse?.data?.STATUS === 'SUCCESSFUL') {
            paymentProofUrl = uploadResponse.data.DB_DATA.url;
          } else {
            throw new Error(uploadResponse?.data?.ERROR_DESCRIPTION || 'Failed to upload payment proof');
          }
        } catch (uploadError) {
          console.error('Error uploading payment proof:', uploadError);
          Swal.fire({
            icon: 'error',
            title: 'Upload Error',
            text: uploadError.response?.data?.ERROR_DESCRIPTION || 'Failed to upload payment proof. Please try again.',
          });
          setProcessingOrder(false);
          setUploadingPaymentProof(false);
          return;
        } finally {
          setUploadingPaymentProof(false);
        }
      }

      // Prepare shipping address (use normalized phone from validation above)
      const shippingAddressData = {
        name: shippingName.trim(),
        phone: normalized_shipping_phone, // Use normalized phone from validation
        address: shippingAddress.trim(),
      };

      // Add latitude and longitude if available
      if (shippingLatitude !== null && shippingLongitude !== null) {
        shippingAddressData.latitude = shippingLatitude;
        shippingAddressData.longitude = shippingLongitude;
      }

      // Add email only if user is logged in (for logged-in users)
      if (!isGuest) {
        shippingAddressData.email = shippingEmail.trim();
      } else {
        // For guest orders, email is optional - use a placeholder or empty
        shippingAddressData.email = shippingEmail.trim() || `${normalized_shipping_phone}@guest.com`;
      }

      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shipping_address: shippingAddressData,
        payment_method: paymentMethod,
        payment_account_number: paymentMethod === 'jazzcash' ? jazzcashAccountNumber.trim() : 
                                paymentMethod === 'easypaisa' ? '03001244672' : null,
        payment_proof: paymentProofUrl,
        tax: tax,
        shipping: shipping,
      };

      // For guest orders, explicitly set user_id to null
      if (isGuest) {
        orderData.user_id = null;
      }
      // For logged-in users, don't send user_id - backend will get it from token

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
        // Use shipping address data (works for both logged-in and guest users)
        const { error, paymentIntent } = await stripeInstance.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: shippingName.trim(),
                email: shippingEmail.trim() || (isGuest ? `${shippingPhone.trim()}@guest.com` : ''),
                phone: shippingPhone.trim() || '',
                address: {
                  line1: shippingAddress.trim() || '123 Main Street',
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
        // Easy Paisa payment - order created with payment proof
        // Payment will be verified manually by admin
        // No redirect needed, order is already created with payment proof
        // Show success message with pending verification note
        clearCart();
        Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully!',
          html: `
            <p>Your order <strong>${order.order_number}</strong> has been placed successfully.</p>
            <p class="mt-2 text-sm text-gray-600">Your payment proof has been uploaded. Your order will be processed once payment is verified.</p>
          `,
          confirmButtonText: isGuest ? 'Continue Shopping' : 'View Orders'
        }).then(() => {
          if (isGuest) {
            navigate('/');
          } else {
            navigate('/MyAccountOrder');
          }
        });
        setProcessingOrder(false);
        return; // Exit early, success already shown
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
        confirmButtonText: isGuest ? 'Continue Shopping' : 'View Orders'
      }).then(() => {
        if (isGuest) {
          navigate('/');
        } else {
          navigate('/MyAccountOrder');
        }
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
            <section className="mb-8 lg:mb-14 mt-8">
              <div className="container mx-auto px-4">
                {/* Headings Row */}
                <div className="flex flex-wrap items-center justify-between mb-6 -mx-4">
                  <div className="px-4">
                    <h1 className="font-bold mb-0 text-3xl">Checkout</h1>
                  </div>
                  <div className="px-4">
                    <h5 className="font-semibold text-lg mb-0">Order Details</h5>
                </div>
                </div>
                {/* Content Row */}
                <div className="flex flex-col lg:flex-row items-start gap-6 -mx-4">
                  {/* Left Column - Checkout */}
                  <div className="w-full lg:w-7/12 px-4 flex-shrink-0">
                  <div className="space-y-4">
                    {/* Delivery Address Section */}
                    <div className="py-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xl text-gray-900">
                          <i className="feather-icon icon-map-pin mr-2 text-gray-500" />
                          Delivery Address
                        </h4>
                      </div>
                      <div className="mt-5">
                        <div className="w-full">
                          <div className="border border-gray-200 p-6 rounded-xl">
                            <div className="mb-3">
                              <label className="text-gray-900 font-bold">
                                Delivery Address
                              </label>
                            </div>
                            {/* Editable address form */}
                            <div className="space-y-4">
                              <div className="w-full">
                                <label htmlFor="shippingName" className="block text-sm font-medium text-gray-700 mb-1">
                                  Full Name <span className="text-red-500">*</span>
                                </label>
                                {user ? (
                                  <p className="text-gray-900 font-medium">{shippingName}</p>
                                ) : (
                                  <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    id="shippingName"
                                    placeholder="Enter your full name"
                                    value={shippingName}
                                    onChange={(e) => setShippingName(e.target.value)}
                                    required
                                  />
                                )}
                              </div>
                              {user && (
                                <div className="w-full">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                  </label>
                                  <p className="text-gray-900 font-medium">{shippingEmail}</p>
                                </div>
                              )}
                              <div className="w-full">
                                <label htmlFor="shippingPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                  Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="tel"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                  id="shippingPhone"
                                  placeholder="Phone Number (e.g., 030xxxxxxxxxxx)"
                                  value={shippingPhone}
                                  onChange={(e) => {
                                    // Only allow numbers
                                    const value = e.target.value.replace(/\D/g, '');
                                    // Limit to 11 digits
                                    if (value.length <= 11) {
                                      setShippingPhone(value);
                                    }
                                  }}
                                  maxLength={11}
                                  required
                                />
                                <small className="text-gray-500 text-xs mt-1 block">
                                  Format: 11 digits starting with 03 (e.g., 030xxxxxxxxxxx)
                                </small>
                              </div>
                              <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Address <span className="text-red-500">*</span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setIsLocationModalOpen(true)}
                                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 font-medium text-gray-700 hover:text-primary"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {shippingAddress ? 'Change Location' : 'Choose Location on Map'}
                                </button>
                                {shippingAddress && (
                                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-start gap-2">
                                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-green-900 mb-1">Selected Location:</p>
                                        <p className="text-sm text-green-800 mb-2">{shippingAddress}</p>
                                        {shippingLatitude !== null && shippingLongitude !== null && (
                                          <div className="mt-2 pt-2 border-t border-green-300">
                                            <p className="text-xs font-semibold text-green-900 mb-1">Coordinates (Lat, Long):</p>
                                            <p className="text-xs text-green-700 font-mono">
                                              {shippingLatitude.toFixed(6)}, {shippingLongitude.toFixed(6)}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {!shippingAddress && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    Click the button above to select your delivery location on the map
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Payment Method Section */}
                    <div className="py-4">
                      <div className="text-gray-900 text-lg font-semibold mb-5">
                        <i className="feather-icon icon-credit-card mr-2 text-gray-500" />
                        Payment Method
                      </div>
                      <div className="mt-5">
                        <div>
                            {/* Credit / Debit Card payment option - Commented out for now, will be used later */}
                            {/* 
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-2">
                              <div className="p-6">
                                <div className="flex items-start mb-4">
                                  <div className="flex items-center h-5 mt-1">
                                    <input
                                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                      type="radio"
                                      name="paymentMethod"
                                      id="creditdebitcard"
                                      checked={paymentMethod === 'stripe'}
                                      onChange={() => {
                                        setPaymentMethod('stripe');
                                        // Clear Easy Paisa fields when switching
                                        setEasypaisaPaymentProof(null);
                                        setEasypaisaPaymentProofPreview(null);
                                      }}
                                    />
                                    <label
                                      className="ml-2"
                                      htmlFor="creditdebitcard"
                                    ></label>
                                  </div>
                                  <div className="ml-3">
                                    <h5 className="mb-1 text-base font-semibold">
                                      Credit / Debit Card
                                    </h5>
                                    <p className="mb-0 text-sm text-gray-600">
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
                            */}
                            {/* JazzCash payment option - Commented out for now, will be used later */}
                            {/* 
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-2">
                              <div className="p-6">
                                <div className="flex items-start">
                                  <div className="flex items-center h-5 mt-1">
                                    <input
                                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                      type="radio"
                                      name="paymentMethod"
                                      id="jazzcash"
                                      checked={paymentMethod === 'jazzcash'}
                                      onChange={() => {
                                        setPaymentMethod('jazzcash');
                                        // Clear Easy Paisa fields when switching
                                        setEasypaisaPaymentProof(null);
                                        setEasypaisaPaymentProofPreview(null);
                                      }}
                                    />
                                    <label
                                      className="ml-2"
                                      htmlFor="jazzcash"
                                    ></label>
                                  </div>
                                  <div className="ml-3">
                                    <h5 className="mb-1 text-base font-semibold">
                                      JazzCash
                                    </h5>
                                    <p className="mb-0 text-sm text-gray-600">
                                      Pay securely using your JazzCash account.
                                      You will be redirected to complete your purchase.
                                    </p>
                                  </div>
                                </div>
                                {paymentMethod === 'jazzcash' && (
                                  <div className="mt-3">
                                    <label htmlFor="jazzcashAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                      JazzCash Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="tel"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                                    <small className="text-gray-500 text-xs mt-1 block">
                                      Enter your 11-digit JazzCash mobile number (e.g., 030xxxxxxxxxxx)
                                    </small>
                                  </div>
                                )}
                              </div>
                            </div>
                            */}
                            {/* Easy Paisa payment option */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-2">
                              <div className="p-6">
                                <div className="flex items-start">
                                  <div className="flex items-center h-5 mt-1">
                                    <input
                                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                      type="radio"
                                      name="paymentMethod"
                                      id="easypaisa"
                                      checked={paymentMethod === 'easypaisa'}
                                      onChange={() => {
                                        setPaymentMethod('easypaisa');
                                        // Clear payment proof when switching away and back
                                        if (paymentMethod !== 'easypaisa') {
                                          setEasypaisaPaymentProof(null);
                                          setEasypaisaPaymentProofPreview(null);
                                        }
                                      }}
                                    />
                                    <label
                                      className="ml-2"
                                      htmlFor="easypaisa"
                                    ></label>
                                  </div>
                                  <div className="ml-3">
                                    <h5 className="mb-1 text-base font-semibold">
                                      Easy Paisa
                                    </h5>
                                    <p className="mb-0 text-sm text-gray-600">
                                      Pay using your Easy Paisa account. Please upload a screenshot of your payment confirmation.
                                    </p>
                                  </div>
                                </div>
                                {paymentMethod === 'easypaisa' && (
                                  <div className="mt-4 space-y-3">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                      <p className="text-sm font-medium text-gray-900 mb-2">
                                        Send payment to this Easy Paisa number:
                                      </p>
                                      <p className="text-2xl font-bold text-primary">
                                        03001244672
                                      </p>
                                      <p className="text-xs text-gray-600 mt-2">
                                        After sending money, please upload a screenshot of your payment confirmation below.
                                      </p>
                                    </div>
                                    <div>
                                      <label htmlFor="easypaisaPaymentProof" className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Proof (Screenshot) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        id="easypaisaPaymentProof"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                      onChange={(e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            setEasypaisaPaymentProof(file);
                                            // Create preview
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                              setEasypaisaPaymentProofPreview(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                      }}
                                      required
                                    />
                                    <small className="text-gray-500 text-xs mt-1 block">
                                        Upload a screenshot of your Easy Paisa payment confirmation (JPEG, PNG, GIF, WebP - Max 5MB)
                                    </small>
                                      {easypaisaPaymentProofPreview && (
                                        <div className="mt-2">
                                          <img
                                            src={easypaisaPaymentProofPreview}
                                            alt="Payment proof preview"
                                            className="max-w-xs h-32 object-contain border border-gray-300 rounded-lg"
                                          />
                                          <button
                                            type="button"
                                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                                            onClick={() => {
                                              setEasypaisaPaymentProof(null);
                                              setEasypaisaPaymentProofPreview(null);
                                            }}
                                          >
                                            Remove
                                          </button>
                                  </div>
                                )}
                              </div>
                            </div>
                                )}
                              </div>
                            </div>
                            {/* Cash on Delivery Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                              <div className="p-6">
                                <div className="flex items-start">
                                  <div className="flex items-center h-5 mt-1">
                                    <input
                                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                      type="radio"
                                      name="paymentMethod"
                                      id="cashonDelivery"
                                      checked={paymentMethod === 'cod'}
                                      onChange={() => {
                                        setPaymentMethod('cod');
                                        // Clear Easy Paisa fields when switching
                                        setEasypaisaPaymentProof(null);
                                        setEasypaisaPaymentProofPreview(null);
                                      }}
                                    />
                                  </div>
                                  <div className="ml-3">
                                    <h5 className="mb-1 text-base font-semibold">
                                      Cash on Delivery
                                    </h5>
                                    <p className="mb-0 text-sm text-gray-600">
                                      Pay with cash when your order is
                                      delivered.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right Column - Order Details */}
                  <div className="w-full lg:w-5/12 px-4 lg:sticky lg:top-24 flex-shrink-0">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="divide-y divide-gray-200">
                      {/* Dynamic cart items */}
                      {items.length > 0 ? (
                        items.map((item) => (
                          <div key={item.id} className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-16 flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-auto object-contain rounded"
                                />
                              </div>
                              <div className="flex-1 ml-4">
                                <h6 className="mb-0 font-semibold">{item.name}</h6>
                                <span className="block">
                                  <small className="text-gray-500">{item.category}</small>
                                </span>
                              </div>
                              <div className="text-center text-gray-500 w-12">
                                <span>{item.quantity}</span>
                              </div>
                              <div className="text-right w-24">
                                <span className="font-bold">Rs {(item.price * item.quantity).toFixed(2)}</span>
                                {item.originalPrice && (
                                  <div className="line-through text-gray-500 text-sm">
                                    Rs {(item.originalPrice * item.quantity).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3">
                          <div className="text-center text-gray-500">
                            <p>Your cart is empty</p>
                          </div>
                        </div>
                      )}
                      {/* Order Summary Items */}
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                          <div>Item Subtotal</div>
                          <div className="font-bold">Rs {getTotalPrice().toFixed(2)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            Service Fee{" "}
                            <i
                              className="feather-icon icon-info text-gray-500 ml-1"
                              title="Default tooltip"
                            />
                          </div>
                          <div className="font-bold">Rs 0.00</div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div>Delivery Fee</div>
                          <div>Rs {shipping.toFixed(2)}</div>
                        </div>
                      </div>
                      {tax > 0 && (
                        <div className="px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div>Tax</div>
                            <div>Rs {tax.toFixed(2)}</div>
                          </div>
                        </div>
                      )}
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between font-bold">
                          <div>Subtotal</div>
                          <div>Rs {(getTotalPrice() + shipping).toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between font-bold text-xl">
                          <div>Total</div>
                          <div>Rs {(getTotalPrice() + tax + shipping).toFixed(2)}</div>
                        </div>
                        </div>
                      </div>
                    </div>
                    {/* Place Order Button */}
                    <div className="px-4 py-4">
                      <button
                        type="button"
                        className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={processingOrder || items.length === 0}
                        onClick={handlePlaceOrder}
                      >
                        {processingOrder ? 'Processing...' : 'Place Order'}
                      </button>
                  </div>
                  </div>
                </div>
              </div>
            </section>
          </>
          <>
            <div>
          {/* Modal - Delete Address (Hidden by default, can be shown with state) */}
          <div
            className="hidden"
            id="deleteModal"
            tabIndex={-1}
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h5 className="text-lg font-semibold" id="deleteModalLabel">
                    Delete address
                  </h5>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <h6 className="font-semibold mb-4">Are you sure you want to delete this address?</h6>
                  <p className="mb-6 text-gray-600">
                    Jitu Chauhan
                    <br />
                    4450 North Avenue Oakland, <br />
                    Nebraska, United States,
                    <br />
                    402-776-1106
                  </p>
                </div>
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button type="button" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Modal - Add Address (Hidden by default, can be shown with state) */}
          <div
            className="hidden"
            id="addAddressModal"
            tabIndex={-1}
            aria-labelledby="addAddressModalLabel"
            aria-hidden="true"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h5 className="text-lg font-semibold mb-1" id="addAddressModalLabel">
                        New Shipping Address
                      </h5>
                      <p className="text-sm text-gray-600 mb-0">
                        Add new shipping address for your order delivery.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Close"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="w-full">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="First name"
                        aria-label="First name"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Last name"
                        aria-label="Last name"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Address Line 1"
                      />
                    </div>
                    <div className="w-full">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Address Line 2"
                      />
                    </div>
                    <div className="w-full">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="City"
                      />
                    </div>
                    <div className="w-full">
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                        <option selected> India</option>
                        <option value={1}>UK</option>
                        <option value={2}>USA</option>
                        <option value={3}>UAE</option>
                      </select>
                    </div>
                    <div className="w-full">
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Default select example"
                      >
                        <option selected>Gujarat</option>
                        <option value={1}>Northern Ireland</option>
                        <option value={2}> Alaska</option>
                        <option value={3}>Abu Dhabi</option>
                      </select>
                    </div>
                    <div className="w-full">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Zip Code"
                      />
                    </div>
                    <div className="w-full">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Business Name"
                      />
                    </div>
                    <div className="w-full">
                      <div className="flex items-center">
                        <input
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          type="checkbox"
                          defaultValue
                          id="flexCheckDefault"
                        />
                        <label
                          className="ml-2 text-sm text-gray-700"
                          htmlFor="flexCheckDefault"
                        >
                          Set as Default
                        </label>
                      </div>
                    </div>
                    <div className="w-full flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors" type="button">
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
      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelect={(location) => {
          // Save address to state
          setShippingAddress(location.address);
          // Save coordinates separately
          setShippingLatitude(location.latitude);
          setShippingLongitude(location.longitude);
          
          // Close modal
          setIsLocationModalOpen(false);
          
          // Show success message confirming address was saved
          Swal.fire({
            icon: 'success',
            title: 'Location Saved!',
            html: `
              <p>Your delivery location has been saved to address.</p>
              <p class="text-sm text-gray-600 mt-2">${location.address}</p>
              <p class="text-xs text-gray-500 mt-1">Coordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}</p>
            `,
            timer: 3000,
            showConfirmButton: true,
            confirmButtonText: 'OK'
          });
        }}
        initialAddress={shippingAddress}
      />
   </div>
     </div>
   );
 };
 
export default ShopCheckOut;
