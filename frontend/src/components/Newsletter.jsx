import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "submitting" | "success" | ""

  const Google_Sheet_URL =
    "https://script.google.com/macros/s/AKfycbwa1AW9t2MbwOJ_mdDmiM8mTt6W6_26Au4TikywnA3ayXlB86eKiHJDcasrMgrEn-_g/exec";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");

    try {
      await fetch(Google_Sheet_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }),
      });

      setStatus("success");

      await fetch(Google_Sheet_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email,
          action: "notify",
        }),
      });


      // Clear status after 2 seconds
      setTimeout(() => {
        setStatus("");
        setEmail("");
      }, 2000);
    } catch (error) {
      console.error("Error sending request:", error);
      setStatus(""); // Reset status on error
    }
  };

  return (
    <section
      className="newsletter bg-light"
      style={{ backgroundImage: "url(images/pattern-bg.png)", backgroundRepeat: "no-repeat" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 py-5 my-5">
            <div className="subscribe-header text-center pb-3">
              <h3 className="section-title text-uppercase">Sign Up for Latest Updates</h3>
            </div>

            <form id="form" className="d-flex flex-wrap gap-2" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                className="form-control form-control-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "submitting"}
                placeholder="Your Email Address"
              />

              <button type="submit" className="btn btn-dark btn-lg text-uppercase w-100" disabled={status === "submitting"}>
                {status === "submitting"
                  ? "Submitting..."
                  : status === "success"
                  ? "Subscribed!"
                  : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
