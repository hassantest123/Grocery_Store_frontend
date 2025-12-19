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

  return (
    <div>
      <>
        <ScrollToTop />
      </>
      <>
        {/* section */}
        <section>
          {/* container */}
          <div className="container">
            {/* row */}
            <div className="row">
              {/* col */}
              <div className="col-12">
                {/* text */}
                <div className="p-6 d-flex justify-content-between align-items-center d-md-none">
                  {/* heading */}
                  <h3 className="fs-5 mb-0">Account Setting</h3>
                  {/* btn */}
                  <button
                    className="btn btn-outline-gray-400 text-muted d-md-none"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasAccount"
                    aria-controls="offcanvasAccount"
                  >
                    <i className="fas fa-bars"></i>
                  </button>
                </div>
              </div>
              {/* col */}
              <div className="col-lg-3 col-md-4 col-12 border-end d-none d-md-block">
                <div className="pt-10 pe-lg-10">
                  {/* nav */}
                  <ul className="nav flex-column nav-pills nav-pills-dark">
                    {/* nav item */}
                    <li className="nav-item">
                      <Link
                        className="nav-link "
                        aria-current="page"
                        to="/MyAccountOrder"
                      >
                        <i className="fas fa-shopping-bag me-2" />
                        Your Orders
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link " to="/MyAccountSetting">
                        <i className="fas fa-cog me-2" />
                        Settings
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link " to="/MyAccountAddress">
                        <i className="fas fa-map-marker-alt me-2" />
                        Address
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link " to="/MyAcconutPaymentMethod">
                        <i className="fas fa-credit-card me-2" />
                        Payment Method
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        to="/MyAcconutNotification"
                      >
                        <i className="fas fa-bell me-2" />
                        Notification
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <hr />
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link " to="../index.html">
                        <i className="fas fa-sign-out-alt me-2" />
                        Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-9 col-md-8 col-12">
                <div>
                  {loaderStatus ? (
                    <div className="loader-container">
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
                    <>
                      <div className="p-6 p-lg-10">
                        {isSaving && (
                          <div className="alert alert-info mb-4">
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Saving settings...
                          </div>
                        )}
                        <div className="mb-6">
                          {/* heading */}
                          <h2 className="mb-0">Notification settings</h2>
                        </div>
                        <div className="mb-10">
                          {/* text */}
                          <div className="border-bottom pb-3 mb-5">
                            <h5 className="mb-0">Email Notifications</h5>
                          </div>
                          {/* text */}
                          <div className="d-flex justify-content-between align-items-center mb-6">
                            <div>
                              <h6 className="mb-1">Weekly Notification</h6>
                              <p className="mb-0 ">
                                Various versions have evolved over the years,
                                sometimes by accident, sometimes on purpose .
                              </p>
                            </div>
                            {/* checkbox */}
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="weeklyNotification"
                                checked={settings.email_notifications.weekly_notification}
                                onChange={(e) => handleSettingChange('email_notifications', 'weekly_notification', e.target.checked)}
                                disabled={isSaving}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="weeklyNotification"
                              />
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-6">
                            {/* text */}
                            <div>
                              <h6 className="mb-1">Account Summary</h6>
                              <p className="mb-0 pe-12 ">
                                Pellentesque habitant morbi tristique senectus
                                et netus et malesuada fames ac turpis eguris eu
                                sollicitudin massa. Nulla ipsum odio, aliquam in
                                odio et, fermentum blandit nulla.
                              </p>
                            </div>
                            {/* form checkbox */}
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="accountSummary"
                                checked={settings.email_notifications.account_summary}
                                onChange={(e) => handleSettingChange('email_notifications', 'account_summary', e.target.checked)}
                                disabled={isSaving}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="accountSummary"
                              />
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            {/* text */}
                            <div>
                              <h6 className="mb-1">Order Updates</h6>
                              <p className="mb-0 pe-12 ">
                                Get notified via email when new products are added to the store.
                              </p>
                            </div>
                            {/* form checkbox */}
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="orderUpdatesEmail"
                                checked={settings.email_notifications.order_updates}
                                onChange={(e) => handleSettingChange('email_notifications', 'order_updates', e.target.checked)}
                                disabled={isSaving}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="orderUpdatesEmail"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-10">
                          {/* heading */}
                          <div className="border-bottom pb-3 mb-5">
                            <h5 className="mb-0">Order updates</h5>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-6">
                            <div>
                              {/* heading */}
                              <h6 className="mb-0">Text messages</h6>
                            </div>
                            {/* form checkbox */}
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="textMessages"
                                checked={settings.text_messages.order_updates}
                                onChange={(e) => handleSettingChange('text_messages', 'order_updates', e.target.checked)}
                                disabled={isSaving}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="textMessages"
                              />
                            </div>
                          </div>
                          {/* text */}
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">Call before checkout</h6>
                              <p className="mb-0 ">
                                We'll only call if there are pending changes
                              </p>
                            </div>
                            {/* form checkbox */}
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="callBeforeCheckout"
                                checked={settings.text_messages.call_before_checkout}
                                onChange={(e) => handleSettingChange('text_messages', 'call_before_checkout', e.target.checked)}
                                disabled={isSaving}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="callBeforeCheckout"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-6">
                          {/* text */}
                          <div className="border-bottom pb-3 mb-5">
                            <h5 className="mb-0">Website Notification</h5>
                          </div>
                          <div>
                            {/* form checkbox */}
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="newFollower"
                                checked={settings.website_notifications.new_follower}
                                onChange={(e) => handleSettingChange('website_notifications', 'new_follower', e.target.checked)}
                                disabled={isSaving}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="newFollower"
                              >
                                New Follower
                              </label>
                            </div>
                            {/* form checkbox */}
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="postLike"
                                checked={settings.website_notifications.post_like}
                                onChange={(e) => handleSettingChange('website_notifications', 'post_like', e.target.checked)}
                                disabled={isSaving}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="postLike"
                              >
                                Post Like
                              </label>
                            </div>
                            {/* form checkbox */}
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="someoneFollowedPosted"
                                checked={settings.website_notifications.someone_followed_posted}
                                onChange={(e) => handleSettingChange('website_notifications', 'someone_followed_posted', e.target.checked)}
                                disabled={isSaving}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="someoneFollowedPosted"
                              >
                                Someone you followed posted
                              </label>
                            </div>
                            {/* form checkbox */}
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="postAddedToCollection"
                                checked={settings.website_notifications.post_added_to_collection}
                                onChange={(e) => handleSettingChange('website_notifications', 'post_added_to_collection', e.target.checked)}
                                disabled={isSaving}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="postAddedToCollection"
                              >
                                Post added to collection
                              </label>
                            </div>
                            {/* form checkbox */}
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="orderDelivery"
                                checked={settings.website_notifications.order_delivery}
                                onChange={(e) => handleSettingChange('website_notifications', 'order_delivery', e.target.checked)}
                                disabled={isSaving}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="orderDelivery"
                              >
                                Order Delivery
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
      <>
        {/* modal */}
        <div
          className="offcanvas offcanvas-start"
          tabIndex={-1}
          id="offcanvasAccount"
          aria-labelledby="offcanvasAccountLabel"
        >
          {/* offcanvas header */}
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasAccountLabel">
              My Account
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          {/* offcanvas body */}
          <div className="offcanvas-body">
            <ul className="nav flex-column nav-pills nav-pills-dark">
              {/* nav item */}
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/MyAccountOrder"
                >
                  <i className="fas fa-shopping-bag me-2" />
                  Your Orders
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link " href="/MyAccountSetting">
                  <i className="fas fa-cog me-2" />
                  Settings
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAccountAddress">
                  <i className="fas fa-map-marker-alt me-2" />
                  Address
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAcconutPaymentMethod">
                  <i className="fas fa-credit-card me-2" />
                  Payment Method
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAcconutNotification">
                  <i className="fas fa-bell me-2" />
                  Notification
                </a>
              </li>
            </ul>
            <hr className="my-6" />
            <div>
              {/* nav  */}
              <ul className="nav flex-column nav-pills nav-pills-dark">
                {/* nav item */}
                <li className="nav-item">
                  <a className="nav-link " href="/">
                    <i className="fas fa-sign-out-alt me-2" />
                    Log out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default MyAcconutNotification;
