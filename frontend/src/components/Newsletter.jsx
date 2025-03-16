import React from 'react'

const Newsletter = () => {
  return (
    <section className="newsletter bg-light" style={{ backgroundImage: "url(images/pattern-bg.png)", backgroundRepeat: "no-repeat" }}  >
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 py-5 my-5">
          <div className="subscribe-header text-center pb-3">
            <h3 className="section-title text-uppercase">Sign Up for our newsletter</h3>
          </div>
          <form id="form" className="d-flex flex-wrap gap-2">
            <input type="text" name="email" placeholder="Your Email Addresss" className="form-control form-control-lg"/>
            <button className="btn btn-dark btn-lg text-uppercase w-100">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Newsletter