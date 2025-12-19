import React, { useState } from 'react';
import axios from 'axios';
import { BaseUri } from '../Model/BaseUri';
import Swal from 'sweetalert2';

const EasyPaisaPayment = ({ orderId, onPaymentInitiated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('jwt') || localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Please login to continue');
      }

      const response = await axios.post(
        `${BaseUri}/api/v1/easypaisa/payment`,
        { order_id: orderId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.STATUS === 'SUCCESSFUL') {
        const { payment_form_data, payment_url } = response.data.DB_DATA;
        
        // Callback for parent component
        if (onPaymentInitiated) {
          onPaymentInitiated();
        }

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
      } else {
        setError(response.data.ERROR_DESCRIPTION || 'Failed to initiate payment');
        Swal.fire({
          icon: 'error',
          title: 'Payment Error',
          text: response.data.ERROR_DESCRIPTION || 'Failed to initiate payment',
        });
      }
    } catch (err) {
      console.error('Easy Paisa payment error:', err);
      const errorMessage = err.response?.data?.ERROR_DESCRIPTION || err.message || 'Payment initiation failed';
      setError(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="easypaisa-payment mt-3">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <button
        className="btn btn-primary w-100"
        onClick={initiatePayment}
        disabled={loading || !orderId}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Processing...
          </>
        ) : (
          'Pay with Easy Paisa'
        )}
      </button>
      
      <p className="text-muted small mt-2 mb-0">
        You will be redirected to Easy Paisa to complete your payment securely.
      </p>
    </div>
  );
};

export default EasyPaisaPayment;

