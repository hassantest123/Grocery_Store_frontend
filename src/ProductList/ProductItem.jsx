import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import useCartStore from '../store/cartStore';
import homeApi from '../Model/Data/Home/Home';
import QuickViewModal from '../Component/QuickViewModal';

const ProductItem = ({ products: propProducts }) => {
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState(propProducts || []);
  const [loading, setLoading] = useState(!propProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // If products are passed as props, use them; otherwise fetch
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
      setLoading(false);
    } else if (!propProducts) {
      fetchProducts();
    }
  }, [propProducts]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await homeApi.getHomeData();
      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        setProducts(response.data.DB_DATA.Popular_Products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = (product) => {
    addItem({
      id: product._id,
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
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill" />
        ))}
        {hasHalfStar && <i className="bi bi-star-half" />}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star" />
        ))}
      </>
    );
  };

  return (
    <div>
      {/* Popular Products Start*/}
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-6">
            <div className="section-head text-center mt-8" >
              <h3 className='h3style' data-title="Popular Products">Popular Products</h3>
              <div className="wt-separator bg-primarys">
              </div>
              <div className="wt-separator2 bg-primarys">
              </div>
            </div>
            </div>
          </div>
          {loading ? (
            <div className="row">
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="row">
              <div className="col-12 text-center py-5">
                <p className="text-muted">No products available</p>
              </div>
            </div>
          ) : (
            <div className="row g-4 row-cols-lg-5 row-cols-2 row-cols-md-3">
              {products.map((product) => (
                <div key={product._id} className="col fade-zoom d-flex">
                  <div className="card card-product w-100 d-flex flex-column">
                    <div className="card-body d-flex flex-column">
                      <div className="text-center position-relative flex-shrink-0">
                        {product.label && (
                          <div className="position-absolute top-0 start-0">
                            <span className={`badge ${
                              product.label === 'Sale' ? 'bg-danger' :
                              product.label === 'Hot' ? 'bg-warning' :
                              'bg-info'
                            }`}>
                              {product.label}
                            </span>
                          </div>
                        )}
                        {product.discount_percentage && product.discount_percentage > 0 && (
                          <div className="position-absolute top-0 end-0">
                            <span className="badge bg-success">{product.discount_percentage}%</span>
                          </div>
                        )}
                        <Link to={`/Shop`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="mb-3 img-fluid"
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200';
                            }}
                          />
                        </Link>
                        <div className="card-product-action">
                          <button
                            type="button"
                            className="btn-action border-0 bg-transparent p-0"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowModal(true);
                            }}
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Quick View"
                          >
                            <i className="bi bi-eye" />
                          </button>
                          <Link
                            to="#!"
                            className="btn-action"
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Wishlist"
                          >
                            <i className="bi bi-heart" />
                          </Link>
                        </div>
                      </div>
                      <div className="text-small mb-1 flex-shrink-0">
                        <Link to={`/Shop?category=${encodeURIComponent(product.category)}`} className="text-decoration-none text-muted">
                          <small>{product.category}</small>
                        </Link>
                      </div>
                      <h2 className="fs-6 mb-2 flex-grow-0" style={{ 
                        minHeight: '48px', 
                        maxHeight: '48px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.5'
                      }}>
                        <Link
                          to={`/Shop`}
                          className="text-inherit text-decoration-none"
                          title={product.name}
                        >
                          {product.name}
                        </Link>
                      </h2>
                      <div className="flex-shrink-0 mb-2">
                        <small className="text-warning">
                          {renderStars(product.rating || 0)}
                        </small>{" "}
                        <span className="text-muted small">
                          {product.rating || 0}({product.reviews_count || 0})
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div className="d-flex flex-column">
                          <span className="text-dark">Rs {product.price}</span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-decoration-line-through text-muted small">
                              Rs {product.original_price}
                            </span>
                          )}
                        </div>
                        <div>
                          <button 
                            className="btn btn-primary btn-sm" 
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddClick(product);
                            }}
                          >
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
                              className="feather feather-plus d-none d-md-inline"
                              aria-hidden="true"
                            >
                              <line x1={12} y1={5} x2={12} y2={19} />
                              <line x1={5} y1={12} x2={19} y2={12} />
                            </svg>
                            <span className="d-md-none">Purchase</span>
                            <span className="d-none d-md-inline"> Purchase</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Popular Products End*/}
      
      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default ProductItem;
