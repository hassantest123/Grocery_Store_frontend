import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import assortment from "../../images/assortment-citrus-fruits.png";
import productimg1 from "../../images/product-img-1.jpg";
import productimg2 from "../../images/product-img-2.jpg";
import productimg3 from "../../images/product-img-3.jpg";
import productimg4 from "../../images/product-img-4.jpg";
import productimg5 from "../../images/product-img-5.jpg";
import { MagnifyingGlass } from "react-loader-spinner";
import productApi from "../../Model/Data/Product/Product";
import homeApi from "../../Model/Data/Home/Home";
import useCartStore from "../../store/cartStore";
import Swal from 'sweetalert2';
import QuickViewModal from "../../Component/QuickViewModal";
import Pagination from "../../Component/Pagination";

const ShopListCol = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryIdParam = searchParams.get('category_id');
  const pageParam = parseInt(searchParams.get('page')) || 1;
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [categoryName, setCategoryName] = useState('All Products');
  const [popularCategories, setPopularCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [ratingProducts, setRatingProducts] = useState({});

  // Fetch popular categories for sidebar - Only once on page load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await homeApi.getHomeData();
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          const categories = response.data.DB_DATA.Popular_Categories || [];
          setPopularCategories(categories);

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

  // Fetch products by category_id with pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAllProducts({
          category_id: categoryIdParam || null,
          page: currentPage,
          limit: 20,
          sort_by: 'newest',
        });

        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          setProducts(response.data.DB_DATA.products || []);
          setProductCount(response.data.DB_DATA.pagination?.total || 0);
          setTotalPages(response.data.DB_DATA.pagination?.total_pages || 1);

          if (categoryIdParam) {
            const selectedCategory = popularCategories.find(cat => cat._id === categoryIdParam);
            if (selectedCategory) {
              setCategoryName(selectedCategory.name);
            } else if (response.data.DB_DATA.products && response.data.DB_DATA.products.length > 0) {
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
  }, [categoryIdParam, popularCategories, currentPage]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryIdParam]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/ShopListCol?category_id=${categoryId}&page=1`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams();
    if (categoryIdParam) {
      params.set('category_id', categoryIdParam);
    }
    params.set('page', page);
    navigate(`/ShopListCol?${params.toString()}`);
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
              className={`transition-all ${
                starValue <= rating
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
    <div>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          {/* Left Sidebar - Categories */}
          <div className="w-full md:w-1/4 px-4">
            <div className="bg-white border-0 rounded-lg shadow-sm sticky top-5">
              <div className="bg-primary text-white px-4 py-3 rounded-t-lg">
                <h5 className="mb-0 font-semibold">
                  <i className="bi bi-grid mr-2"></i>
                  Categories
                </h5>
              </div>
              <div className="p-0">
                {categoriesLoading ? (
                  <div className="text-center py-4">
                    <div className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : popularCategories.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-0">No categories available</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    <li
                      className={`px-4 py-3 cursor-pointer transition-colors ${!categoryIdParam ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      onClick={() => {
                        setCategoryName('All Products');
                        navigate('/ShopListCol');
                      }}
                    >
                      <i className="bi bi-grid mr-2"></i>
                      All Products
                    </li>
                    {popularCategories.map((category) => (
                      <li
                        key={category._id}
                        className={`px-4 py-3 cursor-pointer transition-colors ${categoryIdParam === category._id ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                        onClick={() => handleCategoryClick(category._id)}
                      >
                        <div className="flex items-center">
                          {category.image && (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="rounded mr-2"
                              style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                            />
                          )}
                          <span>{category.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="w-full md:w-3/4 px-4">
            <div>
              <div>
                {/* card */}
                <div className="bg-gray-100 mb-4 border-0 rounded-lg">
                  {/* card body */}
                  <div className="p-9">
                    <h1 className="mb-0 text-2xl font-bold">{categoryName}</h1>
                  </div>
                </div>
                {/* text */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                  <div>
                    <p className="mb-3 md:mb-0">
                      <span className="text-gray-900 font-semibold">{productCount} </span> Products
                      found
                    </p>
                  </div>
                  {/* list icon */}
                  <div className="flex items-center gap-3">
                    <Link to="/ShopListCol" className="text-gray-500 hover:text-primary transition-colors">
                      <i className="bi bi-list-ul text-xl" />
                    </Link>
                    {/* Commented out bi-grid styling - will decide later */}
                    {/* <Link to="/ShopGridCol3" className=" me-3 active">
                      <i className="bi bi-grid" />
                    </Link> */}
                    <Link to="/ShopGridCol3" className="text-gray-500 hover:text-primary transition-colors">
                      <i className="bi bi-grid text-xl" />
                    </Link>
                    <Link to="/Shop" className="text-gray-500 hover:text-primary transition-colors">
                      <i className="bi bi-grid-3x3-gap text-xl" />
                    </Link>
                    <div className="mr-2">
                      {/* select option */}
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Default select example"
                      >
                        <option defaultValue>Show: 50</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                      </select>
                    </div>
                    {/* select option */}
                    <div>
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Default select example"
                      >
                        <option defaultValue>Sort by: Featured</option>
                        <option value="Low to High">
                          Price: Low to High
                        </option>
                        <option value="High to Low">
                          Price: High to Low
                        </option>
                        <option value="Release Date">
                          Release Date
                        </option>
                        <option value="Avg. Rating"> Avg. Rating</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Products List */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <MagnifyingGlass
                      visible={true}
                      height="80"
                      width="80"
                      ariaLabel="magnifying-glass-loading"
                      wrapperStyle={{}}
                      wrapperClass="magnifying-glass-wrapper"
                      glassColor="#c0efef"
                      color="#0aad0a"
                    />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No products found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 mt-2">
                    {products.map((product) => (
                      <div key={product._id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="p-4">
                          <div className="flex flex-col md:flex-row items-center">
                            {/* Image Section */}
                            <div className="w-full md:w-1/3 mb-4 md:mb-0">
                              <div className="text-center relative">
                                {product.original_price && product.original_price > product.price && (
                                  <div className="absolute top-0 left-0 z-10">
                                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                      Sale
                                    </span>
                                  </div>
                                )}
                                <Link to={`/SingleShop/${product._id}`}>
                                  <img
                                    src={product.main_image || product.image || 'https://via.placeholder.com/200'}
                                    alt={product.name}
                                    className="mb-3 w-full h-48 object-cover rounded-lg"
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/200';
                                    }}
                                  />
                                </Link>
                              </div>
                            </div>
                            {/* Content Section */}
                            <div className="w-full md:w-2/3 md:pl-6">
                              {/* Category */}
                              <div className="text-sm mb-1">
                                <Link
                                  to={`/Shop?category_id=${product.category_id?._id || ''}`}
                                  className="text-gray-500 hover:text-primary transition-colors"
                                >
                                  {product.category_id?.name || product.category || 'Uncategorized'}
                                </Link>
                              </div>
                              {/* Product Name */}
                              <h2 className="text-lg font-semibold mb-2">
                                <Link
                                  to={`/SingleShop/${product._id}`}
                                  className="text-gray-900 hover:text-primary transition-colors line-clamp-2"
                                >
                                  {product.name}{product.unit ? ` (${product.unit})` : ''}
                                </Link>
                              </h2>
                              {/* Rating */}
                              <div className="mb-3">
                                <div className="flex items-center gap-2">
                                  {renderStars(product, product.rating || 0, true)}
                                  <span className="text-gray-500 text-sm">
                                    {product.rating?.toFixed(1) || '0.0'} ({product.reviews_count || 0})
                                  </span>
                                </div>
                              </div>
                              {/* Price and Actions */}
                              <div className="mt-6">
                                {/* Price */}
                                <div className="mb-3">
                                  <span className="text-gray-900 font-bold text-xl">Rs {product.price?.toFixed(2) || '0.00'}</span>
                                  {product.original_price && product.original_price > product.price && (
                                    <span className="text-gray-500 text-sm line-through ml-2">
                                      Rs {product.original_price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mb-3">
                                  <button
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setShowModal(true);
                                    }}
                                    className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors"
                                    title="Quick View"
                                  >
                                    <i className="bi bi-eye" />
                                  </button>
                                  <Link
                                    to="/ShopWishList"
                                    className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors"
                                    title="Wishlist"
                                  >
                                    <i className="bi bi-heart" />
                                  </Link>
                                  <button
                                    className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors"
                                    title="Compare"
                                  >
                                    <i className="bi bi-arrow-left-right" />
                                  </button>
                                </div>
                                {/* Add to Cart Button */}
                                <div className="mt-2">
                                  <button
                                    onClick={() => handleAddClick(product)}
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center"
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
                                      className="mr-2"
                                    >
                                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                      <line x1={3} y1={6} x2={21} y2={6} />
                                      <path d="M16 10a4 4 0 0 1-8 0" />
                                    </svg>
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Pagination */}
                {!loading && products.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              {/* </> */}
            </div>
          </div>
        </div>
      </div>
      <QuickViewModal
        product={selectedProduct}
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
      />
    </div>
    // </div>
    // </div>

  );
};

export default ShopListCol;
