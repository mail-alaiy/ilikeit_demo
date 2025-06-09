import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

// Ensure these environment variables are correctly loaded, e.g., via a .env file
const HYGRAPH_API = process.env.REACT_APP_HYGRAPH_API;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  // currentIndex is not needed globally for the image slider within each card

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddToCart = (product) => {
    alert("Added to Cart");
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const storedGenerated =
        JSON.parse(localStorage.getItem("generatedWishlist")) || [];

      // Extract garment IDs from generated cart
      const garmentIds = storedGenerated.map(
        (item) => item.garment_id_by_brand
      );

      try {
        // Fetch product data from Hygraph for both regular and generated cart
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
            variables: { ids: [...storedWishlist, ...garmentIds] },
          }),
        });

        const { data } = await response.json();

        if (data && data.products) {
          // Separate regular and generated products
          const wishlistItems = data.products.filter((product) =>
            storedWishlist.includes(product.id)
          );

          const generatedItems = storedGenerated.map((item) => {
            const matchedProduct = data.products.find(
              (p) => p.id === item.garment_id_by_brand
            );
            return {
              ...item,
              product: matchedProduct || null,
              // Add a state for each generated item to track which image is currently shown
              showGenerated: true, // true for generated image, false for original product image
            };
          });

          setWishlist(wishlistItems);
          setGeneratedImages(generatedItems);
        } else {
          console.error("Invalid product data from Hygraph:", data);
          setWishlist([]);
          setGeneratedImages([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = (id) => {
    const updatedWishlist = wishlist.filter((product) => product.id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist.map((p) => p.id))
    );
  };

  const toggleGeneratedWishlist = (itemToRemove) => {
    const updatedGenerated = generatedImages.filter(
      (item) => item.id !== itemToRemove.id
    );
    setGeneratedImages(updatedGenerated);
    localStorage.setItem("generatedWishlist", JSON.stringify(updatedGenerated));
  };

  // New function to toggle the image for a specific generated item
  const toggleGeneratedImage = (itemId) => {
    setGeneratedImages((prevGeneratedImages) =>
      prevGeneratedImages.map((item) =>
        item.id === itemId
          ? { ...item, showGenerated: !item.showGenerated }
          : item
      )
    );
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
            paddingLeft: "0",
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
            <h1 className="display-5 fw-bold text-primary mb-0">My Wishlist</h1>
            <div className="badge bg-light text-secondary px-3 py-2 rounded-pill">
              {wishlist.length + generatedImages.length}{" "}
              {wishlist.length + generatedImages.length === 1
                ? "item"
                : "items"}
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
          <p className="mt-3 text-muted">Loading your wishlist...</p>
        </div>
      ) : wishlist.length > 0 || generatedImages.length > 0 ? (
        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {generatedImages.map((item) => (
            <div key={item.id} className="col">
              <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden position-relative">
                <div className="position-absolute top-0 end-0 m-3 z-index-1">
                  <button
                    className="btn btn-light btn-sm rounded-circle shadow-sm p-2"
                    onClick={() => toggleGeneratedWishlist(item)}
                    aria-label="Remove generated image"
                  >
                    <i className="bi bi-trash text-danger" />
                  </button>
                </div>

                {/* Image Slider Controls */}
                <div className="position-absolute top-0 start-0 m-3 z-index-1">
                  <button
                    className="btn btn-light btn-sm rounded-circle shadow-sm p-2"
                    onClick={() => toggleGeneratedImage(item.id)}
                    aria-label="Toggle image"
                    disabled={!item.product?.images?.[0]?.url} // Disable if original product image is not available
                  >
                    {item.showGenerated ? (
                      <i className="bi bi-arrow-left-right" title="Show Original" />
                    ) : (
                      <i className="bi bi-magic" title="Show Generated" />
                    )}
                  </button>
                </div>

                <img
                  src={
                    item.showGenerated
                      ? item.inference_image_url
                      : item.product?.images?.[0]?.url || ""
                  }
                  alt={item.showGenerated ? "Generated" : item.product?.name || "Product"}
                  className="card-img-top img-fluid"
                  style={{ minHeight: '200px', objectFit: 'cover' }} // Added for better image handling
                />

                <div className="card-body p-4">
                  <h5 className="card-title mb-2 fs-6 fs-md-5">
                    {item.product?.name || "Generated Item"}
                  </h5>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="price-tag">
                      <span className="fs-6 fs-md-4 fw-bold text-primary">
                        ₹{item.product?.price?.toFixed(2) || "N/A"}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}

          {wishlist.map((product) => (
            <div key={product.id} className="col">
              <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden position-relative">
                <div className="position-absolute top-0 end-0 m-3 z-index-1">
                  <button
                    className="btn btn-light btn-sm rounded-circle shadow-sm p-2"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Remove from wishlist"
                  >
                    <i className="bi bi-trash text-danger" />
                  </button>
                </div>

                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="card-img-top img-fluid"
                  style={{ minHeight: '200px', objectFit: 'cover' }} // Added for better image handling
                />

                <div className="card-body p-4">
                  <h5 className="card-title mb-2 fs-6 fs-md-5">
                    {product.name}
                  </h5>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="price-tag">
                      <span className="fs-6 fs-md-4 fw-bold text-primary">
                        ₹{product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 my-4 bg-light bg-opacity-50 rounded-3">
          <i
            className="bi bi-heart text-muted mb-3"
            style={{ fontSize: "3rem" }}
          />
          <h4 className="text-muted mb-2">Your wishlist is empty</h4>
          <p className="text-muted mb-4">
            Browse our catalog and save items you love
          </p>
          <button
            className="btn btn-primary rounded-pill px-4 py-2"
            onClick={() => navigate("/")}
          >
            Explore Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;