import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../styles/Cart.css';
import { ArrowLeft } from "lucide-react";


function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                   <button onClick={() => navigate(-1)} className="back-button">
    <ArrowLeft size={20} />
    Back
</button>
                <h2>Your cart is empty</h2>
                <button onClick={() => navigate('/products')} className="continue-shopping">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
           <button onClick={() => navigate(-1)} className="back-button">
    <ArrowLeft size={20} />
    Back
</button>
            <h2>Shopping Cart</h2>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item._id} className="cart-item">
                        <div className="item-image">
                            <img  src={item.images[0]?.url || '/images/placeholder.png'}  alt={item.name} />
                        </div>
                        <div className="item-details">
                            <h3>{item.name}</h3>
                            <p className="item-price">₹{item.price}</p>
                            <div className="quantity-controls">
                                <button 
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <button 
                                onClick={() => removeFromCart(item._id)}
                                className="remove-item"
                            >
                                Remove
                            </button>
                        </div>
                        <div className="item-total">
                            ₹{item.price * item.quantity}
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <div className="cart-total">
                    <span>Total:</span>
                    <span>₹{getCartTotal()}</span>
                </div>
                <button 
                    onClick={() => navigate('/checkout')} 
                    className="checkout-button"
                >
                    Proceed to Checkout
                </button>
                <button 
                    onClick={() => navigate('/products')} 
                    className="continue-shopping"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}

export default Cart;
