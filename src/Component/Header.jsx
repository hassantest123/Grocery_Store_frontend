import React, { useState, useEffect } from "react";
import menubanner from "../images/menu-banner.jpg";
import productimage1 from '../images/product-img-1.jpg'
import productimage2 from '../images/product-img-2.jpg'
import productimage3 from '../images/product-img-3.jpg'
import productimage4 from '../images/product-img-4.jpg'
import productimage5 from '../images/product-img-5.jpg'
import { Link, useNavigate, useLocation } from "react-router-dom";
import useCartStore from "../store/cartStore";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // Function to check and update auth state
  const checkAuthState = () => {
    const jwtToken = localStorage.getItem('jwt');
    const userData = localStorage.getItem('user');
    
    if (jwtToken && userData) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Check if user is admin
        setIsAdmin(parsedUser.role === 'admin');
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAdmin(false);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Check auth state on mount
    checkAuthState();

    // Listen for custom auth state change event (for same-tab updates)
    const handleAuthStateChange = () => {
      checkAuthState();
    };

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthState();
    };

    // Add event listeners
    window.addEventListener('authStateChange', handleAuthStateChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('authStateChange', handleAuthStateChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
    // Dispatch custom event to update auth state
    window.dispatchEvent(new Event('authStateChange'));
    navigate('/');
  };

  return (
    <div>
      {/* Animated Underline Styles */}
      <style>{`
        .nav-link-animated {
          position: relative;
          display: inline-block;
          text-decoration: none;
          overflow: hidden;
        }
        
        .nav-link-animated::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #0aad0a;
          transition: width 0.3s ease-in-out;
        }
        
        .nav-link-animated:hover::after,
        .nav-link-animated.active::after {
          width: 100%;
        }
        
        .nav-link-animated:hover {
          color: #0aad0a !important;
        }
        
        /* Mobile navigation animated underline */
        .mobile-nav-link-animated {
          position: relative;
          display: inline-block;
          text-decoration: none;
          overflow: hidden;
        }
        
        .mobile-nav-link-animated::after {
          content: '';
          position: absolute;
          bottom: 8px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #0aad0a;
          transition: width 0.3s ease-in-out;
        }
        
        .mobile-nav-link-animated:hover::after,
        .mobile-nav-link-animated.active::after {
          width: 100%;
        }
        
        .mobile-nav-link-animated:hover {
          color: #0aad0a !important;
        }
      `}</style>
      {/* Top Header Section - Commented Out */}
      {/* This section contains the "Super Value Deals" banner with wishlist, user, and cart icons */}
      {/* 
      <>
        <div className="border-bottom pb-2">
          <div className="bg-light py-1">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-10 col-12 d-flex align-items-center">
                  <span>Super Value Deals - Save more with coupons</span>
                </div>
                <div className="col-md-2 col-xxl-2 text-end d-none d-lg-block">
                  <div className="list-inline d-flex align-items-center justify-content-end gap-3">
                    <div className="list-inline-item">
                      <Link
                        to="/ShopWishList"
                        className="text-muted position-relative"
                        title="Wishlist"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-heart"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                          5
                          <span className="visually-hidden">
                            wishlist items
                          </span>
                        </span>
                      </Link>
                    </div>
                    <div className="list-inline-item">
                      <Link
                        to="/MyAccountSetting"
                        className="text-muted"
                        title="User Account"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-user"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx={12} cy={7} r={4} />
                        </svg>
                      </Link>
                    </div>
                    <div className="list-inline-item">
                      <Link
                        className="text-muted position-relative"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        to="#offcanvasExample"
                        role="button"
                        aria-controls="offcanvasRight"
                        title="Shopping Cart"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-shopping-bag"
                        >
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                          <line x1={3} y1={6} x2={21} y2={6} />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                          1
                          <span className="visually-hidden">
                            cart items
                          </span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      */}
      {/* Top Search Bar Section - Commented Out for Mobile */}
      {/* 
      <>
        <div className="container  displaydesign">
          <div className="row g-4">
            <div className="col-8 col-sm-4 col-lg-9 py-2 ">
              <input
                className="form-control "
                style={{ width: "100%" }}
                list="datalistOptions"
                id="exampleDataList"
                placeholder="Type to search..."
              />
            </div>
            <div className="col-4 col-sm-4 col-lg-3 py-2 d-flex" style={{ justifyContent: 'center' }}>
              <div className="list-inline">
                <div className="list-inline-item">
                  <Link to="/ShopWishList" className="text-muted position-relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-heart"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                      5<span className="visually-hidden">unread messages</span>
                    </span>
                  </Link>
                </div>
                <div className="list-inline-item">
                  <Link
                    to="/MyAccountSetting"
                    className="text-muted"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-user"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx={12} cy={7} r={4} />
                    </svg>
                  </Link>
                </div>
                <div className="list-inline-item">
                  <Link
                    className="text-muted position-relative"
                    to="/ShopCart"
                    role="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-shopping-bag"
                    >
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1={3} y1={6} x2={21} y2={6} />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    {totalItems > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                        {totalItems}
                        <span className="visually-hidden">cart items</span>
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 flex justify-between items-center w-full py-3">
          {/* Store Logo/Brand Name - Left Side */}
          <div className="flex items-center">
            <Link className="flex items-center" to="/" style={{ textDecoration: 'none' }}>
              <span className="font-bold text-3xl text-primary">
                Click Mart
              </span>
            </Link>
            
            {/* Navigation Menu Items - Close to Click Mart (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-6 ml-6">
              <Link 
                to="/AboutUs" 
                className={`text-gray-900 font-semibold nav-link-animated ${location.pathname === '/AboutUs' ? 'active' : ''}`}
                style={{ textDecoration: 'none', fontSize: '16px', paddingBottom: '4px' }}
              >
                About us
              </Link>
              <Link 
                to="/Clients" 
                className={`text-gray-900 font-semibold nav-link-animated ${location.pathname === '/Clients' ? 'active' : ''}`}
                style={{ textDecoration: 'none', fontSize: '16px', paddingBottom: '4px' }}
              >
                Clients
              </Link>
              <Link 
                to="/Services" 
                className={`text-gray-900 font-semibold nav-link-animated ${location.pathname === '/Services' ? 'active' : ''}`}
                style={{ textDecoration: 'none', fontSize: '16px', paddingBottom: '4px' }}
              >
                Services
              </Link>
              <Link 
                to="/Shop" 
                className={`text-gray-900 font-semibold nav-link-animated ${location.pathname === '/Shop' ? 'active' : ''}`}
                style={{ textDecoration: 'none', fontSize: '16px', paddingBottom: '4px' }}
              >
                Shop
              </Link>
              <Link 
                to="/Blog" 
                className={`text-gray-900 font-semibold nav-link-animated ${location.pathname === '/Blog' ? 'active' : ''}`}
                style={{ textDecoration: 'none', fontSize: '16px', paddingBottom: '4px' }}
              >
                Blog
              </Link>
              <Link 
                to="/Contact" 
                className={`text-gray-900 font-semibold nav-link-animated ${location.pathname === '/Contact' ? 'active' : ''}`}
                style={{ textDecoration: 'none', fontSize: '16px', paddingBottom: '4px' }}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Dashboard, Profile, Cart, and Hamburger Menu - Right Side (All in Same Line) */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Dashboard Link for Admin - Show on all screens */}
            {isAdmin && (
              <Link
                to="/AdminDashboard"
                className="flex items-center gap-1.5 px-2 py-1 text-sm border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                style={{ textDecoration: 'none' }}
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
                >
                  <rect x={3} y={3} width={7} height={7} />
                  <rect x={14} y={3} width={7} height={7} />
                  <rect x={14} y={14} width={7} height={7} />
                  <rect x={3} y={14} width={7} height={7} />
                </svg>
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            )}
            {/* Show Profile Icon if logged in, otherwise show Create Account Button */}
            {isLoggedIn ? (
              <Link
                to="/MyAccountSetting"
                className="text-gray-500 flex items-center hover:text-primary transition-colors"
                style={{ textDecoration: 'none' }}
                title="Profile Settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-user"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx={12} cy={7} r={4} />
                </svg>
              </Link>
            ) : (
              <Link 
                to="/MyAccountSignUp" 
                className="bg-primary text-white px-3 py-1 text-sm rounded-lg hover:bg-primary-dark transition-colors"
                style={{ textDecoration: 'none' }}
              >
                <span className="hidden sm:inline">Create Account</span>
                <span className="sm:hidden">Sign Up</span>
              </Link>
            )}
            {/* Cart Icon */}
            <Link
              className="text-gray-500 relative flex items-center gap-2 hover:text-primary transition-colors"
              to="/ShopCart"
              role="button"
              style={{ textDecoration: 'none' }}
            >
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-shopping-bag"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1={3} y1={6} x2={21} y2={6} />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                    <span className="sr-only">cart items</span>
                  </span>
                )}
              </div>
            </Link>
            {/* Mobile Menu Toggle Button (Hamburger) - Right Corner */}
            <button
              className="lg:hidden border-0 p-1 bg-transparent ml-1 text-gray-600 hover:text-gray-900"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-controls="mobileNavMenu"
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isOpen ? (
                  <>
                    <line x1={18} y1={6} x2={6} y2={18} />
                    <line x1={6} y1={6} x2={18} y2={18} />
                  </>
                ) : (
                  <>
                    <line x1={3} y1={12} x2={21} y2={12} />
                    <line x1={3} y1={6} x2={21} y2={6} />
                    <line x1={3} y1={18} x2={21} y2={18} />
                  </>
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Menu - Collapsible */}
          <div className={`lg:hidden absolute w-full left-0 top-full bg-white shadow-lg ${isOpen ? 'block' : 'hidden'}`} style={{ zIndex: 1000, marginTop: '1px' }}>
            <div className="container mx-auto px-4 py-3" id="mobileNavMenu">
              <div className="flex flex-col gap-2 py-3">
                <Link 
                  to="/AboutUs" 
                  className={`text-gray-900 font-semibold mobile-nav-link-animated ${location.pathname === '/AboutUs' ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                  style={{ textDecoration: 'none', fontSize: '16px', padding: '8px 0' }}
                >
                  About us
                </Link>
                <Link 
                  to="/Clients" 
                  className={`text-gray-900 font-semibold mobile-nav-link-animated ${location.pathname === '/Clients' ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                  style={{ textDecoration: 'none', fontSize: '16px', padding: '8px 0' }}
                >
                  Clients
                </Link>
                <Link 
                  to="/Services" 
                  className={`text-gray-900 font-semibold mobile-nav-link-animated ${location.pathname === '/Services' ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                  style={{ textDecoration: 'none', fontSize: '16px', padding: '8px 0' }}
                >
                  Services
                </Link>
                <Link 
                  to="/Shop" 
                  className={`text-gray-900 font-semibold mobile-nav-link-animated ${location.pathname === '/Shop' ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                  style={{ textDecoration: 'none', fontSize: '16px', padding: '8px 0' }}
                >
                  Shop
                </Link>
                <Link 
                  to="/Blog" 
                  className={`text-gray-900 font-semibold mobile-nav-link-animated ${location.pathname === '/Blog' ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                  style={{ textDecoration: 'none', fontSize: '16px', padding: '8px 0' }}
                >
                  Blog
                </Link>
                <Link 
                  to="/Contact" 
                  className={`text-gray-900 font-semibold mobile-nav-link-animated ${location.pathname === '/Contact' ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                  style={{ textDecoration: 'none', fontSize: '16px', padding: '8px 0' }}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>

          {/* All Navigation Menu Items - Commented Out */}
          {/* 
          <input
            className="form-control responsivesearch "
            list="datalistOptions"
            id="exampleDataList"
            placeholder="Type to search..."
            fdprocessedid="9icrif"
            style={{ width: "35%" }}
          />

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile_nav"
            aria-controls="mobile_nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <div className={`containerr ${isOpen ? 'change' : ''}`} onClick={handleClick}>
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </button>

          <div className="collapse navbar-collapse" id="mobile_nav">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0 float-md-right"></ul>
            <ul className="navbar-nav navbar-light">
              <li className="nav-item">
                <li className="nav-item dmenu dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to=""
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span class="me-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-grid"
                      >
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </span>{" "}
                    All Departments
                  </Link>
                  <div
                    className="dropdown-menu sm-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link className="dropdown-item" to="/Shop">
                      Dairy, Bread &amp; Eggs
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Snacks &amp; Munchies
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Fruits &amp; Vegetables
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Cold Drinks &amp; Juices
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Breakfast &amp; Instant Food
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Bakery &amp; Biscuits
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Chicken, Meat &amp; Fish
                    </Link>
                  </div>
                </li>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item dmenu dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  About
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link class="dropdown-item" to="/Blog">
                    Blog
                  </Link>
                  <Link className="dropdown-item" to="/BlogCategory">
                    Blog Category
                  </Link>
                  <Link className="dropdown-item" to="/AboutUs">
                    About us
                  </Link>
                  <Link className="dropdown-item" to="/Contact">
                    Contact
                  </Link>
                </div>
              </li>
              <li className="nav-item dmenu dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Shop
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link className="dropdown-item" to="/Shop">
                    Shop
                  </Link>
                  <Link className="dropdown-item" to="/ShopWishList">
                    Shop Wishlist
                  </Link>
                  <Link className="dropdown-item" to="/ShopCart">
                    Shop Cart
                  </Link>
                  <Link className="dropdown-item" to="/ShopCheckOut">
                    Shop Checkout
                  </Link>
                </div>
              </li>
              <li className="nav-item dmenu dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Stores
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link className="dropdown-item" to="/StoreList">
                    Store List
                  </Link>
                  <Link className="dropdown-item" to="/SingleShop">
                    Single Store
                  </Link>
                </div>
              </li>
              <li className="nav-item dropdown megamenu-li dmenu">
                <Link
                  className="nav-link dropdown-toggle"
                  to="/Shop"
                  id="dropdown01"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  All Services
                </Link>
                <div
                  className="dropdown-menu megamenu sm-menu border-top"
                  aria-labelledby="dropdown01"
                >
                  <div className="row">
                    <div className="col-sm-6 col-lg-3 border-right mb-4">
                      <div>
                        <h6 className="text-primary ps-3">
                          Dairy, Bread &amp; Eggs
                        </h6>
                        <Link className="dropdown-item" to="/Shop">
                          Butter
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Milk Drinks
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Curd &amp; Yogurt
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Eggs
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Buns &amp; Bakery
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Cheese
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Condensed Milk
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Dairy Products
                        </Link>
                      </div>
                    </div>
                    <div className="col-sm-6 col-lg-3 border-right mb-4">
                      <div>
                        <h6 className="text-primary ps-3">
                          Breakfast &amp; Instant Food
                        </h6>
                        <Link className="dropdown-item" to="/Shop">
                          Breakfast Cereal
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Noodles, Pasta &amp; Soup
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Frozen Veg Snacks
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Frozen Non-Veg Snacks
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Vermicelli
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Instant Mixes
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Batter
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Fruit and Juices
                        </Link>
                      </div>
                    </div>
                    <div className="col-sm-6 col-lg-3 mb-4">
                      <div>
                        <h6 className="text-primary ps-3">
                          Cold Drinks &amp; Juices
                        </h6>
                        <Link className="dropdown-item" to="/Shop">
                          Soft Drinks
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Fruit Juices
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Coldpress
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Water &amp; Ice Cubes
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Soda &amp; Mixers
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Health Drinks
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Herbal Drinks
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Milk Drinks
                        </Link>
                      </div>
                    </div>
                    <div className="col-sm-6 col-lg-3 border-right mb-4">
                      <div className="card border-0">
                        <img
                          src={menubanner}
                          style={{ width: "90%" }}
                          alt="eCommerce HTML Template"
                          className="img-fluid rounded-3"
                        />
                        <div className="position-absolute ps-6 mt-8">
                          <h5 className=" mb-0 ">
                            Dont miss this <br />
                            offer today.
                          </h5>
                          <Link
                            to="/Shop"
                            className="btn btn-primary btn-sm mt-3"
                          >
                            Shop Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="nav-item dmenu dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to=""
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Account
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <div>
                    <div>
                      <Link className="dropdown-item" to="/MyAccountSignIn">
                        Sign in
                      </Link>
                      <Link className="dropdown-item" to="/MyAccountSignUp">
                        Signup
                      </Link>
                      <Link
                        className="dropdown-item"
                        to="/MyAccountForgetPassword"
                      >
                        Forgot Password
                      </Link>
                      <Link className="dropdown-item" to="/MyAccountOrder">
                        Orders
                      </Link>
                      <Link className="dropdown-item" to="/MyAccountSetting">
                        Settings
                      </Link>
                      <Link className="dropdown-item" to="/MyAccountAddress">
                        Address
                      </Link>
                      <Link
                        className="dropdown-item"
                        to="/MyAcconutPaymentMethod"
                      >
                        Payment Method
                      </Link>
                      <Link
                        className="dropdown-item"
                        to="/MyAcconutNotification"
                      >
                        Notification
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          */}
        </div>
      </nav>
        {/* Shop Cart - Offcanvas Sidebar */}
        <div
          className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out hidden"
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
        >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <div className="text-left">
              <h5 id="offcanvasRightLabel" className="mb-0 text-xl font-semibold">
                Shop Cart
              </h5>
              <small className="text-gray-500">Location in 382480</small>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 p-2"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div>
              <div className="py-3">
                <ul className="divide-y divide-gray-200">
                <li className="py-3 px-0 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="w-16 flex-shrink-0">
                      <img
                        src={productimage1}
                        alt="Ecommerce"
                        className="w-full h-auto object-contain rounded"
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <h6 className="mb-0 font-semibold">Organic Banana</h6>
                      <span>
                        <small className="text-gray-500">.98 / lb</small>
                      </span>
                      <div className="mt-2 text-sm">
                        <Link to="#!" className="text-gray-600 hover:text-red-600 flex items-center">
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
                            className="feather feather-trash-2 mr-1"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1={10} y1={11} x2={10} y2={17} />
                            <line x1={14} y1={11} x2={14} y2={17} />
                          </svg>
                          Remove
                        </Link>
                      </div>
                    </div>
                    <div className="w-24 flex justify-center">
                      <div className="flex items-center border border-gray-300 rounded">
                        <input
                          type="button"
                          defaultValue="-"
                          className="w-8 h-8 bg-gray-100 text-gray-700 border-0 text-center cursor-pointer hover:bg-gray-200 rounded-l"
                          data-field="quantity"
                        />
                        <input
                          type="number"
                          step={1}
                          max={10}
                          defaultValue={1}
                          name="quantity"
                          className="w-12 h-8 text-center border-0 focus:outline-none"
                        />
                        <input
                          type="button"
                          defaultValue="+"
                          className="w-8 h-8 bg-gray-100 text-gray-700 border-0 text-center cursor-pointer hover:bg-gray-200 rounded-r"
                          data-field="quantity"
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right ml-4">
                      <span className="font-bold">Rs 35.00</span>
                    </div>
                  </div>
                </li>
                <li className="py-3 px-0">
                  <div className="flex items-center">
                    <div className="w-16 flex-shrink-0">
                      <img
                        src={productimage2}
                        alt="Ecommerce"
                        className="w-full h-auto object-contain rounded"
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <h6 className="mb-0 font-semibold">Fresh Garlic, 250g</h6>
                      <span>
                        <small className="text-gray-500">250g</small>
                      </span>
                      <div className="mt-2 text-sm">
                        <Link to="#!" className="text-gray-600 hover:text-red-600 flex items-center">
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
                            className="feather feather-trash-2 mr-1"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1={10} y1={11} x2={10} y2={17} />
                            <line x1={14} y1={11} x2={14} y2={17} />
                          </svg>
                          Remove
                        </Link>
                      </div>
                    </div>
                    <div className="w-24 flex justify-center">
                      <div className="flex items-center border border-gray-300 rounded">
                        <input
                          type="button"
                          defaultValue="-"
                          className="w-8 h-8 bg-gray-100 text-gray-700 border-0 text-center cursor-pointer hover:bg-gray-200 rounded-l"
                          data-field="quantity"
                        />
                        <input
                          type="number"
                          step={1}
                          max={10}
                          defaultValue={1}
                          name="quantity"
                          className="w-12 h-8 text-center border-0 focus:outline-none"
                        />
                        <input
                          type="button"
                          defaultValue="+"
                          className="w-8 h-8 bg-gray-100 text-gray-700 border-0 text-center cursor-pointer hover:bg-gray-200 rounded-r"
                          data-field="quantity"
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right ml-4">
                      <span className="font-bold">Rs 20.97</span>
                      <span className="block line-through text-gray-500 text-sm">
                        Rs 26.97
                      </span>
                    </div>
                  </div>
                </li>
                <li className="py-3 px-0">
                  <div className="flex items-center">
                    <div className="w-16 flex-shrink-0">
                      <img
                        src={productimage3}
                        alt="Ecommerce"
                        className="w-full h-auto object-contain rounded"
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <h6 className="mb-0 font-semibold">Fresh Onion, 1kg</h6>
                      <span>
                        <small className="text-gray-500">1 kg</small>
                      </span>
                      <div className="mt-2 text-sm">
                        <Link to="#!" className="text-gray-600 hover:text-red-600 flex items-center">
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
                            className="feather feather-trash-2 mr-1"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1={10} y1={11} x2={10} y2={17} />
                            <line x1={14} y1={11} x2={14} y2={17} />
                          </svg>
                          Remove
                        </Link>
                      </div>
                    </div>
                    <div className="w-24 flex justify-center">
                      <div className="flex items-center border border-gray-300 rounded">
                        <input
                          type="button"
                          defaultValue="-"
                          className="w-8 h-8 bg-gray-100 text-gray-700 border-0 text-center cursor-pointer hover:bg-gray-200 rounded-l"
                          data-field="quantity"
                        />
                        <input
                          type="number"
                          step={1}
                          max={10}
                          defaultValue={1}
                          name="quantity"
                          className="w-12 h-8 text-center border-0 focus:outline-none"
                        />
                        <input
                          type="button"
                          defaultValue="+"
                          className="w-8 h-8 bg-gray-100 text-gray-700 border-0 text-center cursor-pointer hover:bg-gray-200 rounded-r"
                          data-field="quantity"
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right ml-4">
                      <span className="font-bold">Rs 25.00</span>
                      <span className="block line-through text-gray-500 text-sm">
                        Rs 45.00
                      </span>
                    </div>
                  </div>
                </li>
                <li className="py-3 px-0">
                  <div className="flex items-center">
                    <div className="w-16 flex-shrink-0">
                      <img
                        src={productimage4}
                        alt="Ecommerce"
                        className="w-full h-auto object-contain rounded"
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <h6 className="mb-0 font-semibold">Fresh Ginger</h6>
                      <span>
                        <small className="text-gray-500">250g</small>
                      </span>
                      <div className="mt-2 text-sm">
                        <Link to="#!" className="text-gray-600 hover:text-red-600 flex items-center">
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
                            className="feather feather-trash-2 mr-1"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1={10} y1={11} x2={10} y2={17} />
                            <line x1={14} y1={11} x2={14} y2={17} />
                          </svg>
                          Remove
                        </Link>
                      </div>
                    </div>
                    <div className="w-24 flex justify-center">
                      <div className="flex items-center border border-gray-300 rounded">
                        <input
                          type="button"
                          defaultValue="-"
                          className="w-8 h-8 bg-gray-100 text-gray-700 border-0 text-center cursor-pointer hover:bg-gray-200 rounded-l"
                          data-field="quantity"
                        />
                        <input
                          type="number"
                          step={1}
                          max={10}
                          defaultValue={1}
                          name="quantity"
                          className="w-12 h-8 text-center border-0 focus:outline-none"
                        />
                        <input
                          type="button"
                          defaultValue="+"
                          className="w-8 h-8 bg-gray-100 text-gray-700 border-0 text-center cursor-pointer hover:bg-gray-200 rounded-r"
                          data-field="quantity"
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right ml-4">
                      <span className="font-bold">Rs 39.87</span>
                      <span className="block line-through text-gray-500 text-sm">
                        Rs 45.00
                      </span>
                    </div>
                  </div>
                </li>
                <li className="py-3 px-0 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="w-16 flex-shrink-0">
                      <img
                        src={productimage5}
                        alt="Ecommerce"
                        className="w-full h-auto object-contain rounded"
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <h6 className="mb-0 font-semibold">
                        Apple Royal Gala, 4 Pieces Box
                      </h6>
                      <span>
                        <small className="text-gray-500">4 Apple</small>
                      </span>
                      <div className="mt-2 text-sm">
                        <Link to="#!" className="text-gray-600 hover:text-red-600 flex items-center">
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
                            className="feather feather-trash-2 mr-1"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1={10} y1={11} x2={10} y2={17} />
                            <line x1={14} y1={11} x2={14} y2={17} />
                          </svg>
                          Remove
                        </Link>
                      </div>
                    </div>
                    <div className="w-24 flex justify-center">
                      <div className="flex items-center border border-gray-300 rounded">
                        <input
                          type="button"
                          defaultValue="-"
                          className="w-8 h-8 bg-gray-100 text-gray-700 border-0 text-center cursor-pointer hover:bg-gray-200 rounded-l"
                          data-field="quantity"
                        />
                        <input
                          type="number"
                          step={1}
                          max={10}
                          defaultValue={1}
                          name="quantity"
                          className="w-12 h-8 text-center border-0 focus:outline-none"
                        />
                        <input
                          type="button"
                          defaultValue="+"
                          className="w-8 h-8 bg-gray-100 text-gray-700 border-0 text-center cursor-pointer hover:bg-gray-200 rounded-r"
                          data-field="quantity"
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right ml-4">
                      <span className="font-bold">Rs 45.00</span>
                      <span className="block line-through text-gray-500 text-sm">
                        Rs 50.00
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="w-full">
              <button
                className="w-full bg-primary text-white px-6 py-4 rounded-lg hover:bg-primary-dark transition-colors font-semibold flex justify-between items-center text-lg"
                type="submit"
              >
                Go to Checkout <span className="font-bold">Rs 120.00</span>
              </button>
            </div>
          </div>
        </div>
      </div>
        {/* Modal - Location Selector */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden"
          id="locationModal"
          tabIndex={-1}
          aria-labelledby="locationModalLabel"
          aria-hidden="true"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h5 className="mb-1 text-lg font-semibold" id="locationModalLabel">
                    Choose your Delivery Location
                  </h5>
                  <p className="mb-0 text-sm text-gray-600">
                    Enter your address and we will specify the offer you area.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 p-2"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="my-5">
                <input
                  type="search"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Search your area"
                />
              </div>
              <div className="flex justify-between items-center mb-2">
                <h6 className="mb-0 font-semibold">Select Location</h6>
                <Link
                  to="#"
                  className="px-3 py-1 border border-gray-400 text-gray-600 rounded text-sm hover:bg-gray-100 transition-colors"
                >
                  Clear All
                </Link>
              </div>
              <div>
                <div data-simplebar style={{ height: 300 }}>
                  <div className="divide-y divide-gray-200">
                    <Link
                      to="#"
                      className="flex justify-between items-center px-2 py-3 hover:bg-gray-50 transition-colors bg-primary-light"
                    >
                      <span>Alabama</span>
                      <span>Min: Rs 20</span>
                    </Link>
                    <Link
                      to="#"
                      className="flex justify-between items-center px-2 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span>Alaska</span>
                      <span>Min: Rs 30</span>
                    </Link>
                    <Link
                      to="#"
                      className="flex justify-between items-center px-2 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span>Arizona</span>
                      <span>Min: Rs 50</span>
                    </Link>
                    <Link
                      to="#"
                      className="flex justify-between items-center px-2 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span>California</span>
                      <span>Min: Rs 29</span>
                    </Link>
                    <Link
                      to="#"
                      className="flex justify-between items-center px-2 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span>Colorado</span>
                      <span>Min: Rs 80</span>
                    </Link>
                    <Link
                      to="#"
                      className="flex justify-between items-center px-2 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span>Florida</span>
                      <span>Min: Rs 90</span>
                    </Link>
                    <Link
                      to="#"
                      className="flex justify-between items-center px-2 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span>Arizona</span>
                      <span>Min: Rs 50</span>
                    </Link>
                    <Link
                      to="#"
                      className="flex justify-between items-center px-2 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span>California</span>
                      <span>Min: Rs 29</span>
                    </Link>
                    <Link
                      to="#"
                      className="flex justify-between items-center px-2 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span>Colorado</span>
                      <span>Min: Rs 80</span>
                    </Link>
                    <Link
                      to="#"
                      className="flex justify-between items-center px-2 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span>Florida</span>
                      <span>Min: Rs 90</span>
                    </Link>
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

export default Header;
