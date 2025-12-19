import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/footer-39201.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const date = new Date();
  const year = date.getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log("Subscribing:", email);
    setEmail("");
  };

  return (
    <footer className="footer-39201">
      <div className="container">
        <div className="row">
          <div className="col-md mb-4 mb-md-0">
            <h3>Categories</h3>
            <ul className="list-unstyled nav-links">
              <li><Link to="/Shop">Fruits & Vegetables</Link></li>
              <li><Link to="/Shop">Dairy & Eggs</Link></li>
              <li><Link to="/Shop">Bakery & Bread</Link></li>
              <li><Link to="/Shop">Meat & Seafood</Link></li>
              <li><Link to="/Shop">Snacks & Beverages</Link></li>
              <li><Link to="/Shop">Household Essentials</Link></li>
            </ul>
          </div>
          <div className="col-md mb-4 mb-md-0">
            <h3>About</h3>
            <ul className="list-unstyled nav-links">
              <li><Link to="/AboutUs">About us</Link></li>
              <li><Link to="/Clients">Clients</Link></li>
              <li><Link to="/Services">Services</Link></li>
              <li><Link to="/Shop">Best sellers</Link></li>
              <li><Link to="/Blog">Blog</Link></li>
              <li><Link to="/Contact">Contact</Link></li>
            </ul>
          </div>
          <div className="col-md mb-4 mb-md-0">
            <h3>Legal</h3>
            <ul className="list-unstyled nav-links">
              <li><Link to="/Faq">Terms &amp; Conditions</Link></li>
              <li><Link to="/Faq">Privacy Policy</Link></li>
              <li><Link to="/Faq">Legality</Link></li>
              <li><Link to="/Faq">Author License</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <h3>Subscribe</h3>
            <p className="mb-4">Stay updated with our latest offers and news. Subscribe to our newsletter for exclusive deals.</p>
            <form action="#" className="subscribe" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                className="form-control" 
                placeholder="Enter your e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input type="submit" className="btn btn-submit" value="Send" />
            </form>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-12">
            <div className="border-top my-5"></div>
          </div>
          <div className="col-md-6">
            <p><small>&copy; {year} All Rights Reserved.</small></p>
          </div>
          <div className="col-md-6 text-md-right">
            <ul className="social list-unstyled">
              <li><a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a></li>
              <li><a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a></li>
              <li><a href="#" aria-label="Pinterest"><i className="fab fa-pinterest"></i></a></li>
              <li><a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a></li>
              <li><a href="#" aria-label="Behance"><i className="fab fa-behance"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
