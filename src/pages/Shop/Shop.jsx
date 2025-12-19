import React, { useEffect, useState } from "react";
import assortment from "../../images/assortment-citrus-fruits.png";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import useCartStore from "../../store/cartStore";
import Swal from 'sweetalert2';
import productApi from "../../Model/Data/Product/Product";
import homeApi from "../../Model/Data/Home/Home";
import QuickViewModal from "../../Component/QuickViewModal";
import ScrollToTop from "../ScrollToTop";

function Dropdown() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryIdParam = searchParams.get('category_id');
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [categoryName, setCategoryName] = useState('All Products');
  const [popularCategories, setPopularCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [limit, setLimit] = useState(50); // Default limit
  const [sortBy, setSortBy] = useState('newest'); // Default sort
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Fetch popular categories for sidebar - Only once on page load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await homeApi.getHomeData();
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          const categories = response.data.DB_DATA.Popular_Categories || [];
          setPopularCategories(categories);
          
          // Update category name if categoryIdParam is set on initial load
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
  }, []); // Empty dependency array - only call once on mount

  // Fetch products by category_id - Called when categoryIdParam, limit, or sortBy changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAllProducts({
          category_id: categoryIdParam || null,
          limit: limit,
          sort_by: sortBy,
        });
        
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          setProducts(response.data.DB_DATA.products || []);
          setProductCount(response.data.DB_DATA.pagination?.total || 0);
          
          // Get category name from popular categories (already loaded) or from product
          if (categoryIdParam) {
            // Find category name from popular categories (already fetched)
            const selectedCategory = popularCategories.find(cat => cat._id === categoryIdParam);
            if (selectedCategory) {
              setCategoryName(selectedCategory.name);
            } else if (response.data.DB_DATA.products && response.data.DB_DATA.products.length > 0) {
              // Fallback: get from first product
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
  }, [categoryIdParam, popularCategories, limit, sortBy]); // Depends on categoryIdParam, popularCategories, limit, and sortBy

  const handleCategoryClick = (categoryId) => {
    navigate(`/Shop?category_id=${categoryId}`);
  };

  // Handle limit change (Show: 10, 20, 30, 50)
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
  };

  // Map backend sort values to frontend display values
  const getSortDisplayValue = (backendValue) => {
    switch (backendValue) {
      case 'price_low':
        return 'Low to High';
      case 'price_high':
        return 'High to Low';
      case 'rating':
        return 'Avg. Rating';
      case 'newest':
      default:
        return 'Featured';
    }
  };

  // Handle sort change and map frontend values to backend values
  const handleSortChange = (e) => {
    const frontendValue = e.target.value;
    let backendValue = 'newest'; // Default
    
    // Map frontend sort values to backend sort values
    switch (frontendValue) {
      case 'Low to High':
        backendValue = 'price_low';
        break;
      case 'High to Low':
        backendValue = 'price_high';
        break;
      case 'Release Date':
        backendValue = 'newest';
        break;
      case 'Avg. Rating':
        backendValue = 'rating';
        break;
      case 'Featured':
      default:
        backendValue = 'newest';
        break;
    }
    
    setSortBy(backendValue);
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
      <>
       <>
            <ScrollToTop/>
            </>
    <div className="container ">
      

      <div className="row">
        {/* Left Sidebar - Categories - Hidden on sm and md, visible on lg */}
        <div className="col-lg-3 col-md-4 mb-4 d-none d-lg-block">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '30px' }}>
            <div className="card-header bg-primary text-white" style={{ marginTop: '2rem' }}>
              <h5 className="mb-0">
                <i className="bi bi-grid me-2"></i>
                Categories
              </h5>
            </div>
            <div className="card-body p-0">
              {categoriesLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : popularCategories.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No categories available</p>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  <li 
                    className={`list-group-item list-group-item-action ${!categoryIdParam ? 'active bg-primary text-white' : ''}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                    onClick={() => {
                      setCategoryName('All Products');
                      navigate('/Shop');
                    }}
                  >
                    <i className="bi bi-grid me-2"></i>
                    All Products
                  </li>
                  {popularCategories.map((category) => (
                    <li
                      key={category._id}
                      className={`list-group-item list-group-item-action ${
                        categoryIdParam === category._id ? 'active bg-primary text-white' : ''
                      }`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      onClick={() => handleCategoryClick(category._id)}
                    >
                      <div className="d-flex align-items-center">
                        {category.image && (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="rounded me-2"
                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/30';
                            }}
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

        {/* Categories Dropdown for sm and md devices */}
        <div className="col-12 d-lg-none mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center" style={{ marginTop: '2rem' }}>
              <h5 className="mb-0">
                <i className="bi bi-grid me-2"></i>
                Categories
              </h5>
              <button
                className="btn btn-sm btn-light"
                onClick={() => setShowAllCategories(!showAllCategories)}
                type="button"
              >
                {showAllCategories ? (
                  <>
                    <i className="bi bi-chevron-up me-1"></i>
                    Hide Categories
                  </>
                ) : (
                  <>
                    <i className="bi bi-chevron-down me-1"></i>
                    Explore More Categories
                  </>
                )}
              </button>
            </div>
            {showAllCategories && (
              <div className="card-body p-0">
                {categoriesLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : popularCategories.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No categories available</p>
                  </div>
                ) : (
                  <ul className="list-group list-group-flush">
                    <li 
                      className={`list-group-item list-group-item-action ${!categoryIdParam ? 'active bg-primary text-white' : ''}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      onClick={() => {
                        setCategoryName('All Products');
                        navigate('/Shop');
                        setShowAllCategories(false);
                      }}
                    >
                      <i className="bi bi-grid me-2"></i>
                      All Products
                    </li>
                    {popularCategories.map((category) => (
                      <li
                        key={category._id}
                        className={`list-group-item list-group-item-action ${
                          categoryIdParam === category._id ? 'active bg-primary text-white' : ''
                        }`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={() => {
                          handleCategoryClick(category._id);
                          setShowAllCategories(false);
                        }}
                      >
                        <div className="d-flex align-items-center">
                          {category.image && (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="rounded me-2"
                              style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/30';
                              }}
                            />
                          )}
                          <span>{category.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Column */}
        <div className="col-lg-9 col-md-8">
          {/* card */}
          <div className="card mb-4 bg-light border-0" style={{ marginTop: '2rem' }}>
            {/* card body */}
            <div className="card-body p-9">
              <h1 className="mb-0">{categoryName}</h1>
            </div>
          </div>
          {/* list icon */}
          <div className="d-md-flex justify-content-between align-items-center">
            <div>
              <p className="mb-3 mb-md-0">
                {" "}
                <span className="text-dark">{productCount} </span> Products found{" "}
              </p>
            </div>
            {/* icon */}
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/ShopListCol" className="text-muted me-3">
                <i className="bi bi-list-ul" />
              </Link>
              {/* Commented out bi-grid styling - will decide later */}
              {/* <Link to="/ShopGridCol3" className=" me-3 active">
                <i className="bi bi-grid" />
              </Link> */}
              {/* <Link to="/ShopGridCol3" className=" me-3">
                <i className="bi bi-grid" />
              </Link> */}
              <Link to="/Shop" className="me-3 text-muted">
                <i className="bi bi-grid-3x3-gap" />
              </Link>
              <div className="me-2">
                {/* select option */}
                <select
                  className="form-select"
                  aria-label="Show products per page"
                  value={limit}
                  onChange={handleLimitChange}
                >
                  <option value={10}>Show: 10</option>
                  <option value={20}>Show: 20</option>
                  <option value={30}>Show: 30</option>
                  <option value={50}>Show: 50</option>
                </select>
              </div>
              <div>
                {/* select option */}
                <select
                  className="form-select"
                  aria-label="Sort products"
                  value={getSortDisplayValue(sortBy)}
                  onChange={handleSortChange}
                >
                  <option value="Featured">Sort by: Featured</option>
                  <option value="Low to High">Price: Low to High</option>
                  <option value="High to Low">Price: High to Low</option>
                  <option value="Release Date">Release Date</option>
                  <option value="Avg. Rating">Avg. Rating</option>
                </select>
              </div>
            </div>
          </div>
          {/* row */}
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
                <p className="text-muted">No products found{categoryName !== 'All Products' ? ` in ${categoryName}` : ''}.</p>
              </div>
            </div>
          ) : (
            <>
              {/* TODO: Middle product styling - commented out for now, will decide later what to do */}
              {/* TODO: Middle product styling - commented out for now, will decide later what to do */}
              <div className="row g-4 row-cols-xl-4 row-cols-lg-3 row-cols-2 row-cols-md-2 mt-2">
                {products.map((product, index) => (
                  <div key={product._id} className="col">
                  {/* card */}
                  <div className="card card-product">
                    <div className="card-body">
                      {/* badge */}
                      <div className="text-center position-relative">
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
                        <Link to={`/SingleShop/${product._id}`}>
                          {/* img */}
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
                        {/* action btn */}
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
                      <Link
                        to="#!"
                        className="btn-action"
                        data-bs-toggle="tooltip"
                        data-bs-html="true"
                        title="Compare"
                      >
                        <i className="bi bi-arrow-left-right" />
                      </Link>
                    </div>
                  </div>
                  {/* heading */}
                  <div className="text-small mb-1">
                    {product.category_id && product.category_id._id ? (
                      <Link to={`/Shop?category_id=${product.category_id._id}`} className="text-decoration-none text-muted">
                        <small>{product.category_id.name || product.category}</small>
                      </Link>
                    ) : (
                      <span className="text-decoration-none text-muted">
                        <small>{product.category}</small>
                      </span>
                    )}
                  </div>
                  <h2 className="fs-6">
                    <Link to={`/SingleShop/${product._id}`} className="text-inherit text-decoration-none">
                      {product.name}
                    </Link>
                  </h2>
                  <div>
                    {/* rating */}
                    <small className="text-warning">
                      {renderStars(product.rating || 0)}
                    </small>{" "}
                    <span className="text-muted small">
                      {product.rating || 0}({product.reviews_count || 0})
                    </span>
                  </div>
                  {/* price */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <span className="text-dark">Rs {product.price?.toFixed(2) || '0.00'}</span>
                      {product.original_price && product.original_price > product.price && (
                        <>
                          {" "}
                          <br></br>
                          <span className="text-decoration-line-through text-muted">
                            Rs {product.original_price.toFixed(2)}
                          </span>
                        </>
                      )}
                    </div>
                    {/* btn */}
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
            </>
          )}
        </div>
      </div>
    </div>
    </>
    
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
}

export default Dropdown;
