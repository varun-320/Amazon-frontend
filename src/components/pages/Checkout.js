import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../utils/api";
import "../../styles/Checkout.css";
import { ArrowLeft } from "lucide-react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user?._id) {
        throw new Error('Please log in to place an order');
      }

      // Format the order data to exactly match the backend schema
      const orderData = {
        user: user._id,
        items: cartItems.map(item => ({
          product: item._id,
          quantity: Number(item.quantity),
          price: Number(item.price)
        })),
        totalAmount: Number(getCartTotal()),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.zipCode.trim(),
          phone: formData.phone.trim()
        },
        paymentMethod: formData.paymentMethod,
        orderStatus: "processing",
        paymentStatus: "pending"
      };

      // Validate the data before sending
      if (!orderData.items.length) {
        throw new Error('Your cart is empty');
      }

      if (!orderData.totalAmount) {
        throw new Error('Invalid total amount');
      }

      // Log the exact data being sent
      console.log('Submitting order with data:', JSON.stringify(orderData, null, 2));

      // Create order in backend
      const response = await createOrder(orderData);
      if (response && response._id) {
        // Clear the cart
        clearCart();
        navigate(`/order/${response._id}`);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setError(error.message || 'Error creating order');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>
        <h2>Your cart is empty</h2>
        <button
          onClick={() => navigate("/products")}
          className="continue-shopping"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} />
        Back
      </button>
      <h2>Checkout</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="checkout-content">
        <div className="shipping-form">
          <h3>Shipping Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="cod">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="place-order-btn"
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item._id} className="summary-item">
                <div className="item-image">
                  <img
                    src={item.images?.[0]?.url || "/images/placeholder.png"}
                    alt={item.name}
                  />
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total:</span>
            <span>₹{getCartTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
