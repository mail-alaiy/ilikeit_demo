/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.jpg";

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const Navbar = () => {
  return (
    <>
      {/* Banner */}
      <div className="top-header">
        <div className="banner-container">
          <p className="banner-text">
            GET ₹500 OFF ON ORDERS ABOVE ₹2000. USE CODE: TT500 | FREE SHIPPING
            ON ORDERS ABOVE ₹999!
          </p>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg bg-light text-uppercase fs-6 p-3 border-bottom">
        <div className="container-fluid px-0 px-sm-2">
          <div className="d-flex justify-content-between align-items-center w-100">
            {/* Logo */}
            <div className="navbar-brand me-0">
              <Link to="/" className="text-white">
                <img
                  src={logo}
                  alt="Tom Tailor India"
                  style={{
                    maxWidth: "130px",
                    width: "100%",
                    mixBlendMode: "multiply",
                  }}
                  className="img-fluid"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="d-none d-lg-flex align-items-center"> {/* Changed to d-lg-flex */}
              <ul className="navbar-nav flex-row gap-md-5">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    href="#newArrivals"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("newArrivals");
                    }}
                  >
                    NEW IN
                  </a>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    id="dropdownShop"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    MEN
                  </a>

                  <ul className="dropdown-menu" aria-labelledby="dropdownShop">
                    <li>
                      <a
                        href="#tshirts"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection("tshirts");
                        }}
                        className="dropdown-item"
                      >
                        T-Shirts
                      </a>
                    </li>
                    <li>
                      <a
                        href="#shirts"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection("shirts");
                        }}
                        className="dropdown-item"
                      >
                        Shirts
                      </a>
                    </li>
                    <li>
                      <a
                        href="#winter-comfort"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection("winter-comfort");
                        }}
                        className="dropdown-item"
                      >
                        Winter Wear
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link active"
                    href="#footer"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("footer");
                    }}
                  >
                    LINKS
                  </a>
                </li>
              </ul>
              <ul className="list-unstyled d-flex m-0 align-items-center ms-4">
                <li>
                  <Link to="/wishlist" className="text-uppercase mx-3">
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="text-uppercase mx-3"
                  >
                    Cart
                  </Link>
                </li>
                <li className="search-box">
                  <a href="#search" className="search-button mx-3">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="navbar-toggler border-0 d-lg-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Mobile Offcanvas Menu */}
            <div
              className="offcanvas offcanvas-end d-lg-none"
              tabIndex="-1"
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
            >
              {/* ... Mobile menu content remains the same ... */}
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                  Menu
                </h5>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-end flex-grow-1 gap-1 gap-md-3 pe-3">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      href="#newArrivals"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection("newArrivals");
                      }}
                    >
                      NEW IN
                    </a>
                  </li>

                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      id="offcanvasDropdownShop"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      MEN
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="offcanvasDropdownShop"
                    >
                      <li>
                        <a
                          href="#tshirts"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection("tshirts");
                          }}
                          className="dropdown-item"
                        >
                          T-Shirts
                        </a>
                      </li>
                      <li>
                        <a
                          href="#shirts"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection("shirts");
                          }}
                          className="dropdown-item"
                        >
                          Shirts
                        </a>
                      </li>
                      <li>
                        <a
                          href="#winter-comfort"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection("winter-comfort");
                          }}
                          className="dropdown-item"
                        >
                          Winter Wear
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      href="#footer"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection("footer");
                      }}
                    >
                      LINKS
                    </a>
                  </li>
                  <li className="nav-item">
                    <Link to="/wishlist" className="nav-link">
                      Wishlist
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/cart"
                      className="nav-link"
                    >
                      Cart
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;