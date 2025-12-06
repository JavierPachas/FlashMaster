import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="landing-page-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>FlashMaster</h1>
          <p className="tagline">Master Your Knowledge with Spaced Repetition</p>
          <p className="description">
            FlashMaster is a powerful web application designed to optimize your learning and retention.
            Utilizing a smart spaced-repetition system, it ensures you review flashcards at the perfect time
            to maximize memory recall and minimize study time.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="button primary large">Get Started Now</Link>
          </div>
        </div>
      </header>

      <section className="features-section">
        <h2>Why Choose FlashMaster?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Efficient Learning</h3>
            <p>Our spaced-repetition algorithm schedules your reviews for optimal memory retention.</p>
          </div>
          <div className="feature-item">
            <h3>Organized Content</h3>
            <p>Create and manage decks of flashcards, keeping your study materials neatly categorized.</p>
          </div>
          <div className="feature-item">
            <h3>Rich Media Support</h3>
            <p>Add rich text, code blocks, and more to your flashcards for comprehensive learning.</p>
          </div>
          <div className="feature-item">
            <h3>Track Progress</h3>
            <p>Monitor your learning journey and see your knowledge grow over time.</p>
          </div>
        </div>
      </section>

      <section className="call-to-action-section">
        <h2>Ready to Master Anything?</h2>
        <p>Join thousands of learners who are boosting their retention and achieving their goals with FlashMaster.</p>
        <Link to="/register" className="button primary large">Sign Up for Free</Link>
      </section>
    </div>
  );
};

export default LandingPage;
