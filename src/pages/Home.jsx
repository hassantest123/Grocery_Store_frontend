import slider1 from "../images/slide-1.jpg";
import abouticon from "../images/about-icons-1.svg";
import slider2 from "../images/slider-2.jpg";
import adbanner1 from "../images/ad-banner-1.jpg";
import adbanner2 from "../images/ad-banner-2.jpg";
import adbanner3 from "../images/ad-banner-3.jpg";
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
import grocerybanner from "../images/grocery-banner.png";
import grocerybanner2 from "../images/grocery-banner-2.jpg";
import map from "../images/map.png";
import iphone from "../images/iphone-2.png";
import googleplay from "../images/googleplay-btn.svg";
import appstore from "../images/appstore-btn.svg";
import bannerdeal from "../images/banner-deal1.jpg";
import product11 from "../images/product-img-11.jpg";
import product12 from "../images/product-img-12.jpg";
import product13 from "../images/product-img-13.jpg";
import clock from "../images/clock.svg";
import gift from "../images/gift.svg";
import package1 from "../images/package.svg";
import refresh from "../images/refresh-cw.svg";
import product1 from "../images/category-baby-care.jpg";
import product2 from "../images/category-atta-rice-dal.jpg";
import product3 from "../images/category-bakery-biscuits.jpg";
import product4 from "../images/category-chicken-meat-fish.jpg";
import product5 from "../images/category-cleaning-essentials.jpg";
import product6 from "../images/category-dairy-bread-eggs.jpg";
import product7 from "../images/category-instant-food.jpg";
import product8 from "../images/category-pet-care.jpg";
import product9 from "../images/category-snack-munchies.jpg";
import product10 from "../images/category-tea-coffee-drinks.jpg";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ProductItem from "../ProductList/ProductItem";
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { Slide, Zoom } from "react-awesome-reveal";
import homeApi from "../Model/Data/Home/Home";
import FAQ from "./FooterElements/Faq";
import useCartStore from "../store/cartStore";
import Swal from "sweetalert2";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [popularCategories, setPopularCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [dailyBestSells, setDailyBestSells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
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

  // Helper function to render stars
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

  // Handle add to cart
  const handleAddToCart = (product) => {
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

  const settings1 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    autoplay: true,
    autoplaySpeed: 2000,
  };
  return (
    <div>
      <div>
        <>
          <>
            <div className="scroll-to-top">
                <button
                  onClick={scrollToTop}
                  className={`scroll-to-top-button ${isVisible ? "show" : ""}`}
                >
                  ↑
                </button>
              </div>
              <section className="hero-section" style={{ width: "100%", marginTop: 0, paddingTop: 0 }}>
                <div className="container-fluid" style={{ padding: 0, margin: 0 }}>
                  <div
                    id="carouselExampleFade"
                    className="carousel slide carousel-fade"
                    data-bs-ride="carousel"
                    style={{ width: "100%" }}
                  >
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <div
                          style={{
                            background: `url(${slider1}) no-repeat`,
                            backgroundSize: "cover",
                            borderRadius: "0",
                            backgroundPosition: "center",
                            width: "100%",
                            minHeight: "100vh",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div className="container">
                            <div className="ps-lg-12 py-lg-16 col-xxl-5 col-md-7 py-14 px-8 text-xs-center">
                              <span className="badge text-bg-warning">
                                Opening Sale Discount 50%
                              </span>
                              <h2 className="text-dark display-5 fw-bold mt-4">
                                SuperMarket Daily <br /> Fresh Grocery
                              </h2>
                              <p className="lead">
                                Introduced a new model for online grocery shopping
                                and convenient home delivery.
                              </p>
                              <Link to="/Shop" className="btn btn-dark mt-3">
                                Shop Now{" "}
                                <i className="feather-icon icon-arrow-right ms-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div
                          style={{
                            background: `url(${slider2}) no-repeat`,
                            backgroundSize: "cover",
                            borderRadius: "0",
                            backgroundPosition: "center",
                            width: "100%",
                            minHeight: "100vh",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div className="container">
                            <div className="ps-lg-12 py-lg-16 col-xxl-5 col-md-7 py-14 px-8 text-xs-center">
                              <span className="badge text-bg-warning">
                                Free Shipping - orders over Rs 100
                              </span>
                              <h2 className="text-dark display-5 fw-bold mt-4">
                                Free Shipping on <br /> orders over{" "}
                                <span className="text-primary">Rs 100</span>
                              </h2>
                              <p className="lead">
                                Free Shipping to First-Time Customers Only, After
                                promotions and discounts are applied.
                              </p>
                              <Link to="/Shop" className="btn btn-dark mt-3">
                                Shop Now{" "}
                                <i className="feather-icon icon-arrow-right ms-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      className="carousel-control-prev"
                      to="#carouselExampleFade"
                      role="button"
                      data-bs-slide="prev"
                      style={{
                        backgroundColor: "rgba(0, 0, 139, 0.7)",
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: "20px",
                        opacity: 0.9,
                      }}
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                        style={{
                          filter: "brightness(0) saturate(100%)",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                      <span className="visually-hidden">Previous</span>
                    </Link>
                    <Link
                      className="carousel-control-next"
                      to="#carouselExampleFade"
                      role="button"
                      data-bs-slide="next"
                      style={{
                        backgroundColor: "rgba(0, 0, 139, 0.7)",
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        top: "50%",
                        transform: "translateY(-50%)",
                        right: "20px",
                        opacity: 0.9,
                      }}
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                        style={{
                          filter: "brightness(0) saturate(100%)",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                      <span className="visually-hidden">Next</span>
                    </Link>
                  </div>
                </div>
              </section>
            </>
            <>
              <section className="mt-8">
                {/* contianer */}
                <div className="container ">
                  <div className="row">
                    {/* col */}
                    <Slide direction="down">
                      <div className="col-12">
                        {/* cta */}
                        <div className="bg-light d-lg-flex justify-content-between align-items-center py-6 py-lg-3 px-8 rounded-3 text-center text-lg-start">
                          {/* img */}
                          <div className="d-lg-flex align-items-center">
                            <img
                              src={abouticon}
                              alt="about-icon"
                              className="img-fluid"
                            />
                            {/* text */}
                            <div className="ms-lg-4">
                              <h1 className="fs-2 mb-1">
                                Welcome to Click Mart
                              </h1>
                              <span>
                                Download the app get free food &amp;{" "}
                                <span className="text-primary">Rs 30</span> off on
                                your first order.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Slide>
                  </div>
                </div>
              </section>
            </>
            <>
              {/* section */}
              <section className="mt-8">
                <div className="container">
                  {/* row */}
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-12 fade-in-left">
                      <Slide direction="left">
                        <div className=" banner mb-3">
                          {/* Banner Content */}
                          <div className="position-relative">
                            {/* Banner Image */}
                            <img
                              src={adbanner1}
                              alt="ad-banner"
                              className="img-fluid rounded-3 w-100"
                            />
                            <div className="banner-text">
                              <h3 className="mb-0 fw-bold">
                                10% cashback on <br />
                                personal care{" "}
                              </h3>
                              <div className="mt-4 mb-5 fs-5">
                                <p className="mb-0">Max cashback: Rs 12</p>
                                <span>
                                  Code:{" "}
                                  <span className="fw-bold text-dark">
                                    CARE12
                                  </span>
                                </span>
                              </div>
                              <Link to="/Shop" className="btn btn-dark">
                                Shop Now
                              </Link>
                            </div>
                            {/* Banner Content */}
                          </div>
                        </div>
                      </Slide>
                    </div>

                    <div className="col-lg-4 col-md-6  col-12 slide-in-top">
                      <Zoom>
                        <div className="banner mb-3 ">
                          {/* Banner Content */}
                          <div className="position-relative">
                            {/* Banner Image */}
                            <img
                              src={adbanner2}
                              alt="ad-banner-2"
                              className="img-fluid rounded-3 w-100"
                            />
                            <div className="banner-text">
                              {/* Banner Content */}
                              <h3 className=" fw-bold mb-2">
                                Say yes to <br />
                                season’s fresh{" "}
                              </h3>
                              <p className="fs-5">
                                Refresh your day <br />
                                the fruity way
                              </p>
                              <Link to="/Shop" className="btn btn-dark mt-2">
                                Shop Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                    <div className="col-lg-4 col-12 fade-in-left ">
                      <Slide direction="right">
                        <div className="banner mb-3">
                          <div className="banner-img">
                            {/* Banner Image */}
                            <img
                              src={adbanner3}
                              alt="ad-banner-3"
                              className="img-fluid rounded-3 w-100"
                            />
                            {/* Banner Content */}
                            <div className="banner-text">
                              <h3 className="fs-2 fw-bold lh-1 mb-2">
                                When in doubt,
                                <br />
                                eat ice cream{" "}
                              </h3>
                              <p className="fs-5">
                                Enjoy a scoop of
                                <br />
                                summer today
                              </p>
                              <Link to="/Shop" className="btn btn-dark">
                                Shop Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Slide>
                    </div>
                  </div>
                </div>
              </section>
              {/* section */}
            </>
            <>
              {/* section category */}
              <section className="my-lg-14 my-8 categories-section-lg" style={{ marginTop: '3rem' }}>
                <style>{`
                  @media (min-width: 992px) {
                    .categories-section-lg {
                      margin-top: 5rem !important;
                    }
                  }
                `}</style>
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-6">
                        {/* heading    */}
                        <div className="section-head text-center mt-8 mt-lg-5">
                          <h3
                            className="h3style"
                            data-title="Shop Popular Categories"
                          >
                            Shop Popular Categories
                          </h3>
                          <div className="wt-separator bg-primarys"></div>
                          <div className="wt-separator2 bg-primarys"></div>
                          {/* <p>Connecting with entrepreneurs online, is just a few clicks away.</p> */}
                        </div>
                      </div>
                    </div>
                    <div className="row ">
                      {loading ? (
                        <div className="col-12 text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : popularCategories.length === 0 ? (
                        <div className="col-12 text-center py-5">
                          <p className="text-muted">No categories available</p>
                        </div>
                      ) : (
                        <>
                          {/* Show all categories on large screens, limited on md/sm */}
                          {popularCategories.map((category, index) => {
                            // On md and sm devices, show only first 6 categories initially
                            // On lg and above, always show all
                            const isHiddenOnMdSm = !showAllCategories && index >= 6;
                            
                            return (
                              <div 
                                key={category._id} 
                                className={`col-lg-2 col-md-4 col-6 fade-zoom ${isHiddenOnMdSm ? 'd-none d-lg-block' : ''}`}
                              >
                                <Zoom>
                                  <div className="text-center mb-10">
                                    <Link to={`/Shop?category_id=${category._id}`}>
                                      <div 
                                        className="card-image rounded-circle d-flex align-items-center justify-content-center overflow-hidden"
                                        style={{ 
                                          width: '120px', 
                                          height: '120px', 
                                          margin: '0 auto',
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
                                      <h5 className="fs-6 mb-0">
                                        <Link to={`/Shop?category_id=${category._id}`} className="text-inherit">
                                          {category.name}
                                        </Link>
                                      </h5>
                                    </div>
                                  </div>
                                </Zoom>
                              </div>
                            );
                          })}
                          
                          {/* Explore More Categories button - Only show on md and sm devices */}
                          {popularCategories.length > 6 && (
                            <div className="col-12 d-sm-block d-lg-none text-center mt-4">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => setShowAllCategories(!showAllCategories)}
                              >
                                {showAllCategories ? (
                                  <>
                                    <i className="bi bi-chevron-up me-2"></i>
                                    Show Less Categories
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-chevron-down me-2"></i>
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
              <section>
                <div className="container ">
                  <div className="row">
                    <div className="col-12 col-lg-6 mb-3 mb-lg-0  fade-in-left">
                      <Slide direction="left">
                        <div>
                          <div
                            className="py-10 px-8 rounded-3"
                            style={{
                              background: `url(${grocerybanner}) no-repeat`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <div>
                              <h3 className="fw-bold mb-1">
                                Fruits &amp; Vegetables
                              </h3>
                              <p className="mb-4">
                                Get Upto <span className="fw-bold">30%</span>{" "}
                                Off
                              </p>
                              <Link to="/Shop" className="btn btn-dark">
                                Shop Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Slide>
                    </div>
                    <div className="col-12 col-lg-6 fade-in-left ">
                      <Slide direction="right">
                        <div>
                          <div
                            className="py-10 px-8 rounded-3"
                            style={{
                              background: `url(${grocerybanner2}) no-repeat`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <div>
                              <h3 className="fw-bold mb-1">
                                Freshly Baked Buns
                              </h3>
                              <p className="mb-4">
                                Get Upto <span className="fw-bold">25%</span>{" "}
                                Off
                              </p>
                              <Link to="/Shop" className="btn btn-dark">
                                Shop Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Slide>
                    </div>
                  </div>
                </div>
              </section>
            </>
            <>
              <ProductItem products={popularProducts} />
            </>
            <>
              <section>
                <div className="container">
                  <div className="row">
                    <div className="col-md-12 mb-6">
                      <div className="section-head text-center mt-8">
                        <h3 className="h3style" data-title="Daily Best Sells">
                          Daily Best Sells
                        </h3>
                        <div className="wt-separator bg-primarys"></div>
                        <div className="wt-separator2 bg-primarys"></div>
                        {/* <p>Connecting with entrepreneurs online, is just a few clicks away.</p> */}
                      </div>
                    </div>
                  </div>
                  <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col-md-3 fade-in-left">
                      <div
                        className=" pt-8 px-8 rounded-3"
                        style={{
                          background: `url(${bannerdeal})no-repeat`,
                          backgroundSize: "cover",
                          height: 400,
                        }}
                      >
                        <div>
                          <h3 className="fw-bold text-white">
                            100% Organic Coffee Beans.
                          </h3>
                          <p className="text-white">
                            Get the best deal before close.
                          </p>
                          <Link to="/Shop" className="btn btn-primary">
                            Shop Now{" "}
                            <i className="feather-icon icon-arrow-right ms-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-9 ">
                      <div className="image-itemss">
                        {loading ? (
                          <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : dailyBestSells.length > 0 ? (
                          <Slider {...settings1}>
                            {dailyBestSells.map((product) => (
                              <div key={product._id} className="images swiper-slide px-4">
                                <div className="col">
                                  <div className="card card-product">
                                    <div className="card-body">
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
                                        <Link to="/Shop">
                                          <img
                                            src={product.image || 'https://via.placeholder.com/200'}
                                            alt={product.name}
                                            className="mb-3 img-fluid"
                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                            onError={(e) => {
                                              e.target.src = 'https://via.placeholder.com/200';
                                            }}
                                          />
                                        </Link>
                                        <div className="card-product-action">
                                          <Link
                                            to="/Shop"
                                            className="btn-action"
                                            data-bs-toggle="tooltip"
                                            data-bs-html="true"
                                            title="Quick View"
                                          >
                                            <i className="bi bi-eye" />
                                          </Link>
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
                                      <div className="text-small mb-1">
                                        <Link
                                          to={`/Shop?category=${encodeURIComponent(product.category || '')}`}
                                          className="text-decoration-none text-muted"
                                        >
                                          <small>{product.category || 'Uncategorized'}</small>
                                        </Link>
                                      </div>
                                      <h2 className="fs-6" style={{
                                        minHeight: '48px',
                                        maxHeight: '48px',
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        lineHeight: '1.5'
                                      }}>
                                        <Link
                                          to="/Shop"
                                          className="text-inherit text-decoration-none"
                                          title={product.name}
                                        >
                                          {product.name}
                                        </Link>
                                      </h2>
                                      <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div>
                                          <span className="text-dark">Rs {product.price}</span>{" "}
                                          {product.original_price && product.original_price > product.price && (
                                            <span className="text-decoration-line-through text-muted">
                                              Rs {product.original_price}
                                            </span>
                                          )}
                                        </div>
                                        <div>
                                          <small className="text-warning">
                                            {renderStars(product.rating || 0)}
                                          </small>
                                          <span>
                                            <small>{product.rating || 0}</small>
                                          </span>
                                        </div>
                                      </div>
                                      <div className="d-grid mt-2">
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleAddToCart(product);
                                          }}
                                          className="btn btn-primary"
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
                                            className="feather feather-plus"
                                          >
                                            <line x1={12} y1={5} x2={12} y2={19} />
                                            <line x1={5} y1={12} x2={19} y2={12} />
                                          </svg>{" "}
                                          Add to cart{" "}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </Slider>
                        ) : (
                          <div className="text-center py-5">
                            <p className="text-muted">No products available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
            <>
              <section className="my-lg-14 my-8">
                <div className="container" style={{ marginTop: 50 }}>
                  <div
                    className="row justify-content-center  g-4"
                    style={{ textAlign: "center" }}
                  >
                    <div className="col-md-3 col-sm-6 fade-zoom ">
                      <Zoom>
                        <div className="shadow-effect">
                          <div className="wt-icon-box-wraper center p-a25 p-b50 m-b30 bdr-1 bdr-gray bdr-solid corner-radius step-icon-box bg-white v-icon-effect">
                            <div className="icon-lg m-b20">
                              <div className="mb-6">
                                <img src={refresh} alt="refresh" />
                              </div>
                            </div>
                            <div className="icon-content">
                              <h3 className="h5 mb-3">Easy Returns</h3>
                              <p>
                                Not satisfied with a product? Return it at the
                                doorstep &amp; get a refund within hours. No
                                questions asked
                                <Link to="#!">policy</Link>.
                              </p>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                    <div className="col-md-3 col-sm-12 fade-zoom">
                      <Zoom>
                        <div className="shadow-effect">
                          <div className="wt-icon-box-wraper center p-a25 p-b50 m-b30 bdr-1 bdr-gray bdr-solid corner-radius step-icon-box bg-white v-icon-effect">
                            <div className="icon-lg m-b20">
                              <div className="mb-6">
                                <img src={package1} alt="package" />
                              </div>
                            </div>
                            <div className="icon-content">
                              <h3 className="h5 mb-3">Wide Assortment</h3>
                              <p>
                                Choose from 5000+ products across food, personal
                                care, household, bakery, veg and non-veg &amp;
                                other categories.
                              </p>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                    <div className="col-md-3 col-sm-12 fade-zoom">
                      <Zoom>
                        <div className="shadow-effect">
                          <div className="wt-icon-box-wraper center p-a25 p-b50 m-b30 bdr-1 bdr-gray bdr-solid corner-radius step-icon-box bg-white v-icon-effect">
                            <div className="icon-lg m-b20">
                              <div className="mb-6">
                                <img src={gift} alt="gift" />
                              </div>
                            </div>
                            <div className="icon-content">
                              <h3 className="h5 mb-3">
                                Best Prices &amp; Offers
                              </h3>
                              <p>
                                Cheaper prices than your local supermarket,
                                great cashback offers to top it off. Get best
                                pricess &amp; offers.
                              </p>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                    <div className="col-md-3 col-sm-12 fade-zoom">
                      <Zoom>
                        <div className="shadow-effect">
                          <div className="wt-icon-box-wraper center p-a25 p-b50 m-b30 bdr-1 bdr-gray bdr-solid corner-radius step-icon-box bg-white v-icon-effect">
                            <div className="icon-lg m-b20">
                              <div className="mb-6">
                                <img src={clock} alt="clock" />
                              </div>
                            </div>
                            <div className="icon-content">
                              {/* <h4 className="wt-tilte">Reports</h4> */}
                              <h3 className="h5 mb-3">10 minute grocery now</h3>
                              <p>
                                Get your order delivered to your doorstep at the
                                earliest from Click Mart pickup
                                <p> stores near you.</p>
                              </p>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                  </div>
                </div>
              </section>
            </>
            <>
            <FAQ/>
            </>
            <>
              <div className="container">
                <Slider {...settings2}>
                  {/* <div className="images swiper-slide p-4">
    <div className="item">
      <Link to="#" className="text-decoration-none text-inherit">
        <div className="card card-product mb-4">
          <div className="card-body text-center py-8">
            <img src={product6} alt="Grocery Ecommerce Template" className="mb-3 style={{paddingLeft:'40px'}} " />
            <div>Dairy, Bread &amp; Eggs</div>
          </div>
        </div>
     </Link>
    </div>
  </div>
  <div className="images swiper-slide p-4">
    <div className="item"> 
    <Link to="#" className="text-decoration-none text-inherit">
        <div className="card card-product mb-4">
          <div className="card-body text-center py-8">
            <img src={product9} alt="Grocery Ecommerce Template" className="mb-3"style={{paddingLeft:'40px'}} />
            <div>Snack &amp; Munchies</div>
          </div>
        </div>
     </Link></div>
  </div>
  <div className="images swiper-slide p-4">
    <div className="item">
       <Link to="#" className="text-decoration-none text-inherit">
        <div className="card card-product mb-4">
          <div className="card-body text-center py-8">
            <img src={product3} alt="Grocery Ecommerce Template" className="mb-3"style={{paddingLeft:'40px'}} />
            <div>Bakery &amp; Biscuits</div>
          </div>
        </div>
     </Link></div>
  </div>
  <div className="images swiper-slide p-4">
    <div className="item"> 
    <Link to="#" className="text-decoration-none text-inherit">
        <div className="card card-product mb-4">
          <div className="card-body text-center py-8">
            <img src={product7} alt="Grocery Ecommerce Template " className="mb-3 " style={{paddingLeft:'40px'}} />
            <div>Instant Food</div>
          </div>
        </div>
     </Link></div>
  </div>
  <div className="images swiper-slide p-4">
    <div className="item"> 
    <Link to="#" className="text-decoration-none text-inherit">
        <div className="card card-product mb-4">
          <div className="card-body text-center py-8">
            <img src={product10} alt="Grocery Ecommerce Template" className="mb-3"style={{paddingLeft:'40px'}} />
            <div>Tea, Coffee &amp; Drinks</div>
          </div>
        </div>
     </Link></div>
  </div>
  <div className="images swiper-slide p-4">
    <div className="item">
      <Link to="#" className="text-decoration-none text-inherit">
        <div className="card card-product mb-4">
          <div className="card-body text-center py-8">
            <img src={product2} alt="Grocery Ecommerce Template" className="mb-3" style={{paddingLeft:'40px'}}/>
            <div>Atta, Rice &amp; Dal</div>
          </div>
        </div>
     </Link></div>
  </div>
  <div className="images swiper-slide p-4">
    <div className="item">
       <Link to="#" className="text-decoration-none text-inherit">
        <div className="card card-product mb-4">
          <div className="card-body text-center py-8">
            <img src={product1} alt="Grocery Ecommerce Template" className="mb-3" style={{paddingLeft:'40px'}}/>
            <div>Baby Care</div>
          </div>
        </div>
     </Link></div>
  </div>
  <div className="images swiper-slide p-4">
    <div className="item"> 
    <Link to="#" className="text-decoration-none text-inherit">
        <div className="card card-product mb-4">
          <div className="card-body text-center py-8">
            <img src={product4} alt="Grocery Ecommerce Template" className="mb-3" style={{paddingLeft:'40px'}}/>
            <div>Chicken, Meat &amp; Fish</div>
          </div>
        </div>
     </Link></div>
  </div>
  <div className="images swiper-slide p-4">
    <div className="item"> 
    <Link to="#" className="text-decoration-none text-inherit">
        <div className="card card-product mb-4">
          <div className="card-body text-center py-8">
            <img src={product5} alt="Grocery Ecommerce Template" className="mb-3" style={{paddingLeft:'40px'}}/>
            <div>Cleaning Essentials</div>
          </div>
        </div>
     </Link></div>
  </div>
  <div className="images swiper-slide p-4">
    <div className="item">
      <Link to="#" className="text-decoration-none text-inherit">
        <div className="card card-product mb-4">
          <div className="card-body text-center py-8">
            <img src={product8} alt="Grocery Ecommerce Template" className="mb-3" style={{paddingLeft:'40px'}}/>
            <div>Pet Care</div>
          </div>
        </div>
     </Link>
    </div>
  </div> */}
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product1}
                        style={{ objectFit: "cover" }}
                        className="img-fluid "
                        alt="product"
                      />
                      <h6 class="card-title partner">
                      <div>Baby Care</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product2}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                       <h6 class="card-title">
                       <div>Atta, Rice &amp; Dal</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product3}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                       <h6 class="card-title">
                       <div>Bakery &amp; Biscuits</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product4}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                       <h6 class="card-title">
                       <div>Chicken, Meat &amp; Fish</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product5}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                       <h6 class="card-title">
                       <div>Cleaning Essentials</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product6}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                       <h6 class="card-title">
                       <div>Dairy, Bread &amp; Eggs</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product7}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                       <h6 class="card-title">
                       <div>Instant Food</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product8}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                       <h6 class="card-title">
                      <div>Pet Care</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product9}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                       <h6 class="card-title">
                       <div>Snack &amp; Munchies</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product10}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                       <h6 class="card-title">
                       <div>Tea, Coffee &amp; Drinks</div>
                      </h6>
                    </div>
                  </div>
                </Slider>
              </div>
            </>

            
          </>
      </div>
    </div>
  );
};

export default Home;
