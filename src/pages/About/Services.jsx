import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import { Slide, Zoom } from "react-awesome-reveal";
import ScrollToTop from "../ScrollToTop";
import idea from "../../images/idea.gif";
import team from "../../images/team.gif";
import award from "../../images/award.gif";
import package1 from "../../images/package.svg";
import refresh from "../../images/refresh-cw.svg";
import clock from "../../images/clock.svg";

const Services = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  const services = [
    {
      id: 1,
      icon: package1,
      title: "Fast Delivery",
      description: "Quick and reliable delivery service to your doorstep. We ensure your groceries arrive fresh and on time."
    },
    {
      id: 2,
      icon: refresh,
      title: "Easy Returns",
      description: "Hassle-free return policy. If you're not satisfied, return items within 7 days for a full refund."
    },
    {
      id: 3,
      icon: clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support. Our team is always ready to help you with any queries or issues."
    },
    {
      id: 4,
      icon: idea,
      title: "Smart Shopping",
      description: "AI-powered recommendations and personalized shopping experience tailored to your preferences."
    },
    {
      id: 5,
      icon: award,
      title: "Quality Guarantee",
      description: "We guarantee the freshness and quality of all products. Your satisfaction is our priority."
    },
    {
      id: 6,
      icon: team,
      title: "Expert Team",
      description: "Dedicated team of professionals ensuring the best shopping experience for all our customers."
    }
  ];

  return (
    <div>
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
            <ScrollToTop />
            <>
              {/* Hero Section */}
              <section className="position-relative pt-5">
                <div
                  className="position-absolute top-0 start-0 w-100 bg-position-bottom-center bg-size-cover bg-repeat-0"
                  style={{
                    backgroundImage: "url(assets/img/about/hero-bg.svg)",
                  }}
                >
                  <div className="d-lg-none" style={{ height: 960 }} />
                  <div className="d-none d-lg-block" style={{ height: 768 }} />
                </div>
                <div className="container position-relative zindex-5 pt-5">
                  <div className="row">
                    <div className="col-lg-6">
                      <Slide direction="down">
                        <h1 className="pb-2 pb-md-3">Our Services</h1>
                        <h3 className="pb-2 pb-md-3">Everything You Need for Grocery Shopping</h3>
                        <p
                          className="fs-xl pb-4 mb-1 mb-md-2 mb-lg-3"
                          style={{ maxWidth: 526 }}
                        >
                          We provide comprehensive grocery shopping services designed to 
                          make your life easier. From fast delivery to quality guarantees, 
                          we've got you covered.
                        </p>
                        <div className="row row-cols-3 pt-4 pt-md-5 mt-2 mt-xl-4">
                          <div className="col">
                            <h3 className="h2 mb-2">100+</h3>
                            <p className="mb-0">
                              <strong>Services</strong>
                            </p>
                          </div>
                          <div className="col">
                            <h3 className="h2 mb-2">50K+</h3>
                            <p className="mb-0">
                              <strong>Happy Customers</strong>
                            </p>
                          </div>
                          <div className="col">
                            <h3 className="h2 mb-2">99%</h3>
                            <p className="mb-0">
                              <strong>Success Rate</strong>
                            </p>
                          </div>
                        </div>
                      </Slide>
                    </div>
                    <div className="col-lg-6 mt-xl-3 pt-5 pt-lg-4">
                      <div className="row row-cols-2 gx-3 gx-lg-4">
                        <div className="col pt-lg-5 mt-lg-1">
                          <Zoom>
                            <div className="bg-light rounded-3 p-4 mb-3 mb-lg-4 text-center">
                              <h4 className="text-primary">Quality</h4>
                              <p className="mb-0">Premium Products</p>
                            </div>
                          </Zoom>
                        </div>
                        <div className="col">
                          <Zoom>
                            <div className="bg-light rounded-3 p-4 mb-3 mb-lg-4 text-center">
                              <h4 className="text-primary">Speed</h4>
                              <p className="mb-0">Fast Delivery</p>
                            </div>
                          </Zoom>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>

            <>
              {/* Services Grid */}
              <section className="container mt-8 mb-5 pt-lg-5">
                <div className="row">
                  <div className="col-12 text-center mb-5">
                    <Slide direction="down">
                      <h2 className="h1 mb-3">What We Offer</h2>
                      <p className="lead">Comprehensive grocery shopping solutions</p>
                    </Slide>
                  </div>
                </div>
                <div className="row gy-4">
                  {services.map((service, index) => (
                    <div key={service.id} className="col-md-4 col-sm-6">
                      <Zoom delay={index * 100}>
                        <div className="card border-0 shadow-sm h-100 p-4 text-center">
                          <div className="mb-3">
                            {typeof service.icon === 'string' && service.icon.includes('.svg') ? (
                              <img
                                src={service.icon}
                                width="80"
                                height="80"
                                alt={service.title}
                                className="d-block mx-auto"
                              />
                            ) : (
                              <img
                                src={service.icon}
                                width="100"
                                alt={service.title}
                                className="d-block mx-auto"
                              />
                            )}
                          </div>
                          <h4 className="mb-3">{service.title}</h4>
                          <p className="text-muted mb-0">{service.description}</p>
                        </div>
                      </Zoom>
                    </div>
                  ))}
                </div>
              </section>
            </>

            <>
              {/* Features Section */}
              <section className="container mt-8 mb-5 pb-3 pb-md-4 pb-lg-5">
                <div className="row gy-4">
                  <div className="col-md-6">
                    <Slide direction="left">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                               style={{ width: '60px', height: '60px' }}>
                            <i className="bi bi-check-circle fs-3"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-4">
                          <h5>Wide Product Range</h5>
                          <p className="text-muted mb-0">
                            Browse through thousands of products across multiple categories 
                            including fresh produce, dairy, meat, and household essentials.
                          </p>
                        </div>
                      </div>
                    </Slide>
                  </div>
                  <div className="col-md-6">
                    <Slide direction="right">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                               style={{ width: '60px', height: '60px' }}>
                            <i className="bi bi-shield-check fs-3"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-4">
                          <h5>Secure Payments</h5>
                          <p className="text-muted mb-0">
                            Multiple secure payment options including credit cards, 
                            digital wallets, and cash on delivery for your convenience.
                          </p>
                        </div>
                      </div>
                    </Slide>
                  </div>
                  <div className="col-md-6">
                    <Slide direction="left">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                               style={{ width: '60px', height: '60px' }}>
                            <i className="bi bi-truck fs-3"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-4">
                          <h5>Free Shipping</h5>
                          <p className="text-muted mb-0">
                            Enjoy free shipping on orders above Rs 100. Fast and reliable 
                            delivery to your doorstep within the promised timeframe.
                          </p>
                        </div>
                      </div>
                    </Slide>
                  </div>
                  <div className="col-md-6">
                    <Slide direction="right">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                               style={{ width: '60px', height: '60px' }}>
                            <i className="bi bi-star fs-3"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-4">
                          <h5>Best Prices</h5>
                          <p className="text-muted mb-0">
                            Competitive pricing with regular discounts and special offers. 
                            Save more with our loyalty program and promotional deals.
                          </p>
                        </div>
                      </div>
                    </Slide>
                  </div>
                </div>
              </section>
            </>

            <>
              {/* CTA Section */}
              <section className="container pb-5 mb-2 mt-8 mb-md-4 mb-lg-5">
                <div className="position-relative bg-secondaryy rounded-3 py-5 mb-2">
                  <div className="row pb-2 py-md-3 py-lg-5 px-4 px-lg-0 position-relative zindex-3">
                    <div className="col-xl-8 col-lg-10 offset-xl-2 offset-lg-1 text-center">
                      <Slide direction="down" delay={0.5}>
                        <h2 className="h1 pb-3">Ready to Start Shopping?</h2>
                        <p className="lead mb-4">
                          Experience the convenience of online grocery shopping with 
                          our comprehensive services.
                        </p>
                        <Link
                          to="/Shop"
                          className="btn btn-primary shadow-primary btn-lg me-3"
                        >
                          Shop Now
                        </Link>
                        <Link
                          to="/Contact"
                          className="btn btn-outline-primary btn-lg"
                        >
                          Contact Us
                        </Link>
                      </Slide>
                    </div>
                  </div>
                </div>
              </section>
            </>
          </>
        )}
      </div>
    </div>
  );
};

export default Services;

