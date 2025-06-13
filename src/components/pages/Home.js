import React, { useState, useEffect } from "react";
/*import Navbar from "./Navbar";*/
// import Card from "./Cards";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from 'react-router-dom';
import { getProducts } from '../../utils/api';
// import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../styles/Home.css";

const banners = [
  "/images/banner1.png",
  "/images/banner2.png",
  "/images/banner3.png",
  "/images/banner4.png",
  "/images/banner5.png",
  "/images/banner6.png",
  "/images/banner7.png",
  "/images/banner8.png",
  "/images/banner9.png",
  "/images/banner10.png",
];

const cardData = [
  {
    price: "199",
    subtitle: "Offers on clothing, footwear & more",
    items: [
      { icon: "/images/trend.png", text: "LATEST TRENDS" },
      { icon: "/images/return.png", text: "EASY RETURNS" },
    ],
    products: [
      { image: "/images/Air conditioners.png", name: "Air conditioners" },
      { image: "/images/Refrigerators.png", name: "Refrigerators" },
      { image: "/images/Washing Machines .png", name: "Washing Machines" },
      { image: "/images/Microwaves.png", name: "Microwaves" },
    ],
  },
  {
    price: "149",
    subtitle: "Headphones & Audio Devices",
    items: [{ icon: "/images/top brand.png", text: "TOP BRANDS" }],
    products: [
      { image: "/images/boat earpods.png", name: "boAt", price: "249" },
      { image: "/images/boult earpods.png", name: "Boult", price: "349" },
    ],
  },
  {
    price: "599",
    subtitle: "Automotive essentials | Up to 60% off",
    items: [{ icon: "/images/premium quality.png", text: "PREMIUM QUALITY" }],
    products: [
      { image: "/images/1.png", name: "Cleaning accessories" },
      { image: "/images/2.png", name: "Tyre & rim care" },
    ],
  },
  {
    price: "599",
    subtitle: "Automotive essentials | Up to 60% off",
    items: [{ icon: "/images/premium quality.png", text: "PREMIUM QUALITY" }],
    products: [
      {
        image: "/images/1.png",
        name: "Cleaning accessories",
        category: "Car Care",
      },
      {
        image: "/images/2.png",
        name: "Tyre & rim care",
        category: "Maintenance",
      },
    ],
  },
  {
    price: "499",
    subtitle: "Home Decor & Furnishing",
    items: [
      { icon: "/images/trend.png", text: "TRENDING" },
      { icon: "/images/free delivery.png", text: "FREE DELIVERY" },
    ],
    products: [
      {
        image: "/images/1.png",
        name: "Cushion Covers",
        category: "Living Room",
      },
      { image: "/images/2.png", name: "Bed Sheets", category: "Bedroom" },
      { image: "/images/1.png", name: "Curtains", category: "Living Room" },
      { image: "/images/2.png", name: "Wall Art", category: "Decor" },
    ],
  },
  {
    price: "999",
    subtitle: "Premium Watches | Latest Collection",
    items: [{ icon: "/images/luxury brand.png", text: "LUXURY BRANDS" }],
    products: [
      {
        image: "/images/1.png",
        name: "Titan",
        price: "1499",
        brandName: "Titan",
      },
      {
        image: "/images/2.png",
        name: "Fossil",
        price: "2499",
        brandName: "Fossil",
      },
      {
        image: "/images/1.png",
        name: "Casio",
        price: "1299",
        brandName: "Casio",
      },
    ],
  },
  {
    price: "299",
    subtitle: "Kitchen Essentials | Up to 70% off",
    items: [
      { icon: "/images/trend.png", text: "BEST DEALS" },
      { icon: "/images/top rated.png", text: "TOP RATED" },
    ],
    products: [
      { image: "/images/1.png", name: "Cookware Set", category: "Cooking" },
      {
        image: "/images/2.png",
        name: "Storage Containers",
        category: "Storage",
      },
      { image: "/images/1.png", name: "Knife Set", category: "Utensils" },
      { image: "/images/2.png", name: "Dinner Set", category: "Dining" },
    ],
  },
];

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const user = JSON.parse(localStorage.getItem('user'));
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts({ sort: '-createdAt' });
        setNewProducts(data.products);
        setSearchResults(data.products);
      } catch (error) {
        console.error('Error fetching new products:', error);
        setError(error.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(newProducts);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const searchTerm = searchQuery.toLowerCase();
    
    const filteredProducts = newProducts.filter(product => {
      const productName = String(product.name || '').toLowerCase();
      const productDesc = String(product.description || '').toLowerCase();
      const productCategory = String(product.category || '').toLowerCase();
      
      return productName.includes(searchTerm) ||
             productDesc.includes(searchTerm) ||
             productCategory.includes(searchTerm);
    });
    
    setSearchResults(filteredProducts);
  }, [searchQuery, newProducts]);

  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => {
        setAddedToCart(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart(product._id);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The search is already handled by the useEffect that watches searchQuery
    // This function just prevents the default form submission
  };

  return (
    <div className="home-container">
      <header className="home-header">        
        {/* Search Bar */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i> Search
            </button>
          </form>
        </div>
        {!isSearching && (
          <>
            <h1>Welcome to Our Store</h1>
            <p>Find the best products at amazing discounts</p>
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="banner-swiper"
            >
              {banners.map((banner, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className="banner-image"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
      </header>

      {/* Search Results Section */}
      {isSearching && (
        <div className="search-results-container">
          <h2 className="search-results-title">
            {searchResults.length > 0 
              ? `Search Results for "${searchQuery}"` 
              : `No results found for "${searchQuery}"`}
          </h2>
          <div className="search-results-grid">
            {searchResults.map((product) => (
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
                  </div>
                </Link>
                <button 
                  onClick={() => handleAddToCart(product)}
                  className={`add-to-cart-btn ${addedToCart === product._id ? 'added' : ''}`}
                >
                  {addedToCart === product._id ? 'Added! ✓' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content - Only show when not searching */}
      {!isSearching && (
        <>
          {/* New Products Section */}
          <section className="new-products-section">
            <h2>New Products</h2>
            <div className="product-grid">
              {loading ? (
                <div className="loading">Loading new products...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : (
                newProducts.map((product) => (
                  <div key={product._id} className="product-card">
                    <Link to={`/products/${product._id}`} className="product-link">
                      <img 
                        src={product.images[0]?.url || '/images/placeholder.png'} 
                        alt={product.name} 
                      />
                      <h3>{product.name}</h3>
                      <p className="price">₹{product.price}</p>
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className={`add-to-cart-btn ${addedToCart === product._id ? 'added' : ''}`}
                    >
                      {addedToCart === product._id ? 'Added! ✓' : 'Add to Cart'}
                    </button>
                    {/* {user && (user._id === product.createdBy || user.isAdmin) && (
                      // <div className="admin-actions">
                      //   <button onClick={() => handleEdit(product._id)}>Edit</button>
                      //   <button onClick={() => handleDelete(product._id)}>Delete</button>
                      // </div>
                    )} */}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Featured Categories */}
          <div className="featured-section">
            {cardData.map((card, index) => (
              <div key={index} className="new-products-section">
                <h2>Starting ₹{card.price}</h2>
                <p className="section-subtitle">{card.subtitle}</p>
                
                <div className="card-items">
                  {card.items.map((item, idx) => (
                    <div key={idx} className="card-item">
                      <img src={item.icon} alt={item.text} loading="lazy" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div> 

                <div className="product-grid">
                  {card.products.map((product, idx) => (
                    <Link 
                      to={`/category/${product.category || product.name}`} 
                      key={idx}
                      className="product-link"
                    >
                      <div className="product-card">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="category-image"
                          loading="lazy"
                        />
                        <h3>{product.name}</h3>
                        {product.price && <p className="price">₹{product.price}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
