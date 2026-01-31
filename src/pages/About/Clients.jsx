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
                      <h1 className="text-4xl lg:text-5xl font-bold pb-4 lg:pb-6">Our Clients</h1>
                      <h3 className="text-2xl lg:text-3xl font-semibold pb-4 lg:pb-6">Trusted by Leading Brands</h3>
                      <p
                        className="text-lg lg:text-xl pb-6 mb-4 lg:mb-6"
                        style={{ maxWidth: 526 }}
                      >
                        We are proud to serve some of the most recognized names in the 
                        e-commerce and retail industry. Our clients trust us to deliver 
                        exceptional grocery shopping experiences.
                      </p>
                      <div className="grid grid-cols-3 gap-4 pt-8 lg:pt-12 mt-4 lg:mt-8">
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-bold mb-2">50+</h3>
                          <p className="mb-0 font-semibold">
                            Active Clients
                          </p>
                        </div>
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-bold mb-2">98%</h3>
                          <p className="mb-0 font-semibold">
                            Client Satisfaction
                          </p>
                        </div>
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-bold mb-2">24/7</h3>
                          <p className="mb-0 font-semibold">
                            Support
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
                            <h4 className="text-primary text-xl font-semibold">Partners</h4>
                            <p className="mb-0 mt-2">Trusted Relationships</p>
                          </div>
                        </Zoom>
                      </div>
                      <div>
                        <Zoom>
                          <div className="bg-gray-100 rounded-xl p-6 mb-4 lg:mb-6 text-center">
                            <h4 className="text-primary text-xl font-semibold">Success</h4>
                            <p className="mb-0 mt-2">Proven Results</p>
                          </div>
                        </Zoom>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Clients Grid */}
            <section className="container mx-auto px-4 mt-16 lg:mt-20 mb-12 pt-8 lg:pt-12">
              <div className="flex flex-wrap -mx-4 gap-8 py-4">
                <div className="w-full md:w-1/3 px-4">
                  <div>
                    <div className="pt-20">
                      <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                        <Slide direction="down" delay={0.5}>
                          Our Valued Clients
                        </Slide>
                      </h3>
                      <p className="mt-4 text-gray-600">
                        We work with industry leaders who trust us to deliver 
                        exceptional grocery shopping solutions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-2/3 lg:w-7/12 lg:ml-auto px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {clients.map((client, index) => (
                      <div key={client.id}>
                        <Zoom delay={index * 100}>
                          <div className="bg-white border-0 rounded-lg shadow-sm h-full p-6">
                            <div className="text-center mb-4">
                              <img
                                src={client.logo}
                                width={120}
                                alt={client.name}
                                className="block mx-auto mb-4"
                                style={{ maxHeight: "80px", objectFit: "contain" }}
                              />
                            </div>
                            <h5 className="text-center mb-2 text-xl font-semibold">{client.name}</h5>
                            <p className="text-gray-500 text-center mb-3">{client.description}</p>
                            <div className="text-center">
                              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                {client.category}
                              </span>
                            </div>
                          </div>
                        </Zoom>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="container mx-auto px-4 mt-16 lg:mt-20 mb-12 pb-6 lg:pb-8">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full text-center mb-12">
                  <Slide direction="down">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Clients Say</h2>
                    <p className="text-xl text-gray-600">Hear from our satisfied partners</p>
                  </Slide>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Zoom>
                    <div className="bg-white border-0 rounded-lg shadow-sm h-full p-6">
                      <div className="mb-4">
                        <div className="text-yellow-400 mb-3 flex gap-1">
                          <i className="bi bi-star-fill text-xl"></i>
                          <i className="bi bi-star-fill text-xl"></i>
                          <i className="bi bi-star-fill text-xl"></i>
                          <i className="bi bi-star-fill text-xl"></i>
                          <i className="bi bi-star-fill text-xl"></i>
                        </div>
                      </div>
                      <p className="mb-4 text-gray-700">
                        "Click Mart has transformed our grocery delivery operations. 
                        Their platform is intuitive and reliable."
                      </p>
                      <div className="flex items-center">
                        <div>
                          <h6 className="mb-0 font-semibold">John Smith</h6>
                          <small className="text-gray-500">CEO, Retail Corp</small>
                        </div>
                      </div>
                    </div>
                  </Zoom>
                </div>
                <div>
                  <Zoom>
                    <div className="bg-white border-0 rounded-lg shadow-sm h-full p-6">
                      <div className="mb-4">
                        <div className="text-yellow-400 mb-3 flex gap-1">
                          <i className="bi bi-star-fill text-xl"></i>
                          <i className="bi bi-star-fill text-xl"></i>
                          <i className="bi bi-star-fill text-xl"></i>
                          <i className="bi bi-star-fill text-xl"></i>
                          <i className="bi bi-star-fill text-xl"></i>
                        </div>
                      </div>
                      <p className="mb-4 text-gray-700">
                        "Excellent service and support. Our customers love the 
                        seamless shopping experience."
                      </p>
                      <div className="flex items-center">
                        <div>
                          <h6 className="mb-0 font-semibold">Sarah Johnson</h6>
                          <small className="text-gray-500">Director, FoodMart</small>
                        </div>
                      </div>
                    </div>
                  </Zoom>
                </div>
                <div>
                  <Zoom>
                    <div className="bg-white border-0 rounded-lg shadow-sm h-full p-6">
                      <div className="mb-4">
                        <div className="text-yellow-400 mb-3 flex gap-1">
                          <i className="bi bi-star-fill text-xl"></i>
                          <i className="bi bi-star-fill text-xl"></i>
                          <i className="bi bi-star-fill text-xl"></i>
                          <i className="bi bi-star-fill text-xl"></i>
                          <i className="bi bi-star-fill text-xl"></i>
                        </div>
                      </div>
                      <p className="mb-4 text-gray-700">
                        "The best grocery platform we've worked with. Highly 
                        recommended for any retail business."
                      </p>
                      <div className="flex items-center">
                        <div>
                          <h6 className="mb-0 font-semibold">Michael Brown</h6>
                          <small className="text-gray-500">Founder, QuickShop</small>
                        </div>
                      </div>
                    </div>
                  </Zoom>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 pb-12 mb-8 mt-16 lg:mt-20 mb-8 lg:mb-12">
              <div className="relative bg-gray-100 rounded-xl py-12 mb-8">
                <div className="flex flex-wrap -mx-4 pb-4 py-6 lg:py-12 px-4 lg:px-0 relative z-10">
                  <div className="w-full xl:w-8/12 lg:w-10/12 mx-auto text-center">
                    <Slide direction="down" delay={0.5}>
                      <h2 className="text-3xl lg:text-4xl font-bold pb-6">Become Our Partner</h2>
                      <p className="text-xl lg:text-2xl mb-8 text-gray-600">
                        Join our growing list of satisfied clients and transform 
                        your grocery business today.
                      </p>
                      <Link
                        to="/Contact"
                        className="inline-block bg-primary text-white px-8 py-4 rounded-lg shadow-lg hover:bg-primary-dark transition-colors text-lg font-semibold"
                      >
                        Get Started
                      </Link>
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

export default Clients;
