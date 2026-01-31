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
    phone: '',
    password: '',
    rememberMe: false,
  });
  
  // Check if phone number matches the special admin phone
  const isSpecialPhone = formData.phone.trim().replace(/[\s-]/g, '') === '03286440332';

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

    // Validate form - only phone is required
    if (!formData.phone || !formData.phone.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter your phone number',
      });
      setIsLoading(false);
      return;
    }

    // Validate phone format (Pakistani format: 11 digits starting with 03)
    const phone_regex = /^03\d{9}$/;
    const normalized_phone = formData.phone.trim().replace(/[\s-]/g, '');
    if (!phone_regex.test(normalized_phone)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Phone number must be in Pakistani format: 11 digits starting with 03 (e.g., 030xxxxxxxxxxx)',
      });
      setIsLoading(false);
      return;
    }

    // For special phone number, password is required
    if (normalized_phone === '03286440332') {
      if (!formData.password || !formData.password.trim()) {
        Swal.fire({
          icon: 'error',
          title: 'Security Required',
          text: 'Please enter your password for security verification.',
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      // Call login API - include password if it's the special phone number
      const loginData = {
        phone: normalized_phone,
      };
      
      // Add password only for the special phone number
      if (normalized_phone === '03286440332') {
        loginData.password = formData.password.trim();
      }
      
      // Debug: Log the payload being sent (remove in production)
      console.log('Login payload:', { phone: loginData.phone, hasPassword: !!loginData.password });
      
      const response = await userApi.loginUser(loginData);

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
          text: response.data.ERROR_DESCRIPTION || 'Invalid phone number. Please try again.',
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
      <ScrollToTop/>
      <section className="my-8 lg:my-14">
        <div className="container mx-auto px-4">
          {/* row */}
          <div className="flex flex-wrap justify-center items-center">
            {/* Image Column - Order 2 on mobile, Order 1 on large screens */}
            <div className="w-full md:w-1/2 lg:w-1/3 lg:order-1 order-2 mt-8 lg:mt-0">
              {/* img */}
              <img
                src={signinimage}
                alt="Click Mart"
                className="w-full h-auto"
              />
            </div>
            {/* Form Column - Order 1 on mobile, Order 2 on large screens */}
            <div className="w-full md:w-1/2 lg:w-1/3 lg:ml-8 lg:order-2 order-1">
              <div className="mb-5 lg:mb-9">
                <h1 className="mb-1 text-2xl font-bold">Sign in to Click Mart</h1>
                <p className="text-gray-600">
                  Welcome back to Click Mart! Enter your phone number to login.
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-3">
                  {/* Phone Number Input */}
                  <div className="w-full">
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      id="phone"
                      placeholder="Phone Number (e.g., 030xxxxxxxxxxx)"
                      value={formData.phone}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '');
                        // Limit to 11 digits
                        if (value.length <= 11) {
                          const normalizedValue = value.trim().replace(/[\s-]/g, '');
                          // Clear password if phone number changes away from special number
                          if (normalizedValue !== '03286440332') {
                            setFormData(prev => ({ ...prev, phone: value, password: '' }));
                          } else {
                            setFormData(prev => ({ ...prev, phone: value }));
                          }
                        }
                      }}
                      maxLength={11}
                      required
                    />
                    <small className="text-gray-500 text-xs mt-1 block">
                      Format: 11 digits starting with 03 (e.g., 030xxxxxxxxxxx)
                    </small>
                  </div>
                  
                  {/* Password Input - Only shown for special phone number */}
                  {isSpecialPhone && (
                    <div className="w-full">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        id="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <small className="text-gray-500 text-xs mt-1 block">
                        Additional security verification required for this account.
                      </small>
                    </div>
                  )}
                  
                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                      type="checkbox"
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <label
                      className="ml-2 text-gray-700 cursor-pointer"
                      htmlFor="rememberMe"
                    >
                      Remember me
                    </label>
                  </div>
                  {/* Submit Button */}
                  <div className="w-full">
                    <button 
                      type="submit" 
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </div>
                  {/* Sign Up Link */}
                  <div className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/MyAccountSignUp" className="text-primary hover:underline font-medium">
                      Sign Up
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAccountSignIn;
