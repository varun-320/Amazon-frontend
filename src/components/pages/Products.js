import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Products.css";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(null);

  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    sort: "-createdAt",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page,
      };
      
      if (searchQuery.trim() !== '') {
        params.search = searchQuery;
      }
      
      const response = await getProducts(params);
      setProducts(response.products);
      setTotalPages(response.pages);
      setLoading(false);
    } catch (error) {
      console.error("Error loading products:", error);
      setLoading(false);
    }
  }, [filters, page, searchQuery]);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (!isSearching) {
      loadProducts();
    }
  }, [page, filters, isSearching, loadProducts]);

  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => {
        setAddedToCart(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        loadProducts();
      } else {
        setIsSearching(false);
        loadProducts(); // or optionally: setProducts([])
      }
    }, 600);
  
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, loadProducts]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      setAddedToCart(product._id);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={`products-container ${isSearching ? 'searching' : ''}`}>
      <div className="search-section">
      <div className="search-form">
  <input
    type="text"
    placeholder="Search products..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="search-input"
  />
</div>
 {/* <button type="submit" className="search-button">
            <i className="fas fa-search"></i> Search
          </button> */}
       
      </div>

      {isSearching && (
        <div className="search-results-container">
          <h2 className="search-results-title">
            {products.length > 0 
              ? `Search Results for "${searchQuery}"` 
              : `No results found for "${searchQuery}"`}
          </h2>
          <div className="search-results-grid">
            {products.map((product) => (
              <div key={product._id} className="search-result-card">
                <Link to={`/products/${product._id}`} className="product-link">
                  <img 
                    src={product.images[0]?.url || '/images/placeholder.png'} 
                    alt={product.name}
                    className="search-result-image"
                  />
                  <div className="search-result-details">
                    <h3>{product.name}</h3>
                    <p className="price">₹{product.price}</p>
                    <p className="description">{product.description}</p>
                    <div className="rating">
                      {"★".repeat(Math.round(product.rating))}
                      {"☆".repeat(5 - Math.round(product.rating))}
                      <span>({product.numReviews})</span>
                    </div>
                  </div>
                </Link>
                <div className="product-actions">
                  <button 
                    className={`add-to-cart-btn ${addedToCart === product._id ? 'added' : ''}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    {addedToCart === product._id ? 'Added! ✓' : 'Add to Cart'}
                  </button>
                  {wishlist.some((item) => item._id === product._id) ? (
                    <button className="wishlist-btn remove" onClick={() => removeFromWishlist(product._id)}>
                      ❌ Remove from Wishlist
                    </button>
                  ) : (
                    <button className="wishlist-btn add" onClick={() => addToWishlist(product)}>
                      ❤️ Add to Wishlist
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isSearching && (
        <>
          {user?.isAdmin && (
            <Link to="/products/new" className="add-product-button">
              Add New Product
            </Link>
          )}
          <div className="filters-section">
            <h2>Filters</h2>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="price-filter">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>

            <select
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Star</option>
            </select>

            <select name="sort" value={filters.sort} onChange={handleFilterChange}>
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-price">Price: High to Low</option>
              <option value="price">Price: Low to High</option>
              <option value="-rating">Rating: High to Low</option>
            </select>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <Link to={`/products/${product._id}`}>
                  <div className="product-image">
                    <img
                      src={product.images[0]?.url || "/images/placeholder.png"}
                      alt={product.name}
                    />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">₹{product.price}</p>
                    <div className="rating">
                      {"★".repeat(Math.round(product.rating))}
                      {"☆".repeat(5 - Math.round(product.rating))}
                      <span>({product.numReviews})</span>
                    </div>
                  </div>
                </Link>
                <div className="product-actions">
                  <button 
                    className={`add-to-cart-btn ${addedToCart === product._id ? 'added' : ''}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    {addedToCart === product._id ? 'Added! ✓' : 'Add to Cart'}
                  </button>
                  {wishlist.some((item) => item._id === product._id) ? (
                    <button className="wishlist-btn remove" onClick={() => removeFromWishlist(product._id)}>
                      ❌ Remove from Wishlist
                    </button>
                  ) : (
                    <button className="wishlist-btn add" onClick={() => addToWishlist(product)}>
                      ❤️ Add to Wishlist
                    </button>
                  )}
                </div>
                {user?.isAdmin && (
                  <div className="admin-actions">
                    <Link
                      to={`/products/edit/${product._id}`}
                      className="edit-button"
                    >
                      Edit
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;
