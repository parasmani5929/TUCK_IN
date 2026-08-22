import React from 'react';

const About = () => {
  return (
    <div style={{ minHeight: '80vh', padding: '4rem 2rem', color: '#fff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(90deg, #ff6b35, #f5a623)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Our Story
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#aaa', maxWidth: '600px', margin: '0 auto' }}>
            Redefining food delivery in Kerala with quality, taste, and premium service.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '3rem', borderRadius: '24px', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>Welcome to TuckIN</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#ccc', marginBottom: '1.5rem' }}>
            Founded by <strong>Paras Mani</strong>, TuckIN was born out of a passion for exceptional food and a vision to make premium dining accessible from the comfort of your home. Located in the vibrant heart of <strong>Kalamassery, Kerala</strong>, we are committed to bringing you the best culinary experiences.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#ccc' }}>
            Our mission is simple: to deliver not just food, but joy. We partner with top chefs and source the freshest ingredients to ensure that every meal you order is crafted to perfection. Whether you're craving authentic local delicacies or contemporary international cuisines, TuckIN is your trusted companion for quality food delivery.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--accent, #ff6b35)', marginBottom: '1rem' }}>Quality First</h3>
            <p style={{ color: '#aaa' }}>Uncompromising standards for ingredients, preparation, and packaging.</p>
          </div>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--accent, #ff6b35)', marginBottom: '1rem' }}>Fast Delivery</h3>
            <p style={{ color: '#aaa' }}>Hot and fresh, delivered right to your doorstep in record time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
