import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/footer-39201.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const date = new Date();
  const year = date.getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log("Subscribing:", email);
    
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Thank You!',
      text: 'Thanks for contacting us, we will contact you back soon.',
      showConfirmButton: true,
      confirmButtonColor: '#22c55e',
      timer: 5000,
    });
    
    // Clear the email field
    setEmail("");
  };

  return (
    <footer className="footer-39201 bg-gray-900 text-gray-300 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          <div className="mb-3 md:mb-0 text-center md:text-left">
            <h3 className="text-white text-lg font-semibold mb-3">Categories</h3>
            <ul className="space-y-1.5 nav-links">
              <li><Link to="/Shop" className="text-gray-400 hover:text-primary transition-colors text-sm">Fruits & Vegetables</Link></li>
              <li><Link to="/Shop" className="text-gray-400 hover:text-primary transition-colors text-sm">Dairy & Eggs</Link></li>
              <li><Link to="/Shop" className="text-gray-400 hover:text-primary transition-colors text-sm">Bakery & Bread</Link></li>
              <li><Link to="/Shop" className="text-gray-400 hover:text-primary transition-colors text-sm">Meat & Seafood</Link></li>
              <li><Link to="/Shop" className="text-gray-400 hover:text-primary transition-colors text-sm">Snacks & Beverages</Link></li>
              <li><Link to="/Shop" className="text-gray-400 hover:text-primary transition-colors text-sm">Household Essentials</Link></li>
            </ul>
          </div>
          <div className="mb-3 md:mb-0 text-center md:text-left">
            <h3 className="text-white text-lg font-semibold mb-3">About</h3>
            <ul className="space-y-1.5 nav-links">
              <li><Link to="/AboutUs" className="text-gray-400 hover:text-primary transition-colors text-sm">About us</Link></li>
              <li><Link to="/Clients" className="text-gray-400 hover:text-primary transition-colors text-sm">Clients</Link></li>
              <li><Link to="/Services" className="text-gray-400 hover:text-primary transition-colors text-sm">Services</Link></li>
              <li><Link to="/Shop" className="text-gray-400 hover:text-primary transition-colors text-sm">Shop</Link></li>
              <li><Link to="/Blog" className="text-gray-400 hover:text-primary transition-colors text-sm">Blog</Link></li>
              <li><Link to="/Contact" className="text-gray-400 hover:text-primary transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
          <div className="mb-3 md:mb-0 text-center md:text-left">
            <h3 className="text-white text-lg font-semibold mb-3">Legal</h3>
            <ul className="space-y-1.5 nav-links">
              <li><Link to="/Faq" className="text-gray-400 hover:text-primary transition-colors text-sm">Terms &amp; Conditions</Link></li>
              <li><Link to="/Faq" className="text-gray-400 hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/Faq" className="text-gray-400 hover:text-primary transition-colors text-sm">Legality</Link></li>
              <li><Link to="/Faq" className="text-gray-400 hover:text-primary transition-colors text-sm">Author License</Link></li>
            </ul>
          </div>
          <div className="mb-3 md:mb-0">
            <h3 className="text-white text-lg font-semibold mb-3">Subscribe</h3>
            <p className="mb-3 text-gray-400 text-sm">Stay updated with our latest offers and news. Subscribe to our newsletter for exclusive deals.</p>
            <form action="#" className="subscribe flex flex-col sm:flex-row gap-2" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                className="flex-1 px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
                placeholder="Enter your e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer text-sm" value="Send" />
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-800">
          <div className="mb-2 md:mb-0">
            <p className="text-sm text-gray-400">&copy; {year} All Rights Reserved.</p>
          </div>
          <div className="md:text-right">
            <ul className="social flex space-x-4">
              <li><a href="#" aria-label="Facebook" className="text-gray-400 hover:text-primary transition-colors"><i className="fab fa-facebook-f"></i></a></li>
              <li><a href="#" aria-label="Twitter" className="text-gray-400 hover:text-primary transition-colors"><i className="fab fa-twitter"></i></a></li>
              <li><a href="#" aria-label="Pinterest" className="text-gray-400 hover:text-primary transition-colors"><i className="fab fa-pinterest"></i></a></li>
              <li><a href="#" aria-label="Instagram" className="text-gray-400 hover:text-primary transition-colors"><i className="fab fa-instagram"></i></a></li>
              <li><a href="#" aria-label="Behance" className="text-gray-400 hover:text-primary transition-colors"><i className="fab fa-behance"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
