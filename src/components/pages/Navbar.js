import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {useWishlist} from "../../context/WishlistContext";
import "../../styles/Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const handleScroll = () => {
      if (!isAuthPage) {
        setScrolled(window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAuthPage]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    toggleMenu();
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-brand">
        <Link to="/" className="nav-logo">
          <img src="/images/amazonlog.png" alt="Logo" />
        </Link>
      </div>

      {/* Toggle Button for Mobile */}
      <button className={`nav-toggle ${isOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span className="hamburger"></span>
      </button>

      {/* Navigation Links */}
      <div className={`nav-menu ${isOpen ? "open" : ""}`}>
        <ul>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/products" onClick={toggleMenu}>Products</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/services" onClick={toggleMenu}>Services</Link></li>
          <li><Link to="/wishlist" onClick={toggleMenu}>Wishlist ({wishlist.length})</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/orders" onClick={toggleMenu}>Orders</Link></li>
              <li><Link to="/categories" onClick={toggleMenu}>Categories</Link></li>
              <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
              <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
              <li><Link to="/signup" onClick={toggleMenu}>Signup</Link></li>
            </>
          )}
          <li>
            <Link to="/cart" className="cart-link" onClick={toggleMenu}>
              <span className="cart-icon">🛒</span>
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;