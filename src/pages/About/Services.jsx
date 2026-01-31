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
            {/* Hero Section */}
            <section className="relative pt-12 pb-8 lg:pt-20 lg:pb-16">
              <div
                className="absolute top-0 left-0 w-full bg-bottom bg-cover bg-no-repeat"
                style={{
                  backgroundImage: "url(assets/img/about/hero-bg.svg)",
                }}
              >
                <div className="block lg:hidden" style={{ height: 960 }} />
                <div className="hidden lg:block" style={{ height: 768 }} />
              </div>
              <div className="container mx-auto px-4 relative z-10 pt-12 lg:pt-20">
                <div className="flex flex-wrap -mx-4">
                  <div className="w-full lg:w-1/2 px-4">
                    <Slide direction="down">
                      <h1 className="text-4xl lg:text-5xl font-bold pb-4 lg:pb-6">Our Services</h1>
                      <h3 className="text-2xl lg:text-3xl font-semibold pb-4 lg:pb-6">Everything You Need for Grocery Shopping</h3>
                      <p
                        className="text-lg lg:text-xl pb-6 mb-4 lg:mb-6"
                        style={{ maxWidth: 526 }}
                      >
                        We provide comprehensive grocery shopping services designed to 
                        make your life easier. From fast delivery to quality guarantees, 
                        we've got you covered.
                      </p>
                      <div className="grid grid-cols-3 gap-4 pt-8 lg:pt-12 mt-4 lg:mt-8">
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-bold mb-2">100+</h3>
                          <p className="mb-0 font-semibold">
                            Services
                          </p>
                        </div>
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-bold mb-2">50K+</h3>
                          <p className="mb-0 font-semibold">
                            Happy Customers
                          </p>
                        </div>
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-bold mb-2">99%</h3>
                          <p className="mb-0 font-semibold">
                            Success Rate
                          </p>
                        </div>
                      </div>
                    </Slide>
                  </div>
                  <div className="w-full lg:w-1/2 px-4 mt-8 lg:mt-12 pt-8 lg:pt-12">
                    <div className="grid grid-cols-2 gap-4 lg:gap-6">
                      <div className="pt-8 lg:pt-12 mt-4 lg:mt-6">
                        <Zoom>
                          <div className="bg-gray-100 rounded-xl p-6 mb-4 lg:mb-6 text-center">
                            <h4 className="text-primary text-xl font-semibold">Quality</h4>
                            <p className="mb-0 mt-2">Premium Products</p>
                          </div>
                        </Zoom>
                      </div>
                      <div>
                        <Zoom>
                          <div className="bg-gray-100 rounded-xl p-6 mb-4 lg:mb-6 text-center">
                            <h4 className="text-primary text-xl font-semibold">Speed</h4>
                            <p className="mb-0 mt-2">Fast Delivery</p>
                          </div>
                        </Zoom>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Services Grid */}
            <section className="container mx-auto px-4 mt-16 lg:mt-20 mb-12 pt-8 lg:pt-12">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full text-center mb-12">
                  <Slide direction="down">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">What We Offer</h2>
                    <p className="text-xl text-gray-600">Comprehensive grocery shopping solutions</p>
                  </Slide>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                  <div key={service.id}>
                    <Zoom delay={index * 100}>
                      <div className="bg-white border-0 rounded-lg shadow-sm h-full p-6 text-center">
                        <div className="mb-4">
                          {typeof service.icon === 'string' && service.icon.includes('.svg') ? (
                            <img
                              src={service.icon}
                              width="80"
                              height="80"
                              alt={service.title}
                              className="block mx-auto"
                            />
                          ) : (
                            <img
                              src={service.icon}
                              width="100"
                              alt={service.title}
                              className="block mx-auto"
                            />
                          )}
                        </div>
                        <h4 className="mb-4 text-xl font-semibold">{service.title}</h4>
                        <p className="text-gray-500 mb-0">{service.description}</p>
                      </div>
                    </Zoom>
                  </div>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 mt-16 lg:mt-20 mb-12 pb-6 lg:pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Slide direction="left">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="bg-primary text-white rounded-full flex items-center justify-center" 
                             style={{ width: '60px', height: '60px' }}>
                          <i className="bi bi-check-circle text-2xl"></i>
                        </div>
                      </div>
                      <div className="flex-grow ml-4">
                        <h5 className="text-xl font-semibold mb-2">Wide Product Range</h5>
                        <p className="text-gray-500 mb-0">
                          Browse through thousands of products across multiple categories 
                          including fresh produce, dairy, meat, and household essentials.
                        </p>
                      </div>
                    </div>
                  </Slide>
                </div>
                <div>
                  <Slide direction="right">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="bg-primary text-white rounded-full flex items-center justify-center" 
                             style={{ width: '60px', height: '60px' }}>
                          <i className="bi bi-shield-check text-2xl"></i>
                        </div>
                      </div>
                      <div className="flex-grow ml-4">
                        <h5 className="text-xl font-semibold mb-2">Secure Payments</h5>
                        <p className="text-gray-500 mb-0">
                          Multiple secure payment options including credit cards, 
                          digital wallets, and cash on delivery for your convenience.
                        </p>
                      </div>
                    </div>
                  </Slide>
                </div>
                <div>
                  <Slide direction="left">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="bg-primary text-white rounded-full flex items-center justify-center" 
                             style={{ width: '60px', height: '60px' }}>
                          <i className="bi bi-truck text-2xl"></i>
                        </div>
                      </div>
                      <div className="flex-grow ml-4">
                        <h5 className="text-xl font-semibold mb-2">Free Shipping</h5>
                        <p className="text-gray-500 mb-0">
                          Enjoy free shipping on orders above Rs 100. Fast and reliable 
                          delivery to your doorstep within the promised timeframe.
                        </p>
                      </div>
                    </div>
                  </Slide>
                </div>
                <div>
                  <Slide direction="right">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="bg-primary text-white rounded-full flex items-center justify-center" 
                             style={{ width: '60px', height: '60px' }}>
                          <i className="bi bi-star text-2xl"></i>
                        </div>
                      </div>
                      <div className="flex-grow ml-4">
                        <h5 className="text-xl font-semibold mb-2">Best Prices</h5>
                        <p className="text-gray-500 mb-0">
                          Competitive pricing with regular discounts and special offers. 
                          Save more with our loyalty program and promotional deals.
                        </p>
                      </div>
                    </div>
                  </Slide>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 pb-12 mb-8 mt-16 lg:mt-20 mb-8 lg:mb-12">
              <div className="relative bg-gray-100 rounded-xl py-12 mb-8">
                <div className="flex flex-wrap -mx-4 pb-4 py-6 lg:py-12 px-4 lg:px-0 relative z-10">
                  <div className="w-full xl:w-8/12 lg:w-10/12 mx-auto text-center">
                    <Slide direction="down" delay={0.5}>
                      <h2 className="text-3xl lg:text-4xl font-bold pb-6">Ready to Start Shopping?</h2>
                      <p className="text-xl lg:text-2xl mb-8 text-gray-600">
                        Experience the convenience of online grocery shopping with 
                        our comprehensive services.
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Link
                          to="/Shop"
                          className="inline-block bg-primary text-white px-8 py-4 rounded-lg shadow-lg hover:bg-primary-dark transition-colors text-lg font-semibold"
                        >
                          Shop Now
                        </Link>
                        <Link
                          to="/Contact"
                          className="inline-block border-2 border-primary text-primary px-8 py-4 rounded-lg hover:bg-primary hover:text-white transition-colors text-lg font-semibold"
                        >
                          Contact Us
                        </Link>
                      </div>
                    </Slide>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Services;
