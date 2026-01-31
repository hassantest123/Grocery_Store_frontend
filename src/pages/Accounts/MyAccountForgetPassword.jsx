import React, { useState } from "react";
import forgetpassword from "../../images/fp-g.svg";
import { Link, useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import userApi from "../../Model/Data/User/User";
import Swal from 'sweetalert2';

const MyAccountForgetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email
    if (!email || !email.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter your email address',
      });
      setIsLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call forgot password API
      const response = await userApi.forgotPassword(email.trim());
      
      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Email Sent!',
          text: response.data.DB_DATA?.message || 'New updated password sent on your email, please check email and log in with new password',
          timer: 3000,
          showConfirmButton: true,
        }).then(() => {
          // Redirect to login page
          navigate('/MyAccountSignIn');
        });
        
        // Clear email field
        setEmail('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data?.ERROR_DESCRIPTION || 'Failed to send reset email. Please try again.',
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.ERROR_DESCRIPTION || error.message || 'Failed to send reset email. Please try again.';
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
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
                src={forgetpassword}
                alt="Click Mart"
                className="w-full h-auto"
              />
            </div>
            {/* Form Column - Order 1 on mobile, Order 2 on large screens */}
            <div className="w-full md:w-1/2 lg:w-1/3 lg:ml-8 lg:order-2 order-1">
              <div className="mb-5 lg:mb-9">
                {/* heading */}
                <h1 className="mb-2 text-2xl font-bold">Forgot your password?</h1>
                <p className="text-gray-600">
                  Please enter the email address associated with your
                  account and We will email you a link to reset your
                  password.
                </p>
              </div>
              {/* form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-3">
                  {/* Email Input */}
                  <div className="w-full">
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      id="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {/* Sign In Link */}
                  <div className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/MyAccountSignIn" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </div>
                  {/* Buttons */}
                  <div className="w-full space-y-2">
                    <button 
                      type="submit" 
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Reset Password'}
                    </button>
                    <Link 
                      to="/MyAccountSignUp" 
                      className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
                    >
                      Back
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

export default MyAccountForgetPassword;
