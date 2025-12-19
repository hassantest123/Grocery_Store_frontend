import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useCartStore from '../../store/cartStore';

const JazzCashCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const orderNumber = searchParams.get('order_number');
    const paymentStatus = searchParams.get('status');
    const message = searchParams.get('message');

    if (paymentStatus === 'success') {
      setStatus('success');
      // Clear cart when payment is successful
      clearCart();
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        text: `Your order ${orderNumber || orderId} has been confirmed.`,
        confirmButtonText: 'View Orders',
        allowOutsideClick: false,
      }).then(() => {
        navigate('/MyAccountOrder');
      });
    } else {
      setStatus('failed');
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: message || 'Your payment could not be processed. Please try again.',
        confirmButtonText: 'Go to Orders',
        allowOutsideClick: false,
      }).then(() => {
        navigate('/MyAccountOrder');
      });
    }
  }, [searchParams, navigate]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center py-5">
              {status === 'loading' && (
                <>
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Processing your payment...</p>
                </>
              )}
              {status === 'success' && (
                <>
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                  <h4 className="mt-3">Payment Successful!</h4>
                  <p className="text-muted">Redirecting to your orders...</p>
                </>
              )}
              {status === 'failed' && (
                <>
                  <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '3rem' }}></i>
                  <h4 className="mt-3">Payment Failed</h4>
                  <p className="text-muted">Please try again or contact support.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JazzCashCallback;

