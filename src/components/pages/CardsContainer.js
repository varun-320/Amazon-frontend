import React from "react";
import Card from "./Cards";
import '../../styles/Card.css';

const cardData = [
  {
    title: "Appliances for your home | Up to 55% off",
    images: [{ src: "air-conditioner.jpg", alt: "Air Conditioner" }, { src: "refrigerator.jpg", alt: "Refrigerator" }]
  },
  {
    title: "Revamp your home in style",
    images: [{ src: "cushion.jpg", alt: "Cushion Covers" }, { src: "figurines.jpg", alt: "Figurines" }]
  },
  {
    title: "Starting ₹149 | Headphones",
    images: [{ src: "boat.jpg", alt: "Boat" }, { src: "boult.jpg", alt: "Boult" }]
  },
  {
    title: "Automotive essentials | Up to 60% off",
    images: [{ src: "cleaning.jpg", alt: "Cleaning Accessories" }, { src: "tyre.jpg", alt: "Tyre & Rim Care" }]
  }
];

const CardsContainer = () => {
  return (
    <section className="cards-container">
      {cardData.map((card, index) => (
        <Card key={index} title={card.title} images={card.images} />
      ))}
    </section>
  );
};

export default CardsContainer;
