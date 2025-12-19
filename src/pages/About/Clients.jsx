import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import { Slide, Zoom } from "react-awesome-reveal";
import ScrollToTop from "../ScrollToTop";
import flipkartlogo from "../../images/flipkartlogo.png";
import amazonlogo from "../../images/amazonlogo.png";
import blinkit from "../../images/blinkit.png";
import smartshop from "../../images/smartshop.png";

const Clients = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  const clients = [
    {
      id: 1,
      name: "Flipkart",
      logo: flipkartlogo,
      description: "Leading e-commerce platform in India",
      category: "E-commerce"
    },
    {
      id: 2,
      name: "Amazon",
      logo: amazonlogo,
      description: "Global online retail giant",
      category: "E-commerce"
    },
    {
      id: 3,
      name: "Blinkit",
      logo: blinkit,
      description: "Quick commerce delivery service",
      category: "Grocery Delivery"
    },
    {
      id: 4,
      name: "SmartShop",
      logo: smartshop,
      description: "Modern retail solutions provider",
      category: "Retail Technology"
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
                        <h1 className="pb-2 pb-md-3">Our Clients</h1>
                        <h3 className="pb-2 pb-md-3">Trusted by Leading Brands</h3>
                        <p
                          className="fs-xl pb-4 mb-1 mb-md-2 mb-lg-3"
                          style={{ maxWidth: 526 }}
                        >
                          We are proud to serve some of the most recognized names in the 
                          e-commerce and retail industry. Our clients trust us to deliver 
                          exceptional grocery shopping experiences.
                        </p>
                        <div className="row row-cols-3 pt-4 pt-md-5 mt-2 mt-xl-4">
                          <div className="col">
                            <h3 className="h2 mb-2">50+</h3>
                            <p className="mb-0">
                              <strong>Active Clients</strong>
                            </p>
                          </div>
                          <div className="col">
                            <h3 className="h2 mb-2">98%</h3>
                            <p className="mb-0">
                              <strong>Client Satisfaction</strong>
                            </p>
                          </div>
                          <div className="col">
                            <h3 className="h2 mb-2">24/7</h3>
                            <p className="mb-0">
                              <strong>Support</strong>
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
                              <h4 className="text-primary">Partners</h4>
                              <p className="mb-0">Trusted Relationships</p>
                            </div>
                          </Zoom>
                        </div>
                        <div className="col">
                          <Zoom>
                            <div className="bg-light rounded-3 p-4 mb-3 mb-lg-4 text-center">
                              <h4 className="text-primary">Success</h4>
                              <p className="mb-0">Proven Results</p>
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
              {/* Clients Grid */}
              <section className="container mt-8 mb-5 pt-lg-5">
                <div className="row gy-4 py-xl-2">
                  <div className="col-md-4">
                    <div className="info-whydiff">
                      <div className="section-title-left pt-80">
                        <h3 className="party" style={{ fontSize: "38px" }}>
                          <Slide direction="down" delay={0.5}>
                            Our Valued Clients
                          </Slide>
                        </h3>
                        <p className="mt-3">
                          We work with industry leaders who trust us to deliver 
                          exceptional grocery shopping solutions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7 offset-lg-1 col-md-8">
                    <div className="row row-cols-sm-2 row-cols-1 gy-4">
                      {clients.map((client, index) => (
                        <div key={client.id} className="col">
                          <Zoom delay={index * 100}>
                            <div className="card border-0 shadow-sm h-100 p-4">
                              <div className="text-center mb-3">
                                <img
                                  src={client.logo}
                                  width={120}
                                  alt={client.name}
                                  className="d-block mx-auto mb-3"
                                  style={{ maxHeight: "80px", objectFit: "contain" }}
                                />
                              </div>
                              <h5 className="text-center mb-2">{client.name}</h5>
                              <p className="text-muted text-center mb-2">{client.description}</p>
                              <div className="text-center">
                                <span className="badge bg-primary">{client.category}</span>
                              </div>
                            </div>
                          </Zoom>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </>

            <>
              {/* Testimonials Section */}
              <section className="container mt-8 mb-5 pb-3 pb-md-4 pb-lg-5">
                <div className="row">
                  <div className="col-12 text-center mb-5">
                    <Slide direction="down">
                      <h2 className="h1 mb-3">What Our Clients Say</h2>
                      <p className="lead">Hear from our satisfied partners</p>
                    </Slide>
                  </div>
                </div>
                <div className="row gy-4">
                  <div className="col-md-4">
                    <Zoom>
                      <div className="card border-0 shadow-sm h-100 p-4">
                        <div className="mb-3">
                          <div className="text-warning mb-2">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                        <p className="mb-3">
                          "Click Mart has transformed our grocery delivery operations. 
                          Their platform is intuitive and reliable."
                        </p>
                        <div className="d-flex align-items-center">
                          <div>
                            <h6 className="mb-0">John Smith</h6>
                            <small className="text-muted">CEO, Retail Corp</small>
                          </div>
                        </div>
                      </div>
                    </Zoom>
                  </div>
                  <div className="col-md-4">
                    <Zoom>
                      <div className="card border-0 shadow-sm h-100 p-4">
                        <div className="mb-3">
                          <div className="text-warning mb-2">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                        <p className="mb-3">
                          "Excellent service and support. Our customers love the 
                          seamless shopping experience."
                        </p>
                        <div className="d-flex align-items-center">
                          <div>
                            <h6 className="mb-0">Sarah Johnson</h6>
                            <small className="text-muted">Director, FoodMart</small>
                          </div>
                        </div>
                      </div>
                    </Zoom>
                  </div>
                  <div className="col-md-4">
                    <Zoom>
                      <div className="card border-0 shadow-sm h-100 p-4">
                        <div className="mb-3">
                          <div className="text-warning mb-2">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                        <p className="mb-3">
                          "The best grocery platform we've worked with. Highly 
                          recommended for any retail business."
                        </p>
                        <div className="d-flex align-items-center">
                          <div>
                            <h6 className="mb-0">Michael Brown</h6>
                            <small className="text-muted">Founder, QuickShop</small>
                          </div>
                        </div>
                      </div>
                    </Zoom>
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
                        <h2 className="h1 pb-3">Become Our Partner</h2>
                        <p className="lead mb-4">
                          Join our growing list of satisfied clients and transform 
                          your grocery business today.
                        </p>
                        <Link
                          to="/Contact"
                          className="btn btn-primary shadow-primary btn-lg"
                        >
                          Get Started
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

export default Clients;

