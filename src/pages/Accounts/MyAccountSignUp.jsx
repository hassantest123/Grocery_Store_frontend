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

    // Validate form - name, phone, and address are required, email is optional
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields (Name, Phone, and Address)',
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

    // Validate email format if provided
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a valid email address',
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
        email: formData.email || null, // Email is optional
        phone: normalized_phone, // Use normalized phone
        address: formData.address,
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
      <ScrollToTop/>
      {/* section */}
      <section className="my-8 lg:my-14">
        {/* container */}
        <div className="container mx-auto px-4">
          {/* row */}
          <div className="flex flex-wrap justify-center items-center">
            {/* Image Column - Order 2 on mobile, Order 1 on large screens */}
            <div className="w-full md:w-1/2 lg:w-1/3 lg:order-1 order-2 mt-8 lg:mt-0">
              {/* img */}
              <img
                src={signupimage}
                alt="Click Mart"
                className="w-full h-auto"
              />
            </div>
            {/* Form Column - Order 1 on mobile, Order 2 on large screens */}
            <div className="w-full md:w-1/2 lg:w-1/3 lg:ml-8 lg:order-2 order-1">
              <div className="mb-5 lg:mb-9">
                <h1 className="mb-1 text-2xl font-bold">Get Start Shopping</h1>
                <p className="text-gray-600">Welcome to Click Mart! Enter your details to get started.</p>
                <p className="text-sm text-gray-500 mt-1">* Required fields: Name, Phone, Address</p>
              </div>
              {/* form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-3">
                  {/* First Name and Last Name Row */}
                  <div className="flex gap-3">
                    {/* First Name */}
                    <div className="flex-1">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        id="firstName"
                        placeholder="First name"
                        aria-label="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {/* Last Name */}
                    <div className="flex-1">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        id="lastName"
                        placeholder="Last name"
                        aria-label="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  {/* Email - Optional */}
                  <div className="w-full">
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      id="email"
                      placeholder="Email (Optional)"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* Phone Number - Required */}
                  <div className="w-full">
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      id="phone"
                      placeholder="Phone Number * (e.g., 030xxxxxxxxxxx)"
                      aria-label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '');
                        // Limit to 11 digits
                        if (value.length <= 11) {
                          setFormData(prev => ({ ...prev, phone: value }));
                        }
                      }}
                      maxLength={11}
                      required
                    />
                    <small className="text-gray-500 text-xs mt-1 block">
                      Format: 11 digits starting with 03 (e.g., 030xxxxxxxxxxx)
                    </small>
                  </div>
                  {/* Address - Required */}
                  <div className="w-full">
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      id="address"
                      placeholder="Address *"
                      aria-label="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {/* Submit Button */}
                  <div className="w-full">
                    <button 
                      type="submit" 
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Registering...' : 'Register'}
                    </button>
                    <div className="text-sm text-gray-600 text-center">
                      Already have an account?{" "}
                      <Link to="/MyAccountSignIn" className="text-primary hover:underline font-medium">
                        Sign in
                      </Link>
                    </div>
                  </div>
                  {/* Terms and Privacy */}
                  <p className="text-xs text-gray-500 text-center">
                    By continuing, you agree to our{" "}
                    <Link to="#!" className="text-primary hover:underline">Terms of Service</Link> &amp;{" "}
                    <Link to="#!" className="text-primary hover:underline">Privacy Policy</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAccountSignUp;
