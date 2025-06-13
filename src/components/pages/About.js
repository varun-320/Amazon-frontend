import React from 'react';
import '../../styles/About.css';

function About() {
  return (
    <div className="main-container">
      <h1>About Us</h1>
      <p>We are a customer-focused company committed to delivering high-quality products and services that improve lives and drive innovation.</p>   
<h2>Our Mission</h2>
      <p>Our mission is to create cutting-edge solutions that enhance productivity, efficiency, and overall user experience.</p>

      <h2>Our Values</h2>
      <ul>
        <li><strong>Innovation:</strong> We strive to push the boundaries of technology.</li>
        <li><strong>Quality:</strong> Delivering only the best products and services.</li>
        <li><strong>Customer Focus:</strong> Putting our customers first in everything we do.</li>
        <li><strong>Integrity:</strong> Honesty and transparency in all our dealings.</li>
      </ul>

      <h2>Meet Our Team</h2>
      <p>Our team consists of experienced professionals dedicated to making a difference through technology and innovation.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions, feel free to reach out to us:</p>
      <ul>
        <li>Email: <a href="mailto:support@company.com">support@company.com</a></li>
        <li>Phone: +1 (800) 123-4567</li>
        <li>Address: 123 Innovation Drive, Tech City, USA</li>
      </ul>
    </div>
  );
}

export default About;

