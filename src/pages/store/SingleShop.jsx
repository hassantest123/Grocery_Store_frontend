import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import productApi from "../../Model/Data/Product/Product";
import useCartStore from "../../store/cartStore";
import userApi from "../../Model/Data/User/User";
import Swal from 'sweetalert2';

const SingleShop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(null);
  const [isRating, setIsRating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // null = main product, or index of additional item

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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getProductById(id);
        
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          const productData = response.data.DB_DATA;
          setProduct(productData);
          
          // Check if user has already rated this product
          if (userId && productData.ratings && productData.ratings.length > 0) {
            const userRatingData = productData.ratings.find((r) => {
              if (!r.user_id) return false;
              // Handle both populated and non-populated user_id
              const ratingUserId = r.user_id._id?.toString() || r.user_id.toString();
              return ratingUserId === userId.toString();
            });
            if (userRatingData) {
              setUserRating(userRatingData.rating);
            }
          }

          // Check if product is in favorites
          if (userId) {
            checkFavoriteStatus(productData._id);
          }
        } else {
          setError(response.data.ERROR_DESCRIPTION || "Product not found");
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.response?.data?.ERROR_DESCRIPTION || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, userId]);

  // Get the currently displayed item (main product or selected additional item)
  const getCurrentItem = () => {
    if (!product) return null;
    
    if (selectedItem !== null && product.additional_items && product.additional_items[selectedItem]) {
      const item = product.additional_items[selectedItem];
      return {
        id: item._id || `additional_${product._id}_${selectedItem}`,
        name: item.name,
        price: item.price,
        originalPrice: item.original_price,
        image: item.image,
        stock_quantity: item.stock_quantity,
        descriptions: item.descriptions || null,
        category: product.category_id?.name || product.category,
        rating: 0,
        reviews: 0
      };
    }
    
    return {
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: product.main_image || product.image,
      stock_quantity: product.stock_quantity,
      descriptions: product.descriptions || null,
      category: product.category_id?.name || product.category,
      rating: product.rating || 0,
      reviews: product.reviews_count || 0
    };
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const currentItem = getCurrentItem();
    if (!currentItem) return;

    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: currentItem.id,
        name: currentItem.name,
        price: currentItem.price,
        originalPrice: currentItem.originalPrice,
        image: currentItem.image,
        category: currentItem.category,
        rating: currentItem.rating,
        reviews: currentItem.reviews
      });
    }

    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart!`,
      showConfirmButton: true,
      timer: 3000,
    });
  };

  const handleSelectAdditionalItem = (index) => {
    setSelectedItem(index);
    setQuantity(1); // Reset quantity when switching items
  };

  const handleSelectMainProduct = () => {
    setSelectedItem(null);
    setQuantity(1); // Reset quantity when switching items
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    if (interactive && onStarClick) {
      return (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <button
              key={starValue}
              type="button"
              onClick={() => onStarClick(starValue)}
              disabled={isRating}
              className={`transition-all ${
                starValue <= rating
                  ? 'text-yellow-400 hover:text-yellow-500'
                  : 'text-gray-300 hover:text-yellow-300'
              } ${isRating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-2xl`}
              title={`Rate ${starValue} star${starValue !== 1 ? 's' : ''}`}
            >
              <i className={`bi ${starValue <= rating ? 'bi-star-fill' : 'bi-star'}`} />
            </button>
          ))}
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill text-yellow-400" />
        ))}
        {hasHalfStar && <i className="bi bi-star-half text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star text-yellow-400" />
        ))}
      </div>
    );
  };

  const handleRateProduct = async (ratingValue) => {
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

    if (!product || !id) return;

    try {
      setIsRating(true);
      console.log('Rating product:', id, 'with rating:', ratingValue);
      const response = await productApi.rateProduct(id, ratingValue);
      console.log('Rating response:', response);
      
      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        const { product: updatedProduct, user_rating, already_rated } = response.data.DB_DATA;
        
        // Update product state
        setProduct(updatedProduct);
        setUserRating(user_rating);
        
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
      setIsRating(false);
    }
  };

  const checkFavoriteStatus = async (productId) => {
    if (!userId) return;
    
    try {
      const response = await userApi.getFavorites();
      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        const favorites = response.data.DB_DATA.favorites || [];
        const isFav = favorites.some(fav => fav._id === productId || fav.toString() === productId);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async () => {
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

    if (!product || !product._id || isTogglingFavorite) return;

    try {
      setIsTogglingFavorite(true);
      
      if (isFavorite) {
        // Remove from favorites
        const response = await userApi.removeFromFavorites(product._id);
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          setIsFavorite(false);
          Swal.fire({
            icon: 'success',
            title: 'Removed from Favorites',
            text: 'Product has been removed from your favorites',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data?.ERROR_DESCRIPTION || 'Failed to remove from favorites',
          });
        }
      } else {
        // Add to favorites
        const response = await userApi.addToFavorites(product._id);
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          setIsFavorite(true);
          Swal.fire({
            icon: 'success',
            title: 'Added to Favorites',
            text: 'Product has been added to your favorites',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data?.ERROR_DESCRIPTION || 'Failed to add to favorites',
          });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to update favorites',
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 99)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <MagnifyingGlass
          visible={true}
          height="100"
          width="100"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperclassName="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#0aad0a"
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Link
            to="/Shop"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const currentItem = getCurrentItem();
  const discountPercentage = currentItem?.originalPrice && currentItem.originalPrice > currentItem.price
    ? Math.round(((currentItem.originalPrice - currentItem.price) / currentItem.originalPrice) * 100)
    : 0;

  return (
    <div>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        {/* Product Details */}
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image */}
              <div className="flex flex-col">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {currentItem?.originalPrice && currentItem.originalPrice > currentItem.price && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                  {product.label && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {product.label}
                      </span>
                    </div>
                  )}
                  <img
                    src={currentItem?.image || 'https://via.placeholder.com/600'}
                    alt={currentItem?.name || product.name}
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: '600px' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600';
                    }}
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                {/* Category */}
                {product.category_id && (
                  <Link
                    to={`/Shop?category_id=${product.category_id._id}`}
                    className="text-primary hover:text-primary-dark transition-colors text-sm font-medium mb-2"
                  >
                    {product.category_id.name}
                  </Link>
                )}

                {/* Product Name */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {currentItem?.name || product.name}{product.unit ? ` (${product.unit})` : ''}
                </h1>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      Rs {currentItem?.price?.toFixed(2) || '0.00'}
                    </span>
                    {currentItem?.originalPrice && currentItem.originalPrice > currentItem.price && (
                      <span className="text-xl text-gray-500 line-through">
                        Rs {currentItem.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                {currentItem?.stock_quantity !== undefined && (
                  <div className="mb-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      currentItem.stock_quantity > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currentItem.stock_quantity > 0
                        ? `In Stock (${currentItem.stock_quantity} available)`
                        : 'Out of Stock'}
                    </span>
                  </div>
                )}

                {/* Description - Only show for main product, not for additional items */}
                {product.description && selectedItem === null && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Descriptions (Item-specific) */}
                {currentItem?.descriptions && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Item Details</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {currentItem.descriptions}
                    </p>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 bg-gray-100 text-gray-700 border-0 text-center cursor-pointer hover:bg-gray-200 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={currentItem?.stock_quantity || 99}
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          const max = currentItem?.stock_quantity || 99;
                          setQuantity(Math.min(Math.max(1, val), max));
                        }}
                        className="w-16 h-10 text-center border-0 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= (currentItem?.stock_quantity || 99)}
                        className="w-10 h-10 bg-gray-100 text-gray-700 border-0 text-center cursor-pointer hover:bg-gray-200 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {currentItem?.stock_quantity ? `Max: ${currentItem.stock_quantity}` : ''}
                    </span>
                  </div>
                </div>

                {/* Additional Items List */}
                {product.additional_items && product.additional_items.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Items
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleSelectMainProduct}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors whitespace-nowrap ${
                          selectedItem === null
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-gray-50'
                        }`}
                      >
                        {product.name}
                      </button>
                      {product.additional_items.map((item, index) => (
                        <button
                          key={item._id || index}
                          type="button"
                          onClick={() => handleSelectAdditionalItem(index)}
                          className={`px-4 py-2 rounded-lg border-2 transition-colors whitespace-nowrap ${
                            selectedItem === index
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-gray-50'
                          }`}
                        >
                          {item.name || `Item ${index + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={currentItem?.stock_quantity === 0}
                    className="flex-1 bg-primary text-white px-6 py-4 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    disabled={isTogglingFavorite}
                    className={`px-6 py-4 border-2 rounded-lg transition-colors font-semibold ${
                      isFavorite
                        ? 'bg-primary border-primary text-white hover:bg-primary-dark'
                        : 'border-primary text-primary hover:bg-primary hover:text-white'
                    } ${isTogglingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} text-xl`} />
                  </button>
                </div>

                {/* Additional Info */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <i className="bi bi-truck text-primary text-xl" />
                      <span className="text-gray-600">Free shipping on orders above Rs 100</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="bi bi-arrow-repeat text-primary text-xl" />
                      <span className="text-gray-600">Easy returns within 7 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="bi bi-shield-check text-primary text-xl" />
                      <span className="text-gray-600">Secure payment options</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleShop;
