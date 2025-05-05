/* eslint-disable jsx-a11y/anchor-is-valid */
import React,{useEffect, useState} from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import supabase from "../supabaseClient";
import { useAuth } from "../store/slice/AuthContext";

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const Navbar = () => {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      localStorage.clear();
      alert("Logged out succesfully!");
      setUser(null); // Reset userId on successful logout
      console.log("Logged out successfully");
    }
  };

  return (
    <>
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
                {user && (
                      <li onClick={handleLogout} style={{
                        cursor: "pointer",
                        color: "#333",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = "#000")}
                      onMouseOut={(e) => (e.currentTarget.style.color = "#333")}>
                        Logout
                  </li>
                   )}
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
                    {user && (
                      <li onClick={handleLogout} style={{
                        cursor: "pointer",
                        color: "#333",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = "#000")}
                      onMouseOut={(e) => (e.currentTarget.style.color = "#333")}>
                        Logout
                  </li>
                   )}
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