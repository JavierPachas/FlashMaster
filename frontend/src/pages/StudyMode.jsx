import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const StudyMode = () => {
  const { id } = useParams(); // Deck ID
  const { token, logout } = useAuth();
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardsForStudy = async () => {
      console.log("Fetching cards for deck:", id, "with token:", token);
      try {
        const response = await axios.get(`http://localhost:8000/decks/${id}/cards/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched cards:", response.data);
        const dueCards = response.data; // All cards are immediately available for study
        console.log("Due cards:", dueCards);
        setCards(dueCards);
      } catch (err) {
        setError('Failed to fetch cards for study.');
        console.error('Fetch cards error:', err);
        if (err.response && err.response.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchCardsForStudy();
    }
  }, [token, id, logout]);

  const handleReveal = () => {
    setShowBack(true);
  };

  const handleGrade = async (grade) => {
    setError('');
    const currentCard = cards[currentCardIndex];
    try {
      await axios.put(
        `http://localhost:8000/cards/${currentCard.id}/review`,
        { grade },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Move to the next card
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowBack(false);
      } else {
        alert('Study session complete!');
        navigate(`/deck/${id}`);
      }
    } catch (err) {
      setError('Failed to submit review.');
      console.error('Review error:', err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  if (loading) {
    return <div>Loading cards...</div>;
  }

  if (cards.length === 0) {
    return (
      <div className="study-mode">
        <h1>Study Session</h1>
        <p>No cards due for review in this deck. <Link to={`/deck/${id}`}>Add more cards</Link> or come back later!</p>
        <Link to={`/deck/${id}`} className="button secondary">Back to Deck</Link>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="study-mode">
      <h1>Study Session</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="flashcard">
        <div className="card-content">
          <p className="card-front">{currentCard.front}</p>
          {showBack && <p className="card-back">{currentCard.back}</p>}
        </div>
        {!showBack && (
          <button onClick={handleReveal} className="button primary">Reveal Answer</button>
        )}
        {showBack && (
          <div className="grade-buttons">
            <button onClick={() => handleGrade('Again')} className="button danger">Again</button>
            <button onClick={() => handleGrade('Good')} className="button secondary">Good</button>
            <button onClick={() => handleGrade('Easy')} className="button primary">Easy</button>
          </div>
        )}
      </div>
      <p>Card {currentCardIndex + 1} of {cards.length}</p>
      <Link to={`/deck/${id}`} className="button secondary">Exit Study</Link>
    </div>
  );
};

export default StudyMode;
