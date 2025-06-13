import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import "../../styles/Wishlist.css";

function Wishlist() {
    const { wishlist, removeFromWishlist } = useWishlist();

    return (
        <div className="wishlist-container">
            <h2>My Wishlist ❤️</h2>
            {wishlist.length === 0 ? (
                <p>Your wishlist is empty. <Link to="/products">Browse products</Link></p>
            ) : (
                <div className="wishlist-grid">
                    {wishlist.map((product) => (
                        <div key={product._id} className="wishlist-card">
                            <Link to={`/products/${product._id}`}>
                                <img src={product.images[0]?.url || "/images/placeholder.png"} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>₹{product.price}</p>
                            </Link>
                            <button onClick={() => removeFromWishlist(product._id)}>❌ Remove</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;
