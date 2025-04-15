import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const HYGRAPH_API = process.env.REACT_APP_HYGRAPH_API;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const storedGenerated = JSON.parse(localStorage.getItem("generatedCart")) || [];

      setGeneratedImages(storedGenerated);

      if (storedCart.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(HYGRAPH_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            query: `
              query GetProducts($ids: [ID!]) {
                products(where: { id_in: $ids }) {
                  id
                  name
                  price
                  category
                  images {
                    url
                  }
                }
              }
            `,
            variables: { ids: storedCart },
          }),
        });

        const { data } = await response.json();
        if (data && data.products) {
          setCart(data.products);
        } else {
          console.error("Invalid data structure from Hygraph:", data);
          setCart([]);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const toggleCart = (id) => {
    const updatedCart = cart.filter((product) => product.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart.map((p) => p.id))); // Store only IDs
  };

  return (
    <div className="container py-5">
      {/* Back Button */}
      <div className="mb-4">
        <button 
          onClick={handleBack} 
          className="btn btn-link p-0 bg-transparent d-flex align-items-center"
          style={{
            fontSize: "1rem", 
            color: "#6c757d",
            transition: "transform 0.2s ease", 
            paddingLeft: "0"
          }}
        >
          <i 
            className="bi bi-arrow-left-circle" 
            style={{ fontSize: "1.5rem" }} 
          />
          <span 
            className="ms-2" 
            style={{ fontSize: "1rem", fontWeight: "500" }}
          >
            Back
          </span>
        </button>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="display-5 fw-bold text-primary mb-0">My Cart</h1>
            <div className="badge bg-light text-secondary px-3 py-2 rounded-pill">
              {cart.length + generatedImages.length} {cart.length + generatedImages.length === 1 ? "item" : "items"}
            </div>
          </div>
          <hr className="mt-3 mb-4" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your Cart...</p>
        </div>
      ) : cart.length > 0 || generatedImages.length > 0 ? (
        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {generatedImages.map((url, index) => (
            <div key={`generated-${index}`} className="col">
              <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden position-relative">

                <img
                  src={url}
                  alt={`Generated ${index}`}
                  className="card-img-top img-fluid"
                />

                <div className="card-body p-4">
                  <h5 className="card-title mb-2">Generated Image</h5>
                </div>
              </div>
            </div>
          ))}
          {cart.map((product) => (
            <div key={product.id} className="col">
              <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden position-relative">
                <div className="position-absolute top-0 end-0 m-3 z-index-1">
                  <button
                    className="btn btn-light btn-sm rounded-circle shadow-sm p-2"
                    onClick={() => toggleCart(product.id)}
                    aria-label="Remove from cart"
                  >
                    <i className="bi bi-trash text-danger" />
                  </button>
                </div>

                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="card-img-top img-fluid"
                />

                <div className="card-body p-4">
                  <h5 className="card-title mb-2">{product.name}</h5>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="price-tag">
                      <span className="fs-4 fw-bold text-primary">₹{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 my-4 bg-light bg-opacity-50 rounded-3">
          <i className="bi bi-heart text-muted mb-3" style={{ fontSize: "3rem" }} />
          <h4 className="text-muted mb-2">Your cart is empty</h4>
          <p className="text-muted mb-4">Browse our catalog and add items you love</p>
          <button className="btn btn-primary rounded-pill px-4 py-2"
          onClick={() => navigate('/')}>
            Explore Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
