import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import Swal from 'sweetalert2';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const jwtToken = localStorage.getItem('jwt');

    if (!jwtToken || !userData) {
      // If no token or user data, redirect to login
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please login to view your profile',
      }).then(() => {
        navigate('/MyAccountSignIn');
      });
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/MyAccountSignIn');
    }
  }, [navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear localStorage
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been successfully logged out',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate('/');
        });
      }
    });
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ScrollToTop />
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h3 className="mb-0">My Profile</h3>
                </div>
                <div className="card-body p-4">
                  {/* Profile Icon */}
                  <div className="text-center mb-4">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{ width: '100px', height: '100px', fontSize: '3rem' }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>

                  {/* User Information */}
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Full Name</label>
                    <div className="form-control-plaintext border-bottom pb-2">
                      {user.name || 'Not provided'}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Email Address</label>
                    <div className="form-control-plaintext border-bottom pb-2">
                      {user.email || 'Not provided'}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Phone Number</label>
                    <div className="form-control-plaintext border-bottom pb-2">
                      {user.phone || 'Not provided'}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Address</label>
                    <div className="form-control-plaintext border-bottom pb-2">
                      {user.address || 'Not provided'}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/MyAccountSetting')}
                    >
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;

