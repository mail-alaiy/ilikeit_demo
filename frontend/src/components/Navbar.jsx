/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <><div className="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasCart" aria-labelledby="My Cart">
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
  <div className="top-header">
    <div className="banner-container">
      <p className="banner-text">GET ₹500 OFF ON ORDERS ABOVE ₹2000. USE CODE: TT500 | FREE SHIPPING ON ORDERS ABOVE ₹999!</p>
    </div>
  </div>
  <nav className="navbar navbar-expand-lg bg-light text-uppercase fs-6 p-3 border-bottom align-items-center">
    <div className="container-fluid">
      <div className="row justify-content-between align-items-center w-100">

        <div className="col-auto">
          <a className="navbar-brand text-white" href="index.html">
            <img src="//tom-tailor.co.in/cdn/shop/files/Tom_tailor_LOGO_1_59773f50-f0c3-4f70-9f97-22ac7c47028a_500x.jpg?v=1613784776" 
                 srcset="//tom-tailor.co.in/cdn/shop/files/Tom_tailor_LOGO_1_59773f50-f0c3-4f70-9f97-22ac7c47028a_500x@2x.jpg?v=1613784776 1x, 
                         //tom-tailor.co.in/cdn/shop/files/Tom_tailor_LOGO_1_59773f50-f0c3-4f70-9f97-22ac7c47028a.jpg?v=1613784776 1.1x" 
                 alt="Tom Tailor India" 
                 style={{ maxWidth: "200px", mixBlendMode: "multiply" }}/>
        </a>        
        </div>

        <div className="col-auto">
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"
                aria-label="Close"></button>
            </div>

            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 gap-1 gap-md-5 pe-3">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle active" href="#" id="dropdownHome" data-bs-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">NEW IN</a>
                  <ul className="dropdown-menu list-unstyled" aria-labelledby="dropdownHome">
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Men</a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Women </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Sale</a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="dropdownShop" data-bs-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">MEN</a>
                  <ul className="dropdown-menu list-unstyled" aria-labelledby="dropdownShop">
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Shop All </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">T-Shirts</a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Shirts</a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Jackets</a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Winter Wear</a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Formal Wear</a>
                    </li>
                  </ul>
                </li>
                {/*
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="dropdownBlog" data-bs-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">WOMEN</a>
                  <ul className="dropdown-menu list-unstyled" aria-labelledby="dropdownBlog">
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Shop All </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Women's Jacket</a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Women's Long Coat </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Women's Sweat </a>
                    </li>
                  </ul>
                </li>
          */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="dropdownPages" data-bs-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">LINKS</a>
                  <ul className="dropdown-menu list-unstyled" aria-labelledby="dropdownPages">
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">About </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Cart </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Checkout </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Coming Soon </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Contact </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Error Page </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">FAQs </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">My Account </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Order Tracking </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Wishlist </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-3 col-lg-auto">
          <ul className="list-unstyled d-flex m-0">
          <li className="d-none d-lg-block">
          <Link
                          to="/wishlist"
                          className="text-uppercase mx-3"
                        >
                          Wishlist
                        </Link>
                        </li>
            <li className="d-none d-lg-block">
              <a href="index.html" className="text-uppercase mx-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart"
                aria-controls="offcanvasCart">Cart 
              </a>
            </li>
            <li className="d-lg-none">
              <a href="#" className="mx-2">
                <svg width="24" height="24" viewBox="0 0 24 24">
                </svg>
              </a>
            </li>
            <li className="d-lg-none">
              <a href="#" className="mx-2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart"
                aria-controls="offcanvasCart">
                <svg width="24" height="24" viewBox="0 0 24 24">
                </svg>
              </a>
            </li>
            <li className="search-box" style={{marginRight:2}}>
              <a href="#search" className="search-button">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  
                </svg>
              </a>
            </li>
          </ul>
        </div>

      </div>

    </div>
  </nav>
  </>
  )
}

export default Navbar