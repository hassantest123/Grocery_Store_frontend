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

const ShopListCol = () => {
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

  // Fetch products by category_id
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAllProducts({
          category_id: categoryIdParam || null,
          limit: 50,
          sort_by: 'newest',
        });

        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          setProducts(response.data.DB_DATA.products || []);
          setProductCount(response.data.DB_DATA.pagination?.total || 0);

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
  }, [categoryIdParam, popularCategories]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/ShopListCol?category_id=${categoryId}`);
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
      <div className="container">
        <div className="row fixed-side">
          {/* Left Sidebar - Categories */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
              <div className="card-header bg-primary text-white">
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
                        navigate('/ShopListCol');
                      }}
                    >
                      <i className="bi bi-grid me-2"></i>
                      All Products
                    </li>
                    {popularCategories.map((category) => (
                      <li
                        key={category._id}
                        className={`list-group-item list-group-item-action ${categoryIdParam === category._id ? 'active bg-primary text-white' : ''
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
          <div className="col-lg-9 col-md-8">
            <div>
              <div>
                {/* card */}
                <div className="card mb-4 bg-light border-0">
                  {/* card body */}
                  <div className="card-body p-9">
                    <h1 className="mb-0">Snacks &amp; Munchies</h1>
                  </div>
                </div>
                {/* text */}
                <div className="d-md-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-3 mb-md-0">
                      {" "}
                      <span className="text-dark">24 </span> Products
                      found{" "}
                    </p>
                  </div>
                  {/* list icon */}
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to="/ShopListCol" className="text-muted me-3">
                      <i className="bi bi-list-ul" />
                    </Link>
                    {/* Commented out bi-grid styling - will decide later */}
                    {/* <Link to="/ShopGridCol3" className=" me-3 active">
                      <i className="bi bi-grid" />
                    </Link> */}
                    <Link to="/ShopGridCol3" className=" me-3">
                      <i className="bi bi-grid" />
                    </Link>
                    <Link to="/Shop" className="me-3 text-muted">
                      <i className="bi bi-grid-3x3-gap" />
                    </Link>
                    <div className="me-2">
                      {/* select option */}
                      <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>Show: 50</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                      </select>
                    </div>
                    {/* select option */}
                    <div>
                      <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>Sort by: Featured</option>
                        <option value="Low to High">
                          Price: Low to High
                        </option>
                        <option value="High to Low">
                          {" "}
                          Price: High to Low
                        </option>
                        <option value="Release Date">
                          {" "}
                          Release Date
                        </option>
                        <option value="Avg. Rating"> Avg. Rating</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* row */}
                <div className="row g-4  row-cols-1 mt-2">
                  <div className="col">
                    {/* card */}
                    <div className="card card-product">
                      {/* card body */}
                      <div className="card-body">
                        <div className=" row align-items-center">
                          {/* col */}
                          <div className="col-md-4 col-12">
                            <div className="text-center position-relative ">
                              <div className=" position-absolute top-0">
                                {/* badge */}{" "}
                                <span className="badge bg-danger">
                                  Sale
                                </span>
                              </div>
                              <Link to="#!">
                                {/* img */}
                                <img
                                  src={productimg1}
                                  alt="Grocery Ecommerce Template"
                                  className="mb-3 img-fluid"
                                />
                              </Link>
                            </div>
                          </div>
                          <div className="col-md-8 col-12 flex-grow-1">
                            {/* heading */}
                            <div className="text-small mb-1">
                              <Link
                                to="#!"
                                className="text-decoration-none text-muted"
                              >
                                <small>Snack &amp; Munchies</small>
                              </Link>
                            </div>
                            <h2 className="fs-6">
                              <Link
                                to="#!"
                                className="text-inherit text-decoration-none"
                              >
                                Haldiram's Sev Bhujia
                              </Link>
                            </h2>
                            <div>
                              {/* rating */}
                              <small className="text-warning">
                                {" "}
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-half" />
                              </small>{" "}
                              <span className="text-muted small">
                                4.5(149)
                              </span>
                            </div>
                            <div className=" mt-6">
                              {/* price */}
                              <div>
                                <span className="text-dark">$18</span>{" "}
                                <span className="text-decoration-line-through text-muted">
                                  $24
                                </span>
                              </div>
                              {/* btn */}
                              <div className="mt-3">
                                <Link
                                  to="#!"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Quick View"
                                >
                                  <i className="bi bi-eye" />
                                </Link>
                                <Link
                                  to="shop-wishlist.html"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Wishlist"
                                >
                                  <i className="bi bi-heart" />
                                </Link>
                                <Link
                                  to="#!"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Compare"
                                >
                                  <i className="bi bi-arrow-left-right" />
                                </Link>
                              </div>
                              {/* btn */}
                              <div className="mt-2">
                                <Link
                                  to="#!"
                                  className="btn btn-primary "
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
                                    className="feather feather-shopping-bag me-2"
                                  >
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1={3} y1={6} x2={21} y2={6} />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                  </svg>{" "}
                                  Purchase
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* col */}
                  <div className="col">
                    {/* card */}
                    <div className="card card-product">
                      <div className="card-body">
                        <div className=" row align-items-center">
                          <div className="col-md-4 col-12">
                            <div className="text-center position-relative ">
                              <Link to="#!">
                                {/* img */}
                                <img
                                  src={productimg2}
                                  alt="Grocery Ecommerce Template"
                                  className="mb-3 img-fluid"
                                />
                              </Link>
                            </div>
                          </div>
                          <div className="col-md-8 col-12 flex-grow-1">
                            {/* heading */}
                            <div className="text-small mb-1">
                              <Link
                                to="#!"
                                className="text-decoration-none text-muted"
                              >
                                <small>Bakery &amp; Biscuits</small>
                              </Link>
                            </div>
                            <h2 className="fs-6">
                              <Link
                                to="#!"
                                className="text-inherit text-decoration-none"
                              >
                                NutriChoice Digestive
                              </Link>
                            </h2>
                            <div>
                              {/* rating */}
                              <small className="text-warning">
                                {" "}
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-half" />
                              </small>{" "}
                              <span className="text-muted small">
                                4.5(25)
                              </span>
                            </div>
                            <div className=" mt-6">
                              {/* price */}
                              <div>
                                <span className="text-dark">$24</span>
                              </div>
                              {/* btn */}
                              <div className="mt-3">
                                <Link
                                  to="#!"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Quick View"
                                >
                                  <i className="bi bi-eye" />
                                </Link>
                                <Link
                                  to="shop-wishlist.html"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Wishlist"
                                >
                                  <i className="bi bi-heart" />
                                </Link>
                                <Link
                                  to="#!"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Compare"
                                >
                                  <i className="bi bi-arrow-left-right" />
                                </Link>
                              </div>
                              {/* btn */}
                              <div className="mt-2">
                                <Link
                                  to="#!"
                                  className="btn btn-primary "
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
                                    className="feather feather-shopping-bag me-2"
                                  >
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1={3} y1={6} x2={21} y2={6} />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                  </svg>{" "}
                                  Purchase
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* col */}
                  <div className="col">
                    {/* card */}
                    <div className="card card-product">
                      <div className="card-body">
                        <div className=" row align-items-center">
                          <div className="col-md-4 col-12">
                            <div className="text-center position-relative">
                              <div className=" position-absolute top-0">
                                {/* badge */}{" "}
                                <span className="badge bg-success">
                                  14%
                                </span>
                              </div>
                              <Link to="#!">
                                {/* img */}
                                <img
                                  src={productimg3}
                                  alt="Grocery Ecommerce Template"
                                  className="mb-3 img-fluid"
                                />
                              </Link>
                            </div>
                          </div>
                          <div className="col-md-8 col-12 flex-grow-1">
                            {/* heading */}
                            <div className="text-small mb-1">
                              <Link
                                to="#!"
                                className="text-decoration-none text-muted"
                              >
                                <small>Bakery &amp; Biscuits</small>
                              </Link>
                            </div>
                            <h2 className="fs-6">
                              <Link
                                to="#!"
                                className="text-inherit text-decoration-none"
                              >
                                Cadbury 5 Star Chocolate
                              </Link>
                            </h2>
                            <div>
                              {/* rating */}
                              <small className="text-warning">
                                {" "}
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                              </small>{" "}
                              <span className="text-muted small">
                                5(69)
                              </span>
                            </div>
                            <div className=" mt-6">
                              {/* price */}
                              <div>
                                <span className="text-dark">$14</span>
                              </div>
                              {/* btn */}
                              <div className="mt-3">
                                <Link
                                  to="#!"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Quick View"
                                >
                                  <i className="bi bi-eye" />
                                </Link>
                                <Link
                                  to="shop-wishlist.html"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Wishlist"
                                >
                                  <i className="bi bi-heart" />
                                </Link>
                                <Link
                                  to="#!"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Compare"
                                >
                                  <i className="bi bi-arrow-left-right" />
                                </Link>
                              </div>
                              {/* btn */}
                              <div className="mt-2">
                                <Link
                                  to="#!"
                                  className="btn btn-primary "
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
                                    className="feather feather-shopping-bag me-2"
                                  >
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1={3} y1={6} x2={21} y2={6} />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                  </svg>{" "}
                                  Purchase
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* col */}
                  <div className="col">
                    {/* card */}
                    <div className="card card-product">
                      <div className="card-body">
                        <div className=" row align-items-center">
                          <div className="col-md-4 col-12">
                            <div className="text-center position-relative">
                              <Link to="#!">
                                {/* img */}
                                <img
                                  src={productimg4}
                                  alt="Grocery Ecommerce Template"
                                  className="mb-3 img-fluid"
                                />
                              </Link>
                            </div>
                          </div>
                          <div className="col-md-8 col-12 flex-grow-1">
                            {/* heading */}
                            <div className="text-small mb-1">
                              <Link
                                to="#!"
                                className="text-decoration-none text-muted"
                              >
                                <small>Snack &amp; Munchies</small>
                              </Link>
                            </div>
                            <h2 className="fs-6">
                              <Link
                                to="#!"
                                className="text-inherit text-decoration-none"
                              >
                                Onion Flavour Potato
                              </Link>
                            </h2>
                            <div>
                              {/* rating */}
                              <small className="text-warning">
                                {" "}
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-half" />
                                <i className="bi bi-star" />
                              </small>{" "}
                              <span className="text-muted small">
                                3.5(456)
                              </span>
                            </div>
                            <div className=" mt-6">
                              {/* price */}
                              <div>
                                <span className="text-dark">$3</span>{" "}
                                <span className="text-decoration-line-through text-muted">
                                  $9
                                </span>
                              </div>
                              {/* btn */}
                              <div className="mt-3">
                                <Link
                                  to="#!"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Quick View"
                                >
                                  <i className="bi bi-eye" />
                                </Link>
                                <Link
                                  to="shop-wishlist.html"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Wishlist"
                                >
                                  <i className="bi bi-heart" />
                                </Link>
                                <Link
                                  to="#!"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Compare"
                                >
                                  <i className="bi bi-arrow-left-right" />
                                </Link>
                              </div>
                              {/* btn */}
                              <div className="mt-2">
                                <Link
                                  to="#!"
                                  className="btn btn-primary "
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
                                    className="feather feather-shopping-bag me-2"
                                  >
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1={3} y1={6} x2={21} y2={6} />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                  </svg>{" "}
                                  Purchase
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* col */}
                  <div className="col">
                    {/* card */}
                    <div className="card card-product">
                      <div className="card-body">
                        <div className=" row align-items-center">
                          <div className="col-md-4 col-12">
                            <div className="text-center position-relative">
                              <Link to="#!">
                                {/* img */}
                                <img
                                  src={productimg5}
                                  alt="Grocery Ecommerce Template"
                                  className="mb-3 img-fluid"
                                />
                              </Link>
                            </div>
                          </div>
                          <div className="col-md-8 col-12 flex-grow-1">
                            {/* heading */}
                            <div className="text-small mb-1">
                              <Link
                                to="#!"
                                className="text-decoration-none text-muted"
                              >
                                <small>Instant Food</small>
                              </Link>
                            </div>
                            <h2 className="fs-6">
                              <Link
                                to="#!"
                                className="text-inherit text-decoration-none"
                              >
                                Salted Instant Popcorn
                              </Link>
                            </h2>
                            <div>
                              {/* rating */}
                              <small className="text-warning">
                                {" "}
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star-fill" />
                                <i className="bi bi-star" />
                              </small>{" "}
                              <span className="text-muted small">
                                4.5(456)
                              </span>
                            </div>
                            <div className=" mt-6">
                              {/* price */}
                              <div>
                                <span className="text-dark">$13</span>{" "}
                                <span className="text-decoration-line-through text-muted">
                                  $19
                                </span>
                              </div>
                              {/* btn */}
                              <div className="mt-3">
                                <Link
                                  to="#!"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Quick View"
                                >
                                  <i className="bi bi-eye" />
                                </Link>
                                <Link
                                  to="shop-wishlist.html"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Wishlist"
                                >
                                  <i className="bi bi-heart" />
                                </Link>
                                <Link
                                  to="#!"
                                  className="btn btn-icon btn-sm btn-outline-gray-400 text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Compare"
                                >
                                  <i className="bi bi-arrow-left-right" />
                                </Link>
                              </div>
                              {/* btn */}
                              <div className="mt-2">
                                <Link
                                  to="#!"
                                  className="btn btn-primary "
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
                                    className="feather feather-shopping-bag me-2"
                                  >
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1={3} y1={6} x2={21} y2={6} />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                  </svg>{" "}
                                  Purchase
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* row */}
                <div className="row mt-8">
                  <div className="col">
                    {/* nav */}
                    <nav>
                      <ul className="pagination">
                        <li className="page-item disabled">
                          <Link
                            className="page-link  mx-1 rounded-3 "
                            to="#"
                            aria-label="Previous"
                          >
                            <i className="fa fa-chevron-left" />
                          </Link>
                        </li>
                        <li className="page-item ">
                          <Link
                            className="page-link  mx-1 rounded-3 active"
                            to="#"
                          >
                            1
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link
                            className="page-link mx-1 rounded-3 text-body"
                            to="#"
                          >
                            2
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link
                            className="page-link mx-1 rounded-3 text-body"
                            to="#"
                          >
                            ...
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link
                            className="page-link mx-1 rounded-3 text-body"
                            to="#"
                          >
                            12
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link
                            className="page-link mx-1 rounded-3 text-body"
                            to="#"
                            aria-label="Next"
                          >
                            <i className="fa fa-chevron-right" />
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
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
