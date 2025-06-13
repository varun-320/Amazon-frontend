import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">
                    <img src="/images/amazon.png" alt="Amazon Logo" className="nav-logo" />
                </Link>
            </div>
            
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                {isAuthenticated ? (
                    <>
                        {user?.isAdmin && (
                            <Link to="/add-product" className="nav-link">Add Product</Link>
                        )}
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <button onClick={logout} className="nav-link">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-link">Signup</Link>
                    </>
                )}
                <Link to="/cart" className="cart-link">
                    <span className="cart-icon">🛒</span>
                    {cartItemCount > 0 && (
                        <span className="cart-count">{cartItemCount}</span>
                    )}
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
