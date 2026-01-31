import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import userApi from "../../Model/Data/User/User";
import Swal from "sweetalert2";
import useCartStore from "../../store/cartStore";

const MyAccountFavorites = () => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch favorites on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        if (!jwtToken) {
          navigate("/MyAccountSignIn");
          return;
        }

        setLoading(true);
        setError(null);
        const response = await userApi.getFavorites();

        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          setFavorites(response.data.DB_DATA.favorites || []);
        } else {
          setError(response.data?.ERROR_DESCRIPTION || "Failed to load favorites");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError(error.response?.data?.ERROR_DESCRIPTION || "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const handleRemoveFavorite = async (productId) => {
    try {
      const response = await userApi.removeFromFavorites(productId);

      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        // Remove from local state
        setFavorites(prev => prev.filter(p => p._id !== productId));
        
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
    } catch (error) {
      console.error('Error removing favorite:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to remove from favorites',
      });
    }
  };

  const handleAddToCart = (product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: product.main_image || product.image,
      category: product.category_id?.name || product.category,
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

  if (loading) {
    return (
      <div>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <MagnifyingGlass
            visible={true}
            height="100"
            width="100"
            ariaLabel="loading"
            wrapperStyle={{}}
            wrapperClass=""
            glassColor="#c0efff"
            color="#0aad0a"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <div className="hidden md:block md:w-1/3 lg:w-1/4 border-r border-gray-200">
              <div className="pt-10 pe-4 lg:pe-10">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Settings</h4>
                <ul className="flex flex-col space-y-1">
                  <li>
                    <Link
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      to="/MyAccountOrder"
                    >
                      <i className="fas fa-shopping-bag mr-2" />
                      Your Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      to="/MyAccountSetting"
                    >
                      <i className="fas fa-cog mr-2" />
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" to="/MyAccountAddress">
                      <i className="fas fa-map-marker-alt mr-2" />
                      Address
                    </Link>
                  </li>
                  <li>
                    <Link className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" to="/MyAcconutPaymentMethod">
                      <i className="fas fa-credit-card mr-2" />
                      Payment Method
                    </Link>
                  </li>
                  <li>
                    <Link className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" to="/MyAcconutNotification">
                      <i className="fas fa-bell mr-2" />
                      Notification
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
                      to="/MyAccountFavorites"
                    >
                      <i className="fas fa-heart mr-2" />
                      Favorites
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Menu Button */}
              <div className="md:hidden mb-6">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <span className="font-medium text-gray-700">Account Menu</span>
                  <i className={`fas fa-chevron-${showMobileMenu ? 'up' : 'down'} text-gray-500`} />
                </button>
              </div>

              {/* Mobile Menu */}
              {showMobileMenu && (
                <div className="md:hidden mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <ul className="flex flex-col space-y-1">
                    <li>
                      <Link
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        to="/MyAccountOrder"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <i className="fas fa-shopping-bag mr-2" />
                        Your Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        to="/MyAccountSetting"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <i className="fas fa-cog mr-2" />
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        to="/MyAccountAddress"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <i className="fas fa-map-marker-alt mr-2" />
                        Address
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        to="/MyAcconutPaymentMethod"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <i className="fas fa-credit-card mr-2" />
                        Payment Method
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        to="/MyAcconutNotification"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <i className="fas fa-bell mr-2" />
                        Notification
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
                        to="/MyAccountFavorites"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <i className="fas fa-heart mr-2" />
                        Favorites
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

              {/* Page Header */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">My Favorites</h2>
                <p className="text-gray-600 mt-2">
                  {favorites.length} {favorites.length === 1 ? 'product' : 'products'} in your favorites
                </p>
              </div>

              {/* Favorites Grid */}
              {error ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : favorites.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <i className="fas fa-heart text-gray-300 text-6xl mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
                  <p className="text-gray-600 mb-6">Start adding products to your favorites by clicking the heart icon on any product.</p>
                  <Link
                    to="/Shop"
                    className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                      <div className="relative">
                        {product.original_price && product.original_price > product.price && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                              Sale
                            </span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 z-10">
                          <button
                            onClick={() => handleRemoveFavorite(product._id)}
                            className="bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                            title="Remove from Favorites"
                          >
                            <i className="fas fa-heart text-red-500"></i>
                          </button>
                        </div>
                        <div className="w-full h-48 overflow-hidden">
                          <Link to={`/SingleShop/${product._id}`}>
                            <img
                              src={product.main_image || product.image || 'https://via.placeholder.com/300'}
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300';
                              }}
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <Link
                          to={`/Shop?category_id=${product.category_id?._id || ''}`}
                          className="text-gray-500 text-xs tracking-widest title-font mb-1 block hover:text-primary transition-colors"
                        >
                          {product.category_id?.name || product.category || 'CATEGORY'}
                        </Link>
                        <Link to={`/SingleShop/${product._id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                            {product.name}{product.unit ? ` (${product.unit})` : ''}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mb-3">
                          {renderStars(product.rating || 0)}
                          <span className="text-gray-500 text-xs">
                            ({product.reviews_count || 0})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl font-bold text-gray-900">
                            Rs {product.price?.toFixed(2) || '0.00'}
                          </span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-gray-500 text-sm line-through">
                              Rs {product.original_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="mt-auto">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock_quantity === 0}
                            className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountFavorites;
