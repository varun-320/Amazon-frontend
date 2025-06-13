import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderDetails, deleteOrder } from '../../utils/api';
import '../../styles/OrderDetails.css';

function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await getOrderDetails(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        let message = 'Failed to load order details. Please try again later.';
        if (err.message === 'Not authorized') {
          message = 'You are not authorized to view this order.';
        } else if (err.message === 'Order not found') {
          message = 'Order not found or has been deleted.';
        }
        setError(message);
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (orderStatus) => {
    if (!orderStatus) return 'pending';
    
    switch (orderStatus.toLowerCase()) {
      case 'pending':
      case 'processing':
        return 'processing';
      case 'shipped':
        return 'shipped';
      case 'delivered':
        return 'delivered';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const handleDeleteOrder = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deleteOrder(orderId);
      
      if (response && response.message === 'Order deleted successfully') {
        navigate('/orders', { state: { message: 'Order deleted successfully' } });
      } else {
        throw new Error('Failed to delete order');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete order. Please try again later.');
      console.error('Error deleting order:', err);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="order-details-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-container">
        <div className="error-message">{error}</div>
        <Link to="/orders" className="back-button">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-container">
        <div className="error-message">Order not found</div>
        <Link to="/orders" className="back-button">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <Link to="/orders" className="back-button">
          ← Back to Orders
        </Link>
        <h1>Order Details</h1>
        <button 
          onClick={handleDeleteOrder}
          className="delete-order-btn"
          disabled={isDeleting || order.orderStatus === 'delivered'}
        >
          {isDeleting ? 'Deleting...' : 'Delete Order'}
        </button>
      </div>

      <div className="order-details-card">
        <div className="order-header">
          <div className="order-info">
            <h2>Order #{order._id.slice(-6)}</h2>
            <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`status-badge ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus || 'Pending'}
          </span>
        </div>

        <div className="order-items-section">
          <h3>Order Items</h3>
          <div className="order-items">
            {order.items?.map((item) => (
              <div key={item.product?._id || item._id} className="order-item">
                <img 
                  src={item.product?.images?.[0]?.url || '/images/placeholder.png'} 
                  alt={item.product?.name || 'Product'}
                />
                <div className="item-details">
                  {item.product?._id ? (
                    <Link to={`/products/${item.product._id}`}>
                      <h4>{item.product?.name || 'Product'}</h4>
                    </Link>
                  ) : (
                    <h4>Product</h4>
                  )}
                  <p className="item-price">₹{item.price || 0}</p>
                  <p className="item-quantity">Quantity: {item.quantity || 0}</p>
                  <p className="item-subtotal">Subtotal: ₹{(item.price || 0) * (item.quantity || 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{order.totalAmount}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="shipping-details">
          <h3>Shipping Details</h3>
          <div className="address-details">
            <p>{order.shippingAddress?.name}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
            <p>{order.shippingAddress?.country} - {order.shippingAddress?.postalCode}</p>
            <p>Phone: {order.shippingAddress?.phone}</p>
          </div>
        </div>

        <div className="payment-details">
          <h3>Payment Information</h3>
          <p>Payment Method: {order.paymentMethod}</p>
          <p>Payment Status: {order.paymentStatus}</p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails; 