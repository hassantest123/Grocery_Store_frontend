import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MagnifyingGlass } from "react-loader-spinner";
import productApi from "../../Model/Data/Product/Product";
import userApi from "../../Model/Data/User/User";
import homeApi from "../../Model/Data/Home/Home";
import useCartStore from "../../store/cartStore";
import Swal from 'sweetalert2';
import Pagination from "../../Component/Pagination";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryIdParam = searchParams.get('category_id');
  const pageParam = parseInt(searchParams.get('page')) || 1;
  const searchParam = searchParams.get('search') || '';
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [categoryName, setCategoryName] = useState('All Products');
  const [popularCategories, setPopularCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [ratingProducts, setRatingProducts] = useState({}); // Track which products are being rated
  const [favorites, setFavorites] = useState([]); // Track favorite product IDs
  const [togglingFavorites, setTogglingFavorites] = useState({}); // Track which products are being toggled

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

  // Sync search query with URL param
  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  // Fetch popular categories for sidebar - Only once on page load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await homeApi.getHomeData();
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          const categories = response.data.DB_DATA.Popular_Categories || [];
          setPopularCategories(categories);

          // Update category name if categoryIdParam exists
          if (categoryIdParam) {
            const selectedCategory = categories.find(cat => cat._id === categoryIdParam);
            if (selectedCategory) {
              setCategoryName(selectedCategory.name);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch products by category_id with pagination and search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAllProducts({
          category_id: categoryIdParam || null,
          page: pageParam, // Use pageParam directly from URL instead of currentPage state
          limit: 20,
          sort_by: 'newest',
          search: searchParam || null,
        });

        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          setProducts(response.data.DB_DATA.products || []);
          setProductCount(response.data.DB_DATA.pagination?.total || 0);
          setTotalPages(response.data.DB_DATA.pagination?.total_pages || 1);

          // Update category name from products if not found in popularCategories
          if (categoryIdParam) {
            // First try to find in popularCategories (if loaded)
            const selectedCategory = popularCategories.find(cat => cat._id === categoryIdParam);
            if (selectedCategory) {
              setCategoryName(selectedCategory.name);
            } else if (response.data.DB_DATA.products && response.data.DB_DATA.products.length > 0) {
              // Fallback to product category data
              const firstProduct = response.data.DB_DATA.products[0];
              if (firstProduct.category_id && firstProduct.category_id.name) {
                setCategoryName(firstProduct.category_id.name);
              } else if (firstProduct.category) {
                setCategoryName(firstProduct.category);
              }
            }
          } else {
            setCategoryName('All Products');
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load products. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Remove popularCategories from dependencies to prevent re-fetching when categories load
    // Only fetch when URL params change
  }, [categoryIdParam, pageParam, searchParam]);

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

  const handleCategoryClick = (categoryId) => {
    setSearchQuery('');
    const params = new URLSearchParams();
    if (categoryId) {
      params.set('category_id', categoryId);
    }
    params.set('page', '1');
    navigate(`/Shop?${params.toString()}`);
  };

  // Debounce timer ref
  const searchDebounceTimer = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear existing timer
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    // Set new timer for debouncing (1 second)
    searchDebounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (categoryIdParam) {
        params.set('category_id', categoryIdParam);
      }
      if (value.trim()) {
        params.set('search', value.trim());
      }
      params.set('page', '1');
      navigate(`/Shop?${params.toString()}`);
    }, 1000); // 1 second debounce
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Clear debounce timer if form is submitted
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    const params = new URLSearchParams();
    if (categoryIdParam) {
      params.set('category_id', categoryIdParam);
    }
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    params.set('page', '1');
    navigate(`/Shop?${params.toString()}`);
  };

  const handleClearSearch = () => {
    // Clear debounce timer
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    setSearchQuery('');
    const params = new URLSearchParams();
    if (categoryIdParam) {
      params.set('category_id', categoryIdParam);
    }
    params.set('page', '1');
    navigate(`/Shop?${params.toString()}`);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, []);

  const handlePageChange = (page) => {
    const params = new URLSearchParams();
    if (categoryIdParam) {
      params.set('category_id', categoryIdParam);
    }
    if (searchParam) {
      params.set('search', searchParam);
    }
    params.set('page', page);
    navigate(`/Shop?${params.toString()}`);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const handleRateProduct = async (product, ratingValue) => {
    // Check authentication before making API call - read directly from localStorage
    const jwtToken = localStorage.getItem('jwt');
    const userDataStr = localStorage.getItem('user');

    console.log('handleRateProduct called');
    console.log('jwtToken exists:', !!jwtToken, 'length:', jwtToken?.length);
    console.log('userData exists:', !!userDataStr, 'length:', userDataStr?.length);

    // Validate token exists and is not empty
    if (!jwtToken || jwtToken.trim() === '') {
      console.log('JWT token missing or empty');
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

    // Validate user data exists and is valid JSON
    if (!userDataStr || userDataStr.trim() === '') {
      console.log('User data missing or empty');
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

    // Try to parse user data to ensure it's valid JSON
    let userData;
    try {
      userData = JSON.parse(userDataStr);
      if (!userData || !userData._id) {
        throw new Error('Invalid user data structure');
      }
    } catch (error) {
      console.log('User data is not valid JSON:', error);
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

    console.log('Authentication check passed - user ID:', userData._id);

    if (!product || !product._id) return;

    try {
      setRatingProducts(prev => ({ ...prev, [product._id]: true }));

      console.log('Rating product:', product._id, 'with rating:', ratingValue);
      const response = await productApi.rateProduct(product._id, ratingValue);
      console.log('Rating response:', response);

      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        const { product: updatedProduct, already_rated } = response.data.DB_DATA;

        // Update the product in the products array
        setProducts(prevProducts =>
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
        // Remove from favorites
        const response = await userApi.removeFromFavorites(productId);
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          setFavorites(prev => prev.filter(id => id !== productId));
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
        const response = await userApi.addToFavorites(productId);
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          setFavorites(prev => [...prev, productId]);
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


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Categories</h3>
              {categoriesLoading ? (
                <div className="flex justify-center py-8">
                  <MagnifyingGlass
                    visible={true}
                    height="40"
                    width="40"
                    ariaLabel="loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    glassColor="#c0efff"
                    color="#0aad0a"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      navigate('/Shop?page=1');
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${!categoryIdParam
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    All Products
                  </button>
                  {popularCategories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryClick(category._id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${categoryIdParam === category._id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{categoryName}</h1>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <MagnifyingGlass
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  glassColor="#c0efff"
                  color="#0aad0a"
                />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {products.map((product) => {
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
                          className="inline-block w-fit px-3 py-1 mb-3 rounded-md text-xs font-semibold transition-colors"
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
                })}</div>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && (
              <Pagination
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Shop;
