import React, { useEffect, useState } from "react";
import clutch from "../../images/clutch-dark.png";
import member1 from "../../images/01.jpg";
import member2 from "../../images/02.jpg";
import member3 from "../../images/03.jpg";
import member5 from "../../images/member5.jpg";
import member6 from "../../images/member6.jpg";
import member7 from "../../images/member7.jpg";
import member8 from "../../images/member8.jpg";
import idea from "../../images/idea.gif";
import team from "../../images/team.gif";
import award from "../../images/award.gif";

import flipkartlogo from "../../images/flipkartlogo.png";
import amazonlogo from "../../images/amazonlogo.png";
import blinkit from "../../images/blinkit.png";
import smartshop from "../../images/smartshop.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import SocialNetworksCarousel from "./SocialNetworksCarousel";
import CaseStudySlider from "./CaseStudySlider";
import { MagnifyingGlass } from "react-loader-spinner";
import { Slide, Zoom } from "react-awesome-reveal";
import ScrollToTop from "../ScrollToTop";

const AboutUs = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

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
            {/* Hero */}
            <section className="relative pt-12 pb-8 lg:pt-20 lg:pb-16">
              {/* Background */}
              <div
                className="absolute top-0 left-0 w-full bg-bottom bg-cover bg-no-repeat"
                style={{
                  backgroundImage: "url(assets/img/about/hero-bg.svg)",
                }}
              >
                <div className="block lg:hidden" style={{ height: 960 }} />
                <div className="hidden lg:block" style={{ height: 768 }} />
              </div>
              {/* Content */}
              <div className="container mx-auto px-4 relative z-10 pt-12 lg:pt-20">
                <div className="flex flex-wrap -mx-4">
                  <div className="w-full lg:w-1/2 px-4">
                    {/* Text */}
                    <Slide direction="down">
                      <h1 className="text-4xl lg:text-5xl font-bold pb-4 lg:pb-6">About Click Mart</h1>
                      <h3 className="text-2xl lg:text-3xl font-semibold pb-4 lg:pb-6">The Future of Grocery Delivery:</h3>
                      <p
                        className="text-lg lg:text-xl pb-6 mb-4 lg:mb-6"
                        style={{ maxWidth: 526 }}
                      >
                        By powering the future of grocery with our retail partners, 
                        we give everyone access to the food they love and more time 
                        to enjoy it together.
                      </p>
                      <img
                        src={clutch}
                        className="block dark:hidden"
                        width={175}
                        alt="Clutch"
                      />
                      <img
                        src="assets/img/about/clutch-light.png"
                        className="hidden dark:block"
                        width={175}
                        alt="Clutch"
                      />
                      <div className="grid grid-cols-3 gap-4 pt-8 lg:pt-12 mt-4 lg:mt-8">
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-bold mb-2">2,480</h3>
                          <p className="mb-0">
                            <strong>Remote</strong> Sales Experts
                          </p>
                        </div>
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-bold mb-2">760</h3>
                          <p className="mb-0">
                            <strong>New Clients</strong> per Month
                          </p>
                        </div>
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-bold mb-2">1,200</h3>
                          <p className="mb-0">
                            <strong>Requests</strong> per Week
                          </p>
                        </div>
                      </div>
                    </Slide>
                  </div>
                  {/* Images */}
                  <div className="w-full lg:w-1/2 px-4 mt-8 lg:mt-12 pt-8 lg:pt-12">
                    <div className="grid grid-cols-2 gap-4 lg:gap-6">
                      <div className="pt-8 lg:pt-12 mt-4 lg:mt-6">
                        <Zoom>
                          <img
                            src={member1}
                            className="block rounded-xl mb-4 lg:mb-6 w-full"
                            alt="member"
                          />
                        </Zoom>
                      </div>
                      <div>
                        <Zoom>
                          <img
                            src={member3}
                            className="block rounded-xl mb-4 lg:mb-6 w-full"
                            alt="member"
                          />
                        </Zoom>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Swiper */}
            <section className="container mx-auto px-4 mt-16 lg:mt-20 mb-12 pt-8 lg:pt-12" id="benefits">
              <Swiper
                className="swiper pt-6"
                modules={[]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                breakpoints={{
                  500: { slidesPerView: 2 },
                  991: { slidesPerView: 3 },
                }}
              >
                <div className="swiper-wrapper pt-6">
                  <SwiperSlide className="swiper-slide border-r-0 lg:border-r px-4">
                    <div className="text-center">
                      <Zoom>
                        <img
                          src={idea}
                          width="100"
                          alt="Bulb icon"
                          className="block mb-6 mx-auto"
                        />
                      </Zoom>
                      <Slide direction="up">
                        <h4 className="mb-3 pb-2 text-xl font-semibold">Creative Solutions</h4>
                        <p className="mx-auto text-gray-600" style={{ maxWidth: "336px" }}>
                          Sed morbi nulla pulvinar lectus tempor vel euismod
                          accumsan.
                        </p>
                      </Slide>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide border-r-0 lg:border-r px-4">
                    <div className="text-center">
                      <Zoom>
                        <img
                          src={award}
                          width="100"
                          alt="Award icon"
                          className="block mb-6 mx-auto"
                        />
                      </Zoom>
                      <Slide direction="up">
                        <h4 className="mb-3 pb-2 text-xl font-semibold">Award Winning</h4>
                        <p className="mx-auto text-gray-600" style={{ maxWidth: "336px" }}>
                          Sit facilisis dolor arcu, fermentum vestibulum arcu
                          elementum imperdiet.
                        </p>
                      </Slide>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide px-4">
                    <div className="text-center">
                      <Zoom>
                        <img
                          src={team}
                          width="100"
                          alt="Team icon"
                          className="block mb-6 mx-auto"
                        />
                      </Zoom>
                      <Slide direction="up">
                        <h4 className="mb-3 pb-2 text-xl font-semibold">Team of Professionals</h4>
                        <p className="mx-auto text-gray-600" style={{ maxWidth: "336px" }}>
                          Nam venenatis urna aenean quis feugiat et senectus
                          turpis.
                        </p>
                      </Slide>
                    </div>
                  </SwiperSlide>
                </div>
                <div className="swiper-pagination relative pt-4 lg:pt-6 mt-6"></div>
              </Swiper>
            </section>

            {/* Gallery */}
            <section className="container mx-auto px-4 pb-12 mb-8 lg:mb-12 mt-16 lg:mt-20">
              <div className="flex items-center justify-between pb-8 mb-4">
                <h2 className="text-3xl lg:text-4xl font-bold mb-0">We are Powerful</h2>
                <Link to="#" className="inline-flex items-center border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors text-lg font-semibold">
                  <i className="bx bx-images text-2xl mr-2" />
                  See all photos
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5">
                  <a
                    href="https://www.youtube.com/watch?v=zPo5ZaH6sW8"
                    className="gallery-item video-item is-hovered rounded-xl block overflow-hidden relative group"
                    data-sub-html='<h6 class="fs-sm text-light">Silicon Inc. Showreel by Marvin McKinney</h6>'
                  >
                    <img src={member8} alt="Gallery thumbnail" className="w-full h-auto" />
                    <div className="gallery-item-caption p-6 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white">
                      <h4 className="text-white mb-2 text-xl font-semibold">Click Mart Inc.</h4>
                      <p className="mb-0">Showreel by Marvin McKinney</p>
                    </div>
                  </a>
                </div>
                <div className="md:col-span-3">
                  <a
                    href={member2}
                    className="gallery-item rounded-xl mb-6 block overflow-hidden"
                    data-sub-html='<h6 class="fs-sm text-light">Program for apprentices</h6>'
                  >
                    <img
                      src={member2}
                      alt="Gallery thumbnail"
                      className="w-full"
                      style={{ height: "310px", objectFit: "cover" }}
                    />
                    <div className="gallery-item-caption text-sm font-medium mt-2">
                      Program for apprentices
                    </div>
                  </a>
                  <a
                    href={member5}
                    className="gallery-item rounded-xl block overflow-hidden"
                    data-sub-html='<h6 class="fs-sm text-light">Modern bright offices</h6>'
                  >
                    <img src={member5} alt="Gallery thumbnail" className="w-full h-auto" />
                    <div className="gallery-item-caption text-sm font-medium mt-2">
                      Modern bright offices
                    </div>
                  </a>
                </div>
                <div className="md:col-span-4">
                  <a
                    href={member6}
                    className="gallery-item rounded-xl mb-6 block overflow-hidden"
                    data-sub-html='<h6 class="fs-sm text-light">Friendly professional team</h6>'
                  >
                    <img
                      src={member6}
                      alt="Gallery thumbnail"
                      className="w-full"
                      style={{ height: "360px", objectFit: "cover" }}
                    />
                    <div className="gallery-item-caption text-sm font-medium mt-2">
                      Friendly professional team
                    </div>
                  </a>
                  <a
                    href={member7}
                    className="gallery-item rounded-xl block overflow-hidden"
                    data-sub-html='<h6 class="fs-sm text-light">Efficient project management</h6>'
                  >
                    <img src={member7} alt="Gallery thumbnail" className="w-full h-auto" />
                    <div className="gallery-item-caption text-sm font-medium mt-2">
                      Efficient project management
                    </div>
                  </a>
                </div>
              </div>
            </section>

            {/* Awards */}
            <section className="container mx-auto px-4 mt-16 lg:mt-20 mb-12 pb-6 lg:pb-8">
              <div className="flex flex-wrap -mx-4 gap-8 py-4">
                <div className="w-full md:w-1/3 px-4">
                  <div className="pt-20">
                    <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                      <Slide direction="down" delay={0.5}>
                        Our Partners
                      </Slide>
                    </h3>
                  </div>
                </div>
                <div className="w-full md:w-2/3 lg:w-7/12 lg:ml-auto px-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div>
                      <div className="relative text-center">
                        <Zoom>
                          <img
                            src={flipkartlogo}
                            width={100}
                            alt="Webby"
                            className="block mx-auto mb-4"
                          />
                        </Zoom>
                        <Link
                          to="#"
                          className="text-gray-700 justify-center text-sm block text-center no-underline hover:text-primary"
                        >
                          4x mobile of the day
                        </Link>
                      </div>
                    </div>
                    <div>
                      <div className="relative text-center">
                        <Zoom>
                          <img
                            src={amazonlogo}
                            width={100}
                            alt="CSSDA"
                            className="block mx-auto mb-4"
                          />
                        </Zoom>
                        <Link
                          to="#"
                          className="text-gray-700 justify-center text-sm block text-center no-underline hover:text-primary"
                        >
                          1x Kudos
                        </Link>
                      </div>
                    </div>
                    <div>
                      <div className="relative text-center">
                        <Zoom>
                          <img
                            src={blinkit}
                            width={100}
                            alt="Awwwards"
                            className="block mx-auto mb-4"
                          />
                        </Zoom>
                        <Link
                          to="#"
                          className="text-gray-700 justify-center text-sm block text-center no-underline hover:text-primary"
                        >
                          3x website of the day
                        </Link>
                      </div>
                    </div>
                    <div>
                      <div className="relative text-center">
                        <Zoom>
                          <img
                            src={smartshop}
                            width={100}
                            alt="FWA"
                            className="block mx-auto mb-4"
                          />
                        </Zoom>
                        <Link
                          to="#"
                          className="text-gray-700 justify-center text-sm block text-center no-underline hover:text-primary"
                        >
                          2x best website
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <CaseStudySlider />

            {/* Contact form */}
            <section className="container mx-auto px-4 pb-12 mb-8 mt-16 lg:mt-20 mb-8 lg:mb-12">
              <div className="relative bg-gray-100 rounded-xl py-12 mb-8">
                <div className="flex flex-wrap -mx-4 pb-4 py-6 lg:py-12 px-4 lg:px-0 relative z-10">
                  <div className="w-full xl:w-3/12 lg:w-4/12 md:w-5/12 lg:ml-auto px-4">
                    <Slide direction="down" delay={0.5}>
                      <p className="text-xl lg:text-2xl mb-4 lg:mb-6 text-gray-600">Ready to get started?</p>
                      <h2 className="text-3xl lg:text-4xl font-bold pb-6">Don't Hesitate to Contact Us</h2>
                    </Slide>
                  </div>
                  <form
                    className="w-full lg:w-6/12 md:w-7/12 xl:ml-auto px-4 z-10"
                    noValidate
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="mb-6">
                        <label htmlFor="name" className="block text-base font-medium mb-2">
                          Full name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                        <div className="text-red-500 text-sm mt-1 hidden">
                          Please enter your name!
                        </div>
                      </div>
                      <div className="mb-6 z-10">
                        <label htmlFor="email" className="block text-base font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                        <div className="text-red-500 text-sm mt-1 hidden">
                          Please provide a valid email address!
                        </div>
                      </div>
                      <div className="col-span-1 sm:col-span-2 pb-4 mb-6">
                        <label
                          htmlFor="message"
                          className="block text-base font-medium mb-2"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={4}
                          required
                          defaultValue={""}
                        />
                        <div className="text-red-500 text-sm mt-1 hidden">
                          Please enter your message!
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-primary text-white px-8 py-4 rounded-lg shadow-lg hover:bg-primary-dark transition-colors text-lg font-semibold"
                    >
                      Send request
                    </button>
                  </form>
                </div>
              </div>
            </section>

            <SocialNetworksCarousel />
          </>
        )}
      </div>
    </div>
  );
};
export default AboutUs;
