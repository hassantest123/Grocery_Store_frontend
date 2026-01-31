import slider1 from "../images/slide-1.jpg";
import slider2 from "../images/slider-2.jpg";
import attaricedal from "../images/atta-rice-dal.png";
import petcare from "../images/pet-care.png";
import cleaningessentials from "../images/cleaning-essentials.png";
import babycare from "../images/baby-care.png";
import chickenmeatfish from "../images/chicken-meat-fish.png";
import colddrinksjuices from "../images/cold-drinks-juices.png";
import teacoffeedrinks from "../images/tea-coffee-drinks.png";
import instantfood from "../images/instant-food.png";
import bakerybiscuits from "../images/bakery-biscuits.png";
import snackmunchies from "../images/snack-munchies.png";
import fruitsvegetables from "../images/fruits-vegetables.png";
import dairybreadeggs from "../images/dairy-bread-eggs.png";
import map from "../images/map.png";
import iphone from "../images/iphone-2.png";
import googleplay from "../images/googleplay-btn.svg";
import appstore from "../images/appstore-btn.svg";
import product11 from "../images/product-img-11.jpg";
import product12 from "../images/product-img-12.jpg";
import product13 from "../images/product-img-13.jpg";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ProductItem from "../ProductList/ProductItem";
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { Slide, Zoom } from "react-awesome-reveal";
import homeApi from "../Model/Data/Home/Home";
import useCartStore from "../store/cartStore";
import Swal from "sweetalert2";
import productApi from "../Model/Data/Product/Product";
import userApi from "../Model/Data/User/User";

const Home = () => {
  const navigate = useNavigate();
  const [popularCategories, setPopularCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [dailyBestSells, setDailyBestSells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [ratingProducts, setRatingProducts] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [togglingFavorites, setTogglingFavorites] = useState({});

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Fetch home data (categories, products, and daily best sells)
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await homeApi.getHomeData();
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          setPopularCategories(response.data.DB_DATA.Popular_Categories || []);
          setPopularProducts(response.data.DB_DATA.Popular_Products || []);
          setDailyBestSells(response.data.DB_DATA.Daily_Best_Sells || []);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

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

        // Update the product in the dailyBestSells array
        setDailyBestSells(prevProducts =>
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

  // Helper function to render stars
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

  // Handle add to cart
  const handleAddToCart = (product) => {
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

  // Dynamic slider settings based on number of products
  // Prevent duplication by disabling infinite mode when products < slidesToShow
  const getSettings1 = () => {
    const productCount = dailyBestSells.length;
    const maxSlidesToShow = Math.min(3, productCount); // Max 3, but not more than available products
    const shouldInfinite = productCount > maxSlidesToShow; // Only infinite if we have more products than shown

    return {
      dots: true,
      infinite: shouldInfinite,
      speed: 500,
      slidesToShow: maxSlidesToShow,
      slidesToScroll: 1,
      initialSlide: productCount > 1 ? 1 : 0,
      responsive: [
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: Math.min(3, productCount),
            slidesToScroll: 1,
            infinite: productCount > 3,
            dots: true,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(3, productCount),
            slidesToScroll: 1,
            initialSlide: productCount > 1 ? 1 : 0,
            infinite: productCount > 3,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: Math.min(3, productCount),
            slidesToScroll: 1,
            initialSlide: productCount > 1 ? 1 : 0,
            infinite: productCount > 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(3, productCount),
            slidesToScroll: 1,
            initialSlide: productCount > 1 ? 1 : 0,
            infinite: productCount > 3,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: Math.min(2, productCount),
            slidesToScroll: 1,
            initialSlide: productCount > 1 ? 1 : 0,
            infinite: productCount > 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: productCount > 1,
          },
        },
      ],
      autoplay: productCount > 1,
      autoplaySpeed: 2000,
    };
  };

  const settings1 = getSettings1();
  return (
    <div>
      <div>
        <>
          <>
            <section className="hero-section w-full mt-0 pt-0">
              <div className="w-full p-0 m-0">
                <div
                  id="carouselExampleFade"
                  className="relative w-full"
                >
                  <div className="relative">
                    <div className="carousel-item active">
                      <div
                        className="w-full min-h-screen flex items-center bg-[#e8f5e9] bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: !isMobile ? `url(${slider1})` : 'none',
                        }}
                      >
                        <div className="container mx-auto px-4">
                          <div className="pl-0 lg:pl-12 pt-8 lg:pt-10 pb-14 lg:pb-16 w-full md:w-7/12 xl:w-5/12 px-8">
                            <div className="text-center mb-4">
                              <span className="inline-block bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                                Opening Sale Discount 50%
                              </span>
                            </div>
                            <h2 className="text-gray-900 md:w-[600px] text-3xl lg:text-4xl font-bold leading-tight text-left">
                              SuperMarket Daily Fresh Food<br />
                              Vegetable and Organic Grocery
                            </h2>
                            <p className="text-lg text-gray-700 mt-4 text-left">
                              Introduced a new model for online grocery shopping
                              and convenient home delivery.
                            </p>
                            <div className="mt-8 text-left">
                              <Link to="/Shop" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors ml-2.5">
                                Shop Now{" "}
                                <i className="feather-icon icon-arrow-right ml-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-item hidden">
                      <div
                        className="w-full min-h-screen flex items-center bg-[#e8f5e9] bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: !isMobile ? `url(${slider2})` : 'none',
                        }}
                      >
                        <div className="container mx-auto px-4">
                          <div className="pl-0 lg:pl-12 py-14 lg:py-16 w-full md:w-7/12 xl:w-5/12 px-8 text-center">
                            <span className="inline-block bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                              Free Shipping - orders over Rs 100
                            </span>
                            <h2 className="text-gray-900 text-4xl lg:text-5xl font-bold mt-4">
                              Free Shipping on <br /> orders over{" "}
                              <span className="text-primary">Rs 100</span>
                            </h2>
                            <p className="text-lg text-gray-700 mt-4">
                              Free Shipping to First-Time Customers Only, After
                              promotions and discounts are applied.
                            </p>
                            <Link to="/Shop" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg mt-3 hover:bg-gray-800 transition-colors">
                              Shop Now{" "}
                              <i className="feather-icon icon-arrow-right ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="hidden md:block absolute top-1/2 left-5 bg-blue-900 bg-opacity-70 w-12 h-12 rounded-full opacity-90 hover:opacity-100 transition-opacity z-10"
                    onClick={() => {/* Add carousel prev logic */ }}
                    aria-label="Previous"
                  >
                    <span className="text-white text-xl">‹</span>
                  </button>
                  <button
                    className="hidden md:block absolute top-1/2 right-5 bg-blue-900 bg-opacity-70 w-12 h-12 rounded-full opacity-90 hover:opacity-100 transition-opacity z-10"
                    onClick={() => {/* Add carousel next logic */ }}
                    aria-label="Next"
                  >
                    <span className="text-white text-xl">›</span>
                  </button>
                </div>
              </div>
            </section>
          </>
          <>
            <section className="mt-8">
              <div className="container mx-auto px-4">
                <div className="w-full">
                  <Slide direction="down">
                    <div className="w-full">
                      <div className="bg-gray-100 py-6 lg:py-3 px-8 rounded-xl text-center">
                        <h1 className="text-2xl font-bold mb-1">
                          Welcome to Click Mart
                        </h1>
                      </div>
                    </div>
                  </Slide>
                </div>
              </div>
            </section>
          </>
          <>
            {/* Feature Highlights Section */}
            <section className="mt-6 lg:mt-8 mb-8 lg:mb-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                  {/* Fast Delivery */}
                  <Zoom delay={0}>
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 lg:p-6 text-center border border-gray-100 hover:border-primary group">
                      <div className="bg-primary-light rounded-full w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-3 lg:mb-4 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-8 lg:w-10 lg:h-10 text-primary group-hover:text-white transition-colors duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-1 lg:mb-2">
                        Fast Delivery
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600">
                        10 min delivery
                      </p>
                    </div>
                  </Zoom>

                  {/* Fresh Products */}
                  <Zoom delay={100}>
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 lg:p-6 text-center border border-gray-100 hover:border-primary group">
                      <div className="bg-primary-light rounded-full w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-3 lg:mb-4 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-8 lg:w-10 lg:h-10 text-primary group-hover:text-white transition-colors duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-1 lg:mb-2">
                        Fresh Products
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600">
                        100% Organic
                      </p>
                    </div>
                  </Zoom>

                  {/* Best Prices */}
                  <Zoom delay={200}>
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 lg:p-6 text-center border border-gray-100 hover:border-primary group">
                      <div className="bg-primary-light rounded-full w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-3 lg:mb-4 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-8 lg:w-10 lg:h-10 text-primary group-hover:text-white transition-colors duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-1 lg:mb-2">
                        Best Prices
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600">
                        Great Offers
                      </p>
                    </div>
                  </Zoom>

                  {/* Easy Returns */}
                  <Zoom delay={300}>
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 lg:p-6 text-center border border-gray-100 hover:border-primary group">
                      <div className="bg-primary-light rounded-full w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-3 lg:mb-4 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-8 lg:w-10 lg:h-10 text-primary group-hover:text-white transition-colors duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-1 lg:mb-2">
                        Easy Returns
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600">
                        No Questions
                      </p>
                    </div>
                  </Zoom>
                </div>
              </div>
            </section>
          </>
          <>
            {/* section category */}
            <section className="my-8 lg:my-14 mt-12 lg:mt-20">
              <div className="container mx-auto px-4">
                <div className="w-full">
                  <div className="mb-6">
                    <div className="section-head text-center mt-8 lg:mt-5">
                      <h3
                        className="h3style text-3xl font-bold"
                        data-title="Shop Popular Categories"
                      >
                        Shop Popular Categories
                      </h3>
                      <div className="wt-separator bg-primarys"></div>
                      <div className="wt-separator2 bg-primarys"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {loading ? (
                      <div className="col-span-full text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                      </div>
                    ) : popularCategories.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No categories available</p>
                      </div>
                    ) : (
                      <>
                        {popularCategories.map((category, index) => {
                          const isHiddenOnMdSm = !showAllCategories && index >= 6;

                          return (
                            <div
                              key={category._id}
                              className={`fade-zoom ${isHiddenOnMdSm ? 'hidden lg:block' : ''}`}
                            >
                              <Zoom>
                                <div className="text-center mb-10">
                                  <Link to={`/Shop?category_id=${category._id}`}>
                                    <div
                                      className="rounded-full flex items-center justify-center overflow-hidden mx-auto"
                                      style={{
                                        width: '120px',
                                        height: '120px',
                                        backgroundColor: '#f8f9fa',
                                        border: '2px solid #0aad0a',
                                        backgroundImage: category.image ? `url(${category.image})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                      }}
                                    >
                                      {!category.image && (
                                        <span style={{ fontSize: '48px' }}>🛒</span>
                                      )}
                                    </div>
                                  </Link>
                                  <div className="mt-4">
                                    <h5 className="text-sm font-semibold mb-0">
                                      <Link to={`/Shop?category_id=${category._id}`} className="text-gray-900 hover:text-primary transition-colors">
                                        {category.name}
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </Zoom>
                            </div>
                          );
                        })}

                        {popularCategories.length > 6 && (
                          <div className="col-span-full sm:block lg:hidden text-center mt-4">
                            <button
                              className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                              onClick={() => setShowAllCategories(!showAllCategories)}
                            >
                              {showAllCategories ? (
                                <>
                                  <i className="bi bi-chevron-up mr-2"></i>
                                  Show Less Categories
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-chevron-down mr-2"></i>
                                  Explore More Categories
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
            {/* section */}
          </>
          <>
            <ProductItem products={popularProducts} />
          </>
          <>
            <section className="my-12 lg:my-20">
              <div className="container mx-auto px-4 lg:px-6">
                {/* Section Header */}
                <div className="text-center mb-12">
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Daily Best Sells
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                    Today's handpicked deals on fresh groceries and essentials
                  </p>
                  <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)' }}></div>
                </div>

                {/* Products Slider */}
                <div className="w-full">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                  ) : dailyBestSells.length > 0 ? (
                    <Slider {...settings1}>
                      {dailyBestSells.map((product) => {
                        const hasDiscount = product.original_price && product.original_price > product.price;
                        const discountPercent = hasDiscount
                          ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                          : 0;

                        return (
                          <div key={product._id} className="px-2 lg:px-3">
                            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 hover:-translate-y-1 mx-auto max-w-sm flex flex-col">

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
                                      handleAddToCart(product);
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
                          </div>
                        );
                      })}
                    </Slider>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No products available</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
          <>
            {/* WhatsApp Floating Button */}
            <div className="fixed bottom-6 right-6 z-50">
              <a
                href={`https://wa.me/923286440332?text=${encodeURIComponent('Hello! I\'m interested in your grocery store. Please visit: https://grocery-store-frontend-pied.vercel.app/')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
                title="Contact us on WhatsApp"
                style={{ width: '60px', height: '60px' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </>


        </>
      </div>
    </div>
  );
};

export default Home;
