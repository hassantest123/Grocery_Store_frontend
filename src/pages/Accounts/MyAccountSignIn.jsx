import React, { useState } from "react";
import signinimage from '../../images/signin-g.svg'
import { Link, useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import userApi from "../../Model/Data/User/User";
import Swal from 'sweetalert2';
// import Grocerylogo from '../../images/Grocerylogo.png'

const MyAccountSignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter both email and password',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call login API
      const response = await userApi.loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        // Save token to localStorage with key 'jwt'
        if (response.data.DB_DATA.token) {
          localStorage.setItem('jwt', response.data.DB_DATA.token);
        }

        // Save user data to localStorage
        if (response.data.DB_DATA.user) {
          localStorage.setItem('user', JSON.stringify(response.data.DB_DATA.user));
        }

        // Dispatch custom event to update Header in real-time
        window.dispatchEvent(new Event('authStateChange'));

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back to Click Mart!',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          // Redirect to home page
          navigate('/');
        });
      } else {
        // Handle API error response
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: response.data.ERROR_DESCRIPTION || 'Invalid email or password. Please try again.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.ERROR_DESCRIPTION || error.message || 'Failed to login. Please try again.';
      
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <>
        <div>
          {/* navigation */}
          {/* <div className="border-bottom shadow-sm">
            <nav className="navbar navbar-light py-2">
              <div className="container justify-content-center justify-content-lg-between">
                <Link className="navbar-brand" to="../index.html">
                  <img
                    src={Grocerylogo}
                    alt="Click Mart"
                    className="d-inline-block align-text-top"
                  />
                </Link>
                <span className="navbar-text">
                  Already have an account? <Link to="signin.html">Sign in</Link>
                </span>
              </div>
            </nav>
          </div> */}
          {/* section */}
          <>
            <ScrollToTop/>
            </>
          <section className="my-lg-14 my-8">
            <div className="container">
              {/* row */}
              <div className="row justify-content-center align-items-center">
                <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
                  {/* img */}
                  <img
                    src={signinimage}
                    alt="Click Mart"
                    className="img-fluid"
                  />
                </div>
                {/* col */}
                <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
                  <div className="mb-lg-9 mb-5">
                    <h1 className="mb-1 h2 fw-bold">Sign in to Click Mart</h1>
                    <p>
                      Welcome back to Click Mart! Enter your email to get
                      started.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {/* row */}
                      <div className="col-12">
                        {/* input */}
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-12">
                        {/* input */}
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="d-flex justify-content-between">
                        {/* form check */}
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleInputChange}
                          />
                          {/* label */}{" "}
                          <label
                            className="form-check-label"
                            htmlFor="rememberMe"
                          >
                            Remember me
                          </label>
                        </div>
                        <div>
                          {" "}
                          Forgot password?{" "}
                          <Link to="/MyAccountForgetPassword">Reset it</Link>
                        </div>
                      </div>
                      {/* btn */}
                      <div className="col-12 d-grid">
                        {" "}
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                      </div>
                      {/* link */}
                      <div>
                        Don't have an account?{" "}
                        <Link to="/MyAccountSignUp"> Sign Up</Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    </div>
  );
};

export default MyAccountSignIn;
