import React from "react";
import "../../styles/Card.css";

const Card = ({ price, subtitle, items, products }) => {
  return (
    <div className="card">
      <h2>Starting ₹{price}</h2>
      <p className="card-subtitle">{subtitle}</p>

      <div className="card-items">
        {items.map((item, index) => (
          <div key={index} className="card-item">
            <img src={item.icon} alt={item.text} />
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      <div className="product-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <img src={product.image} alt={product.name} />
            <p>{product.name}</p>
            {product.price && <span>₹{product.price}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
