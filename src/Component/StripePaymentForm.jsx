import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Initialize Stripe with publishable key
const stripePromise = loadStripe('pk_test_51SfPAQ9LGnUwngwG8P9BoBan8w00OhwcJ9FioidtsVvy5NRajHQRALirP0qGLpfJMqnRa6mm1HzFdmmd7yuc14jp00rbZuPAoY');

const CheckoutForm = ({ onStripeReady }) => {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (onStripeReady && stripe && elements) {
      onStripeReady({ stripe, elements });
    }
  }, [stripe, elements, onStripeReady]);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="mb-4">
      <label className="form-label mb-2">Card Details</label>
      <div className="border rounded p-3">
        <CardElement options={cardElementOptions} />
      </div>
    </div>
  );
};

const StripePaymentForm = ({ onStripeReady }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onStripeReady={onStripeReady} />
    </Elements>
  );
};

export default StripePaymentForm;
