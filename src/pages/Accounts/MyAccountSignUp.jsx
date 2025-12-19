import React, { useState } from "react";
import signupimage from '../../images/signup-g.svg'
import { Link, useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import userApi from "../../Model/Data/User/User";
import Swal from 'sweetalert2';

const MyAccountSignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
      });
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Password must be at least 6 characters long',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Combine first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`;

      // Call register API
      const response = await userApi.registerUser({
        name: fullName,
        email: formData.email,
        password: formData.password,
        address: formData.address || null,
        phone: formData.phone || null,
      });

      if (response.status === 201 && response.data.STATUS === "SUCCESSFUL") {
        // Save token to localStorage
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
          title: 'Registration Successful!',
          text: 'Your account has been created successfully',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          // Redirect to home page or sign in
          navigate('/');
        });
      } else {
        // Handle API error response
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: response.data.ERROR_DESCRIPTION || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.ERROR_DESCRIPTION || error.message || 'Failed to register. Please try again.';
      
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
       <>
            <ScrollToTop/>
            </>
      <>
        {/* section */}
        <section className="my-lg-14 my-8">
          {/* container */}
          <div className="container">
            {/* row */}
            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
                {/* img */}
                <img
                  src={signupimage}
                  alt="Click Mart"
                  className="img-fluid"
                />
              </div>
              {/* col */}
              <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
                <div className="mb-lg-9 mb-5">
                  <h1 className="mb-1 h2 fw-bold">Get Start Shopping</h1>
                  <p>Welcome to Click Mart! Enter your email to get started.</p>
                </div>
                {/* form */}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* col */}
                    <div className="col">
                      {/* input */}
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        placeholder="First name"
                        aria-label="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col">
                      {/* input */}
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        placeholder="Last name"
                        aria-label="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
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
                        type="tel"
                        className="form-control"
                        id="phone"
                        placeholder="Phone Number"
                        aria-label="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12">
                      {/* input */}
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        placeholder="Address"
                        aria-label="Address"
                        value={formData.address}
                        onChange={handleInputChange}
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
                        minLength={6}
                      />
                    </div>
                    {/* btn */}
                    <div className="col-12 d-grid">
                      {" "}
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Registering...' : 'Register'}
                      </button>
                      <span className="navbar-text">
                          Already have an account?{" "}

                          <Link to="/MyAccountSignIn">Sign in</Link>
                        </span>
                    </div>
                    {/* text */}
                    <p>
                      <small>
                        By continuing, you agree to our{" "}
                        <Link to="#!"> Terms of Service</Link> &amp;{" "}
                        <Link to="#!">Privacy Policy</Link>
                      </small>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    </div>
  );
};

export default MyAccountSignUp;
