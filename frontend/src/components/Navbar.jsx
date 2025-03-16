/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      {/* Cart Offcanvas */}
      <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex="-1" id="offcanvasCart" aria-labelledby="My Cart">
        <div className="offcanvas-header justify-content-center">
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">0</span>
            </h4>
            <button className="w-100 btn btn-primary btn-lg" type="submit">Add items to continue to checkout</button>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="top-header">
        <div className="banner-container">
          <p className="banner-text">GET ₹500 OFF ON ORDERS ABOVE ₹2000. USE CODE: TT500 | FREE SHIPPING ON ORDERS ABOVE ₹999!</p>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg bg-light text-uppercase fs-6 p-3 border-bottom">
        <div className="container-fluid px-0 px-sm-2">
          <div className="d-flex justify-content-between align-items-center w-100">

            {/* Logo */}
            <div className="navbar-brand me-0">
              <a className="text-white" href="index.html">
                <img src="//tom-tailor.co.in/cdn/shop/files/Tom_tailor_LOGO_1_59773f50-f0c3-4f70-9f97-22ac7c47028a_500x.jpg?v=1613784776" 
                    alt="Tom Tailor India" 
                    style={{ maxWidth: "150px", width: "100%", mixBlendMode: "multiply" }}
                    className="img-fluid"/>
              </a>        
            </div>

            {/* Desktop Menu */}
            <div className="d-none d-lg-block">
              <ul className="navbar-nav flex-row gap-md-5">
                {renderMenuItems()}
              </ul>
            </div>

            {/* Desktop Icons */}
            <div className="d-none d-lg-block">
              <ul className="list-unstyled d-flex m-0 align-items-center">
                <li><Link to="/wishlist" className="text-uppercase mx-3">Wishlist</Link></li>
                <li>
                  <a href="#" className="text-uppercase mx-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart"
                    aria-controls="offcanvasCart">Cart</a>
                </li>
                <li className="search-box">
                  <a href="#search" className="search-button mx-3">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="navbar-toggler border-0 d-lg-none" type="button" data-bs-toggle="offcanvas" 
              data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Mobile Offcanvas Menu */}
            <div className="offcanvas offcanvas-end d-lg-none" tabIndex="-1" id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"
                  aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-end flex-grow-1 gap-1 gap-md-5 pe-3">
                  {renderMenuItems()}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

// Helper function to render menu items
const renderMenuItems = () => (
  <>
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle active" href="#" id="dropdownHome" data-bs-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">NEW IN</a>
      <ul className="dropdown-menu list-unstyled" aria-labelledby="dropdownHome">
        <li><a href="index.html" className="dropdown-item item-anchor">Men</a></li>
        <li><a href="index.html" className="dropdown-item item-anchor">Women</a></li>
        <li><a href="index.html" className="dropdown-item item-anchor">Sale</a></li>
      </ul>
    </li>
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="dropdownShop" data-bs-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">MEN</a>
      <ul className="dropdown-menu list-unstyled" aria-labelledby="dropdownShop">
        <li><a href="index.html" className="dropdown-item item-anchor">Shop All</a></li>
        <li><a href="index.html" className="dropdown-item item-anchor">T-Shirts</a></li>
        <li><a href="index.html" className="dropdown-item item-anchor">Shirts</a></li>
        <li><a href="index.html" className="dropdown-item item-anchor">Jackets</a></li>
        <li><a href="index.html" className="dropdown-item item-anchor">Winter Wear</a></li>
        <li><a href="index.html" className="dropdown-item item-anchor">Formal Wear</a></li>
      </ul>
    </li>
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="dropdownPages" data-bs-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">LINKS</a>
      <ul className="dropdown-menu list-unstyled" aria-labelledby="dropdownPages">
        <li><a href="index.html" className="dropdown-item item-anchor">About</a></li>
        <li><a href="index.html" className="dropdown-item item-anchor">Checkout</a></li>
        <li><a href="index.html" className="dropdown-item item-anchor">Contact</a></li>
        <li><a href="index.html" className="dropdown-item item-anchor">FAQs</a></li>
      </ul>
    </li>
  </>
);

export default Navbar;
