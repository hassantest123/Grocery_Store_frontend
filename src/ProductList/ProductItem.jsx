import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import useCartStore from '../store/cartStore';
import productApi from '../Model/Data/Product/Product';
import userApi from '../Model/Data/User/User';

const ProductItem = ({ products = [] }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [ratingProducts, setRatingProducts] = useState({});
  const [productsList, setProductsList] = useState(products);
  const [favorites, setFavorites] = useState([]);
  const [togglingFavorites, setTogglingFavorites] = useState({});

  const handleAddClick = (product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: product.main_image || product.image,
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

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const jwtToken = localStorage.getItem('jwt');
      const userData = localStorage.getItem('user');

      if (jwtToken && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsLoggedIn(true);
          setUserId(parsedUser._id || parsedUser.id);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsLoggedIn(false);
          setUserId(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserId(null);
      }
    };

    // Check auth state on mount
    checkAuth();

    // Listen for custom auth state change event (for same-tab updates)
    const handleAuthStateChange = () => {
      checkAuth();
    };

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    // Add event listeners
    window.addEventListener('authStateChange', handleAuthStateChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('authStateChange', handleAuthStateChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update products list when products prop changes
  useEffect(() => {
    setProductsList(products);
  }, [products]);

  // Fetch user favorites when logged in
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn || !userId) {
        setFavorites([]);
        return;
      }

      try {
        const response = await userApi.getFavorites();
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          const favoriteIds = (response.data.DB_DATA.favorites || []).map(fav =>
            fav._id?.toString() || fav.toString()
          );
          setFavorites(favoriteIds);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [isLoggedIn, userId]);

  const handleRateProduct = async (product, ratingValue) => {
    // Check authentication before making API call
    const jwtToken = localStorage.getItem('jwt');
    const userData = localStorage.getItem('user');

    if (!jwtToken || !userData) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login to rate products',
        showConfirmButton: true,
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/MyAccountSignIn');
        }
      });
      return;
    }

    if (!product || !product._id) return;

    try {
      setRatingProducts(prev => ({ ...prev, [product._id]: true }));

      console.log('Rating product:', product._id, 'with rating:', ratingValue);
      const response = await productApi.rateProduct(product._id, ratingValue);
      console.log('Rating response:', response);

      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        const { product: updatedProduct, already_rated } = response.data.DB_DATA;

        // Update the product in the products array
        setProductsList(prevProducts =>
          prevProducts.map(p =>
            p._id === product._id
              ? { ...p, rating: updatedProduct.rating, reviews_count: updatedProduct.reviews_count }
              : p
          )
        );

        Swal.fire({
          icon: 'success',
          title: already_rated ? 'Rating Updated!' : 'Thank You!',
          text: already_rated
            ? `Your rating has been updated to ${ratingValue} stars`
            : `You rated this product ${ratingValue} star${ratingValue !== 1 ? 's' : ''}`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data?.ERROR_DESCRIPTION || 'Failed to rate product',
        });
      }
    } catch (error) {
      console.error('Error rating product:', error);
      console.error('Error response:', error.response);

      // Handle error without logging out - just show message
      if (error.response?.status === 401) {
        Swal.fire({
          icon: 'info',
          title: 'Authentication Required',
          text: error.response?.data?.ERROR_DESCRIPTION || 'Please login to rate products',
          showConfirmButton: true,
          confirmButtonText: 'Go to Login',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/MyAccountSignIn');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to rate product. Please try again.',
        });
      }
    } finally {
      setRatingProducts(prev => ({ ...prev, [product._id]: false }));
    }
  };

  const handleToggleFavorite = async (product) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login to add products to favorites',
        showConfirmButton: true,
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/MyAccountSignIn');
        }
      });
      return;
    }

    if (!product || !product._id) return;
    const productId = product._id.toString();
    const isFavorite = favorites.includes(productId);

    try {
      setTogglingFavorites(prev => ({ ...prev, [productId]: true }));

      if (isFavorite) {
        const response = await userApi.removeFromFavorites(productId);
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          setFavorites(prev => prev.filter(id => id !== productId));
          Swal.fire({
            icon: 'success',
            title: 'Removed from Favorites',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } else {
        const response = await userApi.addToFavorites(productId);
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          setFavorites(prev => [...prev, productId]);
          Swal.fire({
            icon: 'success',
            title: 'Added to Favorites',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setTogglingFavorites(prev => ({ ...prev, [productId]: false }));
    }
  };

  const renderStars = (product, rating, interactive = false) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const isRating = ratingProducts[product._id] || false;

    // Always make stars clickable if interactive is true - let handleRateProduct check auth
    if (interactive) {
      return (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <button
              key={starValue}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRateProduct(product, starValue);
              }}
              disabled={isRating}
              className={`transition-all ${starValue <= rating
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-yellow-300'
                } ${isRating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-sm`}
              title={`Rate ${starValue} star${starValue !== 1 ? 's' : ''}`}
            >
              <i className={`bi ${starValue <= rating ? 'bi-star-fill' : 'bi-star'}`} />
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 text-yellow-400 text-sm">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill" />
        ))}
        {hasHalfStar && <i className="bi bi-star-half" />}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star" />
        ))}
      </div>
    );
  };

  if (!productsList || productsList.length === 0) {
    return (
      <section className="my-8 lg:my-14">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-500">No products available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-12 lg:my-20">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Popular Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Discover our handpicked selection of fresh, organic products loved by our customers
          </p>
          <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)' }}></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {productsList.map((product) => {
            const hasDiscount = product.original_price && product.original_price > product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
              : 0;

            return (
              <div
                key={product._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 hover:-translate-y-1 flex flex-col">

                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-white">
                  <img
                    alt={product.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    src={product.main_image || product.image || 'https://via.placeholder.com/400x400'}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400';
                    }}
                  />

                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-3 left-3">
                      <span
                        className="inline-block px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ef4444 100%)' }}
                      >
                        -{discountPercent}% OFF
                      </span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <Link
                      to={`/SingleShop/${product._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-primary hover:text-white transition-all"
                      title="View Details"
                      style={{ color: '#374151' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFavorite(product);
                      }}
                      disabled={togglingFavorites[product._id]}
                      className={`bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg transition-all ${favorites.includes(product._id.toString())
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-gray-600 hover:bg-primary hover:text-white'
                        } ${togglingFavorites[product._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={favorites.includes(product._id.toString()) ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <i className={`bi ${favorites.includes(product._id.toString()) ? 'bi-heart-fill' : 'bi-heart'} text-lg`} />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 lg:p-6 flex flex-col flex-1">
                  {/* Category Badge */}
                  <Link
                    to={`/Shop?category_id=${product.category_id?._id || ''}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-block px-3 py-1 mb-3 rounded-md text-xs font-semibold transition-colors"
                    style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
                  >
                    {product.category_id?.name || product.category || 'CATEGORY'}
                  </Link>

                  {/* Product Name */}
                  <Link to={`/SingleShop/${product._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {product.name}{product.unit ? ` (${product.unit})` : ''}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(product, product.rating || 0, true)}
                    <span className="text-sm text-gray-500 font-medium">
                      ({product.reviews_count || 0})
                    </span>
                  </div>

                  {/* Spacer to push price and button to bottom */}
                  <div className="flex-1"></div>

                  {/* Price & CTA */}
                  <div className="pt-4 border-t border-gray-100">
                    {/* Price */}
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900">
                        Rs {product.price?.toFixed(2) || '0.00'}
                      </p>
                      {hasDiscount && (
                        <p className="text-sm text-gray-400 line-through mt-0.5">
                          Rs {product.original_price.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Add Button - Full Width */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddClick(product);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductItem;
