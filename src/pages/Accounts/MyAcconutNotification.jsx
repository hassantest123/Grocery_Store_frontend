import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import notificationApi from "../../Model/Data/Notification/Notification";
import Swal from "sweetalert2";

const MyAcconutNotification = () => {
  const navigate = useNavigate();
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [settings, setSettings] = useState({
    email_notifications: {
      weekly_notification: false,
      account_summary: false,
      order_updates: false,
    },
    text_messages: {
      call_before_checkout: false,
      order_updates: false,
    },
    website_notifications: {
      new_follower: true,
      post_like: true,
      someone_followed_posted: true,
      post_added_to_collection: true,
      order_delivery: true,
    },
  });

  // Fetch notification settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoaderStatus(true);
        
        // Check authentication
        const token = localStorage.getItem("token") || localStorage.getItem("jwt") || localStorage.getItem("authToken");
        if (!token) {
          navigate("/MyAccountSignIn");
          return;
        }

        const response = await notificationApi.getSettings();
        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
          const fetchedSettings = response.data.DB_DATA.settings;
          if (fetchedSettings) {
            setSettings({
              email_notifications: fetchedSettings.email_notifications || settings.email_notifications,
              text_messages: fetchedSettings.text_messages || settings.text_messages,
              website_notifications: fetchedSettings.website_notifications || settings.website_notifications,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load notification settings. Please try again.',
        });
      } finally {
        setLoaderStatus(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  // Handle setting change
  const handleSettingChange = async (category, subCategory, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [subCategory]: value,
      },
    };
    
    setSettings(newSettings);
    
    // Auto-save on change
    await saveSettings(newSettings);
  };

  // Save settings to backend
  const saveSettings = async (settingsToSave = settings) => {
    try {
      setIsSaving(true);
      
      const response = await notificationApi.updateSettings(settingsToSave);
      
      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        // Settings saved successfully
        console.log('Notification settings saved successfully');
      } else {
        throw new Error(response.data.ERROR_DESCRIPTION || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save notification settings. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authStateChange"));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Mobile Header */}
          <div className="md:hidden flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Account Setting</h3>
            <button
              className="p-2 text-gray-600 hover:text-gray-900"
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation - Desktop */}
            <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
              <div className="pt-4 lg:pt-8 pr-0 lg:pr-8">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Settings</h4>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                        to="/MyAccountOrder"
                      >
                        <i className="fas fa-shopping-bag w-5 mr-3"></i>
                        Your Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                        to="/MyAccountSetting"
                      >
                        <i className="fas fa-cog w-5 mr-3"></i>
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                        to="/MyAccountAddress"
                      >
                        <i className="fas fa-map-marker-alt w-5 mr-3"></i>
                        Address
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                        to="/MyAcconutPaymentMethod"
                      >
                        <i className="fas fa-credit-card w-5 mr-3"></i>
                        Payment Method
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg"
                        to="/MyAcconutNotification"
                      >
                        <i className="fas fa-bell w-5 mr-3"></i>
                        Notification
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                        to="/MyAccountFavorites"
                      >
                        <i className="fas fa-heart w-5 mr-3"></i>
                        Favorites
                      </Link>
                    </li>
                    <li className="pt-2 mt-2 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              {loaderStatus ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <MagnifyingGlass
                    visible={true}
                    height="100"
                    width="100"
                    ariaLabel="magnifying-glass-loading"
                    wrapperStyle={{}}
                    wrapperclassName="magnifying-glass-wrapper"
                    glassColor="#c0efff"
                    color="#0aad0a"
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 lg:p-10">
                  {isSaving && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center text-blue-800">
                      <i className="fas fa-spinner fa-spin mr-3"></i>
                      <span className="font-medium">Saving settings...</span>
                    </div>
                  )}

                  <div className="mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Notification settings</h2>
                  </div>

                  {/* Email Notifications Section */}
                  <div className="mb-10">
                    <div className="border-b border-gray-200 pb-3 mb-6">
                      <h5 className="text-lg font-semibold text-gray-900">Email Notifications</h5>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Weekly Notification */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <h6 className="text-base font-semibold text-gray-900 mb-2">Weekly Notification</h6>
                          <p className="text-sm text-gray-600">
                            Various versions have evolved over the years,
                            sometimes by accident, sometimes on purpose.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.email_notifications.weekly_notification}
                            onChange={(e) => handleSettingChange('email_notifications', 'weekly_notification', e.target.checked)}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      {/* Account Summary */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <h6 className="text-base font-semibold text-gray-900 mb-2">Account Summary</h6>
                          <p className="text-sm text-gray-600">
                            Pellentesque habitant morbi tristique senectus
                            et netus et malesuada fames ac turpis eguris eu
                            sollicitudin massa. Nulla ipsum odio, aliquam in
                            odio et, fermentum blandit nulla.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.email_notifications.account_summary}
                            onChange={(e) => handleSettingChange('email_notifications', 'account_summary', e.target.checked)}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      {/* Order Updates */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <h6 className="text-base font-semibold text-gray-900 mb-2">Order Updates</h6>
                          <p className="text-sm text-gray-600">
                            Get notified via email when new products are added to the store.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.email_notifications.order_updates}
                            onChange={(e) => handleSettingChange('email_notifications', 'order_updates', e.target.checked)}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Order Updates Section */}
                  <div className="mb-10">
                    <div className="border-b border-gray-200 pb-3 mb-6">
                      <h5 className="text-lg font-semibold text-gray-900">Order updates</h5>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Text Messages */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <h6 className="text-base font-semibold text-gray-900">Text messages</h6>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.text_messages.order_updates}
                            onChange={(e) => handleSettingChange('text_messages', 'order_updates', e.target.checked)}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      {/* Call Before Checkout */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <h6 className="text-base font-semibold text-gray-900 mb-2">Call before checkout</h6>
                          <p className="text-sm text-gray-600">
                            We'll only call if there are pending changes
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.text_messages.call_before_checkout}
                            onChange={(e) => handleSettingChange('text_messages', 'call_before_checkout', e.target.checked)}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Website Notification Section */}
                  <div className="mb-6">
                    <div className="border-b border-gray-200 pb-3 mb-6">
                      <h5 className="text-lg font-semibold text-gray-900">Website Notification</h5>
                    </div>
                    
                    <div className="space-y-4">
                      {/* New Follower */}
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                          checked={settings.website_notifications.new_follower}
                          onChange={(e) => handleSettingChange('website_notifications', 'new_follower', e.target.checked)}
                          disabled={isSaving}
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">New Follower</span>
                      </label>

                      {/* Post Like */}
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                          checked={settings.website_notifications.post_like}
                          onChange={(e) => handleSettingChange('website_notifications', 'post_like', e.target.checked)}
                          disabled={isSaving}
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">Post Like</span>
                      </label>

                      {/* Someone Followed Posted */}
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                          checked={settings.website_notifications.someone_followed_posted}
                          onChange={(e) => handleSettingChange('website_notifications', 'someone_followed_posted', e.target.checked)}
                          disabled={isSaving}
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">Someone you followed posted</span>
                      </label>

                      {/* Post Added to Collection */}
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                          checked={settings.website_notifications.post_added_to_collection}
                          onChange={(e) => handleSettingChange('website_notifications', 'post_added_to_collection', e.target.checked)}
                          disabled={isSaving}
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">Post added to collection</span>
                      </label>

                      {/* Order Delivery */}
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                          checked={settings.website_notifications.order_delivery}
                          onChange={(e) => handleSettingChange('website_notifications', 'order_delivery', e.target.checked)}
                          disabled={isSaving}
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">Order Delivery</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h5 className="text-lg font-semibold text-gray-900">My Account</h5>
              <button
                type="button"
                className="p-2 text-gray-600 hover:text-gray-900"
                onClick={() => setShowMobileMenu(false)}
                aria-label="Close"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Settings</h4>
              <ul className="space-y-1">
                <li>
                  <Link
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                    to="/MyAccountOrder"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-shopping-bag w-5 mr-3"></i>
                    Your Orders
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                    to="/MyAccountSetting"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-cog w-5 mr-3"></i>
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                    to="/MyAccountAddress"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-map-marker-alt w-5 mr-3"></i>
                    Address
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors"
                    to="/MyAcconutPaymentMethod"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-credit-card w-5 mr-3"></i>
                    Payment Method
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg"
                    to="/MyAcconutNotification"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-bell w-5 mr-3"></i>
                    Notification
                  </Link>
                </li>
              </ul>
              <hr className="my-4 border-gray-200" />
              <div>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAcconutNotification;
