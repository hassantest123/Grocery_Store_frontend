import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bloglarge from "../../images/blog-large.jpg";
import blog1 from "../../images/blog-img-1.jpg";
import blog2 from "../../images/blog-img-2.jpg";
import blog3 from "../../images/blog-img-4.jpg";
import blog4 from "../../images/blog-img-5.jpg";
import blog5 from "../../images/blog-img-6.jpg";
import blog7 from "../../images/blog-img-7.jpg";
import blog8 from "../../images/blog-img-8.jpg";
import blog9 from "../../images/blog-img-9.jpg";
import { MagnifyingGlass } from "react-loader-spinner";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import ScrollToTop from "../ScrollToTop";

const Blog = () => {
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
            <div>
              {/* section */}
              <section className="mt-16 lg:mt-20">
                <div className="container mx-auto px-4">
                  <div className="flex flex-wrap -mx-4">
                    <div className="w-full px-4">
                      <h1 className="font-bold text-3xl lg:text-4xl">Click Mart Blog</h1>
                    </div>
                  </div>
                </div>
              </section>
              {/* section */}
              <section className="mt-12 lg:mt-16 mb-12 lg:mb-20">
                {/* container */}
                <div className="container mx-auto px-4">
                  <div className="flex flex-wrap -mx-4 items-center mb-12 lg:mb-16">
                    <div className="w-full lg:w-8/12 px-4">
                      <Link to="#!">
                        <Fade>
                          <div className="img-zoom overflow-hidden rounded-xl">
                            <img
                              src={bloglarge}
                              alt="blog"
                              className="w-full h-auto rounded-xl hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </Fade>
                      </Link>
                    </div>
                    {/* text */}
                    <div className="w-full lg:w-4/12 px-4">
                      <Slide direction="down">
                        <div className="pl-0 lg:pl-8 mt-8 lg:mt-0">
                          <h2 className="mb-4 text-2xl lg:text-3xl font-semibold">
                            <Link to="#!" className="text-inherit hover:text-primary transition-colors">
                              Garlic Cream Bucatini with Peas and Asparagus
                            </Link>
                          </h2>
                          <p className="text-gray-600 mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nunc ac erat ut neque bibendum egestas sed
                            quis justo. Integer non rhoncus diam. Nullam eget
                            dapibus lectus, vitae condimentum sem.
                          </p>
                          <div className="flex justify-between text-gray-500 text-sm">
                            <span>
                              <small>25 April 2023</small>
                            </span>
                            <span>
                              <small>
                                Read time:{" "}
                                <span className="text-gray-900 font-bold">6min</span>
                              </small>
                            </span>
                          </div>
                        </div>
                      </Slide>
                    </div>
                  </div>
                  {/* row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Blog Post 1 */}
                    <div className="mb-8 lg:mb-12">
                      <Zoom>
                        <div className="mb-6">
                          <Link to="#!">
                            <div className="img-zoom overflow-hidden rounded-xl">
                              <img
                                src={blog1}
                                alt="blog"
                                className="w-full h-auto rounded-xl hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                        </div>
                      </Zoom>
                      {/* text */}
                      <div className="mb-4">
                        <Link to="#!" className="text-primary hover:text-primary-dark transition-colors">
                          Recipes
                        </Link>
                      </div>
                      {/* text */}
                      <div>
                        <h2 className="text-xl font-semibold mb-3">
                          <Link to="#!" className="text-inherit hover:text-primary transition-colors">
                            Harissa Chickpeas with Whipped Feta
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4">
                          In et eros dapibus, facilisis ipsum sit amet, tempor
                          dolor. Donec sed nisi gravida, molestie dolor
                          molestie, congue sapien.
                        </p>
                        <div className="flex justify-between text-gray-500 text-sm mt-6">
                          <span>
                            <small>22 April 2023</small>
                          </span>
                          <span>
                            <small>
                              Read time:{" "}
                              <span className="text-gray-900 font-bold">12min</span>
                            </small>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Blog Post 2 */}
                    <div className="mb-8 lg:mb-12">
                      <Zoom>
                        <div className="mb-6">
                          <Link to="#!">
                            <div className="img-zoom overflow-hidden rounded-xl">
                              <img
                                src={blog2}
                                alt="blog"
                                className="w-full h-auto rounded-xl hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                        </div>
                      </Zoom>
                      {/* text */}
                      <div className="mb-4">
                        <Link to="#!" className="text-primary hover:text-primary-dark transition-colors">
                          Recipes
                        </Link>
                      </div>
                      {/* text */}
                      <div>
                        <h2 className="text-xl font-semibold mb-3">
                          <Link to="#!" className="text-inherit hover:text-primary transition-colors">
                            Almond Butter Chocolate Chip Zucchini Bars
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elitaenean sit amet tincidunt ellentesque aliquet
                          ligula in ultrices congue.
                        </p>
                        <div className="flex justify-between text-gray-500 text-sm mt-6">
                          <span>
                            <small>20 April 2023</small>
                          </span>
                          <span>
                            <small>
                              Read time:{" "}
                              <span className="text-gray-900 font-bold">8min</span>
                            </small>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Blog Post 3 */}
                    <div className="mb-8 lg:mb-12">
                      <Zoom>
                        <div className="mb-6">
                          <Link to="#!">
                            <div className="img-zoom overflow-hidden rounded-xl">
                              <img
                                src={blog1}
                                alt="blog"
                                className="w-full h-auto rounded-xl hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                        </div>
                      </Zoom>
                      {/* text */}
                      <div className="mb-4">
                        <Link to="#!" className="text-primary hover:text-primary-dark transition-colors">
                          Company
                        </Link>
                      </div>
                      <div>
                        {/* text */}
                        <h2 className="text-xl font-semibold mb-3">
                          <Link to="#!" className="text-inherit hover:text-primary transition-colors">
                            Spicy Shrimp Tacos Garlic Cilantro Lime Slaw
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elitaenean sit amet tincidunt ellentesque aliquet
                          ligula in ultrices congue.
                        </p>
                        <div className="flex justify-between text-gray-500 text-sm mt-6">
                          <span>
                            <small>18 April 2023</small>
                          </span>
                          <span>
                            <small>
                              Read time:{" "}
                              <span className="text-gray-900 font-bold">5min</span>
                            </small>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Blog Post 4 */}
                    <div className="mb-8 lg:mb-12">
                      <Zoom>
                        <div className="mb-6">
                          <Link to="#!">
                            <div className="img-zoom overflow-hidden rounded-xl">
                              <img
                                src={blog3}
                                alt="blog"
                                className="w-full h-auto rounded-xl hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                        </div>
                      </Zoom>
                      {/* text */}
                      <div className="mb-4">
                        <Link to="#!" className="text-primary hover:text-primary-dark transition-colors">
                          Recipes
                        </Link>
                      </div>
                      <div>
                        {/* text */}
                        <h2 className="text-xl font-semibold mb-3">
                          <Link to="#!" className="text-inherit hover:text-primary transition-colors">
                            Red Chile Chicken Tacos with Creamy Corn
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elitaenean sit amet tincidunt ellentesque aliquet
                          ligula in ultrices congue.
                        </p>
                        <div className="flex justify-between text-gray-500 text-sm mt-6">
                          <span>
                            <small>16 April 2023</small>
                          </span>
                          <span>
                            <small>
                              Read time:{" "}
                              <span className="text-gray-900 font-bold">9min</span>
                            </small>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Blog Post 5 */}
                    <div className="mb-8 lg:mb-12">
                      <Zoom>
                        <div className="mb-6">
                          <Link to="#!">
                            <div className="img-zoom overflow-hidden rounded-xl">
                              <img
                                src={blog4}
                                alt="blog"
                                className="w-full h-auto rounded-xl hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                        </div>
                      </Zoom>
                      <div className="mb-4">
                        <Link to="#!" className="text-primary hover:text-primary-dark transition-colors">
                          Retailer
                        </Link>
                      </div>
                      <div>
                        {/* text */}
                        <h2 className="text-xl font-semibold mb-3">
                          <Link to="#!" className="text-inherit hover:text-primary transition-colors">
                            Basic + Awesome Broccoli Cheese Soup
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elitaenean sit amet tincidunt ellentesque aliquet
                          ligula in ultrices congue.
                        </p>
                        <div className="flex justify-between text-gray-500 text-sm mt-6">
                          <span>
                            <small>12 April 2023</small>
                          </span>
                          <span>
                            <small>
                              Read time:{" "}
                              <span className="text-gray-900 font-bold">12min</span>
                            </small>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Blog Post 6 */}
                    <div className="mb-8 lg:mb-12">
                      <Zoom>
                        <div className="mb-6">
                          <Link to="#!">
                            <div className="img-zoom overflow-hidden rounded-xl">
                              <img
                                src={blog5}
                                alt="blog"
                                className="w-full h-auto rounded-xl hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                        </div>
                      </Zoom>
                      {/* text */}
                      <div className="mb-4">
                        <Link to="#!" className="text-primary hover:text-primary-dark transition-colors">
                          Recipes
                        </Link>
                      </div>
                      <div>
                        {/* text */}
                        <h2 className="text-xl font-semibold mb-3">
                          <Link to="#!" className="text-inherit hover:text-primary transition-colors">
                            No-Boil Baked Penne with Meatballs{" "}
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4">
                          Nulla consectetur sapien a libero imperdiet posuere.
                          Donec sollicitudin, turpis sit amet sollicitudin
                          tristique, metus eros euismod tortor
                        </p>
                        <div className="flex justify-between text-gray-500 text-sm mt-6">
                          <span>
                            <small>14 April 2023</small>
                          </span>
                          <span>
                            <small>
                              Read time:{" "}
                              <span className="text-gray-900 font-bold">6min</span>
                            </small>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Blog Post 7 */}
                    <div className="mb-8 lg:mb-12">
                      <Zoom>
                        <div className="mb-6">
                          <Link to="#!">
                            <div className="img-zoom overflow-hidden rounded-xl">
                              <img
                                src={blog7}
                                alt="blog"
                                className="w-full h-auto rounded-xl hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                        </div>
                      </Zoom>
                      {/* text */}
                      <div className="mb-4">
                        <Link to="#!" className="text-primary hover:text-primary-dark transition-colors">
                          Recipes
                        </Link>
                      </div>
                      <div>
                        {/* text */}
                        <h2 className="text-xl font-semibold mb-3">
                          <Link to="#!" className="text-inherit hover:text-primary transition-colors">
                            Red Chile Chicken Tacos with Creamy Corn
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elitaenean sit amet tincidunt ellentesque aliquet
                          ligula in ultrices congue.
                        </p>
                        <div className="flex justify-between text-gray-500 text-sm mt-6">
                          <span>
                            <small>16 April 2023</small>
                          </span>
                          <span>
                            <small>
                              Read time:{" "}
                              <span className="text-gray-900 font-bold">9min</span>
                            </small>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Blog Post 8 */}
                    <div className="mb-8 lg:mb-12">
                      <Zoom>
                        <div className="mb-6">
                          <Link to="#!">
                            <div className="img-zoom overflow-hidden rounded-xl">
                              <img
                                src={blog8}
                                alt="blog"
                                className="w-full h-auto rounded-xl hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                        </div>
                      </Zoom>
                      {/* text */}
                      <div className="mb-4">
                        <Link to="#!" className="text-primary hover:text-primary-dark transition-colors">
                          Retailer
                        </Link>
                      </div>
                      <div>
                        {/* text */}
                        <h2 className="text-xl font-semibold mb-3">
                          <Link to="#!" className="text-inherit hover:text-primary transition-colors">
                            Basic + Awesome Broccoli Cheese Soup
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elitaenean sit amet tincidunt ellentesque aliquet
                          ligula in ultrices congue.
                        </p>
                        <div className="flex justify-between text-gray-500 text-sm mt-6">
                          <span>
                            <small>12 April 2023</small>
                          </span>
                          <span>
                            <small>
                              Read time:{" "}
                              <span className="text-gray-900 font-bold">12min</span>
                            </small>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Blog Post 9 */}
                    <div className="mb-8 lg:mb-12">
                      <Zoom>
                        <div className="mb-6">
                          <Link to="#!">
                            <div className="img-zoom overflow-hidden rounded-xl">
                              <img
                                src={blog9}
                                alt="blog"
                                className="w-full h-auto rounded-xl hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                        </div>
                      </Zoom>
                      <div className="mb-4">
                        <Link to="#!" className="text-primary hover:text-primary-dark transition-colors">
                          Recipes
                        </Link>
                      </div>
                      <div>
                        {/* text */}
                        <h2 className="text-xl font-semibold mb-3">
                          <Link to="#!" className="text-inherit hover:text-primary transition-colors">
                            No-Boil Baked Penne with Meatballs{" "}
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4">
                          Nulla consectetur sapien a libero imperdiet posuere.
                          Donec sollicitudin, turpis sit amet sollicitudin
                          tristique, metus eros euismod tortor
                        </p>
                        <div className="flex justify-between text-gray-500 text-sm mt-6">
                          <span>
                            <small>14 April 2023</small>
                          </span>
                          <span>
                            <small>
                              Read time:{" "}
                              <span className="text-gray-900 font-bold">6min</span>
                            </small>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="w-full mt-12">
                    <nav>
                      <ul className="flex items-center justify-center gap-2">
                        <li>
                          <Link
                            className="px-4 py-2 mx-1 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            to="#"
                            aria-label="Previous"
                          >
                            <i className="fa fa-chevron-left" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="px-4 py-2 mx-1 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
                            to="#"
                          >
                            1
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="px-4 py-2 mx-1 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                            to="#"
                          >
                            2
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="px-4 py-2 mx-1 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                            to="#"
                          >
                            ...
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="px-4 py-2 mx-1 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                            to="#"
                          >
                            12
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="px-4 py-2 mx-1 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                            to="#"
                            aria-label="Next"
                          >
                            <i className="fa fa-chevron-right" />
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Blog;
