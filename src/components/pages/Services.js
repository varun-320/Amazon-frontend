import React from "react";
import "../../styles/Services.css";

const servicesData = [
  {
    title: "Web Development",
    description: "Custom website design & development with modern technologies.",
    icon: "🌐",
  },
  {
    title: "Mobile App Development",
    description: "Develop high-quality Android & iOS applications.",
    icon: "📱",
  },
  {
    title: "AI Solutions",
    description: "AI-driven solutions for business automation.",
    icon: "🤖",
  },
  {
    title: "Cloud Services",
    description: "Cloud computing, hosting, and infrastructure services.",
    icon: "☁️",
  },
  {
    title: "SEO & Digital Marketing",
    description: "Boost your online presence with SEO & digital marketing.",
    icon: "📈",
  },
];

function Services() {
  return (
    <div className="services-container">
      <h2>Our Services</h2>
      <p>We offer a variety of high-quality solutions to help your business grow.</p>
      <div className="services-grid">
        {servicesData.map((service, index) => (
          <div key={index} className="service-card">
            <span className="service-icon">{service.icon}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
