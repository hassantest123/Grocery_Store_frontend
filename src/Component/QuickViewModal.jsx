import React from 'react';
import useCartStore from '../store/cartStore';
import Swal from 'sweetalert2';

const QuickViewModal = ({ product, show, onClose }) => {
  const addItem = useCartStore((state) => state.addItem);

  if (!show || !product) return null;

  const handleAddToCart = () => {
    addItem({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: product.image,
      category: product.category,
      rating: product.rating || 0,
      reviews: product.reviews_count || 0
    });
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: "Product has been added to your cart!",
      showConfirmButton: true,
      timer: 3000,
    });
    onClose();
  };

  return (
    <>
      {/* Modal */}
      {show && (
        <div 
          className="modal fade show"
          style={{ display: 'block' }}
          tabIndex="-1"
          role="dialog"
          onClick={onClose}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title">Product Quick View</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Close"
                ></button>
              </div>
            
            {/* Modal Body */}
            <div className="modal-body">
              <div className="row">
                {/* Product Image */}
                <div className="col-md-6">
                  <div className="text-center">
                    <img
                      src={product.image || '/placeholder-image.jpg'}
                      alt={product.name || 'Product'}
                      className="img-fluid rounded"
                      style={{ maxHeight: '400px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="col-md-6">
                  <div className="product-details">
                    {/* Category */}
                    {product.category && (
                      <div className="mb-2">
                        <span className="badge bg-primary">{product.category}</span>
                      </div>
                    )}
                    
                    {/* Product Name */}
                    <h3 className="mb-3">{product.name || 'Product Name'}</h3>
                    
                    {/* Rating */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center">
                        <div className="text-warning me-2">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`bi ${i < Math.floor(product.rating || 0) ? 'bi-star-fill' : 'bi-star'}`}
                            />
                          ))}
                        </div>
                        <span className="text-muted">
                          ({product.reviews_count || 0} reviews)
                        </span>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center">
                        <h4 className="text-primary mb-0 me-3">
                          Rs. {product.price?.toFixed(2) || '0.00'}
                        </h4>
                        {product.original_price && product.original_price > product.price && (
                          <>
                            <span className="text-muted text-decoration-line-through me-2">
                              Rs. {product.original_price.toFixed(2)}
                            </span>
                            {product.discount_percentage && (
                              <span className="badge bg-danger">
                                {product.discount_percentage}% OFF
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="mb-3">
                      <h6>Description</h6>
                      <p className="text-muted">
                        {product.description || 'No description available for this product.'}
                      </p>
                    </div>
                    
                    {/* Stock Status */}
                    {product.stock_quantity !== undefined && (
                      <div className="mb-3">
                        <span className={`badge ${product.stock_quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
                        </span>
                      </div>
                    )}
                    
                    {/* Label */}
                    {product.label && (
                      <div className="mb-3">
                        <span className="badge bg-info">{product.label}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              {product.stock_quantity === undefined || product.stock_quantity > 0 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  Add to Cart
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
        </div>
      )}
      
      {/* Modal Backdrop Overlay */}
      {show && (
        <div
          className="modal-backdrop fade show"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default QuickViewModal;

