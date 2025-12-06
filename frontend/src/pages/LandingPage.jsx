import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header>
        <h1>FlashMaster</h1>
        <p>Master your knowledge with spaced repetition flashcards.</p>
      </header>
      <section className="cta-buttons">
        <Link to="/login" className="button primary">Login</Link>
        <Link to="/register" className="button secondary">Register</Link>
      </section>
      <section className="features">
        <h2>Features:</h2>
        <ul>
          <li>Efficient Spaced Repetition System</li>
          <li>Rich Text Editor for Flashcards</li>
          <li>Track Your Progress</li>
          <li>Organize with Decks</li>
        </ul>
      </section>
      <footer>
        <p>&copy; 2025 FlashMaster. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
