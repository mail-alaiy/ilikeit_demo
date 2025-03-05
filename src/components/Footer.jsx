/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

const Footer = () => {
  return (
    <footer id="footer" className="mt-5">
    <div className="container">
      <div className="row d-flex flex-wrap justify-content-between py-5">
        <div className="col-md-3 col-sm-6">
          <div className="footer-menu footer-menu-001">
            <div className="footer-intro mb-4">
              <a href="index.html">
                <img src="//tom-tailor.co.in/cdn/shop/files/Tom_tailor_LOGO_1_59773f50-f0c3-4f70-9f97-22ac7c47028a_500x.jpg?v=1613784776" 
                 srcset="//tom-tailor.co.in/cdn/shop/files/Tom_tailor_LOGO_1_59773f50-f0c3-4f70-9f97-22ac7c47028a_500x@2x.jpg?v=1613784776 1x, 
                         //tom-tailor.co.in/cdn/shop/files/Tom_tailor_LOGO_1_59773f50-f0c3-4f70-9f97-22ac7c47028a.jpg?v=1613784776 1.1x" 
                 alt="Tom Tailor India" 
                 style={{ marginLeft: "50px", maxWidth: "200px", mixBlendMode: "multiply" }}/>
              </a>
            </div>
            <p>Discover the latest in fashion and comfort with our curated collection of sweaters, jackets, and coats. We're committed to bringing you high-quality, stylish outerwear for every season</p>
            <div className="social-links">
              <ul className="list-unstyled d-flex flex-wrap gap-3">
                <li>
                  <a href="#" className="text-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      {/*facebook*/}
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      {/*twitter*/}
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      {/*youtube*/}
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      {/*pinterest*/}
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      {/*instagram*/}
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="footer-menu footer-menu-002">
            <h5 className="widget-title text-uppercase mb-4">Quick Links</h5>
            <ul className="menu-list list-unstyled text-uppercase border-animation-left fs-6">
              <li className="menu-item">
                <a href="index.html" className="item-anchor">Home</a>
              </li>
              <li className="menu-item">
                <a href="index.html" className="item-anchor">About</a>
              </li>
              <li className="menu-item">
                <a href="blog.html" className="item-anchor">Services</a>
              </li>
              <li className="menu-item">
                <a href="styles.html" className="item-anchor">Single item</a>
              </li>
              <li className="menu-item">
                <a href="#" className="item-anchor">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="footer-menu footer-menu-003">
            <h5 className="widget-title text-uppercase mb-4">Help & Info</h5>
            <ul className="menu-list list-unstyled text-uppercase border-animation-left fs-6">
              <li className="menu-item">
                <a href="#" className="item-anchor">Track Your Order</a>
              </li>
              <li className="menu-item">
                <a href="#" className="item-anchor">Returns + Exchanges</a>
              </li>
              <li className="menu-item">
                <a href="#" className="item-anchor">Shipping + Delivery</a>
              </li>
              <li className="menu-item">
                <a href="#" className="item-anchor">Contact Us</a>
              </li>
              <li className="menu-item">
                <a href="#" className="item-anchor">Find us easy</a>
              </li>
              <li className="menu-item">
                <a href="index.html" className="item-anchor">Faqs</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="footer-menu footer-menu-004 border-animation-left">
            <h5 className="widget-title text-uppercase mb-4">Contact Us</h5>
            <p>Do you have any questions or suggestions? <a href="mailto:tomtailorindia@inceptralifestyle.com"
                className="item-anchor">tomtailorindia@inceptralifestyle.com</a></p>
            <p>Do you need support? Give us a call. <a href="tel:+91 - 9876543210" className="item-anchor">+91 - 9876543210</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer