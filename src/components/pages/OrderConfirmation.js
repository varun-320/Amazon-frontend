import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/OrderConfirmation.css';

function OrderConfirmation() {
    const navigate = useNavigate();

    return (
        <div className="order-confirmation">
            <div className="confirmation-content">
                <div className="success-icon">✓</div>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your purchase. Your order has been confirmed.</p>
                <div className="confirmation-actions">
                    <button 
                        onClick={() => navigate('/')} 
                        className="continue-shopping"
                    >
                        Continue Shopping
                    </button>
                    <button 
                        onClick={() => navigate('/order-success')} 
                        className="view-orders"
                    >
                        View Orders
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation; 