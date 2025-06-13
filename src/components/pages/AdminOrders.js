import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, deleteOrder, updateOrderStatus } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AdminOrders.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      setError('Failed to delete order. Please try again.');
      console.error('Error deleting order:', err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, orderStatus: newStatus }
          : order
      ));
    } catch (err) {
      setError('Failed to update order status. Please try again.');
      console.error('Error updating order status:', err);
    }
  };

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

  if (!user?.isAdmin) {
    return (
      <div className="admin-orders-container">
        <div className="error-message">Access denied. Admin privileges required.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-orders-container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      <div className="admin-orders-header">
        <h1>Manage Orders</h1>
        <div className="order-stats">
          <div className="stat-item">
            <span>Total Orders:</span>
            <span>{orders.length}</span>
          </div>
          <div className="stat-item">
            <span>Pending:</span>
            <span>{orders.filter(order => order.orderStatus === 'pending').length}</span>
          </div>
          <div className="stat-item">
            <span>Processing:</span>
            <span>{orders.filter(order => order.orderStatus === 'processing').length}</span>
          </div>
          <div className="stat-item">
            <span>Shipped:</span>
            <span>{orders.filter(order => order.orderStatus === 'shipped').length}</span>
          </div>
          <div className="stat-item">
            <span>Delivered:</span>
            <span>{orders.filter(order => order.orderStatus === 'delivered').length}</span>
          </div>
        </div>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order._id.slice(-6)}</h3>
                <p className="order-date">{formatDate(order.createdAt)}</p>
                <p className="customer-info">
                  <strong>Customer:</strong> {order.shippingAddress?.name || 'N/A'}
                </p>
              </div>
              <div className="order-actions">
                <select
                  value={order.orderStatus || 'pending'}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className={`status-select ${getStatusColor(order.orderStatus)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Link to={`/orders/${order._id}`} className="view-btn">
                  View Details
                </Link>
                <button 
                  onClick={() => handleDeleteOrder(order._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="order-items">
              {order.items?.map((item) => (
                <div key={item.product?._id || item._id} className="order-item">
                  <img 
                    src={item.product?.images?.[0]?.url || '/images/placeholder.png'} 
                    alt={item.product?.name || 'Product'}
                  />
                  <div className="item-details">
                    <h4>{item.product?.name || 'Product'}</h4>
                    <p>Quantity: {item.quantity || 0}</p>
                    <p>Price: ₹{item.price || 0}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="shipping-info">
                <h4>Shipping Address:</h4>
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                <p>{order.shippingAddress?.postalCode}</p>
                <p>Phone: {order.shippingAddress?.phone}</p>
              </div>
              <div className="order-total">
                <span>Total Amount:</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders; 