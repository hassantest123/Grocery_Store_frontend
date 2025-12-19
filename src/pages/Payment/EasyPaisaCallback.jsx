import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useCartStore from '../../store/cartStore';

const EasyPaisaCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const paymentStatus = searchParams.get('status');
    const orderIdParam = searchParams.get('order_id');
    const orderNumberParam = searchParams.get('order_number');
    const errorMessage = searchParams.get('message');

    setOrderId(orderIdParam);
    setOrderNumber(orderNumberParam);

    if (paymentStatus === 'success' && orderIdParam) {
      setStatus('success');
      setMessage('Payment successful! Your order has been confirmed.');
      // Clear cart when payment is successful
      clearCart();
      
      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        text: `Your order ${orderNumberParam || orderIdParam} has been confirmed.`,
        confirmButtonText: 'View Orders',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        navigate('/MyAccountOrder');
      });
    } else {
      setStatus('failed');
      setMessage(errorMessage || 'Payment failed. Please try again.');
      
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: errorMessage || 'Payment failed. Please try again.',
        confirmButtonText: 'Return to Cart',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        navigate('/ShopCart');
      });
    }
  }, [searchParams, navigate]);

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className={`card ${status === 'success' ? 'border-success' : 'border-danger'} shadow-sm`}>
            <div className="card-body text-center py-5">
              {status === 'loading' ? (
                <>
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h3 className="mt-3">Processing Payment...</h3>
                  <p className="text-muted">Please wait while we verify your payment.</p>
                </>
              ) : status === 'success' ? (
                <>
                  <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '4rem' }}></i>
                  <h3 className="mt-3 text-success">Payment Successful!</h3>
                  {orderNumber && (
                    <p className="text-muted">Order Number: <strong>{orderNumber}</strong></p>
                  )}
                  <p className="text-muted">Redirecting to your orders...</p>
                </>
              ) : (
                <>
                  <i className="fas fa-times-circle text-danger mb-3" style={{ fontSize: '4rem' }}></i>
                  <h3 className="mt-3 text-danger">Payment Failed</h3>
                  <p className="text-muted">{message}</p>
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/ShopCart')}
                  >
                    Return to Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EasyPaisaCallback;

