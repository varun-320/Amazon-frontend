import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getOrderDetails } from '../../utils/api';
import '../../styles/OrderSuccess.css';

function OrderSuccess() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const params = useParams();
  
  // Try to get orderId from different sources
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const orderId = location.state?.orderId || params.orderId || searchParams.get('orderId');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        console.log('Debug - Location State:', location.state);
        console.log('Debug - URL Params:', params);
        console.log('Debug - Search Params:', Object.fromEntries(searchParams));
        setError('No order ID found. Please check your order in the Orders page.');
        setLoading(false);
        return;
      }

      try {
        console.log('Attempting to fetch order details for ID:', orderId);
        const data = await getOrderDetails(orderId);
        console.log('Received order data:', data);
        
        if (!data) {
          throw new Error('No order data received from the server');
        }
        
        setOrder(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. ' + (err.message || 'Please try again later.'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, location.state, params, searchParams]);

  if (loading) {
    return (
      <div className="order-success-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-success-container">
        <div className="error-message">{error}</div>
        <div className="action-buttons">
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          <Link to="/orders" className="view-orders-btn">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-success-container">
        <div className="error-message">Order not found. Please check your order in the Orders page.</div>
        <div className="action-buttons">
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          <Link to="/orders" className="view-orders-btn">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="success-message">
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-details">
            <div className="order-header">
              <h3>Order #{order._id ? order._id.slice(-6) : 'N/A'}</h3>
              <span className={`status-badge ${(order.status || 'pending').toLowerCase()}`}>
                {order.status || 'Pending'}
              </span>
            </div>

            {order.products && order.products.length > 0 ? (
              <div className="order-items">
                {order.products.map((item, index) => (
                  <div key={item.product?._id || index} className="order-item">
                    <img 
                      src={item.product?.images?.[0]?.url || '/images/placeholder.png'} 
                      alt={item.product?.name || 'Product'}
                    />
                    <div className="item-details">
                      <h4>{item.product?.name || 'Product'}</h4>
                      <p>Quantity: {item.quantity || 0}</p>
                      <p>Price: ₹{item.product?.price || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-items-message">No items in this order</div>
            )}

            <div className="order-total">
              <span>Total Amount:</span>
              <span>₹{order.totalPrice || 0}</span>
            </div>

            {order.shippingAddress && (
              <div className="shipping-address">
                <h4>Shipping Address:</h4>
                <p>{order.shippingAddress.name || 'N/A'}</p>
                <p>{order.shippingAddress.address || 'N/A'}</p>
                <p>
                  {[
                    order.shippingAddress.city,
                    order.shippingAddress.state
                  ].filter(Boolean).join(', ') || 'N/A'}
                </p>
                <p>
                  {[
                    order.shippingAddress.country,
                    order.shippingAddress.postalCode
                  ].filter(Boolean).join(' - ') || 'N/A'}
                </p>
                <p>Phone: {order.shippingAddress.phone || 'N/A'}</p>
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          <Link to="/orders" className="view-orders-btn">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess; 