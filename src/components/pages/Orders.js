import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyOrders, deleteOrder } from '../../utils/api';
import '../../styles/Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      setError(null);
      setSuccessMessage(null);

      // First verify if the order exists and can be cancelled
      const orderToCancel = orders.find(order => order._id === orderId);
      if (!orderToCancel) {
        throw new Error('Order not found');
      }

      if (['delivered', 'cancelled'].includes(orderToCancel.orderStatus?.toLowerCase())) {
        throw new Error('Cannot cancel this order due to its current status');
      }

      // Attempt to delete the order
      const response = await deleteOrder(orderId);
      
      if (response && response.success) {
        // If successful, update the local state
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        setSuccessMessage('Order cancelled successfully');
      } else {
        throw new Error('Failed to cancel order. Please try again.');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError(err.message || 'Failed to cancel order. Please try again later.');
    } finally {
      setCancellingOrderId(null);
      // Refresh orders list to ensure we have the latest state
      fetchOrders();
    }
  };

  const canCancelOrder = (orderStatus) => {
    return orderStatus && !['delivered', 'cancelled'].includes(orderStatus.toLowerCase());
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error-btn">×</button>
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
          <button onClick={() => setSuccessMessage(null)} className="close-success-btn">×</button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <p className="order-date">
                    {order.createdAt ? formatDate(order.createdAt) : 'Processing'}
                  </p>
                </div>
                <span className={`status-badge ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus || 'Pending'}
                </span>
              </div>

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
                      <p>Quantity: {item.quantity || 0}</p>
                      <p>Price: ₹{item.price || 0}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total Amount:</span>
                  <span>₹{order.totalPrice || order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0}</span>
                </div>
                <div className="shipping-address">
                  <h4>Shipping Address:</h4>
                  <p>{order.shippingAddress?.name}</p>
                  <p>{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                  <p>{order.shippingAddress?.country} - {order.shippingAddress?.postalCode}</p>
                  <p>Phone: {order.shippingAddress?.phone}</p>
                </div>
                <div className="order-actions">
                  <Link to={`/order/${order._id}`} className="view-details-btn">
                    View Order Details
                  </Link>
                  {canCancelOrder(order.orderStatus) && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="cancel-order-btn"
                      disabled={cancellingOrderId === order._id}
                    >
                      {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders; 